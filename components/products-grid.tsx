'use client'

import { Product } from '@/lib/types'
import { ProductCard } from '@/components/product-card'
import { ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'

interface ProductsGridProps {
  products: Product[]
  viewMode: 'grid' | 'list'
  onAddToCart?: (productId: string) => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
} as const

export function ProductsGrid({
  products,
  viewMode,
  onAddToCart,
}: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-scale">
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
      <motion.div
        className="space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard
              product={product}
              viewMode="list"
              onAddToCart={onAddToCart}
            />
          </motion.div>
        ))}
      </motion.div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard
            product={product}
            viewMode="grid"
            onAddToCart={onAddToCart}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
