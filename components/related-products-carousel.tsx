'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

interface RelatedProductsCarouselProps {
  products: Product[]
  title?: string
}

export function RelatedProductsCarousel({
  products,
  title = 'Related Products',
}: RelatedProductsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(4)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Update items per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2)
      } else {
        setItemsPerView(4)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, products.length - itemsPerView)

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return

    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext()
      } else {
        handlePrevious()
      }
    }

    setTouchStart(null)
  }

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerView)

  if (products.length === 0) {
    return null
  }

  const getMainImage = (product: Product) => {
    const firstVariant = product.variants[0]
    const mainImage = firstVariant?.images.find((img) => img.sortOrder === 0) || firstVariant?.images[0]
    return mainImage?.imageUrl || '/placeholder.jpg'
  }

  const getPriceRange = (product: Product) => {
    if (product.variants.length === 0) return '$0'
    const prices = product.variants.map((v) => v.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    if (minPrice === maxPrice) {
      return `$${minPrice}`
    }
    return `$${minPrice} - $${maxPrice}`
  }

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>

      <div className="relative">
        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-300 ease-in-out gap-4"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-full"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <Link href={`/products/${product.id}`}>
                  <div className="group h-full border rounded-lg overflow-hidden hover:shadow-lg transition-shadow p-3">
                    {/* Image */}
                    <div className="relative w-full aspect-square bg-muted/50 rounded-lg overflow-hidden mb-3">
                      <Image
                        src={getMainImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />

                      {/* Category Badge */}
                      {product.category && (
                        <Badge variant="secondary" className="absolute top-2 left-2">
                          {product.category.name}
                        </Badge>
                      )}

                      {/* Stock Status */}
                      {product.variants.every((v) => v.stock === 0) && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-semibold">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      {product.rating !== undefined && product.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'w-3 h-3',
                                  product.rating !== undefined && i < Math.round(product.rating)
                                    ? 'fill-accent text-accent'
                                    : 'fill-muted text-muted-foreground'
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({product.reviewCount || 0})
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="font-bold text-sm">{getPriceRange(product)}</div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {products.length > itemsPerView && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              aria-label="Previous products"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10"
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              aria-label="Next products"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Carousel Indicators */}
      {products.length > itemsPerView && (
        <div className="flex justify-center gap-1">
          {Array.from({ length: Math.ceil(products.length / itemsPerView) }).map(
            (_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(Math.min(idx * itemsPerView, maxIndex))}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  Math.floor(currentIndex / itemsPerView) === idx
                    ? 'bg-primary w-6'
                    : 'bg-border'
                )}
                aria-label={`Go to carousel page ${idx + 1}`}
              />
            )
          )}
        </div>
      )}
    </div>
  )
}
