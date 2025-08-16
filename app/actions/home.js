"use server";

import aj from "@/lib/arcjet";
import { serializeCarData } from "@/lib/helper";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getFeaturedCars(limit = 4) {
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

export async function getLatestSuv(limit = 4) {
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

export async function bestHonda(limit = 4) {
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

export async function electricCars(limit = 4) {
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

async function fileToBase64(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString("base64");
}

export async function processImageSearch(file) {
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const based64image = await fileToBase64(file);

    const imagePart = {
      inlineData: {
        data: based64image,
        mimeType: file.type,
      },
    };

    const prompt = `
    Analyze this car image and extract the following information for a search query:
      1. Make (manufacturer)
      2. Body type (SUV, Sedan, Hatchback, etc.)
      3. Color

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
  
        // Return success response with data
        return {
          success: true,
          data: carDetails,
        };
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        console.log("Raw response:", text);
        return {
          success: false,
          error: "Failed to parse AI response",
        };
      }
    } catch (error) {
      throw new Error("AI Search error:" + error.message);
    }
  }