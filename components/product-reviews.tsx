'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Review {
  id: string
  author: string
  rating: number
  title: string
  text: string
  date: string
  helpful: number
  verified: boolean
  avatar?: string
}

interface ProductReviewsProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

const REVIEWS_PER_PAGE = 5

export function ProductReviews({
  reviews,
  averageRating,
  totalReviews,
}: ProductReviewsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<'helpful' | 'newest' | 'rating'>(
    'helpful'
  )

  // Calculate rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) =>
    reviews.filter((r) => r.rating === rating).length
  )

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'helpful') return b.helpful - a.helpful
    if (sortBy === 'newest')
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    return b.rating - a.rating
  })

  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  )

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={cn(
          'w-4 h-4',
          i < rating
            ? 'fill-accent text-accent'
            : 'fill-muted text-muted-foreground'
        )}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-muted/50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overall Rating */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex gap-1 my-2">{renderStars(Math.round(averageRating))}</div>
            <div className="text-sm text-muted-foreground">
              Based on {totalReviews} reviews
            </div>
          </div>

          {/* Rating Bars */}
          <div className="md:col-span-2 space-y-2">
            {[5, 4, 3, 2, 1].map((rating, idx) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm font-medium w-12 text-right">
                  {rating} star
                </span>
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{
                      width: `${(ratingCounts[idx] / Math.max(...ratingCounts, 1)) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12">
                  {ratingCounts[idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full mt-4">Write a Review</Button>
      </div>

      {/* Sort and Filter */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Customer Reviews</h3>
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value as typeof sortBy)
            setCurrentPage(1)
          }}
          className="text-sm border rounded-lg px-3 py-2 bg-background"
        >
          <option value="helpful">Most Helpful</option>
          <option value="newest">Newest</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {paginatedReviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                  {review.author[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm">{review.author}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {review.verified && (
                <Badge variant="secondary" className="text-xs">
                  Verified Purchase
                </Badge>
              )}
            </div>

            {/* Rating and Title */}
            <div>
              <div className="flex gap-1 mb-1">{renderStars(review.rating)}</div>
              <h4 className="font-semibold text-sm">{review.title}</h4>
            </div>

            {/* Review Text */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {review.text}
            </p>

            {/* Helpful Button */}
            <div className="flex items-center gap-2 pt-2">
              <Button variant="ghost" size="sm" className="text-xs">
                <ThumbsUp className="w-3 h-3 mr-1" data-icon="inline-start" />
                Helpful ({review.helpful})
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
