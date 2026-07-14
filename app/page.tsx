'use client'

import { Header } from '@/components/header'
import { HeroCarousel } from '@/components/hero-carousel'
import { CategorySection } from '@/components/category-section'
import { FeaturedProducts } from '@/components/featured-products'
import { NewArrivals } from '@/components/new-arrivals'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroCarousel />
      <CategorySection />
      <FeaturedProducts />
      <NewArrivals />
      <Footer />
    </main>
  )
}
