"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function getDealershipUIState() {
  try {
    console.log('[getDealershipUIState] Starting...');
    const { userId } = await auth();
    console.log('[getDealershipUIState] Auth userId:', userId);

    // No auth => offer to become a dealership
    if (!userId) {
      console.log('[getDealershipUIState] No userId, returning BECOME');
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
    console.log('[getDealershipUIState] User found:', {
      id: user?.id,
      role: user?.role,
      dealershipId: user?.dealershipId,
      hasDealership: !!user?.dealership,
      applicationCount: user?.dealershipApplications?.length || 0
    });

    if (!user) {
      console.log('[getDealershipUIState] No user in DB, returning BECOME');
      return {
        state: "BECOME",
        href: "/dealership-signup",
        label: "Become a Dealership",
        status: "NO_APPLICATION",
      };
    }

    // Admins don't need this button
    if (user.role === "ADMIN") {
      console.log('[getDealershipUIState] User is ADMIN, returning NONE');
      return { state: "NONE" };
    }

    // Dealership admin
    if (user.role === "DEALERSHIP_ADMIN") {
      if (user.dealership) {
        console.log('[getDealershipUIState] DEALERSHIP_ADMIN with dealership, returning MY_DEALERSHIP');
        return {
          state: "MY_DEALERSHIP",
          href: "/dealership",
          label: "My Dealership",
          status: "APPROVED",
        };
      }
      // If dealership is missing, fix role and show become button
      console.log('[getDealershipUIState] DEALERSHIP_ADMIN without dealership, demoting to USER');
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
    console.log('[getDealershipUIState] USER role, latest app status:', latestStatus);

    if (latestStatus === "NO_APPLICATION" || latestStatus === "REJECTED") {
      console.log('[getDealershipUIState] Returning BECOME for USER');
      return {
        state: "BECOME",
        href: "/dealership-signup",
        label: "Become a Dealership",
        status: latestStatus,
      };
    }

    // PENDING, UNDER_REVIEW, REQUIRES_CHANGES
    console.log('[getDealershipUIState] Returning CHECK_STATUS for USER');
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

