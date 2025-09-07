const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function testFilterData() {
  console.log('🔍 Testing filter data fetching...');
  
  try {
    // Test database connection first
    const carCount = await db.car.count();
    console.log(`✅ Database connected. Total cars: ${carCount}`);
    
    if (carCount === 0) {
      console.log('❌ No cars found in database!');
      return;
    }

    // Test the individual queries that getFilterSuggestions uses
    console.log('\n📊 Fetching filter suggestions...');
    
    const [
      availableMakes,
      availableBodyTypes,
      availableFuelTypes,
      availableTransmissions,
      priceRange,
      yearRange,
      mileageRange
    ] = await Promise.all([
      db.car.findMany({
        where: { status: 'AVAILABLE' },
        select: { make: true },
        distinct: ['make'],
        orderBy: { make: 'asc' }
      }),
      db.car.findMany({
        where: { status: 'AVAILABLE' },
        select: { bodyType: true },
        distinct: ['bodyType'],
        orderBy: { bodyType: 'asc' }
      }),
      db.car.findMany({
        where: { status: 'AVAILABLE' },
        select: { fuelType: true },
        distinct: ['fuelType'],
        orderBy: { fuelType: 'asc' }
      }),
      db.car.findMany({
        where: { status: 'AVAILABLE' },
        select: { transmission: true },
        distinct: ['transmission'],
        orderBy: { transmission: 'asc' }
      }),
      db.car.aggregate({
        where: { status: 'AVAILABLE' },
        _min: { minPrice: true },
        _max: { maxPrice: true }
      }),
      db.car.aggregate({
        where: { status: 'AVAILABLE' },
        _min: { year: true },
        _max: { year: true }
      }),
      db.car.aggregate({
        where: { status: 'AVAILABLE' },
        _min: { mileage: true },
        _max: { mileage: true }
      })
    ]);

    console.log('\n🚗 Available Makes:', availableMakes.map(item => item.make).filter(Boolean));
    console.log('🏷️  Available Body Types:', availableBodyTypes.map(item => item.bodyType).filter(Boolean));
    console.log('⛽ Available Fuel Types:', availableFuelTypes.map(item => item.fuelType).filter(Boolean));
    console.log('⚙️  Available Transmissions:', availableTransmissions.map(item => item.transmission).filter(Boolean));
    
    const priceMin = priceRange._min.minPrice ? parseFloat(priceRange._min.minPrice.toString()) : 0;
    const priceMax = priceRange._max.maxPrice ? parseFloat(priceRange._max.maxPrice.toString()) : 10000000;
    
    console.log('\n💰 Price Range:', { min: priceMin, max: priceMax });
    console.log('📅 Year Range:', { min: yearRange._min.year || 1990, max: yearRange._max.year || new Date().getFullYear() });
    console.log('🛣️  Mileage Range:', { 
      min: mileageRange._min.mileage ? parseFloat(mileageRange._min.mileage.toString()) : 0,
      max: mileageRange._max.mileage ? parseFloat(mileageRange._max.mileage.toString()) : 500000
    });

    const filterData = {
      makes: availableMakes.map(item => item.make).filter(Boolean),
      bodyTypes: availableBodyTypes.map(item => item.bodyType).filter(Boolean),
      fuelTypes: availableFuelTypes.map(item => item.fuelType).filter(Boolean),
      transmissions: availableTransmissions.map(item => item.transmission).filter(Boolean),
      priceRange: {
        min: priceMin,
        max: priceMax
      },
      yearRange: {
        min: yearRange._min.year || 1990,
        max: yearRange._max.year || new Date().getFullYear()
      },
      mileageRange: {
        min: mileageRange._min.mileage ? parseFloat(mileageRange._min.mileage.toString()) : 0,
        max: mileageRange._max.mileage ? parseFloat(mileageRange._max.mileage.toString()) : 500000
      }
    };

    console.log('\n✅ Final Filter Data:', JSON.stringify(filterData, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await db.$disconnect();
  }
}

testFilterData();
