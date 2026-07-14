'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getCategoryName } from '@/lib/mock-data'

interface ProductCardProps {
  // Full product object option
  product?: Product
  viewMode?: 'grid' | 'list'

  // Backward compatibility flat props
  id?: string
  name?: string
  price?: string
  priceRange?: string
  image?: string
  badge?: 'New' | 'Out of Stock'

  onAddToCart?: (productId: string) => void
}

export function ProductCard({
  product,
  viewMode = 'grid',
  id,
  name,
  price,
  priceRange,
  image,
  badge,
  onAddToCart,
}: ProductCardProps) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)

  // Resolve product attributes depending on whether we received a full product object or flat props
  const cardId = product ? product.id : id || ''
  const cardName = product ? product.name : name || ''
  
  let cardImageUrl = '/placeholder.jpg'
  if (product) {
    const firstVariant = product.variants[0]
    const resolvedImage = firstVariant?.images.find((img) => img.sortOrder === 0) || firstVariant?.images[0]
    if (resolvedImage?.imageUrl) {
      cardImageUrl = resolvedImage.imageUrl
    }
  } else if (image) {
    cardImageUrl = image
  }

  const categoryName = product ? getCategoryName(product.categoryId) : undefined
  const totalStock = product ? product.variants.reduce((sum, v) => sum + v.stock, 0) : undefined
  const isOutOfStock = product ? totalStock === 0 : badge === 'Out of Stock'

  let minPrice = 0
  let maxPrice = 0
  if (product && product.variants.length > 0) {
    minPrice = Math.min(...product.variants.map((v) => v.price))
    maxPrice = Math.max(...product.variants.map((v) => v.price))
  } else {
    minPrice = parseFloat(price || '0')
    maxPrice = parseFloat(priceRange || price || '0')
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking an Add to Cart button
    if ((e.target as HTMLElement).closest('button')) return
    router.push(`/products/${cardId}`)
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!onAddToCart || isAdding || isOutOfStock) return

    setIsAdding(true)
    try {
      onAddToCart(cardId)
    } finally {
      setIsAdding(false)
    }
  }

  // Render for full Product in "list" mode
  if (product && viewMode === 'list') {
    return (
      <div
        className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow bg-card cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Image */}
        <div className="flex-shrink-0 w-24 h-24 relative bg-muted rounded overflow-hidden">
          {cardImageUrl ? (
            <Image
              src={cardImageUrl}
              alt={cardName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-sm line-clamp-2">{cardName}</h3>
              {isOutOfStock && (
                <Badge variant="secondary" className="flex-shrink-0 text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>
            {categoryName && <p className="text-xs text-muted-foreground mb-2">{categoryName}</p>}
            <p className="text-xs text-muted-foreground line-clamp-1">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm font-semibold">
              {minPrice === maxPrice ? (
                <span>${minPrice}</span>
              ) : (
                <span>
                  ${minPrice} - ${maxPrice}
                </span>
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddToCart}
              disabled={isAdding || isOutOfStock}
              className="gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">{isAdding ? 'Adding...' : 'Add'}</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Render for grid view (either full Product or flat props)
  return (
    <div
      onClick={handleCardClick}
      className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-all bg-card h-full flex flex-col cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-muted overflow-hidden">
        {cardImageUrl ? (
          <Image
            src={cardImageUrl}
            alt={cardName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs text-muted-foreground">No image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {product && product.status === 'INACTIVE' && (
            <Badge variant="destructive" className="text-xs">
              Inactive
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="secondary" className="text-xs">
              Out of Stock
            </Badge>
          )}
          {!product && badge && badge !== 'Out of Stock' && (
            <div className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
              {badge}
            </div>
          )}
        </div>

        {/* Add to Cart Button (Hover) */}
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isAdding}
              className="gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col">
        {categoryName && (
          <Badge variant="outline" className="w-fit mb-2 text-xs">
            {categoryName}
          </Badge>
        )}

        <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-accent transition-colors">
          {cardName}
        </h3>

        <div className="mt-auto">
          <div className="text-sm font-bold text-primary mb-3">
            {minPrice === maxPrice ? (
              <span>${minPrice}</span>
            ) : (
              <span>
                ${minPrice} - ${maxPrice}
              </span>
            )}
          </div>

          {/* Stock or Star rating indicator */}
          {product ? (
            <div className="text-xs text-muted-foreground">
              {isOutOfStock ? (
                <span className="text-destructive font-medium">Out of Stock</span>
              ) : totalStock && totalStock < 10 ? (
                <span className="text-orange-600 font-medium">Only {totalStock} left</span>
              ) : (
                <span>In Stock</span>
              )}
            </div>
          ) : (
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-accent text-xs">
                  ★
                </span>
              ))}
              <span className="text-muted-foreground text-xs ml-2">(245)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
