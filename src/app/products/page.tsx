'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, Grid, List, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductFilters } from '@/components/products/ProductFilters'
import { Product, ProductFilter, SORT_OPTIONS } from '@/types/product'
import { useLocale } from '@/i18n/LocaleProvider'
import { getAllProducts } from '@/lib/products'

export default function ProductsPage() {
  const { t } = useLocale()
  const [filters, setFilters] = useState<ProductFilter>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Load products from Firebase
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

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filteredProducts = products

    // Search filter
    if (searchQuery) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => product.category === filters.category)
    }

    // Size filter
    if (filters.sizes && filters.sizes.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.sizes.some(size => filters.sizes!.includes(size))
      )
    }

    // Color filter
    if (filters.colors && filters.colors.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.colors.some(color => filters.colors!.includes(color))
      )
    }

    // Material filter
    if (filters.materials && filters.materials.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.materials.some(material => filters.materials!.includes(material))
      )
    }

    // Price range filter
    if (filters.priceRange) {
      filteredProducts = filteredProducts.filter(product =>
        product.price >= filters.priceRange!.min &&
        product.price <= filters.priceRange!.max
      )
    }

    // In stock filter
    if (filters.inStock) {
      filteredProducts = filteredProducts.filter(product => product.inStock)
    }

    // New arrivals filter
    if (filters.isNew) {
      filteredProducts = filteredProducts.filter(product => product.isNew)
    }

    // Featured filter
    if (filters.isFeatured) {
      filteredProducts = filteredProducts.filter(product => product.isFeatured)
    }

    return filteredProducts
  }, [products, filters, searchQuery])

  // Sort products
  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts]

    switch (sortBy) {
      case 'newest':
        return products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      case 'oldest':
        return products.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      case 'price-low':
        return products.sort((a, b) => a.price - b.price)
      case 'price-high':
        return products.sort((a, b) => b.price - a.price)
      case 'name-asc':
        return products.sort((a, b) => a.name.localeCompare(b.name))
      case 'name-desc':
        return products.sort((a, b) => b.name.localeCompare(a.name))
      case 'rating':
        return products.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      default:
        return products
    }
  }, [filteredProducts, sortBy])

  const handleAddToCart = (product: Product) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product)
  }

  const handleToggleWishlist = (product: Product) => {
    // TODO: Implement wishlist functionality
    console.log('Toggle wishlist:', product)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Page Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('products_page_title')}</h1>
              <p className="text-gray-600 mt-1">
                {t('products_page_subtitle')}
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('search_products_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              totalProducts={products.length}
              filteredProducts={filteredProducts.length}
            />
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Products Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('products_count')} ({sortedProducts.length})
                </h2>
                
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  {t('filters')}
                </Button>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={t('sort_by')} />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">{t('loading')}...</p>
                </div>
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('no_products_found')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('no_products_found_desc')}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({})
                    setSearchQuery('')
                  }}
                >
                  {t('clear_all_filters')}
                </Button>
              </div>
            )}

            {/* Load More Button */}
            {sortedProducts.length > 0 && (
              <div className="text-center mt-12">
                <Button size="lg" variant="outline">
                  {t('load_more_products')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
