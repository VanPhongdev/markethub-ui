'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Home, Zap, BookOpen, Heart } from 'lucide-react'

export function CategorySection() {
  const [showAll, setShowAll] = useState(false)

  const categories = [
    { name: 'Electronics', slug: 'electronics', icon: Zap, color: 'bg-blue-100' },
    { name: 'Fashion', slug: 'fashion', icon: Heart, color: 'bg-pink-100' },
    { name: 'Home & Garden', slug: 'home-garden', icon: Home, color: 'bg-green-100' },
    { name: 'Books', slug: 'books', icon: BookOpen, color: 'bg-amber-100' },
    { name: 'Sports', slug: 'sports', icon: ShoppingBag, color: 'bg-orange-100' },
    { name: 'Beauty', slug: 'beauty', icon: Heart, color: 'bg-rose-100' },
  ]

  const displayedCategories = showAll ? categories : categories.slice(0, 4)

  return (
    <section className="py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-8">Shop by Category</h2>

        <div className="flex overflow-x-auto gap-4 pb-4 md:pb-0 md:grid md:grid-cols-4 lg:grid-cols-5">
          {displayedCategories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="flex-shrink-0 md:flex-shrink group"
              >
                <div className={`${category.color} rounded-lg p-6 text-center transition-transform hover:scale-105 cursor-pointer min-w-32 md:min-w-auto`}>
                  <div className="flex justify-center mb-3">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-primary text-sm group-hover:text-accent transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-6 md:hidden flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-accent hover:text-accent/80 font-semibold transition-colors"
          >
            {showAll ? 'Show Less' : 'View all categories'}
          </button>
        </div>
      </div>
    </section>
  )
}
