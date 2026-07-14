'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ProductsSidebar } from './products-sidebar'
import { Category, FilterState } from '@/lib/types'

interface FilterDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  minPrice: number
  maxPrice: number
  filters: FilterState
  onFilterChange: (filters: Partial<FilterState>) => void
  onClearAll: () => void
}

export function FilterDrawer({
  isOpen,
  onOpenChange,
  categories,
  minPrice,
  maxPrice,
  filters,
  onFilterChange,
  onClearAll,
}: FilterDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80">
        <SheetHeader className="mb-6">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <ProductsSidebar
          categories={categories}
          minPrice={minPrice}
          maxPrice={maxPrice}
          filters={filters}
          onFilterChange={onFilterChange}
          onClearAll={onClearAll}
          onClose={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  )
}
