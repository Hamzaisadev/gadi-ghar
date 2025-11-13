"use server";

import { serializeCarData } from "@/lib/helper";
import { db } from "@/lib/prisma";
import { createClient } from "@/lib/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function processCarImageWithAI(file) {
  async function fileToBase64() {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      return buffer.toString("base64");
    } catch (error) {
      console.error("Error converting file to base64:", error);
      throw new Error("Failed to process file: " + error.message);
    }
  }

  try {
    // Validate input file
    if (!file) {
      throw new Error("No file provided");
    }

    if (!file.type || !file.type.startsWith("image/")) {
      throw new Error("Invalid file type. Please provide an image file.");
    }

    // check if api is available
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0" });

    const based64image = await fileToBase64(file);

    const imagePart = {
      inlineData: {
        data: based64image,
        mimeType: file.type,
      },
    };

    const prompt = `
    You are an expert automotive analyst for a Pakistani car listing website, specializing in visual car identification and local market valuation. Your primary goal is to provide highly accurate and contextually relevant details about a car based on its image, specifically tailored for the Pakistani automobile market.
    
    **Crucial Directive for Year Estimation:**
    For the 'year' field, estimate the *likely model year of this specific vehicle in the Pakistani market*. Prioritize common release years, facelifts, or current production years in Pakistan. If a car model was introduced in Pakistan in a specific year (e.g., Changan Alsvin in 2021), the estimated year should *never* predate its local launch unless there's explicit visual evidence of an imported, older generation. If the exact year is hard to discern visually but the car appears recent, use the most common recent model year for that vehicle in Pakistan.
    
    For pricing and mileage, prioritize current data from reputable Pakistani automotive sources like PakWheels.com or OLX.pk. Provide precise figures and ranges whenever possible.
    
    From the uploaded car image, visually identify and extract the following information. If any information cannot be precisely determined from the image, provide the most educated estimate based on common Pakistani market trends for similar vehicles, or state "N/A" with a lower confidence if truly unknown.
    
    - make (e.g., Changan, Suzuki, Honda)
    - model (e.g., Alsvin, Alto, City)
    - year (estimated, the likely model year in Pakistan, e.g., 2021, 2023,2024 ,2025. If unsure but the car appears recent, use the most current or common production year for that model in Pakistan. For the Changan Alsvin, for instance, consider years from 2021 onwards.)
    - color (dominant exterior color)
    - bodyType (e.g., Sedan, Hatchback, SUV, Crossover, Coupe, Van, Pickup)
    - mileage (estimated **fuel efficiency in KM/L**, providing a realistic range based on variant, e.g., "12-18 KM/L" for Changan Alsvin)
    - fuelType (Petrol, Diesel, Hybrid, or Electric)
    - transmission (Manual or Automatic/DCT/CVT - specify if possible, otherwise "Automatic")
    - minPrice (estimated minimum current market value in PKR)
    - maxPrice (estimated maximum current market value in PKR)
    - description (a medium sized, compelling listing description for the Pakistani market, highlighting key features and suitable for car marketplaces in Pakistan, e.g., "Well-maintained [Make Model Year] in [Color]. [Key feature 1], [Key feature 2]. [Estimated Mileage KM] driven. [Transmission] transmission. Ideal for city or highway driving.")
    - confidence (value from 0.0 to 1.0 indicating your confidence in the overall accuracy and completeness of this response. Provide a lower confidence if specific details like the exact year or a precise price within a range are uncertain from the image alone.)
    
    Your response must be in this exact JSON format:
    {
      "make": "",
      "model": "",
      "year": 0000,
      "color": "",
      "minPrice": 0,
      "maxPrice": 0,
      "mileage": "",
      "bodyType": "",
      "fuelType": "",
      "transmission": "",
      "description": "",
      "confidence": 0.0
    }
    
    Only return the JSON object. Do not include any explanation, formatting, or extra content. All information should strictly reflect Pakistani market trends and pricing, not international or dollar-based data.
    `;

    // Get response from Gemini
    const result = await model.generateContent([imagePart, prompt]);
    const response = await result.response;
    const text = await response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const carDetails = JSON.parse(cleanedText);

      const requiredFields = [
        "make",
        "model",
        "year",
        "color",
        "minPrice",
        "maxPrice",
        "mileage",
        "bodyType",
        "fuelType",
        "transmission",
        "description",
        "confidence",
      ];

      const missingFields = requiredFields.filter(
        (field) => !(field in carDetails)
      );
      if (missingFields.length > 0)
        throw new Error(
          `AI response missing fields: ${missingFields.join(", ")}`
        );
      return {
        success: true,
        data: carDetails,
      };
    } catch (error) {
      console.error("Failed to parse AI Response: ", error);
      return {
        success: false,
        error: "Failed to parse AI response: " + error.message,
      };
    }
  } catch (error) {
    throw new Error("Gemini API Error: " + error.message);
  }
}

export async function addCar({ carData, images }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        dealership: true,
      },
    });

    if (!user) throw new Error("User not found");

    // Determine dealershipId based on user role
    let dealershipId = carData.dealershipId;

    if (user.role === "DEALERSHIP" && user.dealership) {
      // For dealership users, always use their own dealership
      dealershipId = user.dealership.id;
    } else if (user.role === "ADMIN") {
      // For admin users, use the provided dealershipId or null
      dealershipId = carData.dealershipId || null;
    } else {
      throw new Error(
        "Unauthorized: Only admin and dealership users can add cars"
      );
    }

    const carId = uuidv4();
    const folderPath = `cars/${carId}`;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const imageUrls = [];

    for (let i = 0; i < images.length; i++) {
      const based64Data = images[i];

      if (!based64Data || !based64Data.startsWith("data:image/")) {
        console.warn("Skipping invalid image data");
        continue;
      }
      const based64 = based64Data.split(",")[1];
      const imageBuffer = Buffer.from(based64, "base64");
      const mimeMatch = based64Data.match(/data:image\/([a-zA-Z0-9]+);/);

      const fileExtension = mimeMatch ? mimeMatch[1] : "jpeg";

      const filename = `image-${Date.now()}-${i}.${fileExtension}`;
      const filePath = `${folderPath}/${filename}`;

      const { data, error } = await supabase.storage
        .from("car-images")
        .upload(filePath, imageBuffer, {
          contentType: `image/${fileExtension}`,
        });

      if (error) {
        console.error("Error uploading image:", error);
        throw new Error("Failed to upload image");
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/car-images/${filePath}`;
      imageUrls.push(publicUrl);
    }

    if (imageUrls.length === 0) {
      throw new Error("No images uploaded");
    }

    const car = await db.car.create({
      data: {
        id: carId, // Use the same ID we used for the folder
        make: carData.make,
        model: carData.model,
        year: carData.year,
        minPrice: carData.minPrice,
        maxPrice: carData.maxPrice,
        mileage: carData.mileage,
        color: carData.color,
        fuelType: carData.fuelType,
        transmission: carData.transmission,
        bodyType: carData.bodyType,
        seats: carData.seats,
        description: carData.description,
        status: carData.status,
        featured: carData.featured,
        dealershipId: dealershipId,
        images: imageUrls, // Store the array of image URLs
      },
    });

    // Revalidate relevant paths
    revalidatePath("/admin/cars");
    revalidatePath("/dealership/cars");
    revalidatePath("/dealership");
    revalidatePath("/cars");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error adding car:", error);
    throw new Error("Error adding car: " + error.message);
  }
}

export async function getCars(search = "") {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    let where = {};
    if (search) {
      // Check if search is a number (for year)
      const yearNumber = Number(search);
      where.OR = [
        { make: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { color: { contains: search, mode: "insensitive" } },
        { bodyType: { contains: search, mode: "insensitive" } },
      ];
      if (!isNaN(yearNumber)) {
        where.OR.push({ year: yearNumber });
      }
    }

    const cars = await db.car.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    const serializedCars = cars.map(serializeCarData);
    return {
      success: true,
      data: serializedCars,
    };
  } catch (error) {
    console.error("Error fetching cars:", error);
    throw new Error("Error fetching cars: " + error.message);
  }
}

export async function deleteCars(id) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const car = await db.car.findUnique({
      where: { id },
      select: { images: true },
    });

    if (!car) throw new Error("Car not found");

    // Extract storage file paths before deleting DB row
    const filePaths = (car.images || [])
      .map((image) => {
        try {
          const u = new URL(image);
          const match = u.pathname.match(/\/car-images\/(.+)$/);
          return match && match[1] ? match[1] : null;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    // Delete the car from DB
    await db.car.delete({ where: { id } });

    // Best-effort: remove images from Supabase storage
    let warning = null;
    try {
      if (filePaths.length > 0) {
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);
        const { error } = await supabase.storage
          .from("car-images")
          .remove(filePaths);
        if (error) {
          console.error("Supabase remove error:", error);
          warning = "Some images could not be removed from storage";
        }
      }
    } catch (storageError) {
      console.error("Storage cleanup failed:", storageError);
      warning = "Storage cleanup failed";
    }

    revalidatePath("/admin/cars");
    revalidatePath("/dealership/cars");
    revalidatePath("/cars");

    return {
      success: true,
      warning: warning || undefined,
    };
  } catch (error) {
    console.error("Error deleting car:", error);
    return {
      success: false,
      error: "Error deleting car: " + error.message,
    };
  }
}

export async function updateCarStatus(id, status, featured) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized: You must be logged in to update car status",
      };
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== "ADMIN") {
      return {
        success: false,
        error: "Unauthorized: Admin access required",
      };
    }

    // Validate status
    if (!["AVAILABLE", "UNAVAILABLE", "SOLD"].includes(status)) {
      return {
        success: false,
        error: "Invalid status value",
      };
    }

    // Update the car
    const updatedCar = await db.car.update({
      where: { id },
      data: {
        status,
        featured: featured !== undefined ? featured : undefined,
      },
    });

    return {
      success: true,
      data: serializeCarData(updatedCar),
    };
  } catch (error) {
    console.error("Error updating car status:", error);
    return {
      success: false,
      error: error.message || "Failed to update car status",
    };
  }
}

export async function getCarsByDealership(dealershipId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Check if user is dealership admin and owns this dealership
    if (user.role === "DEALERSHIP_ADMIN") {
      // Get the user with their dealership info
      const userWithDealership = await db.user.findUnique({
        where: { id: user.id },
        include: { dealership: true },
      });

      if (
        !userWithDealership?.dealership ||
        userWithDealership.dealership.id !== dealershipId
      ) {
        throw new Error(
          "Unauthorized: You can only view your own dealership's cars"
        );
      }
    }

    const cars = await db.car.findMany({
      where: { dealershipId },
      orderBy: { createdAt: "desc" },
    });

    const serialized = cars.map(serializeCarData);

    return {
      success: true,
      data: serialized,
    };
  } catch (error) {
    console.error("Error fetching cars by dealership:", error);
    return {
      success: false,
      error: "Error fetching cars: " + error.message,
    };
  }
}
