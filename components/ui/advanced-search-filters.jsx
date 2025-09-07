'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { 
  SORT_OPTIONS,
  FILTER_RANGES,
  CAR_MAKES,
  BODY_TYPES,
  FUEL_TYPES,
  TRANSMISSIONS
} from '@/lib/advanced-search'
import { formatPriceToLakhsCrores } from '@/components/utils/FormatPriceRange'

/**
 * Advanced Search Filters Component
 * 
 * A comprehensive search and filtering interface that provides:
 * - Text search with autocomplete
 * - Price, year, and mileage range filters
 * - Category filters (make, body type, fuel type, etc.)
 * - Sort options
 * - Applied filters display
 * - Mobile-responsive design
 */
export default function AdvancedSearchFilters({
  initialFilters = {},
  onFiltersChange,
  onSearch,
  isLoading = false,
  resultCount = 0,
  className = '',
  filterData = {}
}) {
  // DEBUG: Log filterData to console
  console.log('🔍 AdvancedSearchFilters filterData:', {
    hasFilterData: !!filterData,
    makes: filterData?.makes,
    bodyTypes: filterData?.bodyTypes,
    fuelTypes: filterData?.fuelTypes,
    transmissions: filterData?.transmissions,
    priceRange: filterData?.priceRange,
    yearRange: filterData?.yearRange,
    mileageRange: filterData?.mileageRange
  });
  
  // Get dynamic ranges from filterData
  const priceMin = filterData?.priceRange?.min || 0
  const priceMax = filterData?.priceRange?.max || 10000000
  const yearMin = filterData?.yearRange?.min || 1990
  const yearMax = filterData?.yearRange?.max || new Date().getFullYear()
  const mileageMin = filterData?.mileageRange?.min || 0
  const mileageMax = filterData?.mileageRange?.max || 500000

  const [filters, setFilters] = useState({
    query: '',
    make: '',
    bodyType: '',
    fuelType: '',
    transmission: '',
    color: '',
    dealershipId: '',
    minPrice: priceMin,
    maxPrice: priceMax,
    minYear: yearMin,
    maxYear: yearMax,
    minMileage: mileageMin,
    maxMileage: mileageMax,
    seats: null,
    sortBy: 'NEWEST',
    featured: null,
    ...initialFilters
  })

  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([priceMin, priceMax])
  const [yearRange, setYearRange] = useState([yearMin, yearMax])
  const [mileageRange, setMileageRange] = useState([mileageMin, mileageMax])

  // Update filters and ranges when props change
  useEffect(() => {
    setFilters(prev => ({ ...prev, ...initialFilters }))
  }, [initialFilters])

  // Update ranges when filterData changes
  useEffect(() => {
    if (filterData) {
      const newPriceMin = filterData?.priceRange?.min || 0
      const newPriceMax = filterData?.priceRange?.max || 10000000
      const newYearMin = filterData?.yearRange?.min || 1990
      const newYearMax = filterData?.yearRange?.max || new Date().getFullYear()
      const newMileageMin = filterData?.mileageRange?.min || 0
      const newMileageMax = filterData?.mileageRange?.max || 500000

      setPriceRange([newPriceMin, newPriceMax])
      setYearRange([newYearMin, newYearMax])
      setMileageRange([newMileageMin, newMileageMax])

      // Update filters with new ranges
      setFilters(prev => ({
        ...prev,
        minPrice: newPriceMin,
        maxPrice: newPriceMax,
        minYear: newYearMin,
        maxYear: newYearMax,
        minMileage: newMileageMin,
        maxMileage: newMileageMax
      }))
    }
  }, [filterData])

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    // Convert 'all' to empty string for filtering
    const filterValue = value === 'all' ? '' : value
    const newFilters = { ...filters, [key]: filterValue }
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  // Handle range slider changes
  const handlePriceRangeChange = (values) => {
    setPriceRange(values)
    handleFilterChange('minPrice', values[0])
    handleFilterChange('maxPrice', values[1])
  }

  const handleYearRangeChange = (values) => {
    setYearRange(values)
    handleFilterChange('minYear', values[0])
    handleFilterChange('maxYear', values[1])
  }

  const handleMileageRangeChange = (values) => {
    setMileageRange(values)
    handleFilterChange('minMileage', values[0])
    handleFilterChange('maxMileage', values[1])
  }

  // Clear all filters
  const clearAllFilters = () => {
    const defaultFilters = {
      query: '',
      make: '',
      bodyType: '',
      fuelType: '',
      transmission: '',
      color: '',
      dealershipId: '',
      minPrice: priceMin,
      maxPrice: priceMax,
      minYear: yearMin,
      maxYear: yearMax,
      minMileage: mileageMin,
      maxMileage: mileageMax,
      seats: null,
      sortBy: 'NEWEST',
      featured: null
    }
    setFilters(defaultFilters)
    setPriceRange([priceMin, priceMax])
    setYearRange([yearMin, yearMax])
    setMileageRange([mileageMin, mileageMax])
    onFiltersChange?.(defaultFilters)
  }

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.query) count++
    if (filters.make) count++
    if (filters.bodyType) count++
    if (filters.fuelType) count++
    if (filters.transmission) count++
    if (filters.color) count++
    if (filters.dealershipId) count++
    if (filters.minPrice > priceMin || filters.maxPrice < priceMax) count++
    if (filters.minYear > yearMin || filters.maxYear < yearMax) count++
    if (filters.minMileage > mileageMin || filters.maxMileage < mileageMax) count++
    if (filters.seats) count++
    if (filters.featured !== null) count++
    return count
  }

  // Use existing price formatter
  const formatCurrency = (amount) => {
    const formatted = formatPriceToLakhsCrores(amount)
    return formatted ? `PKR ${formatted}` : 'PKR 0'
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className={`bg-white border rounded-lg shadow-sm ${className}`}>
      {/* Main Search Bar */}
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by make, model, or keyword..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
              className="pl-10 h-11"
            />
          </div>
          
          {/* Sort Dropdown */}
          <Select 
            value={filters.sortBy} 
            onValueChange={(value) => handleFilterChange('sortBy', value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SORT_OPTIONS).map(([key, option]) => (
                <SelectItem key={key} value={key}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${
              isFiltersOpen ? 'rotate-180' : ''
            }`} />
          </Button>

          {/* Search Button */}
          <Button 
            onClick={onSearch}
            disabled={isLoading}
            className="bg-car-red hover:bg-car-red-dark"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Results Count */}
        {resultCount > 0 && (
          <div className="mt-3 text-sm text-gray-600">
            Found {resultCount.toLocaleString()} car{resultCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Advanced Filters Panel */}
      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <CollapsibleContent className="border-t">
          <div className="p-4 space-y-6">
            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={filters.featured === true ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('featured', 
                  filters.featured === true ? null : true
                )}
              >
                Featured Only
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Make Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Make</Label>
                <Select 
                  value={filters.make || 'all'} 
                  onValueChange={(value) => handleFilterChange('make', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Make" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Make</SelectItem>
                    {filterData?.makes?.length > 0 ? (
                      filterData.makes.map((make) => (
                        <SelectItem key={make} value={make}>
                          {make}
                        </SelectItem>
                      ))
                    ) : (
                      CAR_MAKES.map((make) => (
                        <SelectItem key={make} value={make}>
                          {make}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Body Type Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Body Type</Label>
                <Select 
                  value={filters.bodyType || 'all'} 
                  onValueChange={(value) => handleFilterChange('bodyType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Type</SelectItem>
                    {filterData?.bodyTypes?.length > 0 ? (
                      filterData.bodyTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))
                    ) : (
                      BODY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Fuel Type Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Fuel Type</Label>
                <Select 
                  value={filters.fuelType || 'all'} 
                  onValueChange={(value) => handleFilterChange('fuelType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Fuel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Fuel</SelectItem>
                    {filterData?.fuelTypes?.length > 0 ? (
                      filterData.fuelTypes.map((fuel) => (
                        <SelectItem key={fuel} value={fuel}>
                          {fuel}
                        </SelectItem>
                      ))
                    ) : (
                      FUEL_TYPES.map((fuel) => (
                        <SelectItem key={fuel} value={fuel}>
                          {fuel}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Transmission Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Transmission</Label>
                <Select 
                  value={filters.transmission || 'all'} 
                  onValueChange={(value) => handleFilterChange('transmission', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Transmission</SelectItem>
                    {filterData?.transmissions?.length > 0 ? (
                      filterData.transmissions.map((trans) => (
                        <SelectItem key={trans} value={trans}>
                          {trans}
                        </SelectItem>
                      ))
                    ) : (
                      TRANSMISSIONS.map((trans) => (
                        <SelectItem key={trans} value={trans}>
                          {trans}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Range Sliders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Price Range: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                </Label>
                <Slider
                  value={priceRange}
                  onValueChange={handlePriceRangeChange}
                  min={priceMin}
                  max={priceMax}
                  step={Math.max(50000, Math.floor((priceMax - priceMin) / 100))}
                  className="mt-2"
                />
              </div>

              {/* Year Range */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Year: {yearRange[0]} - {yearRange[1]}
                </Label>
                <Slider
                  value={yearRange}
                  onValueChange={handleYearRangeChange}
                  min={yearMin}
                  max={yearMax}
                  step={1}
                  className="mt-2"
                />
              </div>

              {/* Mileage Range */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Mileage: {mileageRange[0].toLocaleString()} - {mileageRange[1].toLocaleString()} KM
                </Label>
                <Slider
                  value={mileageRange}
                  onValueChange={handleMileageRangeChange}
                  min={mileageMin}
                  max={mileageMax}
                  step={Math.max(5000, Math.floor((mileageMax - mileageMin) / 100))}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Additional Filters Row */}
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Color</Label>
                <Input
                  placeholder="Any color"
                  value={filters.color}
                  onChange={(e) => handleFilterChange('color', e.target.value)}
                  className="w-32"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Seats</Label>
                <Select 
                  value={filters.seats?.toString() || 'all'} 
                  onValueChange={(value) => handleFilterChange('seats', value === 'all' ? null : parseInt(value))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    {filterData?.seats?.length > 0 ? (
                      filterData.seats.map((seats) => (
                        <SelectItem key={seats} value={seats.toString()}>
                          {seats}
                        </SelectItem>
                      ))
                    ) : (
                      [2, 4, 5, 7, 8, 9].map((seats) => (
                        <SelectItem key={seats} value={seats.toString()}>
                          {seats}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Dealership</Label>
                <Select
                  value={filters.dealershipId || 'all'}
                  onValueChange={(value) => handleFilterChange('dealershipId', value)}
                >
                  <SelectTrigger className="w-56">
                    <SelectValue placeholder="Any Dealership" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Dealership</SelectItem>
                    {filterData?.dealerships?.length > 0 && (
                      filterData.dealerships.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
