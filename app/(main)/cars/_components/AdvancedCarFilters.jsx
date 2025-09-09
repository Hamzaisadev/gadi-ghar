'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import AdvancedSearchFilters from '@/components/ui/advanced-search-filters'
import { getUserFriendlyMessage } from '@/lib/error-utils'

/**
 * Wrapper component for AdvancedSearchFilters that handles URL parameter synchronization
 * and integrates with the car listing functionality
 */
export default function AdvancedCarFilters({ filterData }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Safety check for filterData
  console.log('AdvancedCarFilters received filterData:', {
    hasFilterData: !!filterData,
    makes: filterData?.makes,
    bodyTypes: filterData?.bodyTypes,
    fuelTypes: filterData?.fuelTypes,
    transmissions: filterData?.transmissions,
    colors: filterData?.colors,
    dealerships: filterData?.dealerships,
    priceRange: filterData?.priceRange,
    yearRange: filterData?.yearRange,
    mileageRange: filterData?.mileageRange
  });
  
  if (!filterData) {
    return (
      <div className="w-full p-4 bg-white border rounded-lg">
        <div className="text-center">
          <p className="text-gray-600">Loading search filters...</p>
        </div>
      </div>
    )
  }

  // Extract current filter values from URL parameters
  const getCurrentFilters = () => {
    const params = Object.fromEntries(searchParams.entries())
    
    // Get default values from filterData with fallbacks
    const defaultPriceMin = filterData?.priceRange?.min || 0
    const defaultPriceMax = filterData?.priceRange?.max || 10000000
    const defaultYearMin = filterData?.yearRange?.min || 1990
    const defaultYearMax = filterData?.yearRange?.max || new Date().getFullYear()
    const defaultMileageMin = filterData?.mileageRange?.min || 0
    const defaultMileageMax = filterData?.mileageRange?.max || 500000
    
    // Parse numeric values with proper fallbacks
    const parseNumericParam = (param, defaultValue) => {
      if (param === undefined || param === null || param === '') return defaultValue
      const parsed = parseInt(param, 10)
      return isNaN(parsed) ? defaultValue : parsed
    }
    
    return {
      query: params.search || '',
      make: params.make || '',
      bodyType: params.bodyType || '',
      fuelType: params.fuelType || '',
      transmission: params.transmission || '',
      color: params.color || '',
      minPrice: parseNumericParam(params.minPrice, defaultPriceMin),
      maxPrice: parseNumericParam(params.maxPrice, defaultPriceMax),
      minYear: parseNumericParam(params.minYear, defaultYearMin),
      maxYear: parseNumericParam(params.maxYear, defaultYearMax),
      minMileage: parseNumericParam(params.minMileage, defaultMileageMin),
      maxMileage: parseNumericParam(params.maxMileage, defaultMileageMax),
      seats: params.seats ? parseNumericParam(params.seats, null) : null,
      sortBy: convertSortBy(params.sortBy || 'newest'),
      featured: params.featured === 'true' ? true : params.featured === 'false' ? false : null,
      dealershipId: params.dealershipId || ''
    }
  }

  // Convert legacy sortBy values to advanced search format
  const convertSortBy = (sortBy) => {
    switch (sortBy) {
      case 'priceAsc':
        return 'PRICE_LOW_HIGH'
      case 'priceDesc':
        return 'PRICE_HIGH_LOW'
      case 'yearNew':
      case 'yearDesc':
        return 'YEAR_NEW_OLD'
      case 'yearOld':
      case 'yearAsc':
        return 'YEAR_OLD_NEW'
      case 'mileageLow':
      case 'mileageAsc':
        return 'MILEAGE_LOW_HIGH'
      case 'mileageHigh':
      case 'mileageDesc':
        return 'MILEAGE_HIGH_LOW'
      case 'oldest':
        return 'OLDEST'
      case 'featured':
        return 'FEATURED'
      case 'newest':
      default:
        return 'NEWEST'
    }
  }

  // Convert advanced search sortBy back to legacy format for URL
  const convertSortByToUrl = (sortBy) => {
    switch (sortBy) {
      case 'PRICE_LOW_HIGH':
        return 'priceAsc'
      case 'PRICE_HIGH_LOW':
        return 'priceDesc'
      case 'YEAR_NEW_OLD':
        return 'yearNew'
      case 'YEAR_OLD_NEW':
        return 'yearOld'
      case 'MILEAGE_LOW_HIGH':
        return 'mileageLow'
      case 'MILEAGE_HIGH_LOW':
        return 'mileageHigh'
      case 'OLDEST':
        return 'oldest'
      case 'FEATURED':
        return 'featured'
      case 'NEWEST':
      default:
        return 'newest'
    }
  }

  const [currentFilters, setCurrentFilters] = useState(getCurrentFilters)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Update filters when URL parameters change
  useEffect(() => {
    const newFilters = getCurrentFilters()
    setCurrentFilters(newFilters)
    
    // This ensures that any time the URL or filterData changes, we update our local state
    // This is important for synchronization between URL parameters and component state
  }, [searchParams, filterData])

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setCurrentFilters(newFilters)
  }

  // Handle search execution
  const handleSearch = () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Validate filter values to prevent crashes
      const validatedFilters = {
        ...currentFilters,
        minPrice: typeof currentFilters.minPrice === 'number' && !isNaN(currentFilters.minPrice) 
          ? currentFilters.minPrice 
          : filterData?.priceRange?.min || 0,
        maxPrice: typeof currentFilters.maxPrice === 'number' && !isNaN(currentFilters.maxPrice) 
          ? currentFilters.maxPrice 
          : filterData?.priceRange?.max || 10000000,
        minYear: typeof currentFilters.minYear === 'number' && !isNaN(currentFilters.minYear) 
          ? currentFilters.minYear 
          : filterData?.yearRange?.min || 1990,
        maxYear: typeof currentFilters.maxYear === 'number' && !isNaN(currentFilters.maxYear) 
          ? currentFilters.maxYear 
          : filterData?.yearRange?.max || new Date().getFullYear(),
        minMileage: typeof currentFilters.minMileage === 'number' && !isNaN(currentFilters.minMileage) 
          ? currentFilters.minMileage 
          : filterData?.mileageRange?.min || 0,
        maxMileage: typeof currentFilters.maxMileage === 'number' && !isNaN(currentFilters.maxMileage) 
          ? currentFilters.maxMileage 
          : filterData?.mileageRange?.max || 500000,
        seats: currentFilters.seats !== null && typeof currentFilters.seats === 'number' && !isNaN(currentFilters.seats) 
          ? currentFilters.seats 
          : null
      }
      
      const params = new URLSearchParams()

      // Add all filter parameters to URL
      if (validatedFilters.query) params.set('search', validatedFilters.query)
      if (validatedFilters.make) params.set('make', validatedFilters.make)
      if (validatedFilters.bodyType) params.set('bodyType', validatedFilters.bodyType)
      if (validatedFilters.fuelType) params.set('fuelType', validatedFilters.fuelType)
      if (validatedFilters.transmission) params.set('transmission', validatedFilters.transmission)
      if (validatedFilters.color) params.set('color', validatedFilters.color)
      if (validatedFilters.dealershipId) params.set('dealershipId', validatedFilters.dealershipId)
      
      // Price range
      const defaultMinPrice = filterData?.priceRange?.min || 0
      const defaultMaxPrice = filterData?.priceRange?.max || 10000000
      if (validatedFilters.minPrice > defaultMinPrice) params.set('minPrice', validatedFilters.minPrice.toString())
      if (validatedFilters.maxPrice < defaultMaxPrice) params.set('maxPrice', validatedFilters.maxPrice.toString())
      
      // Year range
      const defaultMinYear = filterData?.yearRange?.min || 1990
      const defaultMaxYear = filterData?.yearRange?.max || new Date().getFullYear()
      if (validatedFilters.minYear > defaultMinYear) params.set('minYear', validatedFilters.minYear.toString())
      if (validatedFilters.maxYear < defaultMaxYear) params.set('maxYear', validatedFilters.maxYear.toString())
      
      // Mileage range
      const defaultMinMileage = filterData?.mileageRange?.min || 0
      const defaultMaxMileage = filterData?.mileageRange?.max || 500000
      if (validatedFilters.minMileage > defaultMinMileage) params.set('minMileage', validatedFilters.minMileage.toString())
      if (validatedFilters.maxMileage < defaultMaxMileage) params.set('maxMileage', validatedFilters.maxMileage.toString())
      
      // Other parameters
      if (validatedFilters.seats) params.set('seats', validatedFilters.seats.toString())
      if (validatedFilters.featured !== null) params.set('featured', validatedFilters.featured.toString())
      
      // Sort by
      const urlSortBy = convertSortByToUrl(validatedFilters.sortBy)
      if (urlSortBy !== 'newest') params.set('sortBy', urlSortBy)
      
      // Reset to first page when searching
      params.delete('page')

      // Navigate to new URL
      const query = params.toString()
      const url = query ? `${pathname}?${query}` : pathname
      router.push(url)
    } catch (error) {
      console.error('Error updating search filters:', error)
      setError(getUserFriendlyMessage(error) || 'An error occurred while applying filters. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdvancedSearchFilters
      initialFilters={currentFilters}
      onFiltersChange={handleFiltersChange}
      onSearch={handleSearch}
      isLoading={isLoading}
      resultCount={0}
      className="w-full"
      filterData={filterData}
      error={error}
    />
  )
}
