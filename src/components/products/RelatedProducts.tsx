'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from './ProductCard'
import { Product } from '@/types/product'
import { useLocale } from '@/i18n/LocaleProvider'

interface RelatedProductsProps {
  products: Product[]
  currentProductId: string
  onAddToCart?: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
}

export function RelatedProducts({ products, currentProductId, onAddToCart, onToggleWishlist }: RelatedProductsProps) {
  const { t } = useLocale()
  // Filter out current product and get related products
  const relatedProducts = products
    .filter(product => product.id !== currentProductId)
    .slice(0, 4) // Show 4 related products

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {t('you_might_also_like')}
            </h2>
            <p className="text-gray-600">
              {t('discover_more_pieces')}
            </p>
          </div>
          
          <Button variant="outline" className="hidden sm:flex">
            {t('view_all_products')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center mt-8 sm:hidden">
          <Button variant="outline">
            {t('view_all_products')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
