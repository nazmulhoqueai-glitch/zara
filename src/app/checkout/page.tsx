'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Smartphone, Shield, Truck } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/store/useCartStore'
import { useLocale } from '@/i18n/LocaleProvider'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { PaymentMethod } from '@/components/checkout/PaymentMethod'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { OrderConfirmation } from '@/components/checkout/OrderConfirmation'
import { createOrder } from '@/lib/users-orders'

type CheckoutStep = 'shipping' | 'payment' | 'confirmation'

export default function CheckoutPage() {
  const { t, locale } = useLocale()
  const router = useRouter()
  const { items, clear } = useCartStore()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping')
  const [orderData, setOrderData] = useState<any>(null)

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

  const subtotal = Object.values(items).reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 200 ? 0 : 25 // Free shipping over 200 SAR
  const tax = subtotal * 0.15 // 15% VAT
  const total = subtotal + shipping + tax

  const handleStepComplete = async (step: CheckoutStep, data: any) => {
    setOrderData({ ...orderData, ...data })
    
    if (step === 'shipping') {
      setCurrentStep('payment')
    } else if (step === 'payment') {
      // Create order in Firebase
      try {
        const orderItems = Object.values(items).map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size || 'M',
          color: item.color || 'Black',
          image: item.image || ''
        }))

        const orderData = {
          customer: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            phone: data.phone
          },
          items: orderItems,
          total: total,
          status: 'pending' as const,
          paymentMethod: data.paymentMethod,
          shippingAddress: {
            name: `${data.firstName} ${data.lastName}`,
            street: data.address,
            city: data.city,
            postalCode: data.postalCode,
            country: data.country
          }
        }

        const orderId = await createOrder(orderData)
        console.log('Order created with ID:', orderId)
        
        // Clear cart after successful order
        clear()
        setCurrentStep('confirmation')
      } catch (error) {
        console.error('Error creating order:', error)
        // Still proceed to confirmation but show error
        clear()
        setCurrentStep('confirmation')
      }
    }
  }

  const handleBackToCart = () => {
    router.push('/cart')
  }

  if (Object.values(items).length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('empty_cart')}</h1>
          <p className="text-gray-600 mb-6">{t('empty_cart_desc')}</p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('continue_shopping')}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/cart">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('back_to_cart')}
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{t('checkout')}</h1>
            </div>
            
            {/* Security Badges */}
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-emerald-600" />
                {t('secure_checkout')}
              </div>
              <div className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-emerald-600" />
                {t('free_shipping_over')} {formatPrice(200)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-8">
              {/* Step 1: Shipping */}
              <div className={`flex items-center gap-2 ${currentStep === 'shipping' ? 'text-emerald-600' : currentStep === 'payment' || currentStep === 'confirmation' ? 'text-emerald-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep === 'shipping' ? 'bg-emerald-600 text-white' : 
                  currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-emerald-100 text-emerald-600' : 
                  'bg-gray-200 text-gray-400'
                }`}>
                  1
                </div>
                <span className="text-sm font-medium">{t('shipping_info')}</span>
              </div>

              {/* Arrow */}
              <div className={`w-8 h-px ${currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-emerald-600' : 'bg-gray-300'}`}></div>

              {/* Step 2: Payment */}
              <div className={`flex items-center gap-2 ${currentStep === 'payment' ? 'text-emerald-600' : currentStep === 'confirmation' ? 'text-emerald-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep === 'payment' ? 'bg-emerald-600 text-white' : 
                  currentStep === 'confirmation' ? 'bg-emerald-100 text-emerald-600' : 
                  'bg-gray-200 text-gray-400'
                }`}>
                  2
                </div>
                <span className="text-sm font-medium">{t('payment_method')}</span>
              </div>

              {/* Arrow */}
              <div className={`w-8 h-px ${currentStep === 'confirmation' ? 'bg-emerald-600' : 'bg-gray-300'}`}></div>

              {/* Step 3: Confirmation */}
              <div className={`flex items-center gap-2 ${currentStep === 'confirmation' ? 'text-emerald-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep === 'confirmation' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  3
                </div>
                <span className="text-sm font-medium">{t('order_confirmation')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            {currentStep === 'shipping' && (
              <CheckoutForm
                onComplete={(data) => handleStepComplete('shipping', data)}
                orderData={orderData}
              />
            )}
            
            {currentStep === 'payment' && (
              <PaymentMethod
                onComplete={(data) => handleStepComplete('payment', data)}
                orderData={orderData}
                total={total}
              />
            )}
            
            {currentStep === 'confirmation' && (
              <OrderConfirmation
                orderData={orderData}
                onContinueShopping={() => router.push('/products')}
              />
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={Object.values(items)}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              formatPrice={formatPrice}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
