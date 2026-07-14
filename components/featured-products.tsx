'use client'

import { useState, useMemo } from 'react'
import { ProductCard } from './product-card'
import { Skeleton } from './skeleton'
import { mockProducts } from '@/lib/mock-data'

export function FeaturedProducts() {
  const [loading, setLoading] = useState(false)

  // Use mock products for featured items, limiting to first 8
  const products = useMemo(() => mockProducts.slice(0, 8).map((product) => ({
    id: product.id,
    name: product.name,
    price: product.variants[0]?.price ? `${product.variants[0].price}` : '99.99',
    image: product.variants[0]?.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    badge: product.variants.some((v) => v.stock > 0) ? undefined : ('Out of Stock' as const),
  })), [])

  const handleAddToCart = () => {
    // Cart logic would go here
    console.log('Added to cart')
  }

  return (
    <section className="py-12 px-4 md:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-8">Featured Products</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
