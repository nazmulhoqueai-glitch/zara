'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  Save, 
  X, 
  Upload,
  Plus,
  Trash2,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLocale } from '@/i18n/LocaleProvider'
import Link from 'next/link'
import { getProduct, updateProduct, ProductFormData, Product } from '@/lib/products'

interface ProductImage {
  id: string
  url: string
  alt: string
}

export default function EditProductPage() {
  const { t, locale } = useLocale()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    price: '',
    originalPrice: '',
    category: 'borka' as 'borka' | 'abaya' | 'hijab',
    sizes: ['s', 'm', 'l'],
    colors: ['black'],
    materials: ['cotton'],
    inStock: true,
    isNew: false,
    isFeatured: false,
    stock: '',
    tags: ''
  })
  const [images, setImages] = useState<ProductImage[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = [
    { value: 'borka', label: t('category_borka') },
    { value: 'abaya', label: t('category_abaya') },
    { value: 'hijab', label: t('category_hijab') }
  ]

  const availableSizes = ['xs', 's', 'm', 'l', 'xl', 'xxl']
  const availableColors = ['black', 'white', 'navy', 'purple', 'blue', 'red', 'green', 'gray']
  const availableMaterials = ['cotton', 'polyester', 'viscose', 'silk', 'linen']

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setInitialLoading(true)
        const product = await getProduct(productId)
        
        if (product) {
          setFormData({
            name: product.name,
            nameAr: product.nameAr || '',
            description: product.description,
            descriptionAr: product.descriptionAr || '',
            price: product.price.toString(),
            originalPrice: product.originalPrice?.toString() || '',
            category: product.category,
            sizes: product.sizes,
            colors: product.colors,
            materials: product.materials,
            inStock: product.inStock,
            isNew: product.isNew,
            isFeatured: product.isFeatured,
            stock: product.stock.toString(),
            tags: product.tags.join(', ')
          })

          // Set existing images
          const existingImages: ProductImage[] = product.images.map((url, index) => ({
            id: `existing-${index}`,
            url,
            alt: product.name
          }))
          setImages(existingImages)
        }
      } catch (error) {
        console.error('Error loading product:', error)
        setErrors({ general: 'Failed to load product. Please try again.' })
      } finally {
        setInitialLoading(false)
      }
    }

    if (productId) {
      loadProduct()
    }
  }, [productId])

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSizeToggle = (size: string) => {
    const currentSizes = formData.sizes
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size]
    handleInputChange('sizes', newSizes)
  }

  const handleColorToggle = (color: string) => {
    const currentColors = formData.colors
    const newColors = currentColors.includes(color)
      ? currentColors.filter(c => c !== color)
      : [...currentColors, color]
    handleInputChange('colors', newColors)
  }

  const handleMaterialToggle = (material: string) => {
    const currentMaterials = formData.materials
    const newMaterials = currentMaterials.includes(material)
      ? currentMaterials.filter(m => m !== material)
      : [...currentMaterials, material]
    handleInputChange('materials', newMaterials)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files)
      
      // Validate file sizes (max 5MB per file)
      const validFiles = newFiles.filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 5MB.`)
          return false
        }
        return true
      })
      
      // Validate file types
      const imageFiles = validFiles.filter(file => {
        if (!file.type.startsWith('image/')) {
          alert(`File ${file.name} is not an image.`)
          return false
        }
        return true
      })
      
      if (imageFiles.length === 0) return
      
      setImageFiles(prev => [...prev, ...imageFiles])
      
      imageFiles.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newImage: ProductImage = {
            id: Date.now().toString() + Math.random(),
            url: e.target?.result as string,
            alt: file.name
          }
          setImages(prev => [...prev, newImage])
        }
        reader.onerror = () => {
          console.error('Error reading file:', file.name)
          alert(`Error reading file ${file.name}`)
        }
        reader.readAsDataURL(file)
      })
    }
    
    // Clear the input so the same file can be selected again
    event.target.value = ''
  }

  const removeImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
    setImageFiles(prev => prev.filter((_, index) => index !== images.findIndex(img => img.id === imageId)))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = t('product_name_required')
    }
    if (!formData.description.trim()) {
      newErrors.description = t('product_description_required')
    }
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = t('product_price_required')
    }
    if (!formData.stock || Number(formData.stock) < 0) {
      newErrors.stock = t('product_stock_required')
    }
    if (formData.sizes.length === 0) {
      newErrors.sizes = t('product_sizes_required')
    }
    if (formData.colors.length === 0) {
      newErrors.colors = t('product_colors_required')
    }
    if (formData.materials.length === 0) {
      newErrors.materials = t('product_materials_required')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    
    try {
      const productData: ProductFormData = {
        name: formData.name,
        nameAr: formData.nameAr || undefined,
        description: formData.description,
        descriptionAr: formData.descriptionAr || undefined,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        category: formData.category,
        sizes: formData.sizes,
        colors: formData.colors,
        materials: formData.materials,
        inStock: formData.inStock,
        isNew: formData.isNew,
        isFeatured: formData.isFeatured,
        stock: Number(formData.stock),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        images: imageFiles
      }

      console.log('Updating product with data:', productData)

      // Update product in Firebase
      await updateProduct(productId, productData)
      console.log('Product updated successfully')

      // Redirect to products list
      router.push('/admin/products')
    } catch (error: any) {
      console.error('Error updating product:', error)
      
      // More specific error messages
      let errorMessage = 'Failed to update product. Please try again.'
      
      if (error.code === 'storage/unauthorized') {
        errorMessage = 'Storage access denied. Please check Firebase Storage rules.'
      } else if (error.code === 'storage/quota-exceeded') {
        errorMessage = 'Storage quota exceeded. Please contact administrator.'
      } else if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please make sure you are logged in as admin.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setErrors({ general: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('edit_product')}</h1>
          <p className="text-gray-600 mt-2">{t('edit_product_subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('back_to_products')}
            </Button>
          </Link>
          <Button 
            type="submit" 
            form="product-form"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? t('updating') : t('update_product')}
          </Button>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Error Display */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {errors.general}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t('basic_information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('product_name')} *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder={t('product_name_placeholder')}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('product_name_ar')}
                    </label>
                    <Input
                      value={formData.nameAr}
                      onChange={(e) => handleInputChange('nameAr', e.target.value)}
                      placeholder={t('product_name_ar_placeholder')}
                      className={errors.nameAr ? 'border-red-500' : ''}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('product_description')} *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder={t('product_description_placeholder')}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('product_description_ar')}
                  </label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
                    placeholder={t('product_description_ar_placeholder')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>{t('pricing')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('price')} *
                    </label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0"
                      className={errors.price ? 'border-red-500' : ''}
                    />
                    {errors.price && (
                      <p className="text-sm text-red-600 mt-1">{errors.price}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('original_price')}
                    </label>
                    <Input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>{t('product_details')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('category')} *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value as 'borka' | 'abaya' | 'hijab')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('stock_quantity')} *
                    </label>
                    <Input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      placeholder="0"
                      className={errors.stock ? 'border-red-500' : ''}
                    />
                    {errors.stock && (
                      <p className="text-sm text-red-600 mt-1">{errors.stock}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('tags')}
                    </label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      placeholder={t('tags_placeholder')}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => handleInputChange('inStock', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">{t('in_stock')}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => handleInputChange('isNew', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">{t('is_new')}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">{t('is_featured')}</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Sizes, Colors, Materials */}
            <Card>
              <CardHeader>
                <CardTitle>{t('product_variants')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('available_sizes')} *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors uppercase ${
                          formData.sizes.includes(size)
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-500'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {errors.sizes && (
                    <p className="text-sm text-red-600 mt-1">{errors.sizes}</p>
                  )}
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('available_colors')} *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorToggle(color)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors capitalize ${
                          formData.colors.includes(color)
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-500'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                  {errors.colors && (
                    <p className="text-sm text-red-600 mt-1">{errors.colors}</p>
                  )}
                </div>

                {/* Materials */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('materials')} *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableMaterials.map(material => (
                      <button
                        key={material}
                        type="button"
                        onClick={() => handleMaterialToggle(material)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors capitalize ${
                          formData.materials.includes(material)
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-500'
                        }`}
                      >
                        {material}
                      </button>
                    ))}
                  </div>
                  {errors.materials && (
                    <p className="text-sm text-red-600 mt-1">{errors.materials}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>{t('product_images')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t('upload_images')}</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload-edit"
                  />
                  <label 
                    htmlFor="image-upload-edit"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm" 
                      className="cursor-pointer"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t('choose_files')}
                    </Button>
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="space-y-2">
                    {images.map(image => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
