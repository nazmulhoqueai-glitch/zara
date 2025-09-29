import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, orderBy, where, Timestamp } from 'firebase/firestore'
import { db } from './firebase'

// User Management Functions
export interface User {
  uid: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: 'user' | 'admin'
  isActive: boolean
  createdAt: Date
  lastLogin?: Date
  totalOrders?: number
  totalSpent?: number
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        uid: doc.id,
        email: data.email,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        role: data.role || 'user',
        isActive: data.isActive !== false, // Default to true
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLogin: data.lastLogin?.toDate(),
        totalOrders: data.totalOrders || 0,
        totalSpent: data.totalSpent || 0
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export async function updateUserRole(uid: string, role: 'user' | 'admin'): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, { role })
  } catch (error) {
    console.error('Error updating user role:', error)
    throw error
  }
}

export async function updateUserStatus(uid: string, isActive: boolean): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, { isActive })
  } catch (error) {
    console.error('Error updating user status:', error)
    throw error
  }
}

// Order Management Functions
export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  size: string
  color: string
  image: string
}

export interface ShippingAddress {
  name: string
  street: string
  city: string
  postalCode: string
  country: string
}

export interface Order {
  id: string
  customer: {
    name: string
    email: string
    phone: string
  }
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: 'credit_card' | 'apple_pay' | 'bank_transfer'
  shippingAddress: ShippingAddress
  createdAt: string
  updatedAt: string
}

export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const ordersRef = collection(db, 'orders')
    const now = new Date().toISOString()
    
    const orderDoc = {
      ...orderData,
      createdAt: now,
      updatedAt: now
    }
    
    const docRef = doc(ordersRef)
    await setDoc(docRef, orderDoc)
    return docRef.id
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders')
    const q = query(ordersRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        customer: data.customer,
        items: data.items,
        total: data.total,
        status: data.status,
        paymentMethod: data.paymentMethod,
        shippingAddress: data.shippingAddress,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

export async function updateOrderStatus(orderId: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', orderId)
    await updateDoc(orderRef, { 
      status,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders')
    const q = query(ordersRef, where('customer.email', '==', userId), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        customer: data.customer,
        items: data.items,
        total: data.total,
        status: data.status,
        paymentMethod: data.paymentMethod,
        shippingAddress: data.shippingAddress,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }
    })
  } catch (error) {
    console.error('Error fetching user orders:', error)
    throw error
  }
}
