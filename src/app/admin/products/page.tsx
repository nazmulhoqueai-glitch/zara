'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLocale } from '@/i18n/LocaleProvider'
import { getAllProducts, deleteProduct, Product } from '@/lib/products'
import { useState as useStateHook, useEffect } from 'react'

export default function ProductsPage() {
  const { t, locale } = useLocale()
  const [products, setProducts] = useStateHook<Product[]>([])
  const [loading, setLoading] = useStateHook(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Load products from Firebase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const firebaseProducts = await getAllProducts()
        setProducts(firebaseProducts)
      } catch (error) {
        console.error('Error loading products:', error)
        // Show empty state instead of mock data
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'inStock' && product.inStock) ||
                         (selectedStatus === 'outOfStock' && !product.inStock)

    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = ['all', 'borka', 'abaya', 'hijab']
  const statuses = ['all', 'inStock', 'outOfStock']

  const handleDeleteProduct = async (productId: string) => {
    if (confirm(t('confirm_delete_product'))) {
      try {
        await deleteProduct(productId)
        setProducts(products.filter(p => p.id !== productId))
        console.log('Product deleted successfully')
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Failed to delete product. Please try again.')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('manage_products')}</h1>
          <p className="text-gray-600 mt-2">{t('manage_products_subtitle')}</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            {t('add_product')}
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={t('search_products')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">{t('all_categories')}</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>
                    {t(`category_${category}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">{t('all_status')}</option>
                <option value="inStock">{t('in_stock')}</option>
                <option value="outOfStock">{t('out_of_stock')}</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <div className="absolute top-2 right-2 flex gap-1">
                <Link href={`/admin/products/${product.id}/edit`}>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0 bg-white/80 hover:bg-white">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-8 h-8 p-0 bg-white/80 hover:bg-white text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviewCount})
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link href={`/admin/products/${product.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      {t('edit')}
                    </Button>
                  </Link>
                  <Link href={`/products/${product.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      {t('view')}
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('no_products_found')}</h3>
            <p className="text-gray-600 mb-6">{t('no_products_found_desc')}</p>
            <Link href="/admin/products/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                {t('add_first_product')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {t('showing')} {filteredProducts.length} {t('of')} {products.length} {t('products')}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              {t('previous')}
            </Button>
            <Button variant="outline" size="sm" disabled>
              {t('next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
