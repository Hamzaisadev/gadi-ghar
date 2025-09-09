/**
 * Advanced Search and Filtering System for Gadi-Ghar
 * Provides comprehensive search, filtering, sorting, and pagination functionality
 */

import { db } from '@/lib/prisma'
import { serializeCarData } from '@/lib/helper'
import { 
  GadiGharError, 
  ErrorTypes, 
  validateRequired, 
  safeAsync 
} from '@/lib/error-utils'

// Define search constants
export const SORT_OPTIONS = {
  NEWEST: { field: 'createdAt', order: 'desc', label: 'Newest First' },
  OLDEST: { field: 'createdAt', order: 'asc', label: 'Oldest First' },
  PRICE_LOW_HIGH: { field: 'minPrice', order: 'asc', label: 'Price: Low to High' },
  PRICE_HIGH_LOW: { field: 'minPrice', order: 'desc', label: 'Price: High to Low' },
  YEAR_NEW_OLD: { field: 'year', order: 'desc', label: 'Year: New to Old' },
  YEAR_OLD_NEW: { field: 'year', order: 'asc', label: 'Year: Old to New' },
  MILEAGE_LOW_HIGH: { field: 'mileage', order: 'asc', label: 'Mileage: Low to High' },
  MILEAGE_HIGH_LOW: { field: 'mileage', order: 'desc', label: 'Mileage: High to Low' },
  FEATURED: { field: 'featured', order: 'desc', label: 'Featured First' }
}

export const FILTER_RANGES = {
  PRICE: [
    { min: 0, max: 500000, label: 'Under 5 Lakh' },
    { min: 500000, max: 1000000, label: '5L - 10L' },
    { min: 1000000, max: 1500000, label: '10L - 15L' },
    { min: 1500000, max: 2500000, label: '15L - 25L' },
    { min: 2500000, max: 5000000, label: '25L - 50L' },
    { min: 5000000, max: 99999999, label: 'Above 50L' }
  ],
  YEAR: [
    { min: 2020, max: 2025, label: '2020 & Newer' },
    { min: 2015, max: 2019, label: '2015 - 2019' },
    { min: 2010, max: 2014, label: '2010 - 2014' },
    { min: 2005, max: 2009, label: '2005 - 2009' },
    { min: 1990, max: 2004, label: 'Before 2005' }
  ],
  MILEAGE: [
    { min: 0, max: 25000, label: 'Under 25k KM' },
    { min: 25000, max: 50000, label: '25k - 50k KM' },
    { min: 50000, max: 100000, label: '50k - 100k KM' },
    { min: 100000, max: 150000, label: '100k - 150k KM' },
    { min: 150000, max: 999999999, label: 'Over 150k KM' }
  ]
}

export const CAR_MAKES = [
  'Honda', 'Toyota', 'Suzuki', 'Changan', 'Hyundai', 'KIA', 
  'BMW', 'Mercedes', 'Audi', 'Nissan', 'Mitsubishi', 'Daihatsu'
]

export const BODY_TYPES = [
  'Sedan', 'Hatchback', 'SUV', 'Crossover', 'Pickup', 'Van', 
  'Coupe', 'Convertible', 'Wagon'
]

export const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG']
export const TRANSMISSIONS = ['Manual', 'Automatic', 'CVT', 'DCT']

/**
 * Build database query conditions based on search filters
 */
export function buildSearchQuery({
  query = '',
  make = '',
  bodyType = '',
  fuelType = '',
  transmission = '',
  color = '',
  minPrice = 0,
  maxPrice = 999999999,
  minYear = 1990,
  maxYear = new Date().getFullYear(),
  minMileage = 0,
  maxMileage = 999999999,
  seats = null,
  status = 'AVAILABLE',
  featured = null,
  dealershipId = null,
  location = '' // For future location-based search
}) {
  try {
    // Validate input parameters
    if (arguments[0] === undefined || arguments[0] === null) {
      console.error('buildSearchQuery received undefined or null filters');
      return {};
    }
    
    // Log input parameters for debugging
    console.log('🔍 buildSearchQuery called with:', {
      query, make, bodyType, fuelType, transmission, color,
      minPrice, maxPrice, minYear, maxYear, minMileage, maxMileage,
      seats, featured, dealershipId, status
    });
    
    const conditions = []

    // Base condition - only available cars
    if (status) {
      conditions.push({ status: { equals: status } })
    }

    // Text search across multiple fields
    if (query && query.trim()) {
      try {
        const searchTerm = query.trim()
        const yearNumber = parseInt(searchTerm)
        
        conditions.push({
          OR: [
            { make: { contains: searchTerm, mode: 'insensitive' } },
            { model: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { color: { contains: searchTerm, mode: 'insensitive' } },
            { bodyType: { contains: searchTerm, mode: 'insensitive' } },
            ...(isNaN(yearNumber) ? [] : [{ year: yearNumber }])
          ]
        })
      } catch (error) {
        console.error('Error processing search query:', error)
      }
    }

    // Make filter
    if (make) {
      conditions.push({ make: { equals: make, mode: 'insensitive' } })
    }

    // Body type filter
    if (bodyType) {
      conditions.push({ bodyType: { equals: bodyType, mode: 'insensitive' } })
    }

    // Fuel type filter
    if (fuelType) {
      conditions.push({ fuelType: { equals: fuelType, mode: 'insensitive' } })
    }

    // Transmission filter
    if (transmission) {
      conditions.push({ 
        transmission: { equals: transmission, mode: 'insensitive' } 
      })
    }

    // Color filter
    if (color) {
      conditions.push({ color: { contains: color, mode: 'insensitive' } })
    }

    // Price range filter - handle price overlap scenarios
    if (minPrice !== undefined || maxPrice !== undefined) {
      try {
        const priceConditions = [];
        
        // Handle minPrice (cars with price range that overlaps with user's min price)
        if (minPrice !== undefined && minPrice !== null) {
          const minPriceNum = Number(minPrice);
          if (!isNaN(minPriceNum) && minPriceNum > 0) {
            // Car's price range should have max price >= user's min price
            // This ensures we include cars whose price range overlaps with user's range
            priceConditions.push({ maxPrice: { gte: minPriceNum } });
          }
        }
        
        // Handle maxPrice (cars with price range that overlaps with user's max price)
        if (maxPrice !== undefined && maxPrice !== null) {
          const maxPriceNum = Number(maxPrice);
          if (!isNaN(maxPriceNum) && maxPriceNum < 999999999) {
            // Car's price range should have min price <= user's max price
            // This ensures we include cars whose price range overlaps with user's range
            priceConditions.push({ minPrice: { lte: maxPriceNum } });
          }
        }
        
        if (priceConditions.length > 0) {
          conditions.push({ AND: priceConditions });
        }
      } catch (error) {
        console.error('Error processing price filter:', error);
        // Log the original values for debugging
        console.error('Price filter values:', { minPrice, maxPrice });
      }
    }

    // Year range filter
    if (minYear !== undefined || maxYear !== undefined) {
      try {
        // Validate year values
        let minYearNum = 1990;
        let maxYearNum = new Date().getFullYear();
        
        if (minYear !== undefined && minYear !== null) {
          minYearNum = Number(minYear);
          if (isNaN(minYearNum)) {
            console.error('Invalid minYear value:', minYear);
            minYearNum = 1990; // Use default if invalid
          }
        }
        
        if (maxYear !== undefined && maxYear !== null) {
          maxYearNum = Number(maxYear);
          if (isNaN(maxYearNum)) {
            console.error('Invalid maxYear value:', maxYear);
            maxYearNum = new Date().getFullYear(); // Use default if invalid
          }
        }
        
        // Ensure min is not greater than max
        if (minYearNum > maxYearNum) {
          console.error('minYear is greater than maxYear, swapping values');
          [minYearNum, maxYearNum] = [maxYearNum, minYearNum];
        }
        
        // Year range condition - years are stored as integers in the database
        const yearConditions = {
          year: {
            gte: minYearNum,
            lte: maxYearNum
          }
        }
        
        conditions.push(yearConditions)
      } catch (error) {
        console.error('Error processing year filter:', error)
      }
    }

    // Mileage range filter
    if (minMileage !== undefined || maxMileage !== undefined) {
      try {
        // Validate mileage values
        let minMileageNum = 0;
        let maxMileageNum = 999999999;
        
        if (minMileage !== undefined && minMileage !== null) {
          minMileageNum = Number(minMileage);
          if (isNaN(minMileageNum) || minMileageNum < 0) {
            console.error('Invalid minMileage value:', minMileage);
            minMileageNum = 0; // Use default if invalid
          }
        }
        
        if (maxMileage !== undefined && maxMileage !== null) {
          maxMileageNum = Number(maxMileage);
          if (isNaN(maxMileageNum) || maxMileageNum < 0) {
            console.error('Invalid maxMileage value:', maxMileage);
            maxMileageNum = 999999999; // Use default if invalid
          }
        }
        
        // Ensure min is not greater than max
        if (minMileageNum > maxMileageNum) {
          console.error('minMileage is greater than maxMileage, swapping values');
          [minMileageNum, maxMileageNum] = [maxMileageNum, minMileageNum];
        }
        
        // Mileage range condition - mileage is stored as integer in the database
        const mileageConditions = {
          mileage: {
            gte: minMileageNum,
            lte: maxMileageNum
          }
        }
        
        conditions.push(mileageConditions)
      } catch (error) {
        console.error('Error processing mileage filter:', error)
      }
    }

    // Seats filter
    if (seats !== null && seats !== undefined) {
      try {
        // Only process if seats is a valid value
        if (typeof seats === 'string' && seats.trim() === '') {
          // Empty string, skip this filter
          console.log('Skipping empty seats filter');
        } else {
          const seatsValue = Number(seats)
          if (!isNaN(seatsValue) && seatsValue > 0) {
            conditions.push({ seats: { equals: seatsValue } })
          } else {
            console.error('Invalid seats value:', seats);
          }
        }
      } catch (error) {
        console.error('Error processing seats filter:', error)
      }
    }

    // Featured filter
    if (featured !== null && featured !== undefined) {
      try {
        // Handle different types of featured values
        let featuredValue;
        let skipFilter = false;
        
        if (typeof featured === 'string') {
          const lowercased = featured.toLowerCase().trim();
          if (lowercased === 'true') {
            featuredValue = true;
          } else if (lowercased === 'false') {
            featuredValue = false;
          } else if (lowercased === '') {
            // Empty string, skip this filter
            console.log('Skipping empty featured filter');
            skipFilter = true;
          } else {
            console.error('Invalid featured string value:', featured);
            skipFilter = true;
          }
        } else if (typeof featured === 'boolean') {
          featuredValue = featured;
        } else {
          console.error('Invalid featured value type:', typeof featured);
          skipFilter = true;
        }
        
        if (!skipFilter) {
          conditions.push({ featured: { equals: featuredValue } })
        }
      } catch (error) {
        console.error('Error processing featured filter:', error)
      }
    }

    // Dealership filter
    if (dealershipId) {
      conditions.push({ dealershipId: { equals: dealershipId } })
    }

    return conditions.length > 0 ? { AND: conditions } : {}
  } catch (error) {
    console.error('Error building search query:', error)
    return {}
  }
}

/**
 * Get sort configuration from sort option
 */
export function getSortConfig(sortBy = 'NEWEST') {
  const sortOption = SORT_OPTIONS[sortBy] || SORT_OPTIONS.NEWEST
  return {
    [sortOption.field]: sortOption.order
  }
}

/**
 * Advanced car search with all filtering options
 */
export const advancedCarSearch = safeAsync(async (searchParams) => {
  try {
    // Validate searchParams is an object
    if (!searchParams || typeof searchParams !== 'object') {
      throw new GadiGharError(
        'Invalid search parameters provided',
        ErrorTypes.VALIDATION,
        { received: typeof searchParams }
      );
    }
    
    const {
      // Search and filters
      query = '',
      make = '',
      bodyType = '',
      fuelType = '',
      transmission = '',
      color = '',
      minPrice = 0,
      maxPrice = 999999999,
      minYear = 1990,
      maxYear = new Date().getFullYear(),
      minMileage = 0,
      maxMileage = 999999999,
      seats = null,
      featured = null,
      dealershipId = null,
      location = '',
      
      // Pagination and sorting
      page = 1,
      limit = 12,
      sortBy = 'NEWEST',
      
      // Additional options
      includeDealership = false,
      includeImages = true
    } = searchParams

    // Validate pagination parameters
    let pageNum, limitNum, skip;
    try {
      pageNum = parseInt(page);
      if (isNaN(pageNum) || pageNum < 1) {
        console.error('Invalid page number:', page);
        pageNum = 1;
      }
      
      limitNum = parseInt(limit);
      if (isNaN(limitNum) || limitNum < 1) {
        console.error('Invalid limit number:', limit);
        limitNum = 12;
      } else if (limitNum > 50) {
        limitNum = 50; // Max 50 items per page
      }
      
      skip = (pageNum - 1) * limitNum;
    } catch (error) {
      console.error('Error parsing pagination parameters:', error);
      pageNum = 1;
      limitNum = 12;
      skip = 0;
    }

    // Build where clause
    const where = buildSearchQuery({
      query, make, bodyType, fuelType, transmission, color,
      minPrice, maxPrice, minYear, maxYear, minMileage, maxMileage,
      seats, featured, dealershipId, location
    })

    // Build sort configuration
    let orderBy;
    try {
      orderBy = getSortConfig(sortBy);
    } catch (error) {
      console.error('Error getting sort configuration:', error);
      orderBy = getSortConfig('NEWEST'); // Default sort
    }

    // Build include configuration
    const include = {}
    if (includeDealership) {
      include.dealership = {
        select: {
          id: true,
          name: true,
          address: true,
          phone: true,
          email: true
        }
      }
    }

    // Execute search query and count query in parallel
    const [cars, totalCount] = await Promise.all([
      db.car.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: Object.keys(include).length > 0 ? include : undefined
      }),
      db.car.count({ where })
    ]).catch(error => {
      console.error('Database query error:', error);
      throw new GadiGharError(
        'Error executing database query',
        ErrorTypes.DATABASE,
        { originalError: error, cause: error }
      );
    });

    // Validate cars result
    if (!Array.isArray(cars)) {
      console.error('Invalid cars result:', cars);
      throw new GadiGharError(
        'Invalid search results format',
        ErrorTypes.DATABASE,
        { received: typeof cars }
      );
    }

    // Serialize car data with error handling
    let serializedCars = [];
    try {
      serializedCars = cars.map(serializeCarData);
    } catch (serializeError) {
      console.error('Error serializing car data:', serializeError);
      throw new GadiGharError(
        'Error processing car data',
        ErrorTypes.DATABASE,
        { originalError: serializeError, cause: serializeError }
      );
    }

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limitNum)
    const hasNextPage = pageNum < totalPages
    const hasPreviousPage = pageNum > 1

    return {
      cars: serializedCars,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        nextPage: hasNextPage ? pageNum + 1 : null,
        previousPage: hasPreviousPage ? pageNum - 1 : null
      },
      appliedFilters: {
        query, make, bodyType, fuelType, transmission, color,
        minPrice, maxPrice, minYear, maxYear, minMileage, maxMileage,
        seats, featured, dealershipId, sortBy
      }
    }
  } catch (error) {
    // Check if it's already a GadiGharError
    if (error instanceof GadiGharError) {
      throw error; // Re-throw existing GadiGharError
    }
    
    // Determine error type based on error message or properties
    let errorType = ErrorTypes.UNKNOWN;
    let errorMessage = 'Failed to perform car search';
    
    if (error.name === 'PrismaClientKnownRequestError' || 
        error.name === 'PrismaClientUnknownRequestError' || 
        error.name === 'PrismaClientRustPanicError' || 
        error.name === 'PrismaClientInitializationError' || 
        error.message.includes('database') || 
        error.message.includes('query')) {
      errorType = ErrorTypes.DATABASE;
      errorMessage = 'Database error while searching cars';
    } else if (error.message.includes('validation') || 
               error.message.includes('invalid') || 
               error.message.includes('required')) {
      errorType = ErrorTypes.VALIDATION;
      errorMessage = 'Invalid search parameters';
    }
    
    // Create a more specific error
    throw new GadiGharError(
      `${errorMessage}: ${error.message}`,
      errorType,
      { 
        searchFilters: {
          query, make, bodyType, fuelType, transmission, color,
          minPrice, maxPrice, minYear, maxYear, minMileage, maxMileage,
          seats, featured, dealershipId, sortBy, page, limit
        },
        originalError: error,
        cause: error
      }
    );
  }
});
/**
 * Get filter suggestions based on current inventory
 */
export const getFilterSuggestions = safeAsync(async () => {
  try {
    // First, let's check if there are any cars at all
    const totalCars = await db.car.count()
    console.log('Total cars in database:', totalCars)
    
    const availableCars = await db.car.count({ where: { status: 'AVAILABLE' } })
    console.log('Available cars in database:', availableCars)
    
    // If no cars, return fallback data
    if (availableCars === 0) {
      console.log('No available cars found, returning fallback data')
      return {
        makes: CAR_MAKES,
        bodyTypes: BODY_TYPES,
        fuelTypes: FUEL_TYPES,
        transmissions: TRANSMISSIONS,
        priceRange: { min: 0, max: 10000000 },
        yearRange: { min: 1990, max: new Date().getFullYear() },
        mileageRange: { min: 0, max: 500000 }
      }
    }

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
    ])

    // Extract and clean up the data
    const makes = availableMakes.map(item => item.make).filter(Boolean)
    const bodyTypes = availableBodyTypes.map(item => item.bodyType).filter(Boolean)
    const fuelTypes = availableFuelTypes.map(item => item.fuelType).filter(Boolean)
    const transmissions = availableTransmissions.map(item => item.transmission).filter(Boolean)
    
    console.log('Dynamic filter data:', {
      makes: makes.length,
      bodyTypes: bodyTypes.length,
      fuelTypes: fuelTypes.length,
      transmissions: transmissions.length,
      priceRange: priceRange,
      yearRange: yearRange,
      mileageRange: mileageRange
    })
    
    return {
      makes: makes.length > 0 ? makes : CAR_MAKES,
      bodyTypes: bodyTypes.length > 0 ? bodyTypes : BODY_TYPES,
      fuelTypes: fuelTypes.length > 0 ? fuelTypes : FUEL_TYPES,
      transmissions: transmissions.length > 0 ? transmissions : TRANSMISSIONS,
      priceRange: {
        min: priceRange._min.minPrice ? parseFloat(priceRange._min.minPrice.toString()) : 0,
        max: priceRange._max.maxPrice ? parseFloat(priceRange._max.maxPrice.toString()) : 10000000
      },
      yearRange: {
        min: yearRange._min.year || 1990,
        max: yearRange._max.year || new Date().getFullYear()
      },
      mileageRange: {
        min: mileageRange._min.mileage ? parseFloat(mileageRange._min.mileage.toString()) : 0,
        max: mileageRange._max.mileage ? parseFloat(mileageRange._max.mileage.toString()) : 500000
      }
    }
  } catch (error) {
    console.error('Error in getFilterSuggestions:', error)
    throw new GadiGharError(
      `Failed to get filter suggestions: ${error.message}`,
      ErrorTypes.DATABASE,
      { originalError: error }
    )
  }
})

/**
 * Get popular search terms and suggestions
 */
export const getSearchSuggestions = safeAsync(async (query = '') => {
  if (!query || query.length < 2) {
    return { suggestions: [] }
  }

  try {
    const searchTerm = query.toLowerCase().trim()
    
    // Search for matches in make, model, and body type
    const suggestions = await db.car.findMany({
      where: {
        status: 'AVAILABLE',
        OR: [
          { make: { contains: searchTerm, mode: 'insensitive' } },
          { model: { contains: searchTerm, mode: 'insensitive' } },
          { bodyType: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      select: {
        make: true,
        model: true,
        bodyType: true
      },
      take: 10,
      distinct: ['make', 'model']
    })

    // Format suggestions
    const formattedSuggestions = []
    const seen = new Set()

    suggestions.forEach(car => {
      // Add make suggestion
      if (car.make.toLowerCase().includes(searchTerm) && !seen.has(car.make)) {
        formattedSuggestions.push({
          type: 'make',
          value: car.make,
          label: car.make
        })
        seen.add(car.make)
      }

      // Add model suggestion
      const fullModel = `${car.make} ${car.model}`
      if ((car.model.toLowerCase().includes(searchTerm) || fullModel.toLowerCase().includes(searchTerm)) && !seen.has(fullModel)) {
        formattedSuggestions.push({
          type: 'model',
          value: fullModel,
          label: fullModel
        })
        seen.add(fullModel)
      }

      // Add body type suggestion
      if (car.bodyType.toLowerCase().includes(searchTerm) && !seen.has(car.bodyType)) {
        formattedSuggestions.push({
          type: 'bodyType',
          value: car.bodyType,
          label: car.bodyType
        })
        seen.add(car.bodyType)
      }
    })

    return { suggestions: formattedSuggestions.slice(0, 8) }
  } catch (error) {
    throw new GadiGharError(
      `Failed to get search suggestions: ${error.message}`,
      ErrorTypes.DATABASE,
      { query, originalError: error }
    )
  }
})
