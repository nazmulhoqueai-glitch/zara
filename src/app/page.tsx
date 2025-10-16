'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Star, Heart, ShoppingBag, Truck, Shield, Award, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useLocale } from '@/i18n/LocaleProvider'
import { getFeaturedProducts, getNewProducts, Product } from '@/lib/products'

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
      description: t('hero_slide1_description'),
      bgPattern: "from-purple-900 via-indigo-900 to-blue-900",
      textColor: "text-white",
      buttonColor: "bg-white text-gray-900 hover:bg-gray-100",
      images: [
        "/Images/slide1-borka/model1.png",
        "/Images/slide1-borka/model2.png",
        "/Images/slide1-borka/model3.png"
      ]
    },
    {
      id: 2,
      title: t('hero_slide2_title'),
      subtitle: t('hero_slide2_subtitle'),
      description: t('hero_slide2_description'),
      bgPattern: "from-emerald-900 via-teal-900 to-cyan-900",
      textColor: "text-white",
      buttonColor: "bg-white text-gray-900 hover:bg-gray-100",
      images: [
        "/Images/slide2-abaya/model1.png",
        "/Images/slide2-abaya/model2.png",
        "/Images/slide2-abaya/model3.png"
      ]
    },
    {
      id: 3,
      title: t('hero_slide3_title'),
      subtitle: t('hero_slide3_subtitle'),
      description: t('hero_slide3_description'),
      bgPattern: "from-rose-900 via-pink-900 to-red-900",
      textColor: "text-white",
      buttonColor: "bg-white text-gray-900 hover:bg-gray-100",
      images: [
        "/Images/slide3-modest/model1.png",
        "/Images/slide3-modest/model2.png",
        "/Images/slide3-modest/model3.png"
      ]
    },
    {
      id: 4,
      title: t('hero_slide4_title'),
      subtitle: t('hero_slide4_subtitle'),
      description: t('hero_slide4_description'),
      bgPattern: "from-amber-900 via-orange-900 to-yellow-900",
      textColor: "text-white",
      buttonColor: "bg-white text-gray-900 hover:bg-gray-100",
      images: [
        "/Images/slide4-ramadan/model1.png",
        "/Images/slide4-ramadan/model2.png",
        "/Images/slide4-ramadan/model3.png"
      ]
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [heroSlides.length])

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative h-screen overflow-hidden">
        {/* Dark Background with Islamic Patterns */}
        <div className={`absolute inset-0 bg-gradient-to-br ${heroSlides[currentSlide].bgPattern}`}>
          {/* Islamic Geometric Patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-64 h-64 border-2 border-white/20 rounded-full"></div>
            <div className="absolute top-40 right-40 w-48 h-48 border-2 border-white/20 rounded-full"></div>
            <div className="absolute bottom-40 left-40 w-72 h-72 border-2 border-white/20 rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-56 h-56 border-2 border-white/20 rounded-full"></div>
            
            {/* Additional geometric elements */}
            <div className="absolute top-1/2 left-1/4 w-32 h-32 border border-white/10 rotate-45"></div>
            <div className="absolute top-1/3 right-1/3 w-24 h-24 border border-white/10 rotate-12"></div>
            <div className="absolute bottom-1/3 left-1/3 w-40 h-40 border border-white/10 -rotate-12"></div>
          </div>
          
          {/* Ornate Pillars/Architecture */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black/20 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-12 items-center">
              {/* Left Side - Text Content */}
              <div className="text-left pt-4 pb-4 sm:pt-6 sm:pb-6 lg:pt-0 lg:pb-0">
                <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold ${heroSlides[currentSlide].textColor} mb-3 sm:mb-4 lg:mb-6 leading-tight`}>
                  {heroSlides[currentSlide].title}
                </h1>
                
                <p className={`text-sm sm:text-base md:text-lg lg:text-xl ${heroSlides[currentSlide].textColor} mb-4 sm:mb-6 lg:mb-8 opacity-90 leading-relaxed`}>
                  {heroSlides[currentSlide].description}
                </p>
                
                <Button 
                  size="lg" 
                  className={`${heroSlides[currentSlide].buttonColor} px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm md:text-base lg:text-lg font-semibold group`}
                >
                  {heroSlides[currentSlide].subtitle}
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Right Side - Models/Products */}
              <div className="relative">
                <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 h-64 sm:h-80 lg:h-96">
                  {/* Model 1 */}
                  <div className="flex flex-col items-center justify-end">
                    <div className="w-20 sm:w-24 lg:w-32 h-48 sm:h-64 lg:h-80 rounded-t-lg relative overflow-hidden shadow-2xl border-2 sm:border-4 border-white/30 hover:border-white/50 transition-all duration-300">
          <Image
                        src={heroSlides[currentSlide].images[0]}
                        alt={`${heroSlides[currentSlide].title} Model 1`}
                        fill
                        className="object-cover object-top"
                        sizes="128px"
                        priority={currentSlide === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </div>
                  
                  {/* Model 2 */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 sm:w-24 lg:w-32 h-48 sm:h-64 lg:h-80 rounded-t-lg relative overflow-hidden shadow-2xl border-2 sm:border-4 border-white/30 hover:border-white/50 transition-all duration-300">
          <Image
                        src={heroSlides[currentSlide].images[1]}
                        alt={`${heroSlides[currentSlide].title} Model 2`}
                        fill
                        className="object-cover object-top"
                        sizes="128px"
                        priority={currentSlide === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </div>
                  
                  {/* Model 3 */}
                  <div className="flex flex-col items-center justify-end">
                    <div className="w-20 sm:w-24 lg:w-32 h-48 sm:h-64 lg:h-80 rounded-t-lg relative overflow-hidden shadow-2xl border-2 sm:border-4 border-white/30 hover:border-white/50 transition-all duration-300">
          <Image
                        src={heroSlides[currentSlide].images[2]}
                        alt={`${heroSlides[currentSlide].title} Model 3`}
                        fill
                        className="object-cover object-top"
                        sizes="128px"
                        priority={currentSlide === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </div>
                </div>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Product 1 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <div className="text-4xl md:text-6xl">👗</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('product_elegant_purple')}</h3>
                <p className="text-xl font-bold text-emerald-600">299 {t('currency_sar')}</p>
              </div>
            </div>

            {/* Product 2 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <div className="text-4xl md:text-6xl">✨</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('product_classic_black')}</h3>
                <p className="text-xl font-bold text-emerald-600">349 {t('currency_sar')}</p>
              </div>
            </div>

            {/* Product 3 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                  <div className="text-6xl">🌙</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('product_ramadan_special')}</h3>
                <p className="text-xl font-bold text-emerald-600">399 {t('currency_sar')}</p>
              </div>
            </div>

            {/* Product 4 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                  <div className="text-6xl">💎</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('product_premium_pink_hijab')}</h3>
                <p className="text-xl font-bold text-emerald-600">199 {t('currency_sar')}</p>
              </div>
            </div>

            {/* Product 5 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                  <div className="text-6xl">🦋</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('product_modern_teal')}</h3>
                <p className="text-xl font-bold text-emerald-600">279 {t('currency_sar')}</p>
              </div>
            </div>

            {/* Product 6 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <div className="text-6xl">🌟</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('product_golden_evening')}</h3>
                <p className="text-xl font-bold text-emerald-600">449 {t('currency_sar')}</p>
              </div>
            </div>

            {/* Product 7 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                  <div className="text-6xl">🌸</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('product_floral_indigo')}</h3>
                <p className="text-xl font-bold text-emerald-600">329 {t('currency_sar')}</p>
              </div>
            </div>

            {/* Product 8 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center">
                  <div className="text-6xl">🌺</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('product_cyan_summer')}</h3>
                <p className="text-xl font-bold text-emerald-600">259 {t('currency_sar')}</p>
              </div>
            </div>

            {/* Product 9 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center">
                  <div className="text-6xl">🦄</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Violet Luxury Borka</h3>
                <p className="text-xl font-bold text-emerald-600">379 SAR</p>
              </div>
            </div>

            {/* Product 10 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <div className="text-6xl">🌿</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mint Green Abaya</h3>
                <p className="text-xl font-bold text-emerald-600">289 SAR</p>
              </div>
            </div>

            {/* Product 11 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <div className="text-6xl">🍊</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Orange Sunset Borka</h3>
                <p className="text-xl font-bold text-emerald-600">319 SAR</p>
              </div>
            </div>

            {/* Product 12 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-lime-100 to-lime-200 flex items-center justify-center">
                  <div className="text-6xl">🌱</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lime Fresh Abaya</h3>
                <p className="text-xl font-bold text-emerald-600">269 SAR</p>
              </div>
            </div>
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold">
              {t('view_all_new_arrivals')}
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Collections Banner */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout: 2 rows */}
          <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6">
            
            {/* Row 1: Two small columns side by side on mobile */}
            <div className="flex flex-row gap-4 md:flex-col md:gap-6 md:col-span-1">
              
              {/* Small Column 1 - Left */}
              <div className="relative overflow-hidden rounded-xl shadow-2xl group cursor-pointer h-48 md:h-full flex-1">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
                  {/* Islamic Geometric Patterns */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 w-12 h-12 border-2 border-white/30 rounded-full"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-2 border-white/30 rounded-full"></div>
                  </div>
                  
                  {/* Ornate Pillars */}
                  <div className="absolute left-0 top-0 w-4 h-full bg-gradient-to-r from-black/30 to-transparent"></div>
                  <div className="absolute right-0 top-0 w-4 h-full bg-gradient-to-l from-black/30 to-transparent"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-4">
                  <div className="text-white text-right">
                    <h3 className="text-lg md:text-2xl font-bold mb-1">
                      {t('featured_collections_party_borka').split(' ')[0]}
                      <br />
                      <span className="text-yellow-400">{t('featured_collections_party_borka').split(' ')[1]}</span>
                    </h3>
                    <p className="text-sm md:text-lg text-yellow-400 font-semibold mb-2">
                      {t('featured_collections_embroidered_subtitle')}
                    </p>
                    <p className="text-xs md:text-sm text-white/90">
                      {t('featured_collections_party_borka_desc')}
                    </p>
                  </div>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>

              {/* Small Column 2 - Right */}
              <div className="relative overflow-hidden rounded-xl shadow-2xl group cursor-pointer h-48 md:h-full flex-1">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-pink-900 to-red-900">
                  {/* Islamic Geometric Patterns */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 w-12 h-12 border-2 border-white/30 rounded-full"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-2 border-white/30 rounded-full"></div>
                  </div>
                  
                  {/* Ornate Pillars */}
                  <div className="absolute left-0 top-0 w-4 h-full bg-gradient-to-r from-black/30 to-transparent"></div>
                  <div className="absolute right-0 top-0 w-4 h-full bg-gradient-to-l from-black/30 to-transparent"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-start p-4">
                  <div className="text-white text-right">
                    <h3 className="text-lg md:text-2xl font-bold mb-1">
                      {t('featured_collections_party_abaya').split(' ')[0]}
                      <br />
                      <span className="text-yellow-400">{t('featured_collections_party_abaya').split(' ')[1]}</span>
                    </h3>
                    <p className="text-xs md:text-sm text-white/90 mt-2">
                      {t('featured_collections_party_abaya_desc')}
                    </p>
                  </div>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>
            </div>

            {/* Row 2: Large column on mobile, spans 2 columns on desktop */}
            <div className="relative overflow-hidden rounded-xl shadow-2xl group cursor-pointer h-48 md:h-full md:col-span-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
                {/* Islamic Geometric Patterns */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white/30 rounded-full"></div>
                  <div className="absolute top-8 right-8 w-12 h-12 border-2 border-white/30 rounded-full"></div>
                  <div className="absolute bottom-8 left-8 w-20 h-20 border-2 border-white/30 rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-14 h-14 border-2 border-white/30 rounded-full"></div>
                </div>
                
                {/* Ornate Pillars */}
                <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-black/30 to-transparent"></div>
                <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-black/30 to-transparent"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 h-full flex items-center p-4 md:p-8">
                <div className="text-white">
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 leading-tight">
                    {t('featured_collections_embroidered_title').split(' ')[0]}
                    <br />
                    <span className="text-yellow-400">{t('featured_collections_embroidered_title').split(' ')[1]}</span>
                  </h2>
                  <p className="text-lg md:text-xl lg:text-2xl text-yellow-400 font-semibold mb-2 md:mb-6">
                    {t('featured_collections_embroidered_subtitle')}
                  </p>
                  <p className="text-sm md:text-lg text-white/90 max-w-md hidden md:block">
                    {t('featured_collections_embroidered_description')}
                  </p>
                </div>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Product 1 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <div className="text-4xl md:text-6xl">👑</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('product_royal_purple')}</h3>
                <p className="text-xl font-bold text-emerald-600">459 {t('currency_sar')}</p>
              </div>
            </div>

            {/* Product 2 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <div className="text-4xl md:text-6xl">💎</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('product_diamond_blue')}</h3>
                <p className="text-xl font-bold text-emerald-600">529 {t('currency_sar')}</p>
              </div>
            </div>

            {/* Product 3 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                  <div className="text-4xl md:text-6xl">🌿</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('product_emerald_luxury')}</h3>
                <p className="text-xl font-bold text-emerald-600">599 {t('currency_sar')}</p>
              </div>
            </div>

            {/* Product 4 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                  <div className="text-4xl md:text-6xl">🌹</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('product_rose_gold_hijab')}</h3>
                <p className="text-xl font-bold text-emerald-600">329 {t('currency_sar')}</p>
              </div>
            </div>

            {/* Product 5 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                  <div className="text-4xl md:text-6xl">🦋</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Teal Butterfly Abaya</h3>
                <p className="text-xl font-bold text-emerald-600">479 SAR</p>
              </div>
            </div>

            {/* Product 6 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <div className="text-4xl md:text-6xl">☀️</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Golden Sunset Borka</h3>
                <p className="text-xl font-bold text-emerald-600">549 SAR</p>
              </div>
            </div>

            {/* Product 7 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                  <div className="text-4xl md:text-6xl">🌌</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Midnight Galaxy Abaya</h3>
                <p className="text-xl font-bold text-emerald-600">679 SAR</p>
              </div>
            </div>

            {/* Product 8 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center">
                  <div className="text-4xl md:text-6xl">🌊</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ocean Wave Borka</h3>
                <p className="text-xl font-bold text-emerald-600">499 SAR</p>
              </div>
            </div>

            {/* Product 9 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center">
                  <div className="text-4xl md:text-6xl">🦄</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Violet Unicorn Abaya</h3>
                <p className="text-xl font-bold text-emerald-600">579 SAR</p>
              </div>
            </div>

            {/* Product 10 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <div className="text-4xl md:text-6xl">🤍</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pearl White Luxury</h3>
                <p className="text-xl font-bold text-emerald-600">429 SAR</p>
              </div>
            </div>

            {/* Product 11 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <div className="text-4xl md:text-6xl">🔥</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fire Orange Borka</h3>
                <p className="text-xl font-bold text-emerald-600">519 SAR</p>
              </div>
            </div>

            {/* Product 12 */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[2/3] bg-gradient-to-br from-lime-100 to-lime-200 flex items-center justify-center">
                  <div className="text-4xl md:text-6xl">🍃</div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fresh Lime Abaya</h3>
                <p className="text-xl font-bold text-emerald-600">469 SAR</p>
              </div>
            </div>
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold">
              {t('view_all_featured')}
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('testimonials_title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('testimonials_subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  &ldquo;{t('testimonial_1_text')}&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-emerald-600 font-semibold">A</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t('customer_1_name')}</h4>
                    <p className="text-gray-500 text-sm">Riyadh</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  &ldquo;{t('testimonial_2_text')}&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-teal-600 font-semibold">F</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t('customer_2_name')}</h4>
                    <p className="text-gray-500 text-sm">Jeddah</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  &ldquo;{t('testimonial_3_text')}&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-cyan-600 font-semibold">M</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t('customer_3_name')}</h4>
                    <p className="text-gray-500 text-sm">Dammam</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Premium Quality */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('why_choose_premium_quality_title')}
              </h3>
              <p className="text-gray-600">
                {t('why_choose_premium_quality_desc')}
              </p>
            </div>

            {/* Fast Shipping */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
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
            <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              <ShoppingBag className="w-5 h-5 mr-2" />
              {t('cta_start_shopping')}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg font-semibold">
              <Heart className="w-5 h-5 mr-2" />
              {t('cta_view_wishlist')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
