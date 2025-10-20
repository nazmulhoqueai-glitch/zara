'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Star, Heart, ShoppingBag, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLocale } from '@/i18n/LocaleProvider'
import { getFeaturedProducts, getNewProducts, Product } from '@/lib/products'
import Link from 'next/link'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLocale()

  // Load products from Firebase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const [newProducts, featured] = await Promise.all([
          getNewProducts(),
          getFeaturedProducts()
        ])
        setNewArrivals(newProducts)
        setFeaturedProducts(featured)
      } catch (error) {
        console.error('Error loading products:', error)
        // Keep empty arrays if Firebase fails
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const heroSlides = [
    {
      id: 1,
      title: t('hero_slide1_title'),
      subtitle: t('hero_slide1_subtitle'),
      image: '/Images/slide1-borka/model1.png',
      buttonText: t('shop_now'),
      buttonLink: '/products'
    },
    {
      id: 2,
      title: t('hero_slide2_title'),
      subtitle: t('hero_slide2_subtitle'),
      image: '/Images/slide2-abaya/model1.png',
      buttonText: t('explore_collection'),
      buttonLink: '/products'
    },
    {
      id: 3,
      title: t('hero_slide3_title'),
      subtitle: t('hero_slide3_subtitle'),
      image: '/Images/slide3-modest/model1.png',
      buttonText: t('discover_style'),
      buttonLink: '/products'
    },
    {
      id: 4,
      title: t('hero_slide4_title'),
      subtitle: t('hero_slide4_subtitle'),
      image: '/Images/slide4-ramadan/model1.png',
      buttonText: t('ramadan_collection'),
      buttonLink: '/products'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroSlides[currentSlide].image}
            alt={heroSlides[currentSlide].title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  {heroSlides[currentSlide].title}
                </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={heroSlides[currentSlide].buttonLink}>
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold">
                    {heroSlides[currentSlide].buttonText}
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg font-semibold">
                    {t('view_all_products')}
                </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-8 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute bottom-8 right-8 text-white/60 text-sm">
          {currentSlide + 1} / {heroSlides.length}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {/* Decorative Elements */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
              <div className="mx-4 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 relative">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
                {t('new_arrivals_title')}
              </span>
              {/* Floating decorative elements */}
              <div className="absolute -top-2 -left-4 w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute -top-1 -right-6 w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
              <div className="absolute -bottom-1 -left-6 w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
            </h2>
            
            {/* Animated underline */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full animate-pulse"></div>
            </div>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in">
              {t('new_arrivals_subtitle')}
            </p>
            
            {/* Bottom decorative elements */}
            <div className="flex items-center justify-center mt-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
              <div className="mx-3 w-2 h-2 bg-emerald-300 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
            </div>
          </div>
          
          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{t('loading')}...</p>
              </div>
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.slice(0, 8).map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <Link href={`/products/${product.id}`}>
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={300}
                          height={450}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="aspect-[2/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-4xl md:text-6xl">👗</div>
                </div>
                      )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-xl font-bold text-emerald-600">{product.price} {t('currency_sar')}</p>
              </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">{t('no_products_available')}</p>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Link href="/products">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold">
                {t('view_all_products')}
            </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {/* Decorative Elements */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
              <div className="mx-4 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 relative">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
                {t('featured_products_title')}
              </span>
              {/* Floating decorative elements */}
              <div className="absolute -top-2 -left-4 w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute -top-1 -right-6 w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
              <div className="absolute -bottom-1 -left-6 w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
            </h2>
            
            {/* Animated underline */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full animate-pulse"></div>
            </div>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in">
              {t('featured_products_subtitle')}
            </p>
            
            {/* Bottom decorative elements */}
            <div className="flex items-center justify-center mt-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
              <div className="mx-3 w-2 h-2 bg-emerald-300 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
            </div>
          </div>
          
          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{t('loading')}...</p>
              </div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <Link href={`/products/${product.id}`}>
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={300}
                          height={450}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="aspect-[2/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-4xl md:text-6xl">👗</div>
                </div>
                      )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-xl font-bold text-emerald-600">{product.price} {t('currency_sar')}</p>
              </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">{t('no_products_available')}</p>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Link href="/products">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold">
                {t('view_all_products')}
            </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose JARA Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('why_choose_title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('why_choose_subtitle')}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fast & Free Shipping */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                <div className="text-2xl">🚚</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('why_choose_fast_shipping_title')}
              </h3>
              <p className="text-gray-600">
                {t('why_choose_fast_shipping_desc')}
              </p>
            </div>

            {/* Modest & Comfortable */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                <div className="text-2xl">🛡️</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('why_choose_modest_comfortable_title')}
              </h3>
              <p className="text-gray-600">
                {t('why_choose_modest_comfortable_desc')}
              </p>
            </div>

            {/* Modern Design */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                <div className="text-2xl">⭐</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('why_choose_modern_design_title')}
              </h3>
              <p className="text-gray-600">
                {t('why_choose_modern_design_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('cta_title')}
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            {t('cta_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
            <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              <ShoppingBag className="w-5 h-5 mr-2" />
              {t('cta_start_shopping')}
            </Button>
            </Link>
            <Link href="/about">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg font-semibold">
                {t('cta_learn_more')}
            </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}