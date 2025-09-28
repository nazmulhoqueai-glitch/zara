'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Star, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Product } from '@/types/product'
import { useCartStore } from '@/store/useCartStore'
import { useLocale } from '@/i18n/LocaleProvider'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart, onToggleWishlist }: ProductCardProps) {
  const add = useCartStore((s) => s.addItem)
  const { t, locale } = useLocale()

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

  const handleQuickAdd = () => {
    add({
      id: product.id,
      name: product.name,
      image: product.images[0] || '',
      price: product.price,
      quantity: 1,
    })
    onAddToCart?.(product)
  }

  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <Link href={`/products/${product.id}`}>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                NEW
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                FEATURED
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => onToggleWishlist?.(product)}
            className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>

          {/* Quick Add to Cart */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <Button
              onClick={handleQuickAdd}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              size="sm"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {t('add_to_cart')}
            </Button>
          </div>

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold">
                {t('out_of_stock')}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.category}
          </div>

          {/* Product Name */}
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating!)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-emerald-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Colors Preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xs text-gray-500">Colors:</span>
              <div className="flex gap-1">
                {Array.isArray(product.colors) && product.colors.slice(0, 4).map((color) => (
                  <div
                    key={color}
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                {Array.isArray(product.colors) && product.colors.length > 4 && (
                  <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
                )}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Sizes:</span>
              <div className="flex gap-1">
                {Array.isArray(product.sizes) && product.sizes.slice(0, 4).map((size) => (
                  <span
                    key={size}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {size.toUpperCase()}
                  </span>
                ))}
                {Array.isArray(product.sizes) && product.sizes.length > 4 && (
                  <span className="text-xs text-gray-500">+{product.sizes.length - 4}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
