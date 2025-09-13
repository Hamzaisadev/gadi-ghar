"use server"

import { serializeCarData } from "@/lib/helper";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { includes } from "zod";

export async function bookTestDrive({
    carId,
    bookingDate, 
    startTime, 
    endTime,
notes,
}) {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    
      const user = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    
      if (!user) throw new Error("User not found");
    

      const car = await db.car.findUnique({
        where: { id: carId , status: "AVAILABLE" ,},
      });
    
      if (!car) throw new Error("Car not found");
    
      const existingBooking = await db.testDriveBooking.findFirst({
          where: {
              carId, 
              bookingDate: new Date(bookingDate),
              startTime,
              status : { in : ["PENDING", "CONFIRMED"]},
          }
      })

      if (existingBooking) throw new Error("Car is already booked for this time");

      const booking = await db.testDriveBooking.create({
          data: {
              carId,
              userId: user.id,
              bookingDate: new Date(bookingDate),
              startTime,
              endTime,
              notes: notes || null,
              status: "PENDING",
          }
      })

      revalidatePath(`/test-drive/${carId}`);
      revalidatePath(`/cars/${carId}`);
      return {
        success: true,
          message: "Test drive booked successfully",
          data : booking,
      };
  } catch (error) {
    return {
      success: false,
      message: "Failed to book test drive",
      error: error.message,
    };
  }
}

export async function getTestDriveBooking() {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    
      const user = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    
      if (!user) throw new Error("User not found");
    
      const bookings = await db.testDriveBooking.findMany({
          where: { userId: user.id },
          include: {
            car: true,
          },
          orderBy: {
            createdAt: "desc"},
      });

      const formatBookings = bookings.map((booking) => ({
          id: booking.id,
          carId: booking.carId,
          car: serializeCarData(booking.car),
          bookingDate: booking.bookingDate.toISOString(),
          startTime: booking.startTime,
          endTime: booking.endTime,
          notes: booking.notes,
          status: booking.status,
          createdAt: booking.createdAt.toISOString(),
          updatedAt: booking.updatedAt.toISOString(),
      }))
      return {
          success: true,
          data: formatBookings,
      }
  } catch (error) {
    return {
      success: false,
      message: "Failed to get test drive bookings",
      error: error.message,
    };
  }
}

export async function cancelTestDrive(bookinId) {
    try {
        const { userId } = auth();
        if (!userId) throw new Error("Unauthorized");
        
          const user = await db.user.findUnique({
            where: { clerkUserId: userId },
          });
        
          if (!user) throw new Error("User not found");

          const booking = await db.testDriveBooking.findUnique({
            where: { id: bookinId },
          });
        
        if (!booking) {
              return {
                success: false,
                message: "Booking not found",
              }
        }
        
        if (booking.userId !== user.id || user.role !== "ADMIN") {
            return {
                success: false,
                message: "Unauthorized",
            }
        }
        if (booking.status === "CANCELLED") {
            return {
                success: false,
                message: "Booking already cancelled",
            }
        }

        if (booking.status === "CONFIRMED") {
            return {
                success: false,
                message: "Booking already confirmed",
            }
        }

        await db.testDriveBooking.update({
            where: { id: bookinId },
            data: { status: "CANCELLED" },
        })

        revalidatePath("/reservations");
        revalidatePath("/admin/test-drives");
        return {
            success: true,
            message: "Booking cancelled successfully",
        }
    } catch (error) {
        return {
            success: false,
            message: "Failed to cancel test drive",
            error: error.message,
        }
    }
}