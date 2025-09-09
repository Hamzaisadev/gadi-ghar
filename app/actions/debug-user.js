"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function debugCurrentUser() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        dealership: true,
        dealershipApplications: {
          orderBy: { createdAt: "desc" },
          take: 3, // Get latest 3 applications
          select: {
            id: true,
            status: true,
            dealershipName: true,
            createdAt: true,
            updatedAt: true,
          }
        },
      },
    });

    if (!user) {
      return { success: false, error: "User not found in database" };
    }

    return {
      success: true,
      data: {
        userId: user.id,
        clerkUserId: user.clerkUserId,
        role: user.role,
        dealershipId: user.dealershipId,
        dealership: user.dealership ? {
          id: user.dealership.id,
          name: user.dealership.name,
          isActive: user.dealership.isActive,
          isApproved: user.dealership.isApproved,
        } : null,
        applications: user.dealershipApplications,
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
