'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLocale } from '@/i18n/LocaleProvider'
import { HelpCircle, ShoppingBag, CreditCard, Truck, RefreshCw, Shield } from 'lucide-react'

export default function FAQPage() {
  const { t } = useLocale()

  const faqCategories = [
    {
      icon: ShoppingBag,
      title: t('faq_category_orders'),
      questions: [
        {
          question: t('faq_order_1_q'),
          answer: t('faq_order_1_a')
        },
        {
          question: t('faq_order_2_q'),
          answer: t('faq_order_2_a')
        },
        {
          question: t('faq_order_3_q'),
          answer: t('faq_order_3_a')
        },
        {
          question: t('faq_order_4_q'),
          answer: t('faq_order_4_a')
        }
      ]
    },
    {
      icon: CreditCard,
      title: t('faq_category_payment'),
      questions: [
        {
          question: t('faq_payment_1_q'),
          answer: t('faq_payment_1_a')
        },
        {
          question: t('faq_payment_2_q'),
          answer: t('faq_payment_2_a')
        },
        {
          question: t('faq_payment_3_q'),
          answer: t('faq_payment_3_a')
        },
        {
          question: t('faq_payment_4_q'),
          answer: t('faq_payment_4_a')
        }
      ]
    },
    {
      icon: Truck,
      title: t('faq_category_shipping'),
      questions: [
        {
          question: t('faq_shipping_1_q'),
          answer: t('faq_shipping_1_a')
        },
        {
          question: t('faq_shipping_2_q'),
          answer: t('faq_shipping_2_a')
        },
        {
          question: t('faq_shipping_3_q'),
          answer: t('faq_shipping_3_a')
        },
        {
          question: t('faq_shipping_4_q'),
          answer: t('faq_shipping_4_a')
        }
      ]
    },
    {
      icon: RefreshCw,
      title: t('faq_category_returns'),
      questions: [
        {
          question: t('faq_return_1_q'),
          answer: t('faq_return_1_a')
        },
        {
          question: t('faq_return_2_q'),
          answer: t('faq_return_2_a')
        },
        {
          question: t('faq_return_3_q'),
          answer: t('faq_return_3_a')
        },
        {
          question: t('faq_return_4_q'),
          answer: t('faq_return_4_a')
        }
      ]
    },
    {
      icon: Shield,
      title: t('faq_category_products'),
      questions: [
        {
          question: t('faq_product_1_q'),
          answer: t('faq_product_1_a')
        },
        {
          question: t('faq_product_2_q'),
          answer: t('faq_product_2_a')
        },
        {
          question: t('faq_product_3_q'),
          answer: t('faq_product_3_a')
        },
        {
          question: t('faq_product_4_q'),
          answer: t('faq_product_4_a')
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('faq_title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('faq_subtitle')}
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => {
            const Icon = category.icon
            return (
              <div key={categoryIndex}>
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {category.title}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.questions.map((faq, faqIndex) => (
                    <Card key={faqIndex} className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              <HelpCircle className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2">
                                {faq.question}
                              </h3>
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Contact Support */}
        <div className="mt-16">
          <Card className="bg-gray-900 text-white">
            <CardContent className="pt-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6">
                  {t('faq_contact_title')}
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  {t('faq_contact_description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-lg cursor-pointer">
                    {t('faq_contact_button')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {t('faq_quick_links_title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {t('faq_quick_link_1_title')}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {t('faq_quick_link_1_description')}
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {t('faq_quick_link_2_title')}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {t('faq_quick_link_2_description')}
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {t('faq_quick_link_3_title')}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {t('faq_quick_link_3_description')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
