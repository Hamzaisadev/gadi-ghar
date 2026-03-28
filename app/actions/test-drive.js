"use server";

import { serializeCarData } from "@/lib/helper";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { testDriveBookingSchema } from "@/lib/validation";

// Initialize Resend only when needed to avoid import issues
let resend;
const getResend = () => {
  if (!resend && process.env.RESEND_API_KEY) {
    const { Resend } = require("resend");
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
};

// Email notification function
async function sendDealershipTestDriveNotification({
  booking,
  dealership,
  customer,
  car,
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Resend API key not configured, skipping email notification");
    return;
  }

  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🚗 New Test Drive Booking!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #dc2626; margin-top: 0; font-size: 24px;">Booking Details</h2>
          
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #dc2626; margin-top: 0;">🚗 Vehicle Information</h3>
            <p style="margin: 5px 0;"><strong>Car:</strong> ${car.year} ${car.make} ${car.model}</p>
            <p style="margin: 5px 0;"><strong>Color:</strong> ${car.color}</p>
            <p style="margin: 5px 0;"><strong>Fuel Type:</strong> ${car.fuelType}</p>
            <p style="margin: 5px 0;"><strong>Transmission:</strong> ${car.transmission}</p>
          </div>
          
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1d4ed8; margin-top: 0;">📅 Schedule Information</h3>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${format(new Date(booking.bookingDate), "EEEE, MMMM d, yyyy")}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${booking.startTime} - ${booking.endTime}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="background: #fbbf24; color: #92400e; padding: 2px 8px; border-radius: 4px; font-size: 12px;">PENDING</span></p>
            ${booking.notes ? `<p style="margin: 10px 0 5px 0;"><strong>Customer Notes:</strong></p><p style="background: #f9fafb; padding: 10px; border-radius: 4px; margin: 5px 0;">${booking.notes}</p>` : ""}
          </div>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #15803d; margin-top: 0;">👤 Customer Information</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${customer.name || "Not provided"}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${customer.email}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${customer.phone || "Not provided"}</p>
          </div>
          
          <div style="background: #fafafa; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="color: #374151; margin-top: 0;">📋 Next Steps</h3>
            <ul style="color: #6b7280; padding-left: 20px;">
              <li>Review the booking details above</li>
              <li>Confirm availability for the requested time slot</li>
              <li>Contact the customer to confirm the appointment</li>
              <li>Update the booking status in your dashboard</li>
              <li>Prepare the vehicle for the test drive</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dealership/test-drives" style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Manage Test Drives</a>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>This email was sent from <strong>Gadi Ghar</strong> - Your trusted car marketplace</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </div>
    `;

    const resendClient = getResend();
    if (!resendClient) {
      throw new Error("Resend client not initialized");
    }

    await resendClient.emails.send({
      from: process.env.FROM_EMAIL || "noreply@gadighar.com",
      to: dealership.email,
      subject: `🚗 New Test Drive Booking - ${car.year} ${car.make} ${car.model}`,
      html: emailHtml,
    });

  } catch (error) {
    console.error("Failed to send dealership notification email:", error);
    throw error;
  }
}

export async function bookTestDrive({
  carId,
  bookingDate,
  startTime,
  endTime,
  notes,
}) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) throw new Error("You must be logged in to book a test drive");

    const validationResult = testDriveBookingSchema.safeParse({
      carId,
      bookingDate: new Date(bookingDate),
      startTime,
      endTime,
      notes,
    });

    if (!validationResult.success) {
      return {
        success: false,
        error: "Invalid booking data",
        errorDetails: validationResult.error.flatten(),
      };
    }

    const validatedData = validationResult.data;

    // Find user in our database
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found in database");

    // Check if car exists and is available
    const car = await db.car.findUnique({
      where: { id: validatedData.carId, status: "AVAILABLE" },
      include: {
        dealership: true,
      },
    });

    if (!car) throw new Error("Car not available for test drive");

    // Check if slot is already booked
    const existingBooking = await db.testDriveBooking.findFirst({
      where: {
        carId: validatedData.carId,
        bookingDate: validatedData.bookingDate,
        startTime: validatedData.startTime,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });

    if (existingBooking) {
      throw new Error(
        "This time slot is already booked. Please select another time."
      );
    }

    // Create the booking
    const booking = await db.testDriveBooking.create({
      data: {
        carId: validatedData.carId,
        userId: user.id,
        bookingDate: validatedData.bookingDate,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        notes: validatedData.notes || null,
        status: "PENDING",
      },
      include: {
        car: {
          include: {
            dealership: true,
          },
        },
        user: true,
      },
    });

    // Send email notification to dealership (don't wait for it)
    try {
      await sendDealershipTestDriveNotification({
        booking,
        dealership: car.dealership,
        customer: user,
        car,
      });
    } catch (emailError) {
      console.error("Failed to send dealership notification:", emailError);
      // Don't fail the booking if email fails
    }

    // Revalidate relevant paths
    revalidatePath(`/test-drive/${validatedData.carId}`);
    revalidatePath(`/cars/${validatedData.carId}`);
    revalidatePath(`/dealership/test-drives`);
    revalidatePath(`/admin/test-drives`);

    return {
      success: true,
      data: {
        id: booking.id,
        carId: booking.carId,
        bookingDate: booking.bookingDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
        notes: booking.notes,
        status: booking.status,
        dealership: {
          name: car.dealership.name,
          phone: car.dealership.phone,
          email: car.dealership.email,
          address: car.dealership.address,
        },
      },
    };
  } catch (error) {
    console.error("Error booking test drive:", error);
    return {
      success: false,
      error: error.message || "Failed to book test drive",
    };
  }
}

export async function getUserTestDrives() {
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

    // Get user's test drive bookings
    const bookings = await db.testDriveBooking.findMany({
      where: { userId: user.id },
      include: {
        car: true,
      },
      orderBy: { bookingDate: "desc" },
    });

    // Format the bookings
    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      carId: booking.carId,
      car: serializeCarData(booking.car),
      bookingDate: booking.bookingDate.toISOString(),
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      notes: booking.notes,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    }));

    return {
      success: true,
      data: formattedBookings,
    };
  } catch (error) {
    console.error("Error fetching test drives:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function cancelTestDrive(bookingId) {
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

    // Get the booking
    const booking = await db.testDriveBooking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return {
        success: false,
        error: "Booking not found",
      };
    }

    // Check if user owns this booking
    if (booking.userId !== user.id && user.role !== "ADMIN") {
      return {
        success: false,
        error: "Unauthorized to cancel this booking",
      };
    }

    // Check if booking can be cancelled
    if (booking.status === "CANCELLED") {
      return {
        success: false,
        error: "Booking is already cancelled",
      };
    }

    if (booking.status === "COMPLETED") {
      return {
        success: false,
        error: "Cannot cancel a completed booking",
      };
    }

    // Update the booking status
    await db.testDriveBooking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    // Revalidate paths
    revalidatePath("/reservations");
    revalidatePath("/admin/test-drives");

    return {
      success: true,
      message: "Test drive cancelled successfully",
    };
  } catch (error) {
    console.error("Error cancelling test drive:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// DEALERSHIP-SPECIFIC FUNCTIONS

/**
 * Get test drive bookings for a specific dealership
 * Only dealership admins can access their own bookings
 */
export async function getDealershipTestDriveBookings(status = null) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");


    // Check if user is a dealership admin or main admin
    if (user.role !== "DEALERSHIP_ADMIN" && user.role !== "ADMIN") {
      throw new Error(
        "Unauthorized: Only dealership admins can access this resource"
      );
    }

    // Get dealership info if user is DEALERSHIP_ADMIN
    let dealership = null;
    if (user.role === "DEALERSHIP_ADMIN") {
      if (!user.dealershipId) {
        console.error(`No dealership ID found for user ${user.id}`);
        return {
          success: false,
          error: "NO_DEALERSHIP_ASSOCIATED",
          message: "Your account is not associated with any dealership. Please contact support for assistance.",
          data: []
        };
      }

      dealership = await db.dealershipInfo.findUnique({
        where: { id: user.dealershipId }
      });

      if (!dealership) {
        console.error(`Dealership not found with ID ${user.dealershipId} for user ${user.id}`);
        return {
          success: false,
          error: "NO_DEALERSHIP_ASSOCIATED",
          message: "Your dealership could not be found. Please contact support for assistance.",
          data: []
        };
      }

    }

    // Build query conditions
    let whereCondition = {};

    if (user.role === "DEALERSHIP_ADMIN") {
      // Dealership admin can only see bookings for cars from their dealership
      whereCondition = {
        car: {
          dealershipId: dealership.id,
        },
      };
    }
    // If user is ADMIN, they can see all bookings (no additional filter needed)

    if (status) {
      whereCondition.status = status;
    }


    const bookings = await db.testDriveBooking.findMany({
      where: whereCondition,
      include: {
        car: {
          include: {
            dealership: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      carId: booking.carId,
      car: {
        ...serializeCarData(booking.car),
        dealership: {
          id: booking.car.dealership?.id,
          name: booking.car.dealership?.name,
          address: booking.car.dealership?.address,
          phone: booking.car.dealership?.phone,
          email: booking.car.dealership?.email,
        },
      },
      customer: {
        id: booking.user.id,
        name: booking.user.name,
        email: booking.user.email,
        phone: booking.user.phone,
      },
      bookingDate: booking.bookingDate.toISOString().split("T")[0],
      startTime: booking.startTime,
      endTime: booking.endTime,
      notes: booking.notes,
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    }));

    return {
      success: true,
      data: formattedBookings,
    };
  } catch (error) {
    console.error("Error fetching dealership test drives:", error);
    return {
      success: false,
      message: error.message || "Failed to get dealership test drive bookings",
      error: error.message,
    };
  }
}

/**
 * Update test drive booking status (for dealership admins)
 */
export async function updateTestDriveStatus(
  bookingId,
  newStatus,
  notes = null
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        dealership: true,
      },
    });

    if (!user) throw new Error("User not found");

    // Check permissions
    if (user.role !== "DEALERSHIP_ADMIN" && user.role !== "ADMIN") {
      throw new Error(
        "Unauthorized: Only dealership admins can update bookings"
      );
    }

    // Get the booking with car and dealership info
    const booking = await db.testDriveBooking.findUnique({
      where: { id: bookingId },
      include: {
        car: {
          include: {
            dealership: true,
          },
        },
        user: true,
      },
    });

    if (!booking) {
      return {
        success: false,
        message: "Booking not found",
      };
    }

    // Check if dealership admin is trying to update booking for their dealership's car
    if (user.role === "DEALERSHIP_ADMIN") {
      if (!user.dealership || booking.car.dealershipId !== user.dealership.id) {
        return {
          success: false,
          message:
            "Unauthorized: You can only update bookings for your dealership's cars",
        };
      }
    }

    // Validate status transition
    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "CANCELLED",
      "COMPLETED",
      "NO_SHOW",
    ];
    if (!validStatuses.includes(newStatus)) {
      return {
        success: false,
        message: "Invalid status provided",
      };
    }

    // Update the booking
    const updatedBooking = await db.testDriveBooking.update({
      where: { id: bookingId },
      data: {
        status: newStatus,
        ...(notes && { notes }),
      },
    });

    // Send notification email to customer based on status
    try {
      if (newStatus === "CONFIRMED") {
        await sendCustomerConfirmationEmail({
          booking: updatedBooking,
          customer: booking.user,
          car: booking.car,
          dealership: booking.car.dealership,
        });
      }
    } catch (emailError) {
      console.error("Failed to send customer notification:", emailError);
      // Don't fail the update if email fails
    }

    revalidatePath(`/dealership/test-drives`);
    revalidatePath(`/admin/test-drives`);
    revalidatePath(`/test-drive/${booking.carId}`);

    return {
      success: true,
      message: `Test drive status updated to ${newStatus}`,
      data: updatedBooking,
    };
  } catch (error) {
    console.error("Error updating test drive status:", error);
    return {
      success: false,
      message: error.message || "Failed to update test drive status",
      error: error.message,
    };
  }
}

/**
 * Send confirmation email to customer
 */
async function sendCustomerConfirmationEmail({
  booking,
  customer,
  car,
  dealership,
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "Resend API key not configured, skipping customer email notification"
    );
    return;
  }

  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">✅ Test Drive Confirmed!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #10b981; margin-top: 0; font-size: 24px;">Great news, ${customer.name || "valued customer"}!</h2>
          <p style="font-size: 16px; color: #374151;">Your test drive has been confirmed by ${dealership.name}. We're excited to help you experience your dream car!</p>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #15803d; margin-top: 0;">📅 Your Appointment Details</h3>
            <p style="margin: 5px 0;"><strong>Vehicle:</strong> ${car.year} ${car.make} ${car.model}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${format(new Date(booking.bookingDate), "EEEE, MMMM d, yyyy")}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${booking.startTime} - ${booking.endTime}</p>
            <p style="margin: 5px 0;"><strong>Duration:</strong> Approximately 1 hour</p>
          </div>
          
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1d4ed8; margin-top: 0;">📍 Dealership Location</h3>
            <p style="margin: 5px 0; font-weight: bold;">${dealership.name}</p>
            <p style="margin: 5px 0;">${dealership.address}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${dealership.phone}</p>
          </div>
          
          <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">⚠️ Important Reminders</h3>
            <ul style="color: #92400e; padding-left: 20px; margin: 10px 0;">
              <li>Arrive 10 minutes early</li>
              <li>Bring a valid driver's license</li>
              <li>Wear comfortable driving shoes</li>
              <li>Feel free to ask any questions about the vehicle</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280;">Need to reschedule or have questions?</p>
            <a href="tel:${dealership.phone}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 10px;">Call Dealership</a>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>Thank you for choosing <strong>Gadi Ghar</strong></p>
            <p>We hope you have an amazing test drive experience!</p>
          </div>
        </div>
      </div>
    `;

    const resendClient = getResend();
    if (!resendClient) {
      throw new Error("Resend client not initialized");
    }

    await resendClient.emails.send({
      from: process.env.FROM_EMAIL || "noreply@gadighar.com",
      to: customer.email,
      subject: `\u2705 Test Drive Confirmed - ${car.year} ${car.make} ${car.model}`,
      html: emailHtml,
    });

  } catch (error) {
    console.error("Failed to send customer confirmation email:", error);
    throw error;
  }
}

// ADMIN-SPECIFIC FUNCTIONS

/**
 * Get all test drive bookings across all dealerships (Admin only)
 */
export async function getAllTestDriveBookings(filters = {}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized: Admin access required");
    }

    let whereCondition = {};

    if (filters.status) {
      whereCondition.status = filters.status;
    }

    if (filters.dealershipId) {
      whereCondition.car = {
        dealershipId: filters.dealershipId,
      };
    }

    if (filters.dateFrom || filters.dateTo) {
      whereCondition.bookingDate = {};
      if (filters.dateFrom) {
        whereCondition.bookingDate.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        whereCondition.bookingDate.lte = new Date(filters.dateTo);
      }
    }

    const bookings = await db.testDriveBooking.findMany({
      where: whereCondition,
      include: {
        car: {
          include: {
            dealership: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      carId: booking.carId,
      car: {
        ...serializeCarData(booking.car),
        dealership: {
          id: booking.car.dealership?.id,
          name: booking.car.dealership?.name,
          address: booking.car.dealership?.address,
          phone: booking.car.dealership?.phone,
          email: booking.car.dealership?.email,
        },
      },
      customer: {
        id: booking.user.id,
        name: booking.user.name,
        email: booking.user.email,
        phone: booking.user.phone,
      },
      bookingDate: booking.bookingDate.toISOString().split("T")[0],
      startTime: booking.startTime,
      endTime: booking.endTime,
      notes: booking.notes,
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    }));

    return {
      success: true,
      data: formattedBookings,
    };
  } catch (error) {
    console.error("Error fetching all test drives:", error);
    return {
      success: false,
      message: error.message || "Failed to get test drive bookings",
      error: error.message,
    };
  }
}
