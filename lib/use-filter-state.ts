import { useState, useEffect, useCallback, useMemo } from 'react'
import { FilterState } from './types'
import { getMinPrice, getMaxPrice, createFilterUrl, parseFilterUrl } from './filter-utils'

const STORAGE_KEY = 'marketplace-filters'

export function useFilterState(initialFilters?: Partial<FilterState>) {
  const minPrice = getMinPrice()
  const maxPrice = getMaxPrice()

  const defaultFilters = useMemo<FilterState>(() => ({
    categories: [],
    priceRange: [minPrice, maxPrice],
    inStockOnly: false,
    sortBy: 'newest',
    viewMode: 'grid',
    currentPage: 1,
  }), [minPrice, maxPrice])

  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize from URL params and localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Try to get from URL params first
    const searchParams = new URLSearchParams(window.location.search)
    const urlFilters = parseFilterUrl(searchParams)

    // Get from localStorage as fallback
    let storedFilters: Partial<FilterState> = {}
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        storedFilters = JSON.parse(stored)
      }
    } catch (e) {
      console.error('Failed to parse stored filters:', e)
    }

    // Merge: URL params > localStorage > defaults > provided initialFilters
    const merged: FilterState = {
      ...defaultFilters,
      ...storedFilters,
      ...urlFilters,
      ...initialFilters,
    }

    setFilters(merged)
    setIsInitialized(true)
  }, [])

  // Update URL and localStorage when filters change
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return

    // Update URL
    const queryString = createFilterUrl(filters)
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname
    window.history.replaceState({}, '', newUrl)

    // Update localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
    } catch (e) {
      console.error('Failed to save filters to localStorage:', e)
    }
  }, [filters, isInitialized])

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      ...defaultFilters,
      currentPage: 1,
    })
    // Clear localStorage
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Failed to clear localStorage:', e)
    }
    // Clear URL params
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [defaultFilters])

  return {
    filters,
    updateFilters,
    clearFilters,
    isInitialized,
  }
}
