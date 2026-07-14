'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Share2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductImageGallery } from '@/components/product-image-gallery'
import { VariantSelector } from '@/components/variant-selector'
import { ProductSpecs } from '@/components/product-specs'
import { ProductReviews } from '@/components/product-reviews'
import { RelatedProductsCarousel } from '@/components/related-products-carousel'
import { mockProducts, mockReviews } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [id, setId] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    params.then((p) => {
      setId(p.id)
      setMounted(true)
    })
  }, [params])

  if (!mounted) {
    return <div>Loading...</div>
  }

  const product = mockProducts.find((p) => p.id === id)

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    )
  }

  const getMainImage = (product: typeof mockProducts[0]) => {
    const firstVariant = product.variants[0]
    const mainImage = firstVariant?.images.find((img) => img.sortOrder === 0) || firstVariant?.images[0]
    return mainImage?.imageUrl || '/placeholder.jpg'
  }

  // Get related products (same category, excluding current product)
  const relatedProducts = mockProducts.filter(
    (p) =>
      p.id !== product.id &&
      p.category?.id === product.category?.id &&
      p.status === 'ACTIVE'
  )

  // Get product reviews
  const productReviews = mockReviews.filter((r) => r.productId === product.id)
  const averageRating =
    productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.rating, 0) /
        productReviews.length
      : 0

  const getPriceRange = (product: typeof mockProducts[0]) => {
    if (product.variants.length === 0) return 'N/A'
    const prices = product.variants.map((v) => v.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    if (minPrice === maxPrice) {
      return `$${minPrice}`
    }
    return `$${minPrice} - $${maxPrice}`
  }

  const handleAddToCart = (variantId: string, quantity: number) => {
    console.log('Added to cart:', { variantId, quantity, productId: product.id })
  }

  // Gather unique product images from all variants
  const productImages = Array.from(
    new Set(product.variants.flatMap((v) => v.images.map((img) => img.imageUrl)))
  )
  const displayImages = productImages.length > 0 ? productImages : ['/placeholder.jpg']

  return (
    <main className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <div className="sticky top-0 z-40 bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link href="/products" className="hover:underline">
              Products
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            {product.category && (
              <>
                <Link href={`/products?category=${product.category.id}`} className="hover:underline">
                  {product.category.name}
                </Link>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </>
            )}
            <span className="text-foreground font-semibold line-clamp-1">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Header with Status */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i < Math.round(averageRating)
                        ? 'text-accent fill-accent'
                        : 'text-border fill-border'
                    )}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({productReviews.length} reviews)
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            <ProductImageGallery
              images={displayImages}
              productName={product.name}
            />
          </div>

          {/* Product Info & Actions */}
          <div>
            <VariantSelector
              variants={product.variants}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="border-t pt-12 mb-12">
          <ProductSpecs
            description={product.description}
            specifications={product.specifications || {}}
            shipping={{
              domesticDays: 3,
              internationalDays: 7,
              cost: 0,
              freeOver: 50,
            }}
          />
        </div>

        {/* Reviews Section */}
        {productReviews.length > 0 && (
          <div className="border-t pt-12 mb-12">
            <ProductReviews
              reviews={productReviews.map((r) => ({
                id: r.id,
                author: r.authorName,
                rating: r.rating,
                title: r.title,
                text: r.text,
                date: r.date,
                helpful: r.helpfulCount,
                verified: r.verifiedPurchase,
              }))}
              averageRating={averageRating}
              totalReviews={productReviews.length}
            />
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t pt-12">
            <RelatedProductsCarousel
              products={relatedProducts}
              title="Related Products"
            />
          </div>
        )}
      </div>
    </main>
  )
}
