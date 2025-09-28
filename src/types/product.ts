export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  subcategory?: string
  sizes: string[]
  colors: string[]
  materials: string[]
  inStock: boolean
  isNew?: boolean
  isFeatured?: boolean
  rating?: number
  reviewCount?: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductFilter {
  category?: string
  subcategory?: string
  sizes?: string[]
  colors?: string[]
  materials?: string[]
  priceRange?: {
    min: number
    max: number
  }
  inStock?: boolean
  isNew?: boolean
  isFeatured?: boolean
  search?: string
}

export interface SortOption {
  value: string
  label: string
}

export const SORT_OPTIONS: SortOption[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'rating', label: 'Highest Rated' },
]

export const PRODUCT_CATEGORIES = [
  { value: 'borka', label: 'Borka' },
  { value: 'abaya', label: 'Abaya' },
  { value: 'hijab', label: 'Hijab' },
  { value: 'accessories', label: 'Accessories' },
]

export const PRODUCT_SIZES = [
  { value: 'xs', label: 'XS' },
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL' },
  { value: 'xxl', label: 'XXL' },
]

export const PRODUCT_COLORS = [
  { value: 'black', label: 'Black', color: '#000000' },
  { value: 'white', label: 'White', color: '#FFFFFF' },
  { value: 'navy', label: 'Navy', color: '#000080' },
  { value: 'brown', label: 'Brown', color: '#8B4513' },
  { value: 'gray', label: 'Gray', color: '#808080' },
  { value: 'beige', label: 'Beige', color: '#F5F5DC' },
  { value: 'purple', label: 'Purple', color: '#800080' },
  { value: 'blue', label: 'Blue', color: '#0000FF' },
  { value: 'green', label: 'Green', color: '#008000' },
  { value: 'red', label: 'Red', color: '#FF0000' },
  { value: 'pink', label: 'Pink', color: '#FFC0CB' },
  { value: 'yellow', label: 'Yellow', color: '#FFFF00' },
]

export const PRODUCT_MATERIALS = [
  { value: 'cotton', label: 'Cotton' },
  { value: 'polyester', label: 'Polyester' },
  { value: 'silk', label: 'Silk' },
  { value: 'linen', label: 'Linen' },
  { value: 'wool', label: 'Wool' },
  { value: 'viscose', label: 'Viscose' },
  { value: 'chiffon', label: 'Chiffon' },
  { value: 'crepe', label: 'Crepe' },
  { value: 'jersey', label: 'Jersey' },
  { value: 'georgette', label: 'Georgette' },
]
