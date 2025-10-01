"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { serializeCarData } from "@/lib/helper";
import { advancedCarSearch, getFilterSuggestions } from "@/lib/advanced-search";
import { safeAsync, GadiGharError, ErrorTypes } from "@/lib/error-utils";

export async function getCarFilters() {
  try {
    // Use the advanced search system's filter suggestions
    const filterResult = await getFilterSuggestions();
    
    // Handle safeAsync result
    if (!filterResult.success) {
      throw new Error(filterResult.error?.message || 'Failed to get filter suggestions');
    }
    
    const filterSuggestions = filterResult.data;
    
    // Get dealerships separately as they're not part of the advanced search filter suggestions
    const dealerships = await db.dealershipInfo.findMany({
      where: { isActive: true },
      select: { id: true, name: true, address: true },
      orderBy: { name: "asc" },
    });

    // Get seat options from available cars
    const seats = await db.car.findMany({
      where: { 
        status: "AVAILABLE",
        seats: { not: null }
      },
      select: { seats: true },
      distinct: ["seats"],
      orderBy: { seats: "asc" },
    });

    // Get color options from available cars
    const colors = await db.car.findMany({
      where: { status: "AVAILABLE" },
      select: { color: true },
      distinct: ["color"],
      orderBy: { color: "asc" },
    });


    return {
      success: true,
      data: {
        makes: filterSuggestions.makes,
        bodyTypes: filterSuggestions.bodyTypes,
        fuelTypes: filterSuggestions.fuelTypes,
        transmissions: filterSuggestions.transmissions,
        colors: colors.map((item) => item.color).filter(Boolean),
        seats: seats.map((item) => item.seats).filter(Boolean).sort((a, b) => a - b),
        dealerships,
        priceRange: filterSuggestions.priceRange,
        yearRange: filterSuggestions.yearRange,
        mileageRange: filterSuggestions.mileageRange,
      },
    };
  } catch (error) {
    console.error("Error in enhanced getCarFilters:", error);
    return {
      success: false,
      error: "Failed to fetch car filters: " + error.message
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
  maxYear = new Date().getFullYear() + 1,
  minMileage = 0,
  maxMileage = 999999999,
  seats = null,
  featured = null,
  sortBy = "newest",
  page = 1,
  limit = 8,
}) {
  try {

    // Get current user for wishlist status
    const { userId } = await auth();
    let dbUser = null;
    let wishlisted = new Set();

    if (userId) {
      dbUser = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
      
      // Get user's saved cars
      if (dbUser) {
        const savedCars = await db.userSavedCar.findMany({
          where: { userId: dbUser.id },
          select: { carId: true },
        });
        wishlisted = new Set(savedCars.map((saved) => saved.carId));
      }
    }

    // Convert legacy sort values to advanced search format
    let convertedSortBy = sortBy;
    const sortMapping = {
      "newest": "NEWEST",
      "oldest": "OLDEST",
      "priceAsc": "PRICE_LOW_HIGH",
      "priceDesc": "PRICE_HIGH_LOW",
      "yearNew": "YEAR_NEW_OLD",
      "yearOld": "YEAR_OLD_NEW",
      "mileageLow": "MILEAGE_LOW_HIGH",
      "mileageHigh": "MILEAGE_HIGH_LOW",
      "featured": "FEATURED",
      // Legacy mappings for backwards compatibility
      "YEAR_NEWEST": "YEAR_NEW_OLD",
      "YEAR_OLDEST": "YEAR_OLD_NEW", 
      "MILEAGE_LOW_HIGH": "MILEAGE_LOW_HIGH",
      "MILEAGE_HIGH_LOW": "MILEAGE_HIGH_LOW",
      "ALPHABETICAL_AZ": "NEWEST", // Fallback since advanced search doesn't have alphabetical
      "ALPHABETICAL_ZA": "NEWEST"
    };
    if (sortMapping[sortBy]) {
      convertedSortBy = sortMapping[sortBy];
    }

    // Extract year and mileage filter parameters from function parameters
    // Don't use searchParams which is undefined in this context
    const minYearValue = minYear || 1990;
    const maxYearValue = maxYear || new Date().getFullYear() + 1;
    const minMileageValue = minMileage || 0;
    const maxMileageValue = maxMileage || 999999999;
    
    // Use advanced search with proper parameter mapping
    const searchResult = await advancedCarSearch({
      query: search,
      make,
      bodyType,
      fuelType,
      transmission,
      color,
      minPrice: minPrice === Number.MAX_SAFE_INTEGER ? 0 : Number(minPrice),
      maxPrice: maxPrice === Number.MAX_SAFE_INTEGER ? 999999999 : Number(maxPrice),
      // Properly handle seats filter
      seats: seats && seats !== '' && !isNaN(Number(seats)) ? Number(seats) : null,
      // Better featured filter handling
      featured: featured === 'true' ? true : featured === 'false' ? false : featured === true ? true : featured === false ? false : null,
      // Pass year and mileage parameters directly
      minYear: Number(minYearValue),
      maxYear: Number(maxYearValue),
      minMileage: Number(minMileageValue),
      maxMileage: Number(maxMileageValue),
      dealershipId: dealershipId || null,
      sortBy: convertedSortBy,
      page: Number(page) || 1,
      limit: Number(limit) || 8,
      includeDealership: true
    });
    

    // Handle safeAsync result
    if (!searchResult.success) {
      throw new Error(searchResult.error?.message || 'Advanced search failed');
    }

    const searchData = searchResult.data;


    // Apply wishlist status to serialized cars with error handling
    let carsWithWishlist = [];
    try {
      if (!searchData || !Array.isArray(searchData.cars)) {
        console.error('Invalid searchData structure:', searchData);
        throw new Error('Invalid search result structure');
      }
      
      // Update wishlist status efficiently
      carsWithWishlist = searchData.cars.map((car) => {
        const isUserWishlisted = wishlisted.has(car.id);
        return {
          ...car,
          isWishlisted: isUserWishlisted,
          wishlisted: isUserWishlisted  // Ensure both properties are consistent
        };
      });
    } catch (mappingError) {
      console.error('Error mapping cars with wishlist:', mappingError);
      throw new Error('Failed to process search results: ' + mappingError.message);
    }

    // Convert advanced search response to legacy format for compatibility
    const result = {
      success: true,
      data: carsWithWishlist,
      pagination: {
        total: searchData.pagination.total,
        page: searchData.pagination.page,
        limit: searchData.pagination.limit,
        pages: searchData.pagination.totalPages,
      },
    };
    
    
    return result;
  } catch (error) {
    console.error("Error in enhanced getCars:", error);
    
    // Create a user-friendly error message
    let errorMessage = "Please check your input and try again.";
    
    // Check for specific error types to provide better messages
    if (error.message.includes('validation') || 
        error.message.includes('invalid') || 
        error.message.includes('required')) {
      errorMessage = "Invalid filter values. Please check your inputs and try again.";
    } else if (error.message.includes('database') || 
               error.message.includes('query')) {
      errorMessage = "Database error. Please try again later.";
    } else if (error.message.includes('timeout') || 
               error.message.includes('network')) {
      errorMessage = "Network error. Please check your connection and try again.";
    }
    
    return {
      success: false,
      error: "Error fetching cars: " + errorMessage,
      data: [],
      pagination: { total: 0, page: 1, limit: 8, pages: 0 }
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
