'use client'

import { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// import { Separator } from '@/components/ui/separator'
import { useLocale } from '@/i18n/LocaleProvider'

interface Review {
  id: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  date: string
  verified: boolean
  helpful: number
  size?: string
  color?: string
}

interface ProductReviewsProps {
  productId: string
  averageRating: number
  totalReviews: number
  reviews: Review[]
}

export function ProductReviews({ productId, averageRating, totalReviews, reviews }: ProductReviewsProps) {
  const { t } = useLocale()
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'helpful' | 'rating'>('newest')

  const filteredReviews = reviews
    .filter(review => filterRating === null || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'helpful':
          return b.helpful - a.helpful
        case 'rating':
          return b.rating - a.rating
        default:
          return 0
      }
    })

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }))

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  {t('customer_reviews')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Rating */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">
                    {t('based_on_reviews').replace('{count}', totalReviews.toString()).replace('{plural}', totalReviews !== 1 ? 's' : '')}
                  </p>
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">{t('rating_breakdown')}</h4>
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-4">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                {/* Filter by Rating */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">{t('filter_by_rating')}</h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => setFilterRating(null)}
                      className={`w-full text-left text-sm py-1 px-2 rounded ${
                        filterRating === null ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {t('all_reviews')} ({reviews.length})
                    </button>
                    {ratingDistribution.map(({ rating, count }) => (
                      <button
                        key={rating}
                        onClick={() => setFilterRating(rating)}
                        className={`w-full text-left text-sm py-1 px-2 rounded flex items-center gap-2 ${
                          filterRating === rating ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        {t('star_reviews').replace('{rating}', rating.toString())} ({count})
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Reviews ({filteredReviews.length})
              </h3>
              <div className="flex gap-2">
                <Button
                  variant={sortBy === 'newest' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('newest')}
                >
                  {t('newest')}
                </Button>
                <Button
                  variant={sortBy === 'helpful' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('helpful')}
                >
                  {t('most_helpful')}
                </Button>
                <Button
                  variant={sortBy === 'rating' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('rating')}
                >
                  {t('highest_rated')}
                </Button>
              </div>
            </div>

            {/* Reviews */}
            <div className="space-y-6">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      {/* Review Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <span className="text-emerald-600 font-semibold">
                              {review.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">
                                {review.userName}
                              </span>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  {t('verified_purchase')}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span>•</span>
                              <span>{formatDate(review.date)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {review.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>

                      {/* Purchase Details */}
                      {(review.size || review.color) && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">
                            {t('purchased')}: {review.size && `Size ${review.size.toUpperCase()}`}
                            {review.size && review.color && ' • '}
                            {review.color && `Color ${review.color}`}
                          </p>
                        </div>
                      )}

                      {/* Helpful Actions */}
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-600">
                          <ThumbsUp className="w-4 h-4" />
                          {t('helpful')} ({review.helpful})
                        </button>
                        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
                          <ThumbsDown className="w-4 h-4" />
                          {t('not_helpful')}
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">{t('no_reviews_found')}</p>
                </div>
              )}
            </div>

            {/* Load More Reviews */}
            {filteredReviews.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline">
                  {t('load_more_reviews')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
