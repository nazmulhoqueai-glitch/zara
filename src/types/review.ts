export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userEmail: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  createdAt: Date
  updatedAt?: Date
  verified: boolean
  helpful: number
  size?: string
  color?: string
  images?: string[]
}

export interface ReviewFormData {
  rating: number
  title: string
  comment: string
  size?: string
  color?: string
  images?: File[]
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    rating: number
    count: number
    percentage: number
  }[]
}
