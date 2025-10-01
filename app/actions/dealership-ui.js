"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function getDealershipUIState() {
  try {
    const { userId } = await auth();

    // No auth => offer to become a dealership
    if (!userId) {
      return {
        state: "BECOME",
        href: "/dealership-signup",
        label: "Become a Dealership",
        status: "NO_APPLICATION",
      };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        dealership: true,
        dealershipApplications: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return {
        state: "BECOME",
        href: "/dealership-signup",
        label: "Become a Dealership",
        status: "NO_APPLICATION",
      };
    }

    // Admins don't need this button
    if (user.role === "ADMIN") {
      return { state: "NONE" };
    }

    // Dealership admin
    if (user.role === "DEALERSHIP_ADMIN") {
      if (user.dealership) {
        return {
          state: "MY_DEALERSHIP",
          href: "/dealership",
          label: "My Dealership",
          status: "APPROVED",
        };
      }
      // If dealership is missing, fix role and show become button
      await db.user.update({
        where: { id: user.id },
        data: { role: "USER", dealershipId: null },
      });
      return {
        state: "BECOME",
        href: "/dealership-signup",
        label: "Become a Dealership",
        status: "NO_APPLICATION",
      };
    }

    // Regular user: check latest application
    const latest = user.dealershipApplications[0] || null;
    const latestStatus = latest?.status || "NO_APPLICATION";

    if (latestStatus === "NO_APPLICATION" || latestStatus === "REJECTED") {
      return {
        state: "BECOME",
        href: "/dealership-signup",
        label: "Become a Dealership",
        status: latestStatus,
      };
    }

    // PENDING, UNDER_REVIEW, REQUIRES_CHANGES
    return {
      state: "CHECK_STATUS",
      href: "/dealership-signup",
      label: "Check Status",
      status: latestStatus,
    };
  } catch (e) {
    // Fail-safe: still render a button that lets the user try to apply
    console.error('[getDealershipUIState] Error:', e);
    return {
      state: "BECOME",
      href: "/dealership-signup",
      label: "Become a Dealership",
      status: "NO_APPLICATION",
    };
  }
}

