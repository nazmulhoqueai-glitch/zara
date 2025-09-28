'use client'

import { useState } from 'react'
import { Filter, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { ProductFilter } from '@/types/product'
import { PRODUCT_CATEGORIES, PRODUCT_SIZES, PRODUCT_COLORS, PRODUCT_MATERIALS } from '@/types/product'
import { useLocale } from '@/i18n/LocaleProvider'

interface ProductFiltersProps {
  filters: ProductFilter
  onFiltersChange: (filters: ProductFilter) => void
  totalProducts: number
  filteredProducts: number
}

export function ProductFilters({ filters, onFiltersChange, totalProducts, filteredProducts }: ProductFiltersProps) {
  const { t } = useLocale()
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    size: true,
    color: true,
    material: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? undefined : category
    })
  }

  const handleSizeChange = (size: string) => {
    const newSizes = filters.sizes?.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...(filters.sizes || []), size]
    
    onFiltersChange({
      ...filters,
      sizes: newSizes.length > 0 ? newSizes : undefined
    })
  }

  const handleColorChange = (color: string) => {
    const newColors = filters.colors?.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...(filters.colors || []), color]
    
    onFiltersChange({
      ...filters,
      colors: newColors.length > 0 ? newColors : undefined
    })
  }

  const handleMaterialChange = (material: string) => {
    const newMaterials = filters.materials?.includes(material)
      ? filters.materials.filter(m => m !== material)
      : [...(filters.materials || []), material]
    
    onFiltersChange({
      ...filters,
      materials: newMaterials.length > 0 ? newMaterials : undefined
    })
  }

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: {
        min: value[0],
        max: value[1]
      }
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.category) count++
    if (filters.sizes?.length) count++
    if (filters.colors?.length) count++
    if (filters.materials?.length) count++
    if (filters.priceRange) count++
    if (filters.inStock) count++
    if (filters.isNew) count++
    if (filters.isFeatured) count++
    return count
  }

  const getCategoryLabel = (value: string) => {
    const categoryMap: { [key: string]: string } = {
      'borka': t('category_borka'),
      'abaya': t('category_abaya'),
      'hijab': t('category_hijab'),
      'accessories': t('category_accessories'),
    }
    return categoryMap[value] || value
  }

  const getColorLabel = (value: string) => {
    const colorMap: { [key: string]: string } = {
      'black': t('color_black'),
      'white': t('color_white'),
      'navy': t('color_navy'),
      'brown': t('color_brown'),
      'gray': t('color_gray'),
      'beige': t('color_beige'),
      'purple': t('color_purple'),
      'blue': t('color_blue'),
      'green': t('color_green'),
      'red': t('color_red'),
      'pink': t('color_pink'),
      'yellow': t('color_yellow'),
    }
    return colorMap[value] || value
  }

  const getMaterialLabel = (value: string) => {
    const materialMap: { [key: string]: string } = {
      'cotton': t('material_cotton'),
      'polyester': t('material_polyester'),
      'silk': t('material_silk'),
      'linen': t('material_linen'),
      'wool': t('material_wool'),
      'viscose': t('material_viscose'),
      'chiffon': t('material_chiffon'),
      'crepe': t('material_crepe'),
      'jersey': t('material_jersey'),
      'georgette': t('material_georgette'),
    }
    return materialMap[value] || value
  }

  const FilterSection = ({ title, children, sectionKey }: { title: string, children: React.ReactNode, sectionKey: keyof typeof expandedSections }) => (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
      >
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections[sectionKey] ? 'rotate-180' : ''}`} />
      </button>
      {expandedSections[sectionKey] && (
        <div className="space-y-3">
          {children}
        </div>
      )}
    </div>
  )

  const FilterContent = (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {t('showing_results').replace('{filtered}', filteredProducts.toString()).replace('{total}', totalProducts.toString())}
        </div>
        {getActiveFiltersCount() > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs"
          >
            {t('clear_all_filters')} ({getActiveFiltersCount()})
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <FilterSection title={t('filter_category')} sectionKey="category">
        <div className="space-y-2">
          {PRODUCT_CATEGORIES.map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.value}`}
                checked={filters.category === category.value}
                onCheckedChange={() => handleCategoryChange(category.value)}
              />
              <label
                htmlFor={`category-${category.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {getCategoryLabel(category.value)}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection title={t('filter_price_range')} sectionKey="price">
        <div className="space-y-4">
          <Slider
            value={[filters.priceRange?.min || 0, filters.priceRange?.max || 1000]}
            onValueChange={handlePriceChange}
            max={1000}
            min={0}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>0 SAR</span>
            <span>1000+ SAR</span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span>{filters.priceRange?.min || 0} SAR</span>
            <span>{filters.priceRange?.max || 1000} SAR</span>
          </div>
        </div>
      </FilterSection>

      {/* Size Filter */}
      <FilterSection title={t('filter_size')} sectionKey="size">
        <div className="grid grid-cols-2 gap-2">
          {PRODUCT_SIZES.map((size) => (
            <div key={size.value} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size.value}`}
                checked={filters.sizes?.includes(size.value) || false}
                onCheckedChange={() => handleSizeChange(size.value)}
              />
              <label
                htmlFor={`size-${size.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {size.label}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Color Filter */}
      <FilterSection title={t('filter_color')} sectionKey="color">
        <div className="space-y-2">
          {PRODUCT_COLORS.map((color) => (
            <div key={color.value} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color.value}`}
                checked={filters.colors?.includes(color.value) || false}
                onCheckedChange={() => handleColorChange(color.value)}
              />
              <div
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.color }}
                title={color.label}
              />
              <label
                htmlFor={`color-${color.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {getColorLabel(color.value)}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Material Filter */}
      <FilterSection title={t('filter_material')} sectionKey="material">
        <div className="space-y-2">
          {PRODUCT_MATERIALS.map((material) => (
            <div key={material.value} className="flex items-center space-x-2">
              <Checkbox
                id={`material-${material.value}`}
                checked={filters.materials?.includes(material.value) || false}
                onCheckedChange={() => handleMaterialChange(material.value)}
              />
              <label
                htmlFor={`material-${material.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {getMaterialLabel(material.value)}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Additional Filters */}
      <FilterSection title={t('filter_additional')} sectionKey="category">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStock || false}
              onCheckedChange={(checked) => onFiltersChange({ ...filters, inStock: checked as boolean })}
            />
            <label htmlFor="in-stock" className="text-sm font-medium cursor-pointer">
              {t('in_stock_only')}
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="new-arrivals"
              checked={filters.isNew || false}
              onCheckedChange={(checked) => onFiltersChange({ ...filters, isNew: checked as boolean })}
            />
            <label htmlFor="new-arrivals" className="text-sm font-medium cursor-pointer">
              {t('new_arrivals')}
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={filters.isFeatured || false}
              onCheckedChange={(checked) => onFiltersChange({ ...filters, isFeatured: checked as boolean })}
            />
            <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
              {t('featured_products')}
            </label>
          </div>
        </div>
      </FilterSection>
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsMobileFiltersOpen(true)}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            {t('filters')}
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              {t('filters')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {FilterContent}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileFiltersOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {FilterContent}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
