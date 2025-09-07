"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { serializeCarData } from "@/lib/helper";
import { advancedCarSearch, getFilterSuggestions } from "@/lib/advanced-search";
import { safeAsync, GadiGharError, ErrorTypes } from "@/lib/error-utils";

export async function getCarFilters() {
  try {
   

    // Run all queries in parallel
    const [
      makes,
      bodyTypes,
      fuelTypes,
      transmissions,
      colors,
      seats,
      priceAggregations,
      yearAggregations,
      mileageAggregations,
      dealerships
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
      
      // Seats query
      db.car.findMany({
        where: { 
          status: "AVAILABLE",
          seats: { not: null }
        },
        select: { seats: true },
        distinct: ["seats"],
        orderBy: { seats: "asc" },
      }),
      
      // Price aggregations
      db.car.aggregate({
        where: { status: "AVAILABLE" },
        _min: { minPrice: true },
        _max: { maxPrice: true },
      }),
      
      // Year aggregations
      db.car.aggregate({
        where: { status: "AVAILABLE" },
        _min: { year: true },
        _max: { year: true },
      }),
      
      // Mileage aggregations
      db.car.aggregate({
        where: { status: "AVAILABLE" },
        _min: { mileage: true },
        _max: { mileage: true },
      }),
      
      // Dealerships query
      db.dealershipInfo.findMany({
        where: { isActive: true },
        select: { id: true, name: true, address: true },
        orderBy: { name: "asc" },
      })
    ]);

    
    return {
      success: true,
      data: {
        makes: makes.map((item) => item.make).filter(Boolean),
        bodyTypes: bodyTypes.map((item) => item.bodyType).filter(Boolean),
        fuelTypes: fuelTypes.map((item) => item.fuelType).filter(Boolean),
        transmissions: transmissions.map((item) => item.transmission).filter(Boolean),
        colors: colors.map((item) => item.color).filter(Boolean),
        seats: seats.map((item) => item.seats).filter(Boolean).sort((a, b) => a - b),
        dealerships,
        priceRange: {
          min: priceAggregations?._min?.minPrice ? Number(priceAggregations._min.minPrice) : 0,
          max: priceAggregations?._max?.maxPrice ? Number(priceAggregations._max.maxPrice) : 10000000,
        },
        yearRange: {
          min: yearAggregations?._min?.year || 1990,
          max: yearAggregations?._max?.year || new Date().getFullYear(),
        },
        mileageRange: {
          min: mileageAggregations?._min?.mileage ? Number(mileageAggregations._min.mileage) : 0,
          max: mileageAggregations?._max?.mileage ? Number(mileageAggregations._max.mileage) : 500000,
        },
      },
    };
  } catch (error) {
    console.error("Error in getCarFilters:", error);
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
  color = "",
  dealershipId = "",
  minPrice = 0,
  maxPrice = Number.MAX_SAFE_INTEGER,
  minYear = 1990,
  maxYear = new Date().getFullYear(),
  minMileage = 0,
  maxMileage = 999999999,
  sortBy = "newest",
  page = 1,
  limit = 8,
}) {
  try {
    console.log('getCars called with params:', {
      search, make, bodyType, fuelType, transmission, 
      color, dealershipId, minPrice, maxPrice, sortBy, page, limit
    });

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
    if (transmission) where.transmission = { equals: transmission, mode: "insensitive" };
    if (color) where.color = { contains: color, mode: "insensitive" };
    if (dealershipId) where.dealershipId = dealershipId;

    // Add price range
    if (minPrice > 0 || maxPrice < Number.MAX_SAFE_INTEGER) {
      where.minPrice = { gte: parseFloat(minPrice) || 0 };
      where.maxPrice = { lte: parseFloat(maxPrice) || Number.MAX_SAFE_INTEGER };
    }

    // Add year range
    if (minYear > 1990 || maxYear < new Date().getFullYear()) {
      where.year = {
        gte: parseInt(minYear) || 1990,
        lte: parseInt(maxYear) || new Date().getFullYear()
      };
    }

    // Add mileage range
    if (minMileage > 0 || maxMileage < 999999999) {
      where.mileage = {
        gte: parseFloat(minMileage) || 0,
        lte: parseFloat(maxMileage) || 999999999
      };
    }

    console.log('Where conditions:', where);

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

    // Get total count and cars in parallel
    const [totalCars, cars] = await Promise.all([
      db.car.count({ where }),
      db.car.findMany({
        where,
        take: limit,
        skip,
        orderBy,
        include: {
          dealership: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
            },
          },
        },
      })
    ]);

    console.log('Query results:', {
      totalCars,
      carsCount: cars.length,
      firstCar: cars[0] ? { id: cars[0].id, make: cars[0].make, model: cars[0].model } : null
    });

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
    
    console.log('Final result:', {
      success: result.success,
      dataLength: result.data.length,
      pagination: result.pagination
    });
    
    return result;
  } catch (error) {
    console.error("Error fetching cars:", error);
    return {
      success: false,
      error: "Error fetching cars: " + error.message,
      data: [],
      pagination: { total: 0, page: 1, limit: 6, pages: 0 }
    };
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
      include: {
        dealership: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            email: true,
          },
        },
      },
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
    let dealership = null;
    if (car.dealership) {
      dealership = await db.dealershipInfo.findUnique({
        where: { id: car.dealership.id },
        include: {
          workingHours: {
            orderBy: {
              dayOfWeek: "asc",
            },
          },
        },
      });
    } else {
      // Fallback to first active dealership if car has no specific dealership
      dealership = await db.dealershipInfo.findFirst({
        where: { isActive: true },
        include: {
          workingHours: {
            orderBy: {
              dayOfWeek: "asc",
            },
          },
        },
      });
    }

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
