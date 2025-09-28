'use client'

import { useState } from 'react'
import { CreditCard, Smartphone, Shield, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLocale } from '@/i18n/LocaleProvider'

interface PaymentMethodProps {
  onComplete: (data: any) => void
  orderData: any
  total: number
}

type PaymentType = 'apple_pay' | 'credit_card' | 'bank_transfer'

export function PaymentMethod({ onComplete, orderData, total }: PaymentMethodProps) {
  const { t, locale } = useLocale()
  const [paymentType, setPaymentType] = useState<PaymentType>('apple_pay')
  const [processing, setProcessing] = useState(false)
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })

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

  const handleApplePay = async () => {
    setProcessing(true)
    
    // Simulate Apple Pay processing
    try {
      // In a real app, you would integrate with Apple Pay API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      onComplete({
        paymentMethod: 'apple_pay',
        paymentId: `ap_${Date.now()}`,
        status: 'completed'
      })
    } catch (error) {
      console.error('Apple Pay error:', error)
      setProcessing(false)
    }
  }

  const handleCreditCard = async () => {
    setProcessing(true)
    
    // Simulate credit card processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      onComplete({
        paymentMethod: 'credit_card',
        paymentId: `cc_${Date.now()}`,
        status: 'completed',
        cardData
      })
    } catch (error) {
      console.error('Credit card error:', error)
      setProcessing(false)
    }
  }

  const handleBankTransfer = async () => {
    setProcessing(true)
    
    // Simulate bank transfer processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      onComplete({
        paymentMethod: 'bank_transfer',
        paymentId: `bt_${Date.now()}`,
        status: 'pending',
        bankDetails: {
          accountName: 'JARA Fashion Store',
          accountNumber: 'SA1234567890123456789012',
          bankName: 'Al Rajhi Bank',
          swiftCode: 'RJHISARI'
        }
      })
    } catch (error) {
      console.error('Bank transfer error:', error)
      setProcessing(false)
    }
  }

  const handlePayment = () => {
    switch (paymentType) {
      case 'apple_pay':
        handleApplePay()
        break
      case 'credit_card':
        handleCreditCard()
        break
      case 'bank_transfer':
        handleBankTransfer()
        break
    }
  }

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(.{2})/, '$1/').trim()
  }

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            {t('payment_method')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Apple Pay */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-black rounded flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Apple Pay</h3>
                  <p className="text-sm text-gray-600">{t('apple_pay_description')}</p>
                </div>
              </div>
              <input
                type="radio"
                name="payment"
                checked={paymentType === 'apple_pay'}
                onChange={() => setPaymentType('apple_pay')}
                className="text-emerald-600 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Credit Card */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{t('credit_debit_card')}</h3>
                  <p className="text-sm text-gray-600">{t('card_description')}</p>
                </div>
              </div>
              <input
                type="radio"
                name="payment"
                checked={paymentType === 'credit_card'}
                onChange={() => setPaymentType('credit_card')}
                className="text-emerald-600 focus:ring-emerald-500"
              />
            </div>

            {paymentType === 'credit_card' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">{t('card_number')}</Label>
                  <Input
                    id="cardNumber"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData(prev => ({ 
                      ...prev, 
                      cardNumber: formatCardNumber(e.target.value) 
                    }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">{t('expiry_date')}</Label>
                    <Input
                      id="expiryDate"
                      value={cardData.expiryDate}
                      onChange={(e) => setCardData(prev => ({ 
                        ...prev, 
                        expiryDate: formatExpiryDate(e.target.value) 
                      }))}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">{t('cvv')}</Label>
                    <Input
                      id="cvv"
                      value={cardData.cvv}
                      onChange={(e) => setCardData(prev => ({ 
                        ...prev, 
                        cvv: e.target.value.replace(/\D/g, '') 
                      }))}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardName">{t('cardholder_name')}</Label>
                  <Input
                    id="cardName"
                    value={cardData.cardName}
                    onChange={(e) => setCardData(prev => ({ 
                      ...prev, 
                      cardName: e.target.value 
                    }))}
                    placeholder={t('enter_cardholder_name')}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bank Transfer */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">BT</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('bank_transfer')}</h3>
                  <p className="text-sm text-gray-600">{t('bank_transfer_description')}</p>
                </div>
              </div>
              <input
                type="radio"
                name="payment"
                checked={paymentType === 'bank_transfer'}
                onChange={() => setPaymentType('bank_transfer')}
                className="text-emerald-600 focus:ring-emerald-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-emerald-900 mb-1">{t('secure_payment')}</h3>
              <p className="text-sm text-emerald-700">
                {t('payment_security_notice')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          disabled={processing}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('back')}
        </Button>
        
        <Button 
          onClick={handlePayment} 
          size="lg" 
          className="bg-emerald-600 hover:bg-emerald-700"
          disabled={processing}
        >
          {processing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {t('processing')}...
            </div>
          ) : (
            `${t('pay_now')} ${formatPrice(total)}`
          )}
        </Button>
      </div>
    </div>
  )
}
