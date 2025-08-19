"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { serializeCarData } from "@/lib/helper";

export async function getCarFilters() {
  try {
    console.time("getCarFilters.total");

    // Run all queries in parallel
    const [
      makes,
      bodyTypes,
      fuelTypes,
      transmissions,
      colors,
      priceAggregations
    ] = await Promise.all([
      // Makes query
      db.car.findMany({
        where: { status: "AVAILABLE" },
        select: { make: true },
        distinct: ["make"],
        orderBy: { make: "asc" },
      }),
      
      // Body types query
      db.car.findMany({
        where: { status: "AVAILABLE" },
        select: { bodyType: true },
        distinct: ["bodyType"],
        orderBy: { bodyType: "asc" },
      }),
      
      // Fuel types query
      db.car.findMany({
        where: { status: "AVAILABLE" },
        select: { fuelType: true },
        distinct: ["fuelType"],
        orderBy: { fuelType: "asc" },
      }),
      
      // Transmissions query
      db.car.findMany({
        where: { status: "AVAILABLE" },
        select: { transmission: true },
        distinct: ["transmission"],
        orderBy: { transmission: "asc" },
      }),
      
      // Colors query
      db.car.findMany({
        where: { status: "AVAILABLE" },
        select: { color: true },
        distinct: ["color"],
        orderBy: { color: "asc" },
      }),
      
      // Price aggregations
      db.car.aggregate({
        where: { status: "AVAILABLE" },
        _min: { minPrice: true },
        _max: { maxPrice: true },
      })
    ]);

    console.timeEnd("getCarFilters.total");

    return {
      success: true,
      data: {
        makes: makes.map((item) => item.make).filter(Boolean),
        bodyTypes: bodyTypes.map((item) => item.bodyType).filter(Boolean),
        fuelTypes: fuelTypes.map((item) => item.fuelType).filter(Boolean),
        transmissions: transmissions.map((item) => item.transmission).filter(Boolean),
        colors: colors.map((item) => item.color).filter(Boolean),
        priceRange: {
          min: priceAggregations._min.minPrice ? Number(priceAggregations._min.minPrice) : 0,
          max: priceAggregations._max.maxPrice ? Number(priceAggregations._max.maxPrice) : 100000,
        },
      },
    };
  } catch (error) {
    console.error("Error in getCarFilters:", error);
    console.timeEnd("getCarFilters.total");
    return {
      success: false,
      error: "Failed to fetch car filters"
    };
  }
}

export async function getCars({
  search = "",
  make = "",
  bodyType = "",
  fuelType = "",
  transmission = "",
  minPrice = 0,
  maxPrice = Number.MAX_SAFE_INTEGER,
  sortBy = "newest", // Options: newest, priceAsc, priceDesc
  page = 1,
  limit = 6,
}) {
  try {
    console.time("getCars.total");
    // Get current user if authenticated
    const { userId } = await auth();
    let dbUser = null;

    if (userId) {
      dbUser = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    }

    // Build where conditions
    let where = {
      status: "AVAILABLE",
    };

    if (search) {
      where.OR = [
        { make: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (make) where.make = { equals: make, mode: "insensitive" };
    if (bodyType) where.bodyType = { equals: bodyType, mode: "insensitive" };
    if (fuelType) where.fuelType = { equals: fuelType, mode: "insensitive" };
    if (transmission)
      where.transmission = { equals: transmission, mode: "insensitive" };

    // Add price range (overlap condition)
    // Include a car if its [minPrice, maxPrice] overlaps the selected [minPrice, maxPrice]
    where.minPrice = {
      lte:
        maxPrice && maxPrice < Number.MAX_SAFE_INTEGER
          ? parseFloat(maxPrice)
          : Number.MAX_SAFE_INTEGER,
    };
    where.maxPrice = {
      gte: parseFloat(minPrice) || 0,
    };

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Determine sort order
    let orderBy = {};
    switch (sortBy) {
      case "priceAsc":
        orderBy = { minPrice: "asc" };
        break;
      case "priceDesc":
        orderBy = { minPrice: "desc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // Get total count for pagination
    console.time("getCars.count");
    const totalCars = await db.car.count({ where });
    console.timeEnd("getCars.count");

    // Execute the main query
    console.time("getCars.findMany");
    const cars = await db.car.findMany({
      where,
      take: limit,
      skip,
      orderBy,
    });
    console.timeEnd("getCars.findMany");

    // If we have a user, check which cars are wishlisted
    let wishlisted = new Set();
    if (dbUser) {
      const savedCars = await db.userSavedCar.findMany({
        where: { userId: dbUser.id },
        select: { carId: true },
      });

      wishlisted = new Set(savedCars.map((saved) => saved.carId));
    }

    // Serialize and check wishlist status
    const serializedCars = cars.map((car) =>
      serializeCarData(car, wishlisted.has(car.id))
    );

    const result = {
      success: true,
      data: serializedCars,
      pagination: {
        total: totalCars,
        page,
        limit,
        pages: Math.ceil(totalCars / limit),
      },
    };
    return result;
  } catch (error) {
    throw new Error("Error fetching cars:" + error.message);
  }
  finally {
    console.timeEnd("getCars.total");
  }
}

/**
 * Toggle car in user's wishlist
 */
export async function toggleSavedCar(carId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Check if car exists
    const car = await db.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return {
        success: false,
        error: "Car not found",
      };
    }

    // Check if car is already saved
    const existingSave = await db.userSavedCar.findUnique({
      where: {
        userId_carId: {
          userId: user.id,
          carId,
        },
      },
    });

    // If car is already saved, remove it
    if (existingSave) {
      await db.userSavedCar.delete({
        where: {
          userId_carId: {
            userId: user.id,
            carId,
          },
        },
      });

      revalidatePath(`/saved-cars`);
      return {
        success: true,
        saved: false,
        message: "Car removed from favorites",
      };
    }

    // If car is not saved, add it
    await db.userSavedCar.create({
      data: {
        userId: user.id,
        carId,
      },
    });

    revalidatePath(`/saved-cars`);
    return {
      success: true,
      saved: true,
      message: "Car added to favorites",
    };
  } catch (error) {
    throw new Error("Error toggling saved car:" + error.message);
  }
}

/**
 * Get car details by ID
 */
export async function getCarById(carId) {
  try {
    // Get current user if authenticated
    const { userId } = await auth();
    let dbUser = null;

    if (userId) {
      dbUser = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    }

    // Get car details
    const car = await db.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return {
        success: false,
        error: "Car not found",
      };
    }

    // Check if car is wishlisted by user
    let isWishlisted = false;
    if (dbUser) {
      const savedCar = await db.userSavedCar.findUnique({
        where: {
          userId_carId: {
            userId: dbUser.id,
            carId,
          },
        },
      });

      isWishlisted = !!savedCar;
    }

    // Check if user has already booked a test drive for this car (only if logged in)
    let userTestDrive = null;
    if (dbUser) {
      const existingTestDrive = await db.testDriveBooking.findFirst({
        where: {
          carId,
          userId: dbUser.id,
          status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (existingTestDrive) {
        userTestDrive = {
          id: existingTestDrive.id,
          status: existingTestDrive.status,
          bookingDate: existingTestDrive.bookingDate.toISOString(),
        };
      }
    }

    // Get dealership info for test drive availability
    const dealership = await db.dealershipInfo.findFirst({
      include: {
        workingHours: true,
      },
    });

    return {
      success: true,
      data: {
        ...serializeCarData(car, isWishlisted),
        testDriveInfo: {
          userTestDrive,
          dealership: dealership
            ? {
                ...dealership,
                createdAt: dealership.createdAt.toISOString(),
                updatedAt: dealership.updatedAt.toISOString(),
                workingHours: dealership.workingHours.map((hour) => ({
                  ...hour,
                  createdAt: hour.createdAt.toISOString(),
                  updatedAt: hour.updatedAt.toISOString(),
                })),
              }
            : null,
        },
      },
    };
  } catch (error) {
    throw new Error("Error fetching car details:" + error.message);
  }
}

/**
 * Get user's saved cars
 */
export async function getSavedCars() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Get the user from our database
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Get saved cars with their details
    const savedCars = await db.userSavedCar.findMany({
      where: { userId: user.id },
      include: {
        car: true,
      },
      orderBy: { savedAt: "desc" },
    });

    // Extract and format car data
    const cars = savedCars.map((saved) => serializeCarData(saved.car));

    return {
      success: true,
      data: cars,
    };
  } catch (error) {
    console.error("Error fetching saved cars:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
