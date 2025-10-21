import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from './firebase'
import { Review, ReviewFormData, ReviewStats } from '@/types/review'

// Create a new review
export async function createReview(productId: string, userId: string, userData: {
  userName: string
  userEmail: string
  userAvatar?: string
}, reviewData: ReviewFormData): Promise<string> {
  try {
    if (!db) {
      throw new Error('Firebase Firestore not initialized')
    }
    if (!storage) {
      throw new Error('Firebase Storage not initialized')
    }

    // Upload review images if any
    let imageUrls: string[] = []
    if (reviewData.images && reviewData.images.length > 0) {
      const uploadPromises = reviewData.images.map(async (file) => {
        const fileName = `${Date.now()}_${file.name}`
        const imageRef = ref(storage, `reviews/${productId}/${fileName}`)
        const snapshot = await uploadBytes(imageRef, file)
        return await getDownloadURL(snapshot.ref)
      })
      imageUrls = await Promise.all(uploadPromises)
    }

    const review: Omit<Review, 'id'> = {
      productId,
      userId,
      userName: userData.userName,
      userEmail: userData.userEmail,
      userAvatar: userData.userAvatar,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      createdAt: new Date(),
      verified: false, // Will be verified after order confirmation
      helpful: 0,
      size: reviewData.size,
      color: reviewData.color,
      images: imageUrls
    }

    const docRef = await addDoc(collection(db, 'reviews'), review)
    
    // Update product rating and review count
    await updateProductRating(productId)
    
    return docRef.id
  } catch (error) {
    console.error('Error creating review:', error)
    throw error
  }
}

// Get reviews for a specific product
export async function getProductReviews(productId: string, limitCount?: number): Promise<Review[]> {
  try {
    if (!db) {
      throw new Error('Firebase Firestore not initialized')
    }

    let q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    )

    if (limitCount) {
      q = query(q, limit(limitCount))
    }

    const querySnapshot = await getDocs(q)
    const reviews: Review[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      reviews.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate()
      } as Review)
    })

    return reviews
  } catch (error) {
    console.error('Error getting product reviews:', error)
    return []
  }
}

// Get review statistics for a product
export async function getProductReviewStats(productId: string): Promise<ReviewStats> {
  try {
    const reviews = await getProductReviews(productId)
    
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: [5, 4, 3, 2, 1].map(rating => ({
          rating,
          count: 0,
          percentage: 0
        }))
      }
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length

    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
      const count = reviews.filter(r => r.rating === rating).length
      return {
        rating,
        count,
        percentage: (count / reviews.length) * 100
      }
    })

    return {
      averageRating,
      totalReviews: reviews.length,
      ratingDistribution
    }
  } catch (error) {
    console.error('Error getting review stats:', error)
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: 0,
        percentage: 0
      }))
    }
  }
}

// Update review helpful count
export async function updateReviewHelpful(reviewId: string, increment: boolean = true): Promise<void> {
  try {
    if (!db) {
      throw new Error('Firebase Firestore not initialized')
    }

    const reviewRef = doc(db, 'reviews', reviewId)
    const reviewDoc = await getDoc(reviewRef)
    
    if (reviewDoc.exists()) {
      const currentHelpful = reviewDoc.data().helpful || 0
      const newHelpful = increment ? currentHelpful + 1 : Math.max(0, currentHelpful - 1)
      
      await updateDoc(reviewRef, {
        helpful: newHelpful,
        updatedAt: serverTimestamp()
      })
    }
  } catch (error) {
    console.error('Error updating review helpful:', error)
    throw error
  }
}

// Update product rating and review count
async function updateProductRating(productId: string): Promise<void> {
  try {
    if (!db) {
      throw new Error('Firebase Firestore not initialized')
    }

    const stats = await getProductReviewStats(productId)
    const productRef = doc(db, 'products', productId)
    
    await updateDoc(productRef, {
      rating: stats.averageRating,
      reviewCount: stats.totalReviews,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error updating product rating:', error)
    throw error
  }
}

// Delete a review (admin only)
export async function deleteReview(reviewId: string): Promise<void> {
  try {
    if (!db) {
      throw new Error('Firebase Firestore not initialized')
    }

    const reviewRef = doc(db, 'reviews', reviewId)
    const reviewDoc = await getDoc(reviewRef)
    
    if (reviewDoc.exists()) {
      const reviewData = reviewDoc.data()
      
      // Delete review images from storage
      if (reviewData.images && reviewData.images.length > 0) {
        // Note: In production, you might want to implement image cleanup
        console.log('Review images should be cleaned up:', reviewData.images)
      }
      
      await deleteDoc(reviewRef)
      
      // Update product rating
      await updateProductRating(reviewData.productId)
    }
  } catch (error) {
    console.error('Error deleting review:', error)
    throw error
  }
}
