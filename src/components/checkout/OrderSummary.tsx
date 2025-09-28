'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/useCartStore'
import { useLocale } from '@/i18n/LocaleProvider'

interface OrderSummaryProps {
  items: any[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  formatPrice: (price: number) => string
}

export function OrderSummary({ items, subtotal, shipping, tax, total, formatPrice }: OrderSummaryProps) {
  const { t } = useLocale()
  const { setQuantity, removeItem } = useCartStore()

  const handleQuantityChange = (itemKey: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemKey)
    } else {
      setQuantity(itemKey, newQuantity)
    }
  }

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>{t('order_summary')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.key} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={item.image || '/images/slide1-borka/model1.png'}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {item.size && (
                    <span>{t('size')}: {item.size.toUpperCase()}</span>
                  )}
                  {item.color && (
                    <span>{t('color')}: {item.color}</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-emerald-600">
                  {formatPrice(item.price)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(item.key, item.quantity - 1)}
                  className="w-8 h-8 p-0"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(item.key, item.quantity + 1)}
                  className="w-8 h-8 p-0"
                >
                  <Plus className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeItem(item.key)}
                  className="w-8 h-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Order Totals */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('subtotal')}</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('shipping')}</span>
              <span className="font-medium">
                {shipping === 0 ? (
                  <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                    {t('free')}
                  </Badge>
                ) : (
                  formatPrice(shipping)
                )}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('tax_vat')}</span>
              <span className="font-medium">{formatPrice(tax)}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900">{t('total')}</span>
                <span className="text-lg font-bold text-emerald-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promo Code */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('promo_code')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('enter_promo_code')}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <Button variant="outline" size="sm">
              {t('apply')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Badges */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            {t('ssl_secured')}
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            {t('encrypted')}
          </div>
        </div>
        <p className="text-xs text-gray-500">
          {t('secure_checkout_notice')}
        </p>
      </div>
    </div>
  )
}
