'use client'

import { useState, useMemo } from 'react'
import { ProductCard } from './product-card'
import { Skeleton } from './skeleton'
import { mockProducts } from '@/lib/mock-data'

export function NewArrivals() {
  const [loading, setLoading] = useState(false)

  // Use mock products for new arrivals, selecting the next 8 after featured
  const products = useMemo(() => mockProducts.slice(8, 16).map((product) => ({
    id: product.id,
    name: product.name,
    price: product.variants[0]?.price ? `${product.variants[0].price}` : '99.99',
    image: product.variants[0]?.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    badge: 'New' as const,
  })), [])

  const handleAddToCart = () => {
    console.log('Added to cart')
  }

  return (
    <section className="py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-8">New Arrivals</h2>

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
