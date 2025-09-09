import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { getCars } from '@/app/actions/car-listing';

export async function GET() {
  try {
    console.log('[DEBUG] Starting database connection test...');
    
    // Test 1: Basic database connection
    const userCount = await db.user.count();
    console.log('[DEBUG] User count:', userCount);
    
    // Test 2: Car count
    const carCount = await db.car.count();
    console.log('[DEBUG] Car count:', carCount);
    
    // Test 3: Available cars count
    const availableCarCount = await db.car.count({
      where: { status: 'AVAILABLE' }
    });
    console.log('[DEBUG] Available car count:', availableCarCount);
    
    // Test 4: Sample car query
    const sampleCar = await db.car.findFirst({
      where: { status: 'AVAILABLE' },
      include: {
        dealership: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
          }
        }
      }
    });
    console.log('[DEBUG] Sample car:', sampleCar ? { 
      id: sampleCar.id, 
      make: sampleCar.make, 
      model: sampleCar.model,
      dealership: sampleCar.dealership?.name 
    } : 'No cars found');
    
    // Test 5: Call getCars action
    console.log('[DEBUG] Calling getCars action...');
    const carsResult = await getCars({
      limit: 2,
      page: 1
    });
    console.log('[DEBUG] getCars result:', {
      success: carsResult.success,
      error: carsResult.error,
      dataLength: carsResult.data?.length,
      pagination: carsResult.pagination
    });
    
    return NextResponse.json({
      success: true,
      tests: {
        dbConnection: true,
        userCount,
        carCount,
        availableCarCount,
        sampleCar: sampleCar ? { 
          id: sampleCar.id, 
          make: sampleCar.make, 
          model: sampleCar.model,
          dealership: sampleCar.dealership?.name 
        } : null,
        getCarsAction: carsResult
      }
    });
  } catch (error) {
    console.error('[DEBUG] Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
