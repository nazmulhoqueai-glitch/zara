'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductImageGallery } from '@/components/products/ProductImageGallery'
import { ProductInfo } from '@/components/products/ProductInfo'
import { RelatedProducts } from '@/components/products/RelatedProducts'
import { ProductReviews } from '@/components/products/ProductReviews'
import { Product } from '@/types/product'
import { useLocale } from '@/i18n/LocaleProvider'

// Mock data - In real app, this would come from Firebase/API
const mockProducts: Product[] = []

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    userName: 'Sarah Ahmed',
    rating: 5,
    title: 'Absolutely beautiful!',
    comment: 'This Borka is stunning. The embroidery is so detailed and the fabric is comfortable. Perfect for special occasions. Highly recommend!',
    date: '2024-01-15',
    verified: true,
    helpful: 12,
    size: 'm',
    color: 'purple'
  },
  {
    id: '2',
    userName: 'Fatima Al-Rashid',
    rating: 4,
    title: 'Great quality',
    comment: 'Good quality fabric and nice design. The fit is perfect. Only minor issue is the shipping took a bit longer than expected.',
    date: '2024-01-10',
    verified: true,
    helpful: 8,
    size: 'l',
    color: 'navy'
  },
  {
    id: '3',
    userName: 'Aisha Khan',
    rating: 5,
    title: 'Love it!',
    comment: 'This is exactly what I was looking for. The color is beautiful and the material is soft. Will definitely order again.',
    date: '2024-01-08',
    verified: true,
    helpful: 15,
    size: 's',
    color: 'purple'
  }
]

export default function ProductDetailsPage() {
  const { t } = useLocale()
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchProduct = async () => {
      setLoading(true)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const foundProduct = mockProducts.find(p => p.id === productId)
      setProduct(foundProduct || null)
      setLoading(false)
    }

    fetchProduct()
  }, [productId])

  const handleAddToCart = (product: Product, quantity: number, selectedSize?: string, selectedColor?: string) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', {
      product: product.name,
      quantity,
      size: selectedSize,
      color: selectedColor
    })
    
    // You could add a toast notification here
    alert(`Added ${quantity}x ${product.name} to cart!`)
  }

  const handleAddToCartSimple = (product: Product) => {
    handleAddToCart(product, 1)
  }

  const handleToggleWishlist = (product: Product) => {
    // TODO: Implement wishlist functionality
    console.log('Toggle wishlist:', product.name)
    
    // You could add a toast notification here
    alert(`Added ${product.name} to wishlist!`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading_product_details')}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('product_not_found')}</h1>
          <p className="text-gray-600 mb-6">{t('product_not_found_desc')}</p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('back_to_products')}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              {t('home')}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/products" className="text-gray-500 hover:text-gray-700">
              {t('products')}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{product.category}</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div>
            <ProductImageGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Product Information */}
          <div>
            <ProductInfo
              product={product}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
            />
          </div>
        </div>
      </div>

      {/* Product Reviews */}
      <ProductReviews
        productId={product.id}
        averageRating={product.rating || 0}
        totalReviews={product.reviewCount || 0}
        reviews={mockReviews}
      />

      {/* Related Products */}
      <RelatedProducts
        products={mockProducts}
        currentProductId={product.id}
        onAddToCart={handleAddToCartSimple}
        onToggleWishlist={handleToggleWishlist}
      />
    </div>
  )
}
