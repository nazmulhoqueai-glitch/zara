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
    if (!db) {
      console.error('Firebase Firestore not initialized - db is null')
      return []
    }
    
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
    return []
  }
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    if (!db) {
      console.error('Firebase Firestore not initialized - db is null')
      return null
    }
    
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
    
    console.log(`Product with ID ${id} not found`)
    return null
  } catch (error) {
    console.error('Error getting product:', error)
    return null
  }
}

// Alias for getProductById
export const getProduct = getProductById

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    if (!db) {
      throw new Error('Firebase Firestore not initialized')
    }
    
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
    if (!storage) {
      throw new Error('Firebase Storage not initialized')
    }
    
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
    if (!db) {
      throw new Error('Firebase Firestore not initialized')
    }
    
    // First, create the product document to get an ID
    const productsRef = collection(db, 'products')
    
    // Clean the data to remove undefined values
    const cleanProductData: Record<string, unknown> = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category,
      sizes: productData.sizes,
      colors: productData.colors,
      materials: productData.materials,
      inStock: productData.inStock,
      isNew: productData.isNew,
      isFeatured: productData.isFeatured,
      stock: productData.stock,
      tags: productData.tags,
      images: [], // Will be updated after image uploads
      rating: 0,
      reviewCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    
    // Only add optional fields if they have values
    if (productData.nameAr && productData.nameAr.trim()) {
      cleanProductData.nameAr = productData.nameAr
    }
    if (productData.descriptionAr && productData.descriptionAr.trim()) {
      cleanProductData.descriptionAr = productData.descriptionAr
    }
    if (productData.originalPrice && productData.originalPrice > 0) {
      cleanProductData.originalPrice = productData.originalPrice
    }
    
    const docRef = await addDoc(productsRef, cleanProductData)

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
    if (!db) {
      throw new Error('Firebase Firestore not initialized')
    }
    
    const productRef = doc(db, 'products', id)
    
    // Clean the data to remove undefined values
    const cleanUpdateData: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    }
    
    // Only add fields that have values
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'nameAr' || key === 'descriptionAr') {
          // Only add if not empty string
          if (value && value.toString().trim()) {
            cleanUpdateData[key] = value
          }
        } else if (key === 'originalPrice') {
          // Only add if greater than 0
          if (value && Number(value) > 0) {
            cleanUpdateData[key] = value
          }
        } else if (key !== 'images') {
          // Add all other fields except images
          cleanUpdateData[key] = value
        }
      }
    })

    // If new images are provided, upload them
    if (productData.images && productData.images.length > 0) {
      const imageUrls: string[] = []
      for (const imageFile of productData.images) {
        const imageUrl = await uploadProductImage(imageFile, id)
        imageUrls.push(imageUrl)
      }
      cleanUpdateData.images = imageUrls
    }

    await updateDoc(productRef, cleanUpdateData)
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

// Delete product
export async function deleteProduct(id: string): Promise<void> {        
  try {
    if (!db) {
      throw new Error('Firebase Firestore not initialized')
    }
    
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
    if (!db) {
      throw new Error('Firebase Firestore not initialized')
    }
    
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
    if (!db) {
      console.error('Firebase Firestore not initialized - db is null')
      return []
    }
    
    const productsRef = collection(db, 'products')
    // Automatic: newest by createdAt, limited to 8
    const q = query(
      productsRef,
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
    
    // Return only top 8
    return products.slice(0, 8)
  } catch (error) {
    console.error('Error getting new products:', error)
    return []
  }
}
