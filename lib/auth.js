import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCurrentUser() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        dealership: true
      }
    });

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function checkUserRole(allowedRoles = []) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return { hasAccess: false, user: null };
    }

    const hasAccess = allowedRoles.length === 0 || allowedRoles.includes(user.role);
    
    return { hasAccess, user };
  } catch (error) {
    console.error("Error checking user role:", error);
    return { hasAccess: false, user: null };
  }
}

export async function requireAuth(allowedRoles = []) {
  const { hasAccess, user } = await checkUserRole(allowedRoles);
  
  if (!hasAccess) {
    throw new Error("Unauthorized");
  }
  
  return user;
}

export function isDealershipAdmin(user) {
  return user && user.role === "DEALERSHIP_ADMIN";
}

export function isMainAdmin(user) {
  return user && user.role === "ADMIN";
}

export function canAccessDealership(user, dealershipId) {
  if (!user) return false;
  
  // Main admins can access everything
  if (user.role === "ADMIN") return true;
  
  // Dealership admins can only access their own dealership
  if (user.role === "DEALERSHIP_ADMIN" && user.dealershipId === dealershipId) {
    return true;
  }
  
  return false;
}
