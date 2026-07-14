'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Minus, Plus, Heart, ShoppingCart } from 'lucide-react'
import { ProductVariant } from '@/lib/types'
import { cn } from '@/lib/utils'

interface VariantSelectorProps {
  variants: ProductVariant[]
  onAddToCart: (variantId: string, quantity: number) => void
}

export function VariantSelector({
  variants,
  onAddToCart,
}: VariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    variants[0]
  )
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta)
    const maxStock = selectedVariant.stock
    setQuantity(Math.min(newQuantity, maxStock))
  }

  const handleAddToCart = () => {
    onAddToCart(selectedVariant.id, quantity)
  }

  const isOutOfStock = selectedVariant.stock === 0

  return (
    <div className="flex flex-col gap-6">
      {/* Variant Selection */}
      {variants.length > 1 && (
        <div>
          <label className="text-sm font-semibold mb-3 block">Chọn phiên bản</label>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => {
                  setSelectedVariant(variant)
                  setQuantity(1)
                }}
                className={cn(
                  'px-4 py-2 rounded-lg border font-medium transition-all text-sm',
                  selectedVariant.id === variant.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-primary bg-background text-foreground'
                )}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price and Stock Info */}
      <div className="flex items-center gap-4">
        <div>
          <div className="text-3xl font-bold">${selectedVariant.price}</div>
        </div>

        {isOutOfStock ? (
          <Badge variant="destructive" className="text-sm">
            Out of Stock
          </Badge>
        ) : selectedVariant.stock < 10 ? (
          <Badge variant="secondary" className="text-sm">
            Only {selectedVariant.stock} left
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-sm">
            In Stock
          </Badge>
        )}
      </div>

      {/* Quantity Selector */}
      <div>
        <label className="text-sm font-semibold mb-3 block">Quantity</label>
        <div className="flex items-center gap-3 w-fit">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity === 1 || isOutOfStock}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-12 text-center font-semibold">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= selectedVariant.stock || isOutOfStock}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          size="lg"
          className="flex-1"
        >
          <ShoppingCart className="w-4 h-4 mr-2" data-icon="inline-start" />
          Add to Cart
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart
            className={cn(
              'w-4 h-4',
              isWishlisted && 'fill-current text-red-500'
            )}
            data-icon="inline-start"
          />
          <span className="hidden sm:inline">
            {isWishlisted ? 'Wishlisted' : 'Wishlist'}
          </span>
        </Button>
      </div>

      {/* Shipping Info */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
        <div className="flex gap-2">
          <span className="font-semibold">Free shipping</span>
          <span className="text-muted-foreground">on orders over $50</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold">30-day returns</span>
          <span className="text-muted-foreground">hassle-free</span>
        </div>
      </div>
    </div>
  )
}
