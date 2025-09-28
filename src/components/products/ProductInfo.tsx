'use client'

import { useState } from 'react'
import { Heart, Star, Truck, Shield, Award, Share2, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
// import { Separator } from '@/components/ui/separator'
import { Product } from '@/types/product'
import { useCartStore } from '@/store/useCartStore'
import { useLocale } from '@/i18n/LocaleProvider'

interface ProductInfoProps {
  product: Product
  onAddToCart: (product: Product, quantity: number, selectedSize?: string, selectedColor?: string) => void
  onToggleWishlist: (product: Product) => void
}

export function ProductInfo({ product, onAddToCart, onToggleWishlist }: ProductInfoProps) {
  const { t, locale } = useLocale()
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const add = useCartStore((s) => s.addItem)

  const formatPrice = (price: number) => {
    if (locale === 'ar') {
      return `${price} ${t('currency_sar')}`
    }
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    add({
      id: product.id,
      name: product.name,
      image: product.images[0] || '',
      price: product.price,
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    })
    onAddToCart(product, quantity, selectedSize || undefined, selectedColor || undefined)
  }

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    onToggleWishlist(product)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You could add a toast notification here
    }
  }

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div>
        {/* Category & Badges */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {product.category.toUpperCase()}
          </Badge>
          {product.isNew && (
            <Badge className="bg-emerald-500 text-white text-xs">
              {t('new_badge')}
            </Badge>
          )}
          {product.isFeatured && (
            <Badge className="bg-purple-500 text-white text-xs">
              {t('featured_badge')}
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-red-500 text-white text-xs">
              -{discountPercentage}% {t('off_badge')}
            </Badge>
          )}
        </div>

        {/* Product Name */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating!)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviewCount || 0} {t('reviews')})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl font-bold text-emerald-600">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xl text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('description')}</h3>
        <p className="text-gray-600 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('size')}</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                  selectedSize === size
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>
          {!selectedSize && (
            <p className="text-sm text-red-600 mt-2">{t('please_select_size')}</p>
          )}
        </div>
      )}

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('color')}</h3>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? 'border-emerald-500 ring-2 ring-emerald-200'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          {!selectedColor && (
            <p className="text-sm text-red-600 mt-2">{t('please_select_color')}</p>
          )}
        </div>
      )}

      {/* Quantity */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('quantity')}</h3>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock || (!selectedSize && product.sizes?.length > 0) || (!selectedColor && product.colors?.length > 0)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3"
          size="lg"
        >
          {!product.inStock ? t('out_of_stock') : t('add_to_cart')}
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleToggleWishlist}
            className={`flex-1 ${
              isWishlisted ? 'border-red-500 text-red-500' : ''
            }`}
          >
            <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
            {isWishlisted ? t('wishlisted') : t('add_to_wishlist')}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex-1"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {t('share')}
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-4">
        <div className="border-t border-gray-200 my-6"></div>
        
        {/* Materials */}
        {product.materials && product.materials.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('materials')}</h3>
            <div className="flex flex-wrap gap-2">
              {product.materials.map((material) => (
                <Badge key={material} variant="secondary">
                  {material.charAt(0).toUpperCase() + material.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('tags')}</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <Truck className="w-6 h-6 text-emerald-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">{t('free_shipping')}</span>
            <span className="text-xs text-gray-600">{t('free_shipping_desc')}</span>
          </div>
          <div className="flex flex-col items-center">
            <Shield className="w-6 h-6 text-emerald-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">{t('secure_payment')}</span>
            <span className="text-xs text-gray-600">{t('secure_payment_desc')}</span>
          </div>
          <div className="flex flex-col items-center">
            <Award className="w-6 h-6 text-emerald-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">{t('quality_guarantee')}</span>
            <span className="text-xs text-gray-600">{t('quality_guarantee_desc')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
