'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { createProduct, ProductFormData } from '@/lib/products'

interface ProductImage {
  id: string
  url: string
  alt: string
}

export default function NewProductPage() {
  const { t, locale } = useLocale()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    price: '',
    originalPrice: '',
    category: 'borka',
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

    if (!formData.price.trim()) {
      newErrors.price = t('product_price_required')
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = t('product_price_invalid')
    }

    if (!formData.description.trim()) {
      newErrors.description = t('product_description_required')
    }

    if (formData.sizes.length === 0) {
      newErrors.sizes = t('at_least_one_size_required')
    }

    if (formData.colors.length === 0) {
      newErrors.colors = t('at_least_one_color_required')
    }

    if (formData.materials.length === 0) {
      newErrors.materials = t('at_least_one_material_required')
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
        category: formData.category as 'borka' | 'abaya' | 'hijab',
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

      console.log('Creating product with data:', productData)
      console.log('Image files:', imageFiles)

      // Save to Firebase
      const productId = await createProduct(productData)
      console.log('Product created with ID:', productId)

      // Redirect to products list
      router.push('/admin/products')
    } catch (error: any) {
      console.error('Error saving product:', error)
      
      // More specific error messages
      let errorMessage = 'Failed to create product. Please try again.'
      
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('back_to_products')}
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('add_new_product')}</h1>
            <p className="text-gray-600 mt-2">{t('add_new_product_subtitle')}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products">
            <Button variant="outline">
              <X className="w-4 h-4 mr-2" />
              {t('cancel')}
            </Button>
          </Link>
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? t('saving') : t('save_product')}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('product_name_en')} *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder={t('enter_product_name_en')}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('product_name_ar')}
                    </label>
                    <Input
                      value={formData.nameAr}
                      onChange={(e) => handleInputChange('nameAr', e.target.value)}
                      placeholder={t('enter_product_name_ar')}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('product_description_en')} *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder={t('enter_product_description_en')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('product_description_ar')}
                  </label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
                    placeholder={t('enter_product_description_ar')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    rows={4}
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('product_tags')}
                  </label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder={t('enter_tags_separated_by_commas')}
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('tags_help_text')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>{t('pricing_information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('price')} (SAR) *
                    </label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="299"
                      className={errors.price ? 'border-red-500' : ''}
                    />
                    {errors.price && (
                      <p className="text-sm text-red-600 mt-1">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('original_price')} (SAR)
                    </label>
                    <Input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                      placeholder="399"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('original_price_help')}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('stock_quantity')}
                  </label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    placeholder="100"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product Options */}
            <Card>
              <CardHeader>
                <CardTitle>{t('product_options')}</CardTitle>
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
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          formData.sizes.includes(size)
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-500'
                        }`}
                      >
                        {size.toUpperCase()}
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">{t('upload_images')}</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <button 
                    type="button"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('choose_files')}
                  </button>
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

            {/* Category & Status */}
            <Card>
              <CardHeader>
                <CardTitle>{t('category_status')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('category')}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => handleInputChange('inStock', e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{t('in_stock')}</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => handleInputChange('isNew', e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{t('mark_as_new')}</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{t('mark_as_featured')}</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
