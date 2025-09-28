import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  orderBy,
  where,
  serverTimestamp 
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from './firebase'

export interface Product {
  id: string
  name: string
  nameAr?: string
  description: string
  descriptionAr?: string
  price: number
  originalPrice?: number
  images: string[]
  category: 'borka' | 'abaya' | 'hijab'
  sizes: string[]
  colors: string[]
  materials: string[]
  inStock: boolean
  isNew: boolean
  isFeatured: boolean
  stock: number
  tags: string[]
  rating?: number
  reviewCount?: number
  createdAt: Date
  updatedAt: Date
}

export interface ProductFormData {
  name: string
  nameAr?: string
  description: string
  descriptionAr?: string
  price: number
  originalPrice?: number
  category: 'borka' | 'abaya' | 'hijab'
  sizes: string[]
  colors: string[]
  materials: string[]
  inStock: boolean
  isNew: boolean
  isFeatured: boolean
  stock: number
  tags: string[]
  images: File[]
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products')
    const q = query(productsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const products: Product[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      products.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Product)
    })
    
    return products
  } catch (error) {
    console.error('Error getting products:', error)
    throw error
  }
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const productRef = doc(db, 'products', id)
    const productSnap = await getDoc(productRef)
    
    if (productSnap.exists()) {
      const data = productSnap.data()
      return {
        id: productSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Product
    }
    
    return null
  } catch (error) {
    console.error('Error getting product:', error)
    throw error
  }
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products')
    const q = query(
      productsRef, 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    const products: Product[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      products.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Product)
    })
    
    return products
  } catch (error) {
    console.error('Error getting products by category:', error)
    throw error
  }
}

// Upload image to Firebase Storage
export async function uploadProductImage(file: File, productId: string): Promise<string> {
  try {
    const storageRef = ref(storage, `products/${productId}/${Date.now()}_${file.name}`)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// Create new product
export async function createProduct(productData: ProductFormData): Promise<string> {
  try {
    // First, create the product document to get an ID
    const productsRef = collection(db, 'products')
    const docRef = await addDoc(productsRef, {
      ...productData,
      images: [], // Will be updated after image uploads
      rating: 0,
      reviewCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // Upload images and get URLs
    const imageUrls: string[] = []
    for (const imageFile of productData.images) {
      const imageUrl = await uploadProductImage(imageFile, docRef.id)
      imageUrls.push(imageUrl)
    }

    // Update the product with image URLs
    await updateDoc(docRef, {
      images: imageUrls,
      updatedAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

// Update product
export async function updateProduct(id: string, productData: Partial<ProductFormData>): Promise<void> {
  try {
    const productRef = doc(db, 'products', id)
    
    const updateData: any = {
      ...productData,
      updatedAt: serverTimestamp(),
    }

    // If new images are provided, upload them
    if (productData.images && productData.images.length > 0) {
      const imageUrls: string[] = []
      for (const imageFile of productData.images) {
        const imageUrl = await uploadProductImage(imageFile, id)
        imageUrls.push(imageUrl)
      }
      updateData.images = imageUrls
    }

    await updateDoc(productRef, updateData)
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

// Delete product
export async function deleteProduct(id: string): Promise<void> {
  try {
    const productRef = doc(db, 'products', id)
    await deleteDoc(productRef)
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

// Get featured products
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products')
    const q = query(
      productsRef,
      where('isFeatured', '==', true),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    const products: Product[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      products.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Product)
    })
    
    return products
  } catch (error) {
    console.error('Error getting featured products:', error)
    throw error
  }
}

// Get new products
export async function getNewProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products')
    const q = query(
      productsRef,
      where('isNew', '==', true),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    const products: Product[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      products.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Product)
    })
    
    return products
  } catch (error) {
    console.error('Error getting new products:', error)
    throw error
  }
}
