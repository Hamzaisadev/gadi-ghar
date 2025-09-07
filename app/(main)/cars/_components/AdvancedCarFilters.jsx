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
    
    return {
      query: params.search || '',
      make: params.make || '',
      bodyType: params.bodyType || '',
      fuelType: params.fuelType || '',
      transmission: params.transmission || '',
      color: params.color || '',
      minPrice: parseInt(params.minPrice) || (filterData?.priceRange?.min || 0),
      maxPrice: parseInt(params.maxPrice) || (filterData?.priceRange?.max || 10000000),
      minYear: parseInt(params.minYear) || (filterData?.yearRange?.min || 1990),
      maxYear: parseInt(params.maxYear) || (filterData?.yearRange?.max || new Date().getFullYear()),
      minMileage: parseInt(params.minMileage) || (filterData?.mileageRange?.min || 0),
      maxMileage: parseInt(params.maxMileage) || (filterData?.mileageRange?.max || 500000),
      seats: params.seats ? parseInt(params.seats) : null,
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
    setCurrentFilters(getCurrentFilters())
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
      const params = new URLSearchParams()

      // Add all filter parameters to URL
      if (currentFilters.query) params.set('search', currentFilters.query)
      if (currentFilters.make) params.set('make', currentFilters.make)
      if (currentFilters.bodyType) params.set('bodyType', currentFilters.bodyType)
      if (currentFilters.fuelType) params.set('fuelType', currentFilters.fuelType)
      if (currentFilters.transmission) params.set('transmission', currentFilters.transmission)
      if (currentFilters.color) params.set('color', currentFilters.color)
      if (currentFilters.dealershipId) params.set('dealershipId', currentFilters.dealershipId)
      
      // Price range
      const defaultMinPrice = filterData?.priceRange?.min || 0
      const defaultMaxPrice = filterData?.priceRange?.max || 10000000
      if (currentFilters.minPrice > defaultMinPrice) params.set('minPrice', currentFilters.minPrice.toString())
      if (currentFilters.maxPrice < defaultMaxPrice) params.set('maxPrice', currentFilters.maxPrice.toString())
      
      // Year range
      const defaultMinYear = filterData?.yearRange?.min || 1990
      const defaultMaxYear = filterData?.yearRange?.max || new Date().getFullYear()
      if (currentFilters.minYear > defaultMinYear) params.set('minYear', currentFilters.minYear.toString())
      if (currentFilters.maxYear < defaultMaxYear) params.set('maxYear', currentFilters.maxYear.toString())
      
      // Mileage range
      const defaultMinMileage = filterData?.mileageRange?.min || 0
      const defaultMaxMileage = filterData?.mileageRange?.max || 500000
      if (currentFilters.minMileage > defaultMinMileage) params.set('minMileage', currentFilters.minMileage.toString())
      if (currentFilters.maxMileage < defaultMaxMileage) params.set('maxMileage', currentFilters.maxMileage.toString())
      
      // Other parameters
      if (currentFilters.seats) params.set('seats', currentFilters.seats.toString())
      if (currentFilters.featured !== null) params.set('featured', currentFilters.featured.toString())
      
      // Sort by
      const urlSortBy = convertSortByToUrl(currentFilters.sortBy)
      if (urlSortBy !== 'newest') params.set('sortBy', urlSortBy)
      
      // Reset to first page when searching
      params.delete('page')

      // Navigate to new URL
      const query = params.toString()
      const url = query ? `${pathname}?${query}` : pathname
      router.push(url)
    } catch (error) {
      console.error('Error updating search filters:', error)
      setError(error)
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
    />
  )
}
