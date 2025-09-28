'use client'

import { CheckCircle, Package, Truck, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLocale } from '@/i18n/LocaleProvider'

interface OrderConfirmationProps {
  orderData: any
  onContinueShopping: () => void
}

export function OrderConfirmation({ orderData, onContinueShopping }: OrderConfirmationProps) {
  const { t, locale } = useLocale()

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

  const orderNumber = `JARA-${Date.now().toString().slice(-8)}`
  const estimatedDelivery = new Date()
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3)

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-emerald-900 mb-2">
            {t('order_confirmed')}
          </h1>
          <p className="text-emerald-700 mb-4">
            {t('order_confirmation_message')}
          </p>
          <div className="bg-white rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-600 mb-1">{t('order_number')}</p>
            <p className="text-lg font-bold text-gray-900">{orderNumber}</p>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            {t('order_details')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('payment_method')}</h3>
              <div className="flex items-center gap-2">
                {orderData?.paymentMethod === 'apple_pay' && (
                  <>
                    <div className="w-8 h-5 bg-black rounded flex items-center justify-center">
                      <span className="text-white text-xs">🍎</span>
                    </div>
                    <span>Apple Pay</span>
                  </>
                )}
                {orderData?.paymentMethod === 'credit_card' && (
                  <>
                    <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">💳</span>
                    </div>
                    <span>{t('credit_debit_card')}</span>
                  </>
                )}
                {orderData?.paymentMethod === 'bank_transfer' && (
                  <>
                    <div className="w-8 h-5 bg-green-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">🏦</span>
                    </div>
                    <span>{t('bank_transfer')}</span>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('order_status')}</h3>
              <Badge className="bg-emerald-100 text-emerald-700">
                {orderData?.status === 'completed' ? t('paid') : t('pending')}
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('estimated_delivery')}</h3>
            <div className="flex items-center gap-2 text-gray-600">
              <Truck className="w-4 h-4" />
              <span>
                {estimatedDelivery.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            {t('shipping_address')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="font-medium text-gray-900">
              {orderData?.firstName} {orderData?.lastName}
            </p>
            <p className="text-gray-600">{orderData?.address}</p>
            <p className="text-gray-600">
              {orderData?.city}, {orderData?.postalCode}
            </p>
            <p className="text-gray-600">{orderData?.country}</p>
            <div className="flex items-center gap-2 text-gray-600 mt-2">
              <Phone className="w-4 h-4" />
              <span>{orderData?.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{orderData?.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Transfer Details (if applicable) */}
      {orderData?.paymentMethod === 'bank_transfer' && orderData?.bankDetails && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">{t('bank_transfer_details')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">{t('account_name')}:</span>
                <p className="font-medium">{orderData.bankDetails.accountName}</p>
              </div>
              <div>
                <span className="text-gray-600">{t('account_number')}:</span>
                <p className="font-medium font-mono">{orderData.bankDetails.accountNumber}</p>
              </div>
              <div>
                <span className="text-gray-600">{t('bank_name')}:</span>
                <p className="font-medium">{orderData.bankDetails.bankName}</p>
              </div>
              <div>
                <span className="text-gray-600">{t('swift_code')}:</span>
                <p className="font-medium font-mono">{orderData.bankDetails.swiftCode}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 mt-4">
              <p className="text-sm text-gray-600 mb-2">{t('payment_instructions')}</p>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>{t('payment_step_1')}</li>
                <li>{t('payment_step_2')}</li>
                <li>{t('payment_step_3')}</li>
                <li>{t('payment_step_4')}</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>{t('what_happens_next')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-600 text-xs font-bold">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{t('order_processing')}</h3>
                <p className="text-sm text-gray-600">{t('order_processing_desc')}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-600 text-xs font-bold">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{t('shipping_preparation')}</h3>
                <p className="text-sm text-gray-600">{t('shipping_preparation_desc')}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-600 text-xs font-bold">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{t('tracking_info')}</h3>
                <p className="text-sm text-gray-600">{t('tracking_info_desc')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={onContinueShopping}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
        >
          {t('continue_shopping')}
        </Button>
        <Button 
          variant="outline"
          className="flex-1"
          onClick={() => window.print()}
        >
          {t('print_receipt')}
        </Button>
      </div>
    </div>
  )
}
