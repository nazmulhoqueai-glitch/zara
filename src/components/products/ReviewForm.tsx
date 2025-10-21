'use client'

import { useState } from 'react'
import { Star, Upload, X, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { useLocale } from '@/i18n/LocaleProvider'
import { createReview } from '@/lib/reviews'
import { ReviewFormData } from '@/types/review'

interface ReviewFormProps {
  productId: string
  productName: string
  onReviewSubmitted: () => void
}

export function ReviewForm({ productId, productName, onReviewSubmitted }: ReviewFormProps) {
  const { user } = useAuth()
  const { t } = useLocale()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    title: '',
    comment: '',
    size: '',
    color: ''
  })

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  const handleInputChange = (field: keyof ReviewFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (selectedImages.length + imageFiles.length > 5) {
      setError('You can upload maximum 5 images')
      return
    }

    setSelectedImages(prev => [...prev, ...imageFiles])
    
    // Create preview URLs
    imageFiles.forEach(file => {
      const url = URL.createObjectURL(file)
      setPreviewUrls(prev => [...prev, url])
    })
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('Please log in to write a review')
      return
    }

    if (formData.rating === 0) {
      setError('Please select a rating')
      return
    }

    if (!formData.title.trim()) {
      setError('Please enter a review title')
      return
    }

    if (!formData.comment.trim()) {
      setError('Please write your review')
      return
    }

    setLoading(true)
    setError('')

    try {
      await createReview(productId, user.uid, {
        userName: user.displayName || `${user.firstName} ${user.lastName}`.trim() || 'Anonymous',
        userEmail: user.email,
        userAvatar: user.photoURL
      }, {
        ...formData,
        images: selectedImages
      })

      setSuccess(true)
      setFormData({
        rating: 0,
        title: '',
        comment: '',
        size: '',
        color: ''
      })
      setSelectedImages([])
      setPreviewUrls([])
      
      // Call the callback to refresh reviews
      onReviewSubmitted()
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      console.error('Error submitting review:', error)
      setError(error.message || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Please log in to write a review for this product.
          </p>
          <Button asChild>
            <a href="/login">Log In</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review for {productName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <Label className="text-sm font-medium">Rating *</Label>
            <div className="flex items-center space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingChange(rating)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      rating <= formData.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {formData.rating > 0 && `${formData.rating} star${formData.rating !== 1 ? 's' : ''}`}
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium">Review Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Summarize your review in a few words"
              className="mt-2"
              maxLength={100}
            />
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment" className="text-sm font-medium">Your Review *</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              placeholder="Tell others about your experience with this product..."
              className="mt-2 min-h-[120px]"
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.comment.length}/1000 characters
            </p>
          </div>

          {/* Size and Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="size" className="text-sm font-medium">Size (Optional)</Label>
              <Select value={formData.size} onValueChange={(value) => handleInputChange('size', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="s">S</SelectItem>
                  <SelectItem value="m">M</SelectItem>
                  <SelectItem value="l">L</SelectItem>
                  <SelectItem value="xl">XL</SelectItem>
                  <SelectItem value="xxl">XXL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="color" className="text-sm font-medium">Color (Optional)</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                placeholder="e.g., Black, Navy, Purple"
                className="mt-2"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-sm font-medium">Photos (Optional)</Label>
            <p className="text-xs text-gray-500 mb-2">Upload up to 5 photos to show others what you received</p>
            
            <div className="mt-2">
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <Label htmlFor="images" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload photos</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
                </div>
              </Label>
            </div>

            {/* Image Previews */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              Thank you! Your review has been submitted and will appear after moderation.
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || formData.rating === 0 || !formData.title.trim() || !formData.comment.trim()}
            className="w-full"
          >
            {loading ? 'Submitting Review...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
