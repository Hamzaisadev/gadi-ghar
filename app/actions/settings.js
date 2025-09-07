"use server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDealershipInfo() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    let dealership;
    
    // If user is a dealership admin, get their specific dealership
    if (user.role === 'DEALERSHIP_ADMIN' && user.dealershipId) {
      dealership = await db.dealershipInfo.findUnique({
        where: { id: user.dealershipId },
        include: {
          workingHours: {
            orderBy: {
              dayOfWeek: "asc",
            },
          },
        },
      });
    } else {
      // For other users, get the first active dealership
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
    
    // If no dealership exists and user is an admin, create a default one
    if (!dealership && user.role === 'ADMIN') {
      dealership = await db.dealershipInfo.create({
        data: {
          // Default values will be used from schema
          workingHours: {
            create: [
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
                openTime: "10:00",
                closeTime: "16:00",
                isOpen: true,
              },
              {
                dayOfWeek: "SUNDAY",
                openTime: "10:00",
                closeTime: "16:00",
                isOpen: false,
              },
            ],
          },
        },
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
        ...dealership,
        createdAt: dealership.createdAt.toISOString(),
        updatedAt: dealership.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    throw new Error("Error fetching dealership info:" + error.message);
  }
}

export async function getAllDealerships() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const dealerships = await db.dealershipInfo.findMany({
      include: {
        workingHours: {
          orderBy: {
            dayOfWeek: "asc",
          },
        },
        _count: {
          select: {
            cars: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: dealerships.map(dealership => ({
        ...dealership,
        createdAt: dealership.createdAt.toISOString(),
        updatedAt: dealership.updatedAt.toISOString(),
        workingHours: dealership.workingHours.map(hour => ({
          ...hour,
          createdAt: hour.createdAt.toISOString(),
          updatedAt: hour.updatedAt.toISOString(),
        })),
      })),
    };
  } catch (error) {
    throw new Error("Error fetching dealerships:" + error.message);
  }
}

export async function getDealershipById(dealershipId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const dealership = await db.dealershipInfo.findUnique({
      where: { id: dealershipId },
      include: {
        workingHours: {
          orderBy: {
            dayOfWeek: "asc",
          },
        },
        _count: {
          select: {
            cars: true,
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
      data: {
        ...dealership,
        createdAt: dealership.createdAt.toISOString(),
        updatedAt: dealership.updatedAt.toISOString(),
        workingHours: dealership.workingHours.map(hour => ({
          ...hour,
          createdAt: hour.createdAt.toISOString(),
          updatedAt: hour.updatedAt.toISOString(),
        })),
      },
    };
  } catch (error) {
    throw new Error("Error fetching dealership:" + error.message);
  }
}

export async function createDealership(dealershipData) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const { name, address, phone, email, workingHours } = dealershipData;

    const dealership = await db.dealershipInfo.create({
      data: {
        name,
        address,
        phone,
        email,
        workingHours: {
          create: workingHours.map(hour => ({
            dayOfWeek: hour.dayOfWeek,
            openTime: hour.openTime,
            closeTime: hour.closeTime,
            isOpen: hour.isOpen,
          })),
        },
      },
      include: {
        workingHours: {
          orderBy: {
            dayOfWeek: "asc",
          },
        },
      },
    });

    revalidatePath("/admin/settings");
    return {
      success: true,
      data: {
        ...dealership,
        createdAt: dealership.createdAt.toISOString(),
        updatedAt: dealership.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    throw new Error("Error creating dealership:" + error.message);
  }
}

export async function updateDealership(dealershipId, dealershipData) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const { name, address, phone, email, isActive, workingHours } = dealershipData;

    // Update dealership info
    const dealership = await db.dealershipInfo.update({
      where: { id: dealershipId },
      data: {
        name,
        address,
        phone,
        email,
        isActive,
      },
      include: {
        workingHours: {
          orderBy: {
            dayOfWeek: "asc",
          },
        },
      },
    });

    // Update working hours
    if (workingHours) {
      // Delete existing working hours
      await db.workingHour.deleteMany({
        where: { dealershipId },
      });

      // Create new working hours
      await db.workingHour.createMany({
        data: workingHours.map(hour => ({
          dealershipId,
          dayOfWeek: hour.dayOfWeek,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          isOpen: hour.isOpen,
        })),
      });

      // Fetch updated dealership with new working hours
      const updatedDealership = await db.dealershipInfo.findUnique({
        where: { id: dealershipId },
        include: {
          workingHours: {
            orderBy: {
              dayOfWeek: "asc",
            },
          },
        },
      });

      revalidatePath("/admin/settings");
      return {
        success: true,
        data: {
          ...updatedDealership,
          createdAt: updatedDealership.createdAt.toISOString(),
          updatedAt: updatedDealership.updatedAt.toISOString(),
        },
      };
    }

    revalidatePath("/admin/settings");
    return {
      success: true,
      data: {
        ...dealership,
        createdAt: dealership.createdAt.toISOString(),
        updatedAt: dealership.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    throw new Error("Error updating dealership:" + error.message);
  }
}

export async function deleteDealership(dealershipId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    // Check if dealership has cars
    const carCount = await db.car.count({
      where: { dealershipId },
    });

    if (carCount > 0) {
      return {
        success: false,
        error: "Cannot delete dealership with associated cars. Please reassign or remove cars first.",
      };
    }

    await db.dealershipInfo.delete({
      where: { id: dealershipId },
    });

    revalidatePath("/admin/settings");
    return {
      success: true,
      message: "Dealership deleted successfully",
    };
  } catch (error) {
    throw new Error("Error deleting dealership:" + error.message);
  }
}

export async function saveWorkingHours(workingHours) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { 
        success: false, 
        error: "Unauthorized: You must be logged in to save working hours" 
      };
    }

    // Get the user and their dealership
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: { dealership: true },
    });

    if (!user) {
      return { 
        success: false, 
        error: "User not found" 
      };
    }

    let dealership = user.dealership;

    // If no dealership exists, create one
    if (!dealership) {
      dealership = await db.dealershipInfo.create({
        data: {
          name: "New Dealership",
          address: "Address to be updated",
          phone: "Phone to be updated",
          email: "Email to be updated",
          isApproved: true,
          approvedAt: new Date(),
        },
      });

      // Link the dealership to the user
      await db.user.update({
        where: { id: user.id },
        data: { dealershipId: dealership.id },
      });
    }

    // Delete existing working hours
    const deleteResult = await db.workingHour.deleteMany({
      where: { dealershipId: dealership.id },
    });

    // Create new working hours
    const workingHoursData = Object.entries(workingHours).map(([day, hours]) => ({
      dealershipId: dealership.id,
      dayOfWeek: day.toUpperCase(),
      openTime: hours.openTime || "",
      closeTime: hours.closeTime || "",
      isOpen: hours.isOpen,
    }));

    await db.workingHour.createMany({
      data: workingHoursData,
    });

    return {
      success: true,
      data: { message: "Working hours saved successfully" },
    };
  } catch (error) {
    console.error('Error saving working hours:', error);
    return {
      success: false,
      error: error.message || 'Failed to save working hours',
    };
  }
}

export async function getUsers() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
   
    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized: Admin access required")
    }

    const users = await db.user.findMany({
      orderBy:{createdAt: "desc"}
    })

    return {
      success: true, 
      data: users.map((user) => ({
        ...user, 
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      }))
    }
  } catch (error) {
    return {
      error: "Error fetching users: " + error.message
    }
  }
}

export async function updateUserRole(userId, role) {
  try {
    const { userId: adminId } = await auth();
    if (!adminId) throw new Error("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: adminId },
    });
   
    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Unauthorized: Admin access required")
    }

    await db.user.update({
      where: { id: userId },
      data: { role },
    })

    revalidatePath("/admin/settings")
    return {
      success: true,
    }
  } catch (error) {
    return {
      error: "Error updating user role: " + error.message
    }
  }
}