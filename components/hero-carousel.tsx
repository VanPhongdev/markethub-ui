'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: 'Summer Collection Sale',
      subtitle: 'Up to 50% off on selected items',
      gradient: 'from-orange-100 to-amber-50',
    },
    {
      id: 2,
      title: 'New Arrivals Every Week',
      subtitle: 'Discover the latest trends first',
      gradient: 'from-blue-100 to-cyan-50',
    },
    {
      id: 3,
      title: 'Exclusive Member Deals',
      subtitle: 'Join now and get 20% off your first order',
      gradient: 'from-purple-100 to-pink-50',
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative w-full h-80 md:h-96 overflow-hidden rounded-lg mx-4 md:mx-8 my-8">
      {/* Slides */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === currentSlide ? 'opacity-100' : 'opacity-0'
          } bg-gradient-to-r ${slide.gradient} flex items-center justify-center`}
        >
          <div className="text-center px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">{slide.title}</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">{slide.subtitle}</p>
            <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 rounded-lg font-semibold transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-primary p-2 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-primary p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3 h-3 rounded-full transition-colors ${
              idx === currentSlide ? 'bg-primary' : 'bg-white/60 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
