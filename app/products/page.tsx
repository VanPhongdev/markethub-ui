'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useMemo, Suspense } from 'react'
import { mockCategories } from '@/lib/mock-data'
import { getMinPrice, getMaxPrice, filterAndSortProducts, getPaginatedProducts } from '@/lib/filter-utils'
import { useFilterState } from '@/lib/use-filter-state'
import { ProductsSidebar } from '@/components/products-sidebar'
import { FilterDrawer } from '@/components/filter-drawer'
import { ProductsTopBar } from '@/components/products-top-bar'
import { ProductsGrid } from '@/components/products-grid'
import { Pagination } from '@/components/pagination'
import { ProductSkeleton } from '@/components/product-skeleton'
import { mockProducts } from '@/lib/mock-data'

function ProductsContent() {
  const searchParams = useSearchParams()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { filters, updateFilters, clearFilters, isInitialized } = useFilterState()

  const minPrice = getMinPrice()
  const maxPrice = getMaxPrice()

  // Get filtered and sorted products
  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(mockProducts, filters)
  }, [filters])

  // Get paginated results
  const paginationData = useMemo(() => {
    return getPaginatedProducts(filteredProducts, filters.currentPage, 24)
  }, [filteredProducts, filters.currentPage])

  const selectedCategoryId =
    filters.categories.length === 1 ? filters.categories[0] : undefined

  const handleAddToCart = (productId: string) => {
    console.log(`Added product ${productId} to cart`)
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <ProductSkeleton viewMode="grid" count={24} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Top Bar */}
        <ProductsTopBar
          resultCount={paginationData.products.length}
          totalResults={paginationData.total}
          currentPage={filters.currentPage}
          filters={filters}
          onSortChange={(sortBy) => updateFilters({ sortBy, currentPage: 1 })}
          onViewModeChange={(viewMode) => updateFilters({ viewMode })}
          onOpenFilters={() => setIsDrawerOpen(true)}
          categoryId={selectedCategoryId}
        />

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <ProductsSidebar
                categories={mockCategories}
                minPrice={minPrice}
                maxPrice={maxPrice}
                filters={filters}
                onFilterChange={updateFilters}
                onClearAll={clearFilters}
              />
            </div>
          </aside>

          {/* Main Grid */}
          <main className="flex-1">
            {/* Products Grid */}
            <ProductsGrid
              products={paginationData.products}
              viewMode={filters.viewMode}
              onAddToCart={handleAddToCart}
            />

            {/* Pagination */}
            {paginationData.totalPages > 1 && (
              <Pagination
                currentPage={filters.currentPage}
                totalPages={paginationData.totalPages}
                onPageChange={(page) => updateFilters({ currentPage: page })}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        categories={mockCategories}
        minPrice={minPrice}
        maxPrice={maxPrice}
        filters={filters}
        onFilterChange={(partialFilters) => {
          updateFilters(partialFilters)
          setIsDrawerOpen(false)
        }}
        onClearAll={() => {
          clearFilters()
          setIsDrawerOpen(false)
        }}
      />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading products...</div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
