'use client'

import { Product, FilterState } from '@/lib/types'
import { ProductCard } from '@/components/product-card'
import { ShoppingCart } from 'lucide-react'

interface ProductsGridProps {
  products: Product[]
  viewMode: 'grid' | 'list'
  onAddToCart?: (productId: string) => void
}

export function ProductsGrid({
  products,
  viewMode,
  onAddToCart,
}: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto opacity-30" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search terms
        </p>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode="list"
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode="grid"
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}
