'use client'

import { useState, useEffect } from 'react'
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLocale } from '@/i18n/LocaleProvider'
import { getProductReviews, getProductReviewStats, updateReviewHelpful } from '@/lib/reviews'
import { Review, ReviewStats } from '@/types/review'
import { ReviewForm } from './ReviewForm'

interface ProductReviewsProps {
  productId: string
  productName: string
}

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { t } = useLocale()
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'helpful' | 'rating'>('newest')
  const [showReviewForm, setShowReviewForm] = useState(false)

  const loadReviews = async () => {
    try {
      setLoading(true)
      const [reviewsData, statsData] = await Promise.all([
        getProductReviews(productId),
        getProductReviewStats(productId)
      ])
      setReviews(reviewsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [productId])

  const handleReviewSubmitted = () => {
    loadReviews() // Reload reviews after new review is submitted
    setShowReviewForm(false)
  }

  const handleHelpfulClick = async (reviewId: string, increment: boolean) => {
    try {
      await updateReviewHelpful(reviewId, increment)
      // Reload reviews to get updated helpful count
      loadReviews()
    } catch (error) {
      console.error('Error updating helpful count:', error)
    }
  }

  const filteredReviews = reviews
    .filter(review => filterRating === null || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'helpful':
          return b.helpful - a.helpful
        case 'rating':
          return b.rating - a.rating
        default:
          return 0
      }
    })

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  Customer Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Rating */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stats?.averageRating.toFixed(1) || '0.0'}
                  </div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(stats?.averageRating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">
                    Based on {stats?.totalReviews || 0} review{(stats?.totalReviews || 0) !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                  {stats?.ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <span className="text-sm font-medium w-8">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  )) || []}
                </div>

                {/* Write Review Button */}
                <Button 
                  onClick={() => setShowReviewForm(true)}
                  className="w-full"
                >
                  Write a Review
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            {/* Filters and Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterRating === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRating(null)}
                >
                  All ({stats?.totalReviews || 0})
                </Button>
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = stats?.ratingDistribution.find(r => r.rating === rating)?.count || 0
                  return (
                    <Button
                      key={rating}
                      variant={filterRating === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterRating(rating)}
                    >
                      {rating} star{rating !== 1 ? 's' : ''} ({count})
                    </Button>
                  )
                })}
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'helpful' | 'rating')}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="helpful">Most Helpful</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="mb-8">
                <ReviewForm
                  productId={productId}
                  productName={productName}
                  onReviewSubmitted={handleReviewSubmitted}
                />
              </div>
            )}

            {/* Reviews */}
            <div className="space-y-6">
              {filteredReviews.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      {filterRating ? `No ${filterRating}-star reviews found.` : 'No reviews yet.'}
                    </p>
                    <Button onClick={() => setShowReviewForm(true)}>
                      Be the first to review this product
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {review.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-900">{review.userName}</h4>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-gray-500 ml-2">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                      <p className="text-gray-700 mb-4">{review.comment}</p>

                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}

                      {/* Size and Color */}
                      {(review.size || review.color) && (
                        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                          {review.size && (
                            <span>Size: <span className="font-medium">{review.size.toUpperCase()}</span></span>
                          )}
                          {review.color && (
                            <span>Color: <span className="font-medium">{review.color}</span></span>
                          )}
                        </div>
                      )}

                      {/* Helpful */}
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">Was this helpful?</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleHelpfulClick(review.id, true)}
                            className="flex items-center space-x-1"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{review.helpful}</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
