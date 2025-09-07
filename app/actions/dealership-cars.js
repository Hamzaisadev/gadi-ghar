"use server";

import { serializeCarData } from "@/lib/helper";
import { db } from "@/lib/prisma";
import { createClient } from "@/lib/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

/**
 * Get dealership user and verify permissions
 */
async function getDealershipUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      dealership: true
    }
  });

  if (!user) throw new Error("User not found");
  
  if (user.role !== 'DEALERSHIP' || !user.dealership) {
    throw new Error("Unauthorized: Only dealership users can perform this action");
  }

  return user;
}

/**
 * Add car specifically for dealership users
 */
export async function addDealershipCar({ carData, images }) {
  try {
    const user = await getDealershipUser();
    const dealershipId = user.dealership.id;

    if (!images || images.length === 0) {
      throw new Error("At least one image is required");
    }

    const carId = uuidv4();
    const folderPath = `cars/${carId}`;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const imageUrls = [];

    // Upload images to Supabase
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
        throw new Error(`Failed to upload image ${i + 1}: ${error.message}`);
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/car-images/${filePath}`;
      imageUrls.push(publicUrl);
    }

    if (imageUrls.length === 0) {
      throw new Error("No images were successfully uploaded");
    }

    // Create car in database
    const car = await db.car.create({
      data: {
        id: carId,
        make: carData.make,
        model: carData.model,
        year: parseInt(carData.year),
        minPrice: parseFloat(carData.minPrice),
        maxPrice: parseFloat(carData.maxPrice),
        mileage: parseFloat(carData.mileage),
        color: carData.color,
        fuelType: carData.fuelType,
        transmission: carData.transmission,
        bodyType: carData.bodyType,
        seats: carData.seats ? parseInt(carData.seats) : null,
        description: carData.description,
        status: carData.status || "AVAILABLE",
        featured: Boolean(carData.featured),
        dealershipId: dealershipId,
        images: imageUrls,
      },
      include: {
        dealership: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true
          }
        }
      }
    });

    // Revalidate paths
    revalidatePath("/dealership/cars");
    revalidatePath("/dealership");
    revalidatePath("/cars");

    return {
      success: true,
      data: serializeCarData(car),
      message: "Car added successfully"
    };
  } catch (error) {
    console.error("Error adding dealership car:", error);
    throw new Error("Error adding car: " + error.message);
  }
}

/**
 * Get cars for the current dealership
 */
export async function getDealershipCars(search = "") {
  try {
    const user = await getDealershipUser();
    const dealershipId = user.dealership.id;

    let where = {
      dealershipId: dealershipId
    };

    if (search) {
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
      include: {
        dealership: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true
          }
        }
      }
    });

    const serializedCars = cars.map(car => serializeCarData(car));
    
    return {
      success: true,
      data: serializedCars,
    };
  } catch (error) {
    console.error("Error fetching dealership cars:", error);
    throw new Error("Error fetching cars: " + error.message);
  }
}

/**
 * Update car for dealership
 */
export async function updateDealershipCar(carId, updateData) {
  try {
    const user = await getDealershipUser();
    const dealershipId = user.dealership.id;

    // Verify the car belongs to this dealership
    const existingCar = await db.car.findFirst({
      where: {
        id: carId,
        dealershipId: dealershipId
      }
    });

    if (!existingCar) {
      throw new Error("Car not found or unauthorized");
    }

    const updatedCar = await db.car.update({
      where: { id: carId },
      data: {
        ...updateData,
        year: updateData.year ? parseInt(updateData.year) : undefined,
        minPrice: updateData.minPrice ? parseFloat(updateData.minPrice) : undefined,
        maxPrice: updateData.maxPrice ? parseFloat(updateData.maxPrice) : undefined,
        mileage: updateData.mileage ? parseFloat(updateData.mileage) : undefined,
        seats: updateData.seats ? parseInt(updateData.seats) : undefined,
      },
      include: {
        dealership: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true
          }
        }
      }
    });

    revalidatePath("/dealership/cars");
    revalidatePath("/dealership");
    revalidatePath("/cars");

    return {
      success: true,
      data: serializeCarData(updatedCar),
      message: "Car updated successfully"
    };
  } catch (error) {
    console.error("Error updating dealership car:", error);
    throw new Error("Error updating car: " + error.message);
  }
}

/**
 * Delete car for dealership
 */
export async function deleteDealershipCar(carId) {
  try {
    const user = await getDealershipUser();
    const dealershipId = user.dealership.id;

    // Verify the car belongs to this dealership
    const car = await db.car.findFirst({
      where: {
        id: carId,
        dealershipId: dealershipId
      },
      select: {
        id: true,
        images: true,
      }
    });

    if (!car) {
      throw new Error("Car not found or unauthorized");
    }

    // Delete from database first
    await db.car.delete({ 
      where: { id: carId } 
    });

    // Try to delete images from storage (non-blocking)
    try {
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);

      const filePaths = car.images
        .map((imageUrl) => {
          try {
            const url = new URL(imageUrl);
            const pathMatch = url.pathname.match(/\/car-images\/(.*)/);
            return pathMatch ? pathMatch[1] : null;
          } catch (e) {
            return null;
          }
        })
        .filter(Boolean);

      if (filePaths.length > 0) {
        await supabase.storage
          .from("car-images")
          .remove(filePaths);
      }
    } catch (storageError) {
      console.warn("Error deleting images from storage:", storageError);
      // Continue execution as the car is already deleted from DB
    }

    revalidatePath("/dealership/cars");
    revalidatePath("/dealership");
    revalidatePath("/cars");

    return {
      success: true,
      message: "Car deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting dealership car:", error);
    throw new Error("Error deleting car: " + error.message);
  }
}
