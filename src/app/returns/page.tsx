'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLocale } from '@/i18n/LocaleProvider'
import { RefreshCw, Clock, Shield, Mail, Phone, Package } from 'lucide-react'

export default function ReturnsPage() {
  const { t } = useLocale()

  const returnSteps = [
    { step: 1, title: t('returns_step_1'), description: t('returns_step_1_desc') },
    { step: 2, title: t('returns_step_2'), description: t('returns_step_2_desc') },
    { step: 3, title: t('returns_step_3'), description: t('returns_step_3_desc') },
    { step: 4, title: t('returns_step_4'), description: t('returns_step_4_desc') },
    { step: 5, title: t('returns_step_5'), description: t('returns_step_5_desc') }
  ]

  const returnPolicies = [
    {
      icon: Clock,
      title: t('returns_timeframe_title'),
      description: t('returns_timeframe_description'),
      details: [
        t('returns_timeframe_detail_1'),
        t('returns_timeframe_detail_2'),
        t('returns_timeframe_detail_3')
      ]
    },
    {
      icon: Package,
      title: t('returns_condition_title'),
      description: t('returns_condition_description'),
      details: [
        t('returns_condition_detail_1'),
        t('returns_condition_detail_2'),
        t('returns_condition_detail_3')
      ]
    },
    {
      icon: RefreshCw,
      title: t('returns_process_title'),
      description: t('returns_process_description'),
      details: [
        t('returns_process_detail_1'),
        t('returns_process_detail_2'),
        t('returns_process_detail_3')
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('returns_title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('returns_subtitle')}
          </p>
        </div>

        {/* Return Process */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                {t('returns_process_title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {returnSteps.map((step, index) => (
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

        {/* Return Policies */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('returns_policies_title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('returns_policies_subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {returnPolicies.map((policy, index) => {
              const Icon = policy.icon
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {policy.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {policy.description}
                      </p>
                      <div className="space-y-2">
                        {policy.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0"></div>
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

        {/* Important Information */}
        <div className="mb-16">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    {t('returns_important_title')}
                  </h3>
                  <div className="space-y-2 text-blue-800">
                    <p>{t('returns_important_note_1')}</p>
                    <p>{t('returns_important_note_2')}</p>
                    <p>{t('returns_important_note_3')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <div className="mb-16">
          <Card className="bg-gray-900 text-white">
            <CardContent className="pt-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6">
                  {t('returns_contact_title')}
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  {t('returns_contact_description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-emerald-400" />
                    <span className="text-gray-300">support@zaarasarafi.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-emerald-400" />
                    <span className="text-gray-300">+966 50 123 4567</span>
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
                {t('returns_faq_title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    question: t('returns_faq_1_q'),
                    answer: t('returns_faq_1_a')
                  },
                  {
                    question: t('returns_faq_2_q'),
                    answer: t('returns_faq_2_a')
                  },
                  {
                    question: t('returns_faq_3_q'),
                    answer: t('returns_faq_3_a')
                  },
                  {
                    question: t('returns_faq_4_q'),
                    answer: t('returns_faq_4_a')
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
