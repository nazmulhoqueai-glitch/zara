export interface User {
  uid: string
  email: string
  displayName?: string
  firstName?: string
  lastName?: string
  phone?: string
  photoURL?: string
  createdAt: Date
  updatedAt?: Date
  role: 'user' | 'admin'
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: 'SAR'
  images: string[]
  category: string
  sizes: string[]
  colors: string[]
  material: string
  inStock: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  productId: string
  quantity: number
  size: string
  color: string
  price: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  currency: 'SAR'
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: ShippingAddress
  paymentMethod: 'apple_pay' | 'credit_card'
  createdAt: Date
  updatedAt: Date
}

export interface ShippingAddress {
  fullName: string
  address: string
  city: string
  postalCode: string
  country: string
  phone: string
}
