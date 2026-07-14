'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CategoryFilter } from '@/components/category-filter'
import { PriceRangeSlider } from '@/components/price-range-slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Category, FilterState } from '@/lib/types'
import { X } from 'lucide-react'

interface ProductsSidebarProps {
  categories: Category[]
  minPrice: number
  maxPrice: number
  filters: FilterState
  onFilterChange: (filters: Partial<FilterState>) => void
  onClearAll: () => void
  onClose?: () => void
}

export function ProductsSidebar({
  categories,
  minPrice,
  maxPrice,
  filters,
  onFilterChange,
  onClearAll,
  onClose,
}: ProductsSidebarProps) {
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priceRange[0] !== minPrice ||
    filters.priceRange[1] !== maxPrice ||
    filters.inStockOnly

  return (
    <div className="space-y-6">
      {/* Close button for mobile drawer */}
      {onClose && (
        <div className="flex items-center justify-between md:hidden">
          <h2 className="font-semibold">Filters</h2>
          <button onClick={onClose} aria-label="Close filters">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Categories Filter */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Categories</h3>
        <CategoryFilter
          categories={categories}
          selectedCategories={filters.categories}
          onChange={(categories) => onFilterChange({ categories, currentPage: 1 })}
        />
      </div>

      <Separator />

      {/* Price Range Filter */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Price Range</h3>
        <PriceRangeSlider
          min={minPrice}
          max={maxPrice}
          value={filters.priceRange}
          onChange={(priceRange) => onFilterChange({ priceRange, currentPage: 1 })}
          step={10}
        />
      </div>

      <Separator />

      {/* Availability Filter */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Availability</h3>
        <div className="flex items-center gap-2">
          <Checkbox
            id="in-stock-only"
            checked={filters.inStockOnly}
            onCheckedChange={(checked) =>
              onFilterChange({ inStockOnly: !!checked, currentPage: 1 })
            }
          />
          <Label htmlFor="in-stock-only" className="cursor-pointer text-sm">
            In Stock Only
          </Label>
        </div>
      </div>

      <Separator />

      {/* Clear All Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={onClearAll}
          className="w-full"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  )
}
