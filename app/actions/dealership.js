"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generatePlaceholderLogo } from "@/lib/utils";
import { cookies } from "next/headers";
import { createClient } from "@/lib/server";

export async function getDealership() {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user || user.role !== "DEALERSHIP_ADMIN") {
    return { authorized: false, reason: "not-admin" };
  }

  return { authorized: true, user };
}

export async function submitDealershipApplication(applicationData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized: You must be logged in to submit an application",
      };
    }

    // Get the user
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Handle logo - applicationData.logo should already be a URL string
    let logoUrl = applicationData.logo;

    // If no logo provided, generate placeholder
    if (!logoUrl || logoUrl === "null" || logoUrl === "undefined") {
      logoUrl = generatePlaceholderLogo(applicationData.ownerName);
    }

    // Create the application
    const application = await db.dealershipApplication.create({
      data: {
        userId: user.id,
        dealershipName: applicationData.dealershipName,
        businessLicense: applicationData.businessLicense,
        businessAddress: applicationData.businessAddress,
        businessPhone: applicationData.businessPhone,
        businessEmail: applicationData.businessEmail,
        ownerName: applicationData.ownerName,
        ownerPhone: applicationData.ownerPhone,
        ownerEmail: applicationData.ownerEmail,
        businessType: applicationData.businessType,
        yearsInBusiness: parseInt(applicationData.yearsInBusiness) || 0,
        description: applicationData.description,
        logo: logoUrl,
        website: applicationData.website || null,
        facebook: applicationData.facebook || null,
        twitter: applicationData.twitter || null,
        instagram: applicationData.instagram || null,
        whatsapp: applicationData.whatsapp || null,
        status: "PENDING",
      },
    });

    // Note: Working hours will be created when the application is approved and dealership info is created
    // For now, we'll store working hours in the application data for later use

    return {
      success: true,
      data: application,
    };
  } catch (error) {
    console.error("Error submitting dealership application:", error);
    return {
      success: false,
      error: error.message || "Failed to submit application",
    };
  }
}

export async function getDealershipApplications() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
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

    const applications = await db.dealershipApplication.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviewedByUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: applications,
    };
  } catch (error) {
    console.error("Error fetching dealership applications:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch applications",
    };
  }
}

// New function to get approved dealerships with car counts
export async function getApprovedDealerships() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
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

    const dealerships = await db.dealershipInfo.findMany({
      where: {
        isApproved: true,
        isActive: true,
      },
      include: {
        cars: {
          select: {
            id: true,
          },
        },
        admins: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        approvedByUser: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        approvedAt: "desc",
      },
    });

    // Get the original application data for each dealership
    const dealershipsWithApplications = await Promise.all(
      dealerships.map(async (dealership) => {
        const application = await db.dealershipApplication.findFirst({
          where: {
            dealershipName: dealership.name,
            businessEmail: dealership.email,
            status: "APPROVED",
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return {
          ...dealership,
          application: application || null,
        };
      })
    );

    return {
      success: true,
      data: dealershipsWithApplications,
    };
  } catch (error) {
    console.error("Error fetching approved dealerships:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch approved dealerships",
    };
  }
}

export async function reviewDealershipApplication(applicationId, reviewData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized: You must be logged in to review applications",
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

    // Get the application
    const application = await db.dealershipApplication.findUnique({
      where: { id: applicationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!application) {
      return {
        success: false,
        error: "Application not found",
      };
    }

    // Update the application status
    const updatedApplication = await db.dealershipApplication.update({
      where: { id: applicationId },
      data: {
        status: reviewData.status,
        reviewNotes: reviewData.reviewNotes,
        reviewedAt: new Date(),
        reviewedBy: user.id,
      },
    });

    // If approved, create dealership info and update user role
    if (reviewData.status === "APPROVED") {
      // Create dealership info
      const dealershipInfo = await db.dealershipInfo.create({
        data: {
          name: application.dealershipName,
          address: application.businessAddress,
          phone: application.businessPhone,
          email: application.businessEmail,
          logo: application.logo, // Include the logo
          description: application.description,
          // Include social media fields from application
          website: application.website,
          facebook: application.facebook,
          twitter: application.twitter,
          instagram: application.instagram,
          whatsapp: application.whatsapp,
          isApproved: true,
          approvedBy: user.id,
          approvedAt: new Date(),
        },
      });

      // Create working hours if the application had working hours data
      // Note: We'll need to store working hours in the application or retrieve them from the form data
      // For now, we'll create default working hours
      const defaultWorkingHours = [
        {
          dayOfWeek: "MONDAY",
          openTime: "09:00",
          closeTime: "18:00",
          isOpen: true,
        },
        {
          dayOfWeek: "TUESDAY",
          openTime: "09:00",
          closeTime: "18:00",
          isOpen: true,
        },
        {
          dayOfWeek: "WEDNESDAY",
          openTime: "09:00",
          closeTime: "18:00",
          isOpen: true,
        },
        {
          dayOfWeek: "THURSDAY",
          openTime: "09:00",
          closeTime: "18:00",
          isOpen: true,
        },
        {
          dayOfWeek: "FRIDAY",
          openTime: "09:00",
          closeTime: "18:00",
          isOpen: true,
        },
        {
          dayOfWeek: "SATURDAY",
          openTime: "09:00",
          closeTime: "17:00",
          isOpen: true,
        },
        { dayOfWeek: "SUNDAY", openTime: "", closeTime: "", isOpen: false },
      ];

      await db.workingHour.createMany({
        data: defaultWorkingHours.map((hours) => ({
          ...hours,
          dealershipId: dealershipInfo.id,
        })),
      });

      // Update user role to dealership admin and link to dealership
      await db.user.update({
        where: { id: application.userId },
        data: {
          role: "DEALERSHIP_ADMIN",
          dealershipId: dealershipInfo.id,
        },
      });
    }

    return {
      success: true,
      data: updatedApplication,
    };
  } catch (error) {
    console.error("Error reviewing dealership application:", error);
    return {
      success: false,
      error: error.message || "Failed to review application",
    };
  }
}

export async function getDealershipData(dealershipId = null) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized: You must be logged in",
      };
    }

    // Use checkUser to ensure user exists in database
    const { checkUser } = await import("@/lib/checkUser");
    const user = await checkUser();

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // If no dealershipId is provided, use the user's dealership (for dealer portal)
    const targetDealershipId = dealershipId || user.dealershipId;

    // If user is not an admin and is trying to access a different dealership, deny access
    if (user.role !== "ADMIN" && targetDealershipId !== user.dealershipId) {
      return {
        success: false,
        error: "Unauthorized: You can only access your own dealership",
      };
    }

    if (!targetDealershipId) {
      return {
        success: false,
        error: "No dealership specified",
      };
    }

    // Get dealership data with working hours
    const dealership = await db.dealershipInfo.findUnique({
      where: { id: targetDealershipId },
      include: {
        workingHours: {
          orderBy: {
            dayOfWeek: "asc",
          },
        },
      },
    });

    if (!dealership) {
      return {
        success: false,
        error: "Dealership not found",
      };
    }

    return {
      success: true,
      data: dealership,
    };
  } catch (error) {
    console.error("❌ getDealershipData: Error occurred:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch dealership data",
    };
  }
}

export async function checkUserApplicationStatus() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized: You must be logged in",
      };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        dealershipApplications: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        dealership: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // If user is already a dealership admin
    if (user.role === "DEALERSHIP_ADMIN" && user.dealership) {
      return {
        success: true,
        data: {
          status: "APPROVED",
          dealership: user.dealership,
          application: null,
        },
      };
    }

    // If user has a pending application
    if (user.dealershipApplications.length > 0) {
      const latestApplication = user.dealershipApplications[0];
      return {
        success: true,
        data: {
          status: latestApplication.status,
          application: latestApplication,
          dealership: null,
        },
      };
    }

    // No application found
    return {
      success: true,
      data: {
        status: "NO_APPLICATION",
        application: null,
        dealership: null,
      },
    };
  } catch (error) {
    console.error("Error checking user application status:", error);
    return {
      success: false,
      error: error.message || "Failed to check application status",
    };
  }
}

// Wrapper function to ensure we always return a valid response
export async function safeCheckUserApplicationStatus() {
  try {
    const result = await checkUserApplicationStatus();

    // Double-check that we have a valid response structure
    if (!result || typeof result !== "object") {
      return {
        success: false,
        error: "Invalid response from server",
        data: null,
      };
    }

    // Ensure all required properties exist
    return {
      success: result.success || false,
      error: result.error || null,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Critical error in safeCheckUserApplicationStatus:", error);
    return {
      success: false,
      error: "Critical server error occurred",
      data: null,
    };
  }
}

export async function checkDealershipAuthorization() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized: You must be logged in",
      };
    }

    // Get the user with their dealership info
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        dealership: true, // Include the dealership relation
      },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Allow main admins to access dealership admin panel
    if (user.role === "ADMIN") {
      // For main admins, get the first approved dealership or create a default one
      let defaultDealership = await db.dealershipInfo.findFirst({
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
      });

      if (!defaultDealership) {
        // Create a default dealership if none exists
        defaultDealership = await db.dealershipInfo.create({
          data: {
            name: "Default Dealership",
            email: "admin@example.com",
            phone: "123-456-7890",
            address: "123 Main St",
            isApproved: true,
            isActive: true,
          },
        });
      }

      return {
        success: true,
        data: {
          role: user.role,
          dealership: defaultDealership,
        },
      };
    }

    // Handle DEALERSHIP_ADMIN role
    if (user.role === "DEALERSHIP_ADMIN") {
      let dealership = user.dealership;

      // If no dealership assigned, try to find one where user is admin
      if (!dealership) {
        dealership = await db.dealershipInfo.findFirst({
          where: {
            admins: {
              some: {
                id: user.id,
              },
            },
          },
          include: {
            workingHours: true,
          },
        });

        if (dealership) {
          // Update user with dealershipId
          await db.user.update({
            where: { id: user.id },
            data: { dealershipId: dealership.id },
          });
          user.dealershipId = dealership.id;
          user.dealership = dealership;
        } else {
          return {
            success: false,
            error:
              "No dealership assigned to your account. Please contact support.",
          };
        }
      }

      // Return the dealership info
      return {
        success: true,
        data: {
          role: user.role,
          dealership: dealership,
        },
      };
    }

    // For other users, try to fix their role
    try {
      const fixResult = await checkAndFixDealershipAdminRole();

      if (fixResult.success && fixResult.data.role === "DEALERSHIP_ADMIN") {
        return fixResult;
      }
    } catch (error) {
      console.error("Error fixing user role:", error);
      // Continue with the normal flow if role fixing fails
    }

    return {
      success: false,
      error: "You do not have permission to access the dealership admin panel.",
      data: {
        role: user.role,
        dealership: null,
      },
    };
  } catch (error) {
    console.error("Error checking dealership authorization:", error);
    return {
      success: false,
      error: error.message || "Failed to check authorization",
    };
  }
}

// Delete a dealership (hard delete with manual cascading)
export async function deleteDealership(dealershipId) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized: You must be logged in" };
    }

    // Permissions
    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) return { success: false, error: "User not found" };
    const isAdmin = user.role === "ADMIN";
    const isDealershipAdmin =
      user.role === "DEALERSHIP_ADMIN" && user.dealershipId === dealershipId;
    if (!isAdmin && !isDealershipAdmin) {
      return { success: false, error: "Unauthorized: Admin access required" };
    }

    // Fetch target dealership and related IDs first (outside of transaction)
    const target = await db.dealershipInfo.findUnique({
      where: { id: dealershipId },
      include: { admins: { select: { id: true } } },
    });
    if (!target) {
      return { success: false, error: "Dealership not found" };
    }

    const cars = await db.car.findMany({
      where: { dealershipId },
      select: { id: true },
    });
    const carIds = cars.map((c) => c.id);

    // Clean up dependent data sequentially to avoid long interactive transactions in serverless
    if (carIds.length > 0) {
      await db.testDriveBooking.deleteMany({
        where: { carId: { in: carIds } },
      });
      await db.userSavedCar.deleteMany({ where: { carId: { in: carIds } } });
    }

    // Delete cars and working hours
    await db.car.deleteMany({ where: { dealershipId } });
    await db.workingHour.deleteMany({ where: { dealershipId } });

    // Delete related dealership applications (for admins or by matching business details)
    const userIds = target.admins.map((admin) => admin.id);
    if (userIds.length > 0) {
      await db.dealershipApplication.deleteMany({
        where: {
          OR: [
            { userId: { in: userIds } },
            {
              AND: [
                { dealershipName: target.name },
                { businessEmail: target.email },
              ],
            },
          ],
        },
      });
    } else {
      await db.dealershipApplication.deleteMany({
        where: {
          AND: [
            { dealershipName: target.name },
            { businessEmail: target.email },
          ],
        },
      });
    }

    // Reset user roles for users belonging to this dealership
    await db.user.updateMany({
      where: { dealershipId },
      data: { role: "USER", dealershipId: null },
    });

    // Finally delete the dealership itself
    await db.dealershipInfo.delete({ where: { id: dealershipId } });

    return { success: true, data: { id: dealershipId } };
  } catch (error) {
    console.error("Error deleting dealership:", error);
    return {
      success: false,
      error: error.message || "Failed to delete dealership",
    };
  }
}

// Backwards-compatible wrapper (deactivation now means deletion)
export async function deactivateDealership(dealershipId) {
  return deleteDealership(dealershipId);
}

// New function to update dealership information
export async function updateDealershipInfo(dealershipData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized: You must be logged in",
      };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: { dealership: true },
    });

    if (!user || (user.role !== "DEALERSHIP_ADMIN" && user.role !== "ADMIN")) {
      return {
        success: false,
        error: "Unauthorized: Dealership admin access required",
      };
    }

    if (!user.dealership) {
      return {
        success: false,
        error: "No dealership found for this user",
      };
    }

    const updateData = {
      name: dealershipData.name,
      address: dealershipData.address,
      phone: dealershipData.phone,
      email: dealershipData.email,
      website: dealershipData.website,
      whatsapp: dealershipData.whatsapp,
      facebook: dealershipData.facebook,
      twitter: dealershipData.twitter,
      instagram: dealershipData.instagram,
      description: dealershipData.description,
    };

    if (dealershipData.logo) {
      updateData.logo = dealershipData.logo;
    }

    const updatedDealership = await db.dealershipInfo.update({
      where: { id: user.dealership.id },
      data: updateData,
    });

    return {
      success: true,
      data: updatedDealership,
    };
  } catch (error) {
    console.error("Error updating dealership info:", error);
    return {
      success: false,
      error: error.message || "Failed to update dealership information",
    };
  }
}

// New function to add car to dealership
import { serializeCarData } from "@/lib/helper";

export async function addCarToDealership(carData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized: You must be logged in",
      };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: { dealership: true },
    });

    if (!user || (user.role !== "DEALERSHIP_ADMIN" && user.role !== "ADMIN")) {
      return {
        success: false,
        error: "Unauthorized: Dealership admin access required",
      };
    }

    if (!user.dealership) {
      return {
        success: false,
        error: "No dealership found for this user",
      };
    }

    // Create the car
    const car = await db.car.create({
      data: {
        make: carData.make,
        model: carData.model,
        year: parseInt(carData.year),
        mileage: parseInt(carData.mileage) || 0,
        color: carData.color,
        fuelType: carData.fuelType,
        transmission: carData.transmission,
        bodyType: carData.bodyType,
        seats: parseInt(carData.seats) || null,
        description: carData.description,
        minPrice: parseFloat(carData.minPrice),
        maxPrice: parseFloat(carData.maxPrice),
        dealershipId: user.dealership.id,
        status: "AVAILABLE",
        featured: false,
        images: carData.images || [],
      },
    });

    return {
      success: true,
      data: serializeCarData(car),
    };
  } catch (error) {
    console.error("Error adding car to dealership:", error);
    return {
      success: false,
      error: error.message || "Failed to add car",
    };
  }
}

// New function to delete car from dealership
export async function deleteCarFromDealership(carId) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized: You must be logged in",
      };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: { dealership: true },
    });

    if (!user || (user.role !== "DEALERSHIP_ADMIN" && user.role !== "ADMIN")) {
      return {
        success: false,
        error: "Unauthorized: Dealership admin access required",
      };
    }

    if (!user.dealership) {
      return {
        success: false,
        error: "No dealership found for this user",
      };
    }

    // Verify the car belongs to this dealership
    const car = await db.car.findFirst({
      where: {
        id: carId,
        dealershipId: user.dealership.id,
      },
    });

    if (!car) {
      return {
        success: false,
        error: "Car not found or not authorized to delete",
      };
    }

    // Delete the car
    await db.car.delete({
      where: { id: carId },
    });

    return {
      success: true,
      data: { message: "Car deleted successfully" },
    };
  } catch (error) {
    console.error("Error deleting car from dealership:", error);
    return {
      success: false,
      error: error.message || "Failed to delete car",
    };
  }
}

// Function to manually check and fix user roles for dealership admins
export async function checkAndFixDealershipAdminRole() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized: You must be logged in",
      };
    }

    // Get user by Clerk ID
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Check if user has an approved dealership application
    const approvedApplication = await db.dealershipApplication.findFirst({
      where: {
        userId: user.id,
        status: "APPROVED",
      },
      orderBy: { createdAt: "desc" },
    });

    if (approvedApplication) {
      // Check if dealership exists
      const dealership = await db.dealershipInfo.findFirst({
        where: {
          name: approvedApplication.dealershipName,
          email: approvedApplication.businessEmail,
          isApproved: true,
        },
      });

      if (dealership) {
        // Update user role and dealershipId if needed
        if (
          user.role !== "DEALERSHIP_ADMIN" ||
          user.dealershipId !== dealership.id
        ) {
          await db.user.update({
            where: { id: user.id },
            data: {
              role: "DEALERSHIP_ADMIN",
              dealershipId: dealership.id,
            },
          });

          return {
            success: true,
            data: {
              role: "DEALERSHIP_ADMIN",
              dealership: dealership,
            },
          };
        } else {
          return {
            success: true,
            data: {
              role: user.role,
              dealership: dealership,
            },
          };
        }
      }
    }

    return {
      success: true,
      data: {
        role: user.role,
        dealership: null,
      },
    };
  } catch (error) {
    console.error("Error checking and fixing dealership admin role:", error);
    return {
      success: false,
      error: error.message || "Failed to check and fix role",
    };
  }
}

// New public dealership actions
export async function getDealershipById(dealershipId) {
  try {
    if (!dealershipId) {
      return { success: false, error: "Dealership ID is required" };
    }

    const dealership = await db.dealershipInfo.findUnique({
      where: {
        id: dealershipId,
        isActive: true,
        isApproved: true,
      },
      include: {
        workingHours: {
          orderBy: {
            dayOfWeek: "asc",
          },
        },
        cars: {
          where: {
            status: {
              in: ["AVAILABLE", "UNAVAILABLE"],
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 12,
        },
        _count: {
          select: {
            cars: {
              where: {
                status: {
                  in: ["AVAILABLE", "UNAVAILABLE"],
                },
              },
            },
          },
        },
      },
    });

    if (!dealership) {
      return { success: false, error: "Dealership not found" };
    }

    // Convert Decimal objects to numbers for client components
    const serializedDealership = {
      ...dealership,
      cars: dealership.cars.map((car) => ({
        ...car,
        minPrice: Number(car.minPrice),
        maxPrice: Number(car.maxPrice),
      })),
    };

    return { success: true, data: serializedDealership };
  } catch (error) {
    console.error("Error fetching dealership by ID:", error);
    return { success: false, error: "Failed to fetch dealership" };
  }
}

export async function getDealershipCarsById(
  dealershipId,
  page = 1,
  limit = 12,
  filters = {}
) {
  try {
    const skip = (page - 1) * limit;

    const where = {
      dealershipId,
      status: {
        in: ["AVAILABLE", "UNAVAILABLE"],
      },
      ...(filters.make && { make: filters.make }),
      ...(filters.year && { year: parseInt(filters.year) }),
      ...(filters.fuelType && { fuelType: filters.fuelType }),
      ...(filters.transmission && { transmission: filters.transmission }),
      ...(filters.bodyType && { bodyType: filters.bodyType }),
      ...(filters.color && { color: filters.color }),
      ...(filters.seats && { seats: parseInt(filters.seats) }),
      ...(filters.minPrice && {
        minPrice: { gte: parseFloat(filters.minPrice) },
      }),
      ...(filters.maxPrice && {
        maxPrice: { lte: parseFloat(filters.maxPrice) },
      }),
    };

    const [cars, totalCount] = await Promise.all([
      db.car.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.car.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    // Convert Decimal objects to numbers for client components
    const serializedCars = cars.map((car) => ({
      ...car,
      minPrice: Number(car.minPrice),
      maxPrice: Number(car.maxPrice),
    }));

    return {
      success: true,
      data: {
        cars: serializedCars,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching dealership cars:", error);
    return { success: false, error: "Failed to fetch dealership cars" };
  }
}

export async function getDealershipStats(dealershipId) {
  try {
    const stats = await db.dealershipInfo.findUnique({
      where: { id: dealershipId },
      include: {
        _count: {
          select: {
            cars: true,
          },
        },
        cars: {
          select: {
            status: true,
            minPrice: true,
            maxPrice: true,
            featured: true,
          },
        },
      },
    });

    if (!stats) {
      return { success: false, error: "Dealership not found" };
    }

    const totalCars = stats._count.cars;
    const availableCars = stats.cars.filter(
      (car) => car.status === "AVAILABLE"
    ).length;
    const soldCars = stats.cars.filter((car) => car.status === "SOLD").length;
    const featuredCars = stats.cars.filter((car) => car.featured).length;
    const totalValue = stats.cars.reduce(
      (sum, car) => sum + (Number(car.maxPrice) || 0),
      0
    );
    const avgPrice = totalCars > 0 ? totalValue / totalCars : 0;

    return {
      success: true,
      data: {
        totalCars,
        availableCars,
        soldCars,
        featuredCars,
        totalValue,
        avgPrice,
        yearsInBusiness: Math.floor(
          (new Date() - new Date(stats.createdAt)) /
            (365.25 * 24 * 60 * 60 * 1000)
        ),
      },
    };
  } catch (error) {
    console.error("Error fetching dealership stats:", error);
    return { success: false, error: "Failed to fetch dealership stats" };
  }
}

const slugifyName = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export async function getDealershipByName(dealershipName) {
  try {
    if (!dealershipName) {
      return { success: false, error: "Dealership name is required" };
    }

    const targetSlug = slugifyName(dealershipName);

    // Find the dealership whose generated slug matches the target
    const potentialMatches = await db.dealershipInfo.findMany({
      where: {
        isActive: true,
        isApproved: true,
      },
      select: {
        id: true,
        name: true,
      },
    });

    const matchedDealership = potentialMatches.find(
      (dealership) =>
        slugifyName(dealership.name) === targetSlug ||
        dealership.name.toLowerCase().trim() ===
          dealershipName.toLowerCase().trim()
    );

    if (!matchedDealership) {
      return { success: false, error: "Dealership not found" };
    }

    const dealership = await db.dealershipInfo.findFirst({
      where: {
        id: matchedDealership.id,
        isActive: true,
        isApproved: true,
      },
      include: {
        workingHours: {
          orderBy: {
            dayOfWeek: "asc",
          },
        },
        cars: {
          where: {
            status: {
              in: ["AVAILABLE", "UNAVAILABLE"],
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 12,
        },
        _count: {
          select: {
            cars: {
              where: {
                status: {
                  in: ["AVAILABLE", "UNAVAILABLE"],
                },
              },
            },
          },
        },
      },
    });

    if (!dealership) {
      return { success: false, error: "Dealership not found" };
    }

    // Convert Decimal objects to numbers for client components
    const serializedDealership = {
      ...dealership,
      cars: dealership.cars.map((car) => ({
        ...car,
        minPrice: Number(car.minPrice),
        maxPrice: Number(car.maxPrice),
      })),
    };

    return { success: true, data: serializedDealership };
  } catch (error) {
    console.error("Error fetching dealership by name:", error);
    return { success: false, error: "Failed to fetch dealership" };
  }
}
