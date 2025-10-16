'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLocale } from '@/i18n/LocaleProvider'
import { Truck, Clock, Shield, RefreshCw, MapPin, CreditCard, Package, CheckCircle } from 'lucide-react'

export default function ShippingPage() {
  const { t, locale } = useLocale()

  const shippingMethods = [
    {
      icon: Truck,
      title: t('shipping_standard_title'),
      description: t('shipping_standard_description'),
      duration: t('shipping_standard_duration'),
      price: t('shipping_standard_price'),
      features: [
        t('shipping_standard_feature_1'),
        t('shipping_standard_feature_2'),
        t('shipping_standard_feature_3')
      ]
    },
    {
      icon: Clock,
      title: t('shipping_express_title'),
      description: t('shipping_express_description'),
      duration: t('shipping_express_duration'),
      price: t('shipping_express_price'),
      features: [
        t('shipping_express_feature_1'),
        t('shipping_express_feature_2'),
        t('shipping_express_feature_3')
      ]
    },
    {
      icon: Package,
      title: t('shipping_same_day_title'),
      description: t('shipping_same_day_description'),
      duration: t('shipping_same_day_duration'),
      price: t('shipping_same_day_price'),
      features: [
        t('shipping_same_day_feature_1'),
        t('shipping_same_day_feature_2'),
        t('shipping_same_day_feature_3')
      ]
    }
  ]

  const shippingInfo = [
    {
      icon: MapPin,
      title: t('shipping_coverage_title'),
      description: t('shipping_coverage_description'),
      details: [
        t('shipping_coverage_detail_1'),
        t('shipping_coverage_detail_2'),
        t('shipping_coverage_detail_3')
      ]
    },
    {
      icon: Shield,
      title: t('shipping_protection_title'),
      description: t('shipping_protection_description'),
      details: [
        t('shipping_protection_detail_1'),
        t('shipping_protection_detail_2'),
        t('shipping_protection_detail_3')
      ]
    },
    {
      icon: RefreshCw,
      title: t('shipping_returns_title'),
      description: t('shipping_returns_description'),
      details: [
        t('shipping_returns_detail_1'),
        t('shipping_returns_detail_2'),
        t('shipping_returns_detail_3')
      ]
    }
  ]

  const trackingSteps = [
    { step: 1, title: t('shipping_step_1'), description: t('shipping_step_1_desc') },
    { step: 2, title: t('shipping_step_2'), description: t('shipping_step_2_desc') },
    { step: 3, title: t('shipping_step_3'), description: t('shipping_step_3_desc') },
    { step: 4, title: t('shipping_step_4'), description: t('shipping_step_4_desc') },
    { step: 5, title: t('shipping_step_5'), description: t('shipping_step_5_desc') }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('shipping_title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('shipping_subtitle')}
          </p>
        </div>

        {/* Shipping Methods */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('shipping_methods_title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('shipping_methods_subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shippingMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <CardTitle className="text-xl">{method.title}</CardTitle>
                    <p className="text-gray-600">{method.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-2xl font-bold text-emerald-600 mb-2">
                        {method.price}
                      </div>
                      <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                        {method.duration}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {method.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Shipping Information */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('shipping_info_title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('shipping_info_subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shippingInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {info.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {info.description}
                      </p>
                      <div className="space-y-2">
                        {info.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Tracking Process */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                {t('shipping_tracking_title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {trackingSteps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                      {step.step}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notes */}
        <div className="mb-16">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    {t('shipping_important_title')}
                  </h3>
                  <div className="space-y-2 text-blue-800">
                    <p>{t('shipping_important_note_1')}</p>
                    <p>{t('shipping_important_note_2')}</p>
                    <p>{t('shipping_important_note_3')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {t('shipping_faq_title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    question: t('shipping_faq_1_q'),
                    answer: t('shipping_faq_1_a')
                  },
                  {
                    question: t('shipping_faq_2_q'),
                    answer: t('shipping_faq_2_a')
                  },
                  {
                    question: t('shipping_faq_3_q'),
                    answer: t('shipping_faq_3_a')
                  },
                  {
                    question: t('shipping_faq_4_q'),
                    answer: t('shipping_faq_4_a')
                  }
                ].map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-semibold text-gray-900">
                      {faq.question}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
