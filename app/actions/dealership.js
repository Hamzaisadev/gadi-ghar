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
        error: "Unauthorized: You must be logged in to submit an application" 
      };
    }

    // Get the user
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return { 
        success: false, 
        error: "User not found" 
      };
    }

    // Handle logo - applicationData.logo should already be a URL string
    let logoUrl = applicationData.logo;

    // If no logo provided, generate placeholder
    if (!logoUrl || logoUrl === 'null' || logoUrl === 'undefined') {
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
        status: 'PENDING',
      },
    });

    // Note: Working hours will be created when the application is approved and dealership info is created
    // For now, we'll store working hours in the application data for later use

    return {
      success: true,
      data: application,
    };
  } catch (error) {
    console.error('Error submitting dealership application:', error);
    return {
      success: false,
      error: error.message || 'Failed to submit application',
    };
  }
}

export async function getDealershipApplications() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new Error("Unauthorized: Admin access required");
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: applications,
    };
  } catch (error) {
    console.error('Error fetching dealership applications:', error);
    throw error;
  }
}

// New function to get approved dealerships with car counts
export async function getApprovedDealerships() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new Error("Unauthorized: Admin access required");
    }

    const dealerships = await db.dealershipInfo.findMany({
      where: { 
        isApproved: true,
        isActive: true
      },
      include: {
        cars: {
          select: {
            id: true
          }
        },
        admins: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        approvedByUser: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        approvedAt: 'desc',
      },
    });

    // Get the original application data for each dealership
    const dealershipsWithApplications = await Promise.all(
      dealerships.map(async (dealership) => {
        const application = await db.dealershipApplication.findFirst({
          where: {
            dealershipName: dealership.name,
            businessEmail: dealership.email,
            status: 'APPROVED'
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        return {
          ...dealership,
          application: application || null
        };
      })
    );

    return {
      success: true,
      data: dealershipsWithApplications,
    };
  } catch (error) {
    console.error('Error fetching approved dealerships:', error);
    throw error;
  }
}

export async function reviewDealershipApplication(applicationId, reviewData) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { 
        success: false, 
        error: "Unauthorized: You must be logged in to review applications" 
      };
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      return { 
        success: false, 
        error: "Unauthorized: Admin access required" 
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
        error: "Application not found" 
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
    if (reviewData.status === 'APPROVED') {
      // Create dealership info
      const dealershipInfo = await db.dealershipInfo.create({
        data: {
          name: application.dealershipName,
          address: application.businessAddress,
          phone: application.businessPhone,
          email: application.businessEmail,
          logo: application.logo, // Include the logo
          isApproved: true,
          approvedBy: user.id,
          approvedAt: new Date(),
        },
      });

      // Create working hours if the application had working hours data
      // Note: We'll need to store working hours in the application or retrieve them from the form data
      // For now, we'll create default working hours
      const defaultWorkingHours = [
        { dayOfWeek: 'MONDAY', openTime: '09:00', closeTime: '18:00', isOpen: true },
        { dayOfWeek: 'TUESDAY', openTime: '09:00', closeTime: '18:00', isOpen: true },
        { dayOfWeek: 'WEDNESDAY', openTime: '09:00', closeTime: '18:00', isOpen: true },
        { dayOfWeek: 'THURSDAY', openTime: '09:00', closeTime: '18:00', isOpen: true },
        { dayOfWeek: 'FRIDAY', openTime: '09:00', closeTime: '18:00', isOpen: true },
        { dayOfWeek: 'SATURDAY', openTime: '09:00', closeTime: '17:00', isOpen: true },
        { dayOfWeek: 'SUNDAY', openTime: '', closeTime: '', isOpen: false },
      ];

      await db.workingHour.createMany({
        data: defaultWorkingHours.map(hours => ({
          ...hours,
          dealershipId: dealershipInfo.id
        }))
      });

      // Update user role to dealership admin and link to dealership
      await db.user.update({
        where: { id: application.userId },
        data: { 
          role: 'DEALERSHIP_ADMIN',
          dealershipId: dealershipInfo.id,
        },
      });
    }

    return {
      success: true,
      data: updatedApplication,
    };
  } catch (error) {
    console.error('Error reviewing dealership application:', error);
    return {
      success: false,
      error: error.message || 'Failed to review application',
    };
  }
}

export async function getDealershipData() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { 
        success: false, 
        error: "Unauthorized: You must be logged in" 
      };
    }

    // Use checkUser to ensure user exists in database
    const { checkUser } = await import('@/lib/checkUser');
    const user = await checkUser();

    if (!user) {
      return { 
        success: false, 
        error: "User not found" 
      };
    }

    // Check if user is dealership admin or main admin
    if (user.role !== 'DEALERSHIP_ADMIN' && user.role !== 'ADMIN') {
      return {
        success: false,
        error: "Unauthorized: Dealership admin access required"
      };
    }

    if (!user.dealershipId) {
      return { 
        success: false, 
        error: "No dealership found for this user" 
      };
    }

    // Get dealership data with working hours
    const dealership = await db.dealershipInfo.findUnique({
      where: { id: user.dealershipId },
      include: {
        workingHours: {
          orderBy: {
            dayOfWeek: 'asc',
          },
        },
      },
    });

    if (!dealership) {
      return { 
        success: false, 
        error: "Dealership not found" 
      };
    }

    return {
      success: true,
      data: dealership,
    };
  } catch (error) {
    console.error('Error fetching dealership data:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch dealership data',
    };
  }
}

export async function checkUserApplicationStatus() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { 
        success: false, 
        error: "Unauthorized: You must be logged in" 
      };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        dealershipApplications: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        dealership: true,
      },
    });

    if (!user) {
      return { 
        success: false, 
        error: "User not found" 
      };
    }

    // If user is already a dealership admin
    if (user.role === 'DEALERSHIP_ADMIN' && user.dealership) {
      return {
        success: true,
        data: {
          status: 'APPROVED',
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
        status: 'NO_APPLICATION',
        application: null,
        dealership: null,
      },
    };
  } catch (error) {
    console.error('Error checking user application status:', error);
    return {
      success: false,
      error: error.message || 'Failed to check application status',
    };
  }
}

export async function checkDealershipAuthorization() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.log('Auth: No userId found');
      return {
        success: false,
        error: "Unauthorized: You must be logged in"
      };
    }

    console.log('Auth: Checking for Clerk user ID:', userId);

    // Get the user with their dealership info
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        dealership: true // Include the dealership relation
      }
    });

    console.log('Auth: User found:', user ? {
      id: user.id,
      role: user.role,
      dealershipId: user.dealershipId,
      hasDealership: !!user.dealership
    } : 'null');

    if (!user) {
      console.log('Auth: User not found in database');
      return {
        success: false,
        error: "User not found"
      };
    }

    console.log('Auth: User role:', user.role);
    console.log('Auth: User dealershipId:', user.dealershipId);

    // Allow main admins to access dealership admin panel
    if (user.role === 'ADMIN') {
      console.log('Auth: User is main admin, granting access');
      // For main admins, get the first approved dealership or create a default one
      let defaultDealership = await db.dealershipInfo.findFirst({
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' }
      });

      if (!defaultDealership) {
        // Create a default dealership if none exists
        defaultDealership = await db.dealershipInfo.create({
          data: {
            name: 'Default Dealership',
            email: 'admin@example.com',
            phone: '123-456-7890',
            address: '123 Main St',
            isApproved: true,
            isActive: true
          }
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
    if (user.role === 'DEALERSHIP_ADMIN') {
      let dealership = user.dealership;
      
      // If no dealership assigned, try to find one where user is admin
      if (!dealership) {
        console.log('Auth: User is DEALERSHIP_ADMIN but has no dealership assigned');
        dealership = await db.dealershipInfo.findFirst({
          where: {
            admins: {
              some: {
                id: user.id
              }
            }
          },
          include: {
            workingHours: true
          }
        });

        if (dealership) {
          console.log('Auth: Found dealership for admin, updating user record');
          // Update user with dealershipId
          await db.user.update({
            where: { id: user.id },
            data: { dealershipId: dealership.id }
          });
          user.dealershipId = dealership.id;
          user.dealership = dealership;
        } else {
          console.log('Auth: No dealership found for this admin');
          return {
            success: false,
            error: "No dealership assigned to your account. Please contact support."
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
    console.log('Auth: User is not an admin, trying to fix role...');
    const fixResult = await checkAndFixDealershipAdminRole();
    
    if (fixResult.success && fixResult.data.role === 'DEALERSHIP_ADMIN') {
      console.log('Auth: Role fixed successfully');
      return fixResult;
    }
    
    console.log('Auth: Final dealership:', dealership ? {
      id: dealership.id,
      name: dealership.name,
      isApproved: dealership.isApproved
    } : 'null');

    return {
      success: true,
      data: {
        role: user.role,
        dealership: dealership,
      },
    };
  } catch (error) {
    console.error('Error checking dealership authorization:', error);
    return {
      success: false,
      error: error.message || 'Failed to check authorization',
    };
  }
}

// New function to deactivate a dealership
export async function deactivateDealership(dealershipId) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { 
        success: false, 
        error: "Unauthorized: You must be logged in" 
      };
    }

    // Fetch user and determine permissions
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found"
      };
    }

    const isAdmin = user.role === 'ADMIN';
    const isDealershipAdmin = user.role === 'DEALERSHIP_ADMIN' && user.dealershipId === dealershipId;

    // Admins can deactivate any dealership; dealership admins can only deactivate their own
    if (!isAdmin && !isDealershipAdmin) {
      return { 
        success: false, 
        error: "Unauthorized: Admin access required" 
      };
    }

    // Collect file paths for Supabase image cleanup BEFORE DB deletion
    const carsWithImages = await db.car.findMany({
      where: { dealershipId },
      select: { id: true, images: true },
    });

    const filePathSet = new Set();
    for (const car of carsWithImages) {
      if (Array.isArray(car.images)) {
        for (const imageUrl of car.images) {
          try {
            const u = new URL(imageUrl);
            const match = u.pathname.match(/\/car-images\/(.+)$/);
            if (match && match[1]) filePathSet.add(match[1]);
          } catch (e) {
            // ignore invalid URL
          }
        }
      }
    }
    const filePaths = Array.from(filePathSet);

    // Use transaction to ensure data consistency
    const result = await db.$transaction(async (tx) => {
      // Ensure the dealership exists
      const target = await tx.dealershipInfo.findUnique({ where: { id: dealershipId } });
      if (!target) {
        throw new Error("Dealership not found");
      }

      // Find all cars (ids) for cascading deletes
      const cars = await tx.car.findMany({
        where: { dealershipId },
        select: { id: true },
      });
      const carIds = cars.map((c) => c.id);

      // Delete dependent records first to satisfy FK constraints
      if (carIds.length > 0) {
        await tx.testDriveBooking.deleteMany({ where: { carId: { in: carIds } } });
        await tx.userSavedCar.deleteMany({ where: { carId: { in: carIds } } });
      }

      // Delete cars belonging to this dealership
      await tx.car.deleteMany({ where: { dealershipId } });

      // Delete working hours explicitly (in case DB doesn't cascade)
      await tx.workingHour.deleteMany({ where: { dealershipId } });

      // Remove admin role and association from users of this dealership
      await tx.user.updateMany({
        where: { dealershipId },
        data: {
          role: 'USER',
          dealershipId: null,
        },
      });

      // Finally delete the dealership
      const deletedDealership = await tx.dealershipInfo.delete({
        where: { id: dealershipId },
      });

      return deletedDealership;
    });

    // After successful DB deletion, attempt to remove Supabase storage files (best-effort)
    let storageWarning = null;
    try {
      if (filePaths.length > 0) {
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);
        const { error } = await supabase.storage.from('car-images').remove(filePaths);
        if (error) {
          console.error('Supabase storage removal error:', error);
          storageWarning = 'Some images could not be removed from storage';
        }
      }
    } catch (storageErr) {
      console.error('Supabase storage cleanup failed:', storageErr);
      storageWarning = 'Storage cleanup failed';
    }

    return {
      success: true,
      data: result,
      warning: storageWarning || undefined,
    };
  } catch (error) {
    console.error('Error deactivating dealership:', error);
    return {
      success: false,
      error: error.message || 'Failed to deactivate dealership',
    };
  }
}

// New function to update dealership information
export async function updateDealershipInfo(dealershipData) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { 
        success: false, 
        error: "Unauthorized: You must be logged in" 
      };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: { dealership: true },
    });

    if (!user || (user.role !== 'DEALERSHIP_ADMIN' && user.role !== 'ADMIN')) {
      return {
        success: false,
        error: "Unauthorized: Dealership admin access required"
      };
    }

    if (!user.dealership) {
      return { 
        success: false, 
        error: "No dealership found for this user" 
      };
    }

    // Update dealership information
    const updatedDealership = await db.dealershipInfo.update({
      where: { id: user.dealership.id },
      data: {
        name: dealershipData.name,
        address: dealershipData.address,
        phone: dealershipData.phone,
        email: dealershipData.email,
      },
    });

    return {
      success: true,
      data: updatedDealership,
    };
  } catch (error) {
    console.error('Error updating dealership info:', error);
    return {
      success: false,
      error: error.message || 'Failed to update dealership information',
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
        error: "Unauthorized: You must be logged in" 
      };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: { dealership: true },
    });

    if (!user || (user.role !== 'DEALERSHIP_ADMIN' && user.role !== 'ADMIN')) {
      return {
        success: false,
        error: "Unauthorized: Dealership admin access required"
      };
    }

    if (!user.dealership) {
      return { 
        success: false, 
        error: "No dealership found for this user" 
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
        status: 'AVAILABLE',
        featured: false,
        images: carData.images || [],
      },
    });

    return {
      success: true,
      data: serializeCarData(car),
    };
  } catch (error) {
    console.error('Error adding car to dealership:', error);
    return {
      success: false,
      error: error.message || 'Failed to add car',
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
        error: "Unauthorized: You must be logged in" 
      };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: { dealership: true },
    });

    if (!user || (user.role !== 'DEALERSHIP_ADMIN' && user.role !== 'ADMIN')) {
      return {
        success: false,
        error: "Unauthorized: Dealership admin access required"
      };
    }

    if (!user.dealership) {
      return { 
        success: false, 
        error: "No dealership found for this user" 
      };
    }

    // Verify the car belongs to this dealership
    const car = await db.car.findFirst({
      where: { 
        id: carId,
        dealershipId: user.dealership.id 
      },
    });

    if (!car) {
      return { 
        success: false, 
        error: "Car not found or not authorized to delete" 
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
    console.error('Error deleting car from dealership:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete car',
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
        error: "Unauthorized: You must be logged in" 
      };
    }

    console.log('Fix: Checking user role for Clerk ID:', userId);

    // Get user by Clerk ID
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      console.log('Fix: User not found');
      return { 
        success: false, 
        error: "User not found" 
      };
    }

    console.log('Fix: Current user role:', user.role);
    console.log('Fix: Current dealershipId:', user.dealershipId);

    // Check if user has an approved dealership application
    const approvedApplication = await db.dealershipApplication.findFirst({
      where: {
        userId: user.id,
        status: 'APPROVED'
      },
      orderBy: { createdAt: 'desc' }
    });

    if (approvedApplication) {
      console.log('Fix: Found approved application');
      
      // Check if dealership exists
      const dealership = await db.dealershipInfo.findFirst({
        where: {
          name: approvedApplication.dealershipName,
          email: approvedApplication.businessEmail,
          isApproved: true
        }
      });

      if (dealership) {
        console.log('Fix: Found approved dealership:', dealership.id);
        
        // Update user role and dealershipId if needed
        if (user.role !== 'DEALERSHIP_ADMIN' || user.dealershipId !== dealership.id) {
          console.log('Fix: Updating user role and dealershipId');
          
          await db.user.update({
            where: { id: user.id },
            data: {
              role: 'DEALERSHIP_ADMIN',
              dealershipId: dealership.id,
            },
          });

          console.log('Fix: User role updated successfully');
          
          return {
            success: true,
            data: {
              role: 'DEALERSHIP_ADMIN',
              dealership: dealership,
            },
          };
        } else {
          console.log('Fix: User role is already correct');
          return {
            success: true,
            data: {
              role: user.role,
              dealership: dealership,
            },
          };
        }
      } else {
        console.log('Fix: No approved dealership found');
      }
    } else {
      console.log('Fix: No approved application found');
    }

    return {
      success: true,
      data: {
        role: user.role,
        dealership: null,
      },
    };
  } catch (error) {
    console.error('Error checking and fixing dealership admin role:', error);
    return {
      success: false,
      error: error.message || 'Failed to check and fix role',
    };
  }
}
