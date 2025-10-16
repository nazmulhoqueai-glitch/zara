'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/i18n/LocaleProvider'
import { getAllProducts, Product } from '@/lib/products'
import Link from 'next/link'
import { Package, Grid, Filter } from 'lucide-react'

export default function CategoriesPage() {
  const { t, locale } = useLocale()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const allProducts = await getAllProducts()
        setProducts(allProducts)
      } catch (error) {
        console.error('Error loading products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const categories = [
    { value: 'all', label: t('all_categories'), count: products.length },
    { value: 'borka', label: t('category_borka'), count: products.filter(p => p.category === 'borka').length },
    { value: 'abaya', label: t('category_abaya'), count: products.filter(p => p.category === 'abaya').length },
    { value: 'hijab', label: t('category_hijab'), count: products.filter(p => p.category === 'hijab').length },
  ]

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('nav_categories')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('categories_description')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4 justify-center">
                {categories.map(category => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`flex items-center gap-2 ${
                      selectedCategory === category.value 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                        : 'hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    {category.label}
                    <Badge variant="secondary" className="ml-1">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('loading_products')}</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    {product.isNew && (
                      <Badge className="bg-emerald-600 text-white text-xs">{t('new')}</Badge>
                    )}
                    {product.isFeatured && (
                      <Badge className="bg-blue-600 text-white text-xs">{t('featured')}</Badge>
                    )}
                    {!product.inStock && (
                      <Badge className="bg-red-600 text-white text-xs">{t('out_of_stock')}</Badge>
                    )}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-emerald-600">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.stock} {t('in_stock')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{t(`category_${product.category}`)}</span>
                      <span>•</span>
                      <span>{product.sizes.length} {t('sizes')}</span>
                      <span>•</span>
                      <span>{product.colors.length} {t('colors')}</span>
                    </div>

                    <Link href={`/products/${product.id}`} className="block">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Package className="w-4 h-4 mr-2" />
                        {t('view_product')}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('no_products_found')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('no_products_found_desc')}
              </p>
              <Link href="/products">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Package className="w-4 h-4 mr-2" />
                  {t('view_all_products')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
