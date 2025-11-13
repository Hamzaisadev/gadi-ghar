"use server";

import aj from "@/lib/arcjet";
import { serializeCarData } from "@/lib/helper";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getFeaturedCars(limit = 3) {
  try {
    const cars = await db.car.findMany({
      where: {
        featured: true,
        status: "AVAILABLE",
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return cars.map(serializeCarData);
  } catch (error) {
    return {
      error: "Error fetching featured cars: " + error.message,
    };
  }
}

export async function getLatestSuv(limit = 3) {
  try {
    const cars = await db.car.findMany({
      where: {
        bodyType: "SUV",
        status: "AVAILABLE",
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return cars.map(serializeCarData);
  } catch (error) {
    return {
      error: "Error fetching latest SUV cars: " + error.message,
    };
  }
}

export async function bestHonda(limit = 3) {
  try {
    const cars = await db.car.findMany({
      where: {
        make: "Honda",
        status: "AVAILABLE",
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return cars.map(serializeCarData);
  } catch (error) {
    return {
      error: "Error fetching best Honda cars: " + error.message,
    };
  }
}

export async function electricCars(limit = 3) {
  try {
    const cars = await db.car.findMany({
      where: {
        fuelType: "Electric",
        status: "AVAILABLE",
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return cars.map(serializeCarData);
  } catch (error) {
    return {
      error: "Error fetching electric cars: " + error.message,
    };
  }
}

const DEFAULT_IMAGE_MIME = "image/jpeg";

async function fileToBase64(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString("base64");
}

function extractBase64(data) {
  if (!data) return "";
  if (typeof data !== "string") return "";
  const base64Index = data.indexOf(",");
  if (base64Index >= 0) {
    return data.slice(base64Index + 1);
  }
  return data;
}

// Normalize AI response to match system body types
function normalizeBodyType(bodyType) {
  if (!bodyType) return "";

  const normalized = bodyType.toLowerCase().trim();

  // Define mapping for common variations
  const mappings = {
    "pickup truck": "Pickup",
    pickup: "Pickup",
    truck: "Pickup",
    "light truck": "Pickup",
    suv: "SUV",
    "sport utility vehicle": "SUV",
    crossover: "SUV",
    sedan: "Sedan",
    "4-door": "Sedan",
    saloon: "Sedan",
    hatchback: "Hatchback",
    hatch: "Hatchback",
    compact: "Hatchback",
    convertible: "Convertible",
    cabriolet: "Convertible",
    roadster: "Convertible",
    coupe: "Coupe",
    coupé: "Coupe",
    "2-door": "Coupe",
    wagon: "Wagon",
    estate: "Wagon",
    "station wagon": "Wagon",
    touring: "Wagon",
  };

  // Check for exact match first
  if (mappings[normalized]) {
    return mappings[normalized];
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(mappings)) {
    if (normalized.includes(key)) {
      return value;
    }
  }

  // If no match found, return the original with proper capitalization
  return bodyType.charAt(0).toUpperCase() + bodyType.slice(1).toLowerCase();
}

export async function processImageSearch(imagePayload) {
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimited()) {
        const { remaining, reset } = decision.reason;

        console.error({
          code: "RATE_LIMIT_EXCEEDS",
          details: {
            remaining,
            resetInSecondes: reset,
          },
        });
        throw new Error("Rate limit exceeded");
      }
      throw new Error("Request Blocked");
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key is not set");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    let mimeType = DEFAULT_IMAGE_MIME;
    let base64Data = "";

    if (imagePayload) {
      // Handle structured payload from client ({ data, type })
      if (
        typeof imagePayload === "object" &&
        "data" in imagePayload &&
        typeof imagePayload.data === "string"
      ) {
        base64Data = extractBase64(imagePayload.data);
        mimeType = imagePayload.type || DEFAULT_IMAGE_MIME;
      }
      // Handle raw File/Blob object (fallback)
      else if (typeof imagePayload === "object" && imagePayload.arrayBuffer) {
        base64Data = await fileToBase64(imagePayload);
        mimeType = imagePayload.type || DEFAULT_IMAGE_MIME;
      }
      // Handle string payloads
      else if (typeof imagePayload === "string") {
        base64Data = extractBase64(imagePayload);
      }
    }

    if (!base64Data) {
      throw new Error("Invalid image payload");
    }

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    };

    const prompt = `
    Analyze this car image and extract the following information for a search query:
      1. Make (manufacturer)
      2. Body type - MUST be one of these exact values: SUV, Sedan, Hatchback, Convertible, Coupe, Wagon, Pickup
      3. Color

      IMPORTANT: For bodyType, only use these exact values:
      - SUV (for sport utility vehicles, crossovers)
      - Sedan (for 4-door sedans)
      - Hatchback (for hatchbacks, compact cars)
      - Convertible (for convertible cars)
      - Coupe (for 2-door coupes)
      - Wagon (for station wagons, estates)
      - Pickup (for pickup trucks, light trucks)

      Format your response as a clean JSON object with these fields:
      {
        "make": "",
        "bodyType": "",
        "color": "",
        "confidence": 0.0
      }

      For confidence, provide a value between 0 and 1 representing how confident you are in your overall identification.
      Only respond with the JSON object, nothing else.
    `;

    // Get response from Gemini
    const result = await model.generateContent([imagePart, prompt]);
    const response = await result.response;
    const text = await response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    try {
      const carDetails = JSON.parse(cleanedText);

      // Normalize the bodyType to match system expectations
      if (carDetails.bodyType) {
        carDetails.bodyType = normalizeBodyType(carDetails.bodyType);
      }

      // Return success response with data
      return {
        success: true,
        data: carDetails,
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return {
        success: false,
        error: "Failed to parse AI response",
      };
    }
  } catch (error) {
    throw new Error("AI Search error:" + error.message);
  }
}
