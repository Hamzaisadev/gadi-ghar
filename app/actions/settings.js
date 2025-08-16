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

    let dealership = await db.dealershipInfo.findFirst({
      include: {
        workingHours: {
          orderBy: {
            dayOfWeek: "asc",
          },
        },
      },
    });
    if (!dealership) {
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

export async function saveWorkingHours(workingHours) {
  try {
    console.log('Starting saveWorkingHours with data:', JSON.stringify(workingHours, null, 2));
    
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
   
    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized: Admin access required");
    }
    
    // Find or create dealership
    let dealership = await db.dealershipInfo.findFirst();
    
    if (!dealership) {
      console.log('No dealership found, creating a new one');
      dealership = await db.dealershipInfo.create({
        data: {
          name: 'Gadi Ghar',
          address: 'Clifton Block 8, Karachi, Pakistan',
          phone: '03343149433',
          email: 'hamzaisadev@gmail.com'
        }
      });
    }

    console.log('Using dealership:', dealership.id);

    // Delete existing working hours for this dealership
    console.log('Deleting existing working hours...');
    const deleteResult = await db.workingHour.deleteMany({
      where: { dealershipId: dealership.id }
    });
    console.log(`Deleted ${deleteResult.count} existing working hours`);
    
    // Create new working hours
    console.log('Creating new working hours...');
    const createPromises = workingHours.map(hour => 
      db.workingHour.create({
        data: {
          dayOfWeek: hour.dayOfWeek,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          isOpen: hour.isOpen,
          dealershipId: dealership.id
        }
      })
    );
    
    await Promise.all(createPromises);
    console.log('Successfully created all working hours');

    revalidatePath("/admin/settings");
    revalidatePath("/");

    return { success: true, message: "Working hours saved successfully!" };
    
  } catch (error) {
    console.error('Error in saveWorkingHours:', error);
    return {
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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