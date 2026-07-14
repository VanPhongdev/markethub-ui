'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Grid3x3, List, Filter } from 'lucide-react'
import { FilterState } from '@/lib/types'
import { getCategoryName } from '@/lib/mock-data'

interface ProductsTopBarProps {
  resultCount: number
  totalResults: number
  currentPage: number
  filters: FilterState
  onSortChange: (sortBy: FilterState['sortBy']) => void
  onViewModeChange: (viewMode: 'grid' | 'list') => void
  onOpenFilters: () => void
  categoryId?: string
}

export function ProductsTopBar({
  resultCount,
  totalResults,
  currentPage,
  filters,
  onSortChange,
  onViewModeChange,
  onOpenFilters,
  categoryId,
}: ProductsTopBarProps) {
  const pageSize = 24
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(startItem + resultCount - 1, totalResults)

  return (
    <div className="space-y-4 mb-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <a href="/" className="hover:text-foreground transition-colors">
          Home
        </a>
        {categoryId && (
          <>
            <span>/</span>
            <span>{getCategoryName(categoryId)}</span>
          </>
        )}
      </div>

      {/* Result count, Sort, and View toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Result count */}
        <div className="text-sm text-muted-foreground">
          {totalResults > 0 ? (
            <>
              Showing{' '}
              <span className="font-semibold text-foreground">
                {startItem}-{endItem}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-foreground">
                {totalResults}
              </span>{' '}
              products
            </>
          ) : (
            <span>No products found</span>
          )}
        </div>

        {/* Sort and View Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filters button (mobile) */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenFilters}
            className="md:hidden gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>

          <Separator className="hidden sm:block h-6" orientation="vertical" />

          {/* Sort dropdown */}
          <Select value={filters.sortBy} onValueChange={(value) => onSortChange(value as any)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="priceLow">Price: Low to High</SelectItem>
              <SelectItem value="priceHigh">Price: High to Low</SelectItem>
              <SelectItem value="nameAZ">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>

          {/* View toggle */}
          <div className="flex gap-1 border rounded-md p-1">
            <Button
              variant={filters.viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="px-2"
              title="Grid view"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={filters.viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="px-2"
              title="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
