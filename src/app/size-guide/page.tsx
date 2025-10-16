'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLocale } from '@/i18n/LocaleProvider'
import { Ruler, Users, Info, CheckCircle } from 'lucide-react'

export default function SizeGuidePage() {
  const { t } = useLocale()

  const sizeCharts = [
    {
      category: 'borka',
      title: t('size_guide_borka_title'),
      description: t('size_guide_borka_description'),
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      measurements: [
        { label: t('size_guide_chest'), values: ['80-85', '85-90', '90-95', '95-100', '100-105', '105-110'] },
        { label: t('size_guide_waist'), values: ['70-75', '75-80', '80-85', '85-90', '90-95', '95-100'] },
        { label: t('size_guide_length'), values: ['140', '145', '150', '155', '160', '165'] }
      ]
    },
    {
      category: 'abaya',
      title: t('size_guide_abaya_title'),
      description: t('size_guide_abaya_description'),
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      measurements: [
        { label: t('size_guide_chest'), values: ['85-90', '90-95', '95-100', '100-105', '105-110', '110-115'] },
        { label: t('size_guide_waist'), values: ['75-80', '80-85', '85-90', '90-95', '95-100', '100-105'] },
        { label: t('size_guide_length'), values: ['150', '155', '160', '165', '170', '175'] }
      ]
    },
    {
      category: 'hijab',
      title: t('size_guide_hijab_title'),
      description: t('size_guide_hijab_description'),
      sizes: ['One Size'],
      measurements: [
        { label: t('size_guide_width'), values: ['180'] },
        { label: t('size_guide_length'), values: ['90'] }
      ]
    }
  ]

  const measuringTips = [
    {
      icon: Ruler,
      title: t('size_guide_tip_1_title'),
      description: t('size_guide_tip_1_description')
    },
    {
      icon: Users,
      title: t('size_guide_tip_2_title'),
      description: t('size_guide_tip_2_description')
    },
    {
      icon: Info,
      title: t('size_guide_tip_3_title'),
      description: t('size_guide_tip_3_description')
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('size_guide_title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('size_guide_subtitle')}
          </p>
        </div>

        {/* Measuring Tips */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('size_guide_measuring_title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('size_guide_measuring_subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {measuringTips.map((tip, index) => {
              const Icon = tip.icon
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {tip.title}
                      </h3>
                      <p className="text-gray-600">
                        {tip.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Size Charts */}
        <div className="space-y-12">
          {sizeCharts.map((chart, chartIndex) => (
            <div key={chartIndex}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {chart.title}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {chart.description}
                </p>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">
                            {t('size_guide_measurement')}
                          </th>
                          {chart.sizes.map((size, sizeIndex) => (
                            <th key={sizeIndex} className="text-center py-3 px-4 font-semibold text-gray-900">
                              {size}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {chart.measurements.map((measurement, measurementIndex) => (
                          <tr key={measurementIndex} className="border-b border-gray-100">
                            <td className="py-3 px-4 font-medium text-gray-700">
                              {measurement.label}
                            </td>
                            {measurement.values.map((value, valueIndex) => (
                              <td key={valueIndex} className="text-center py-3 px-4 text-gray-600">
                                {value} cm
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Important Notes */}
        <div className="mt-16">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-yellow-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                    {t('size_guide_important_title')}
                  </h3>
                  <div className="space-y-2 text-yellow-800">
                    <p>{t('size_guide_important_note_1')}</p>
                    <p>{t('size_guide_important_note_2')}</p>
                    <p>{t('size_guide_important_note_3')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {t('size_guide_faq_title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    question: t('size_guide_faq_1_q'),
                    answer: t('size_guide_faq_1_a')
                  },
                  {
                    question: t('size_guide_faq_2_q'),
                    answer: t('size_guide_faq_2_a')
                  },
                  {
                    question: t('size_guide_faq_3_q'),
                    answer: t('size_guide_faq_3_a')
                  },
                  {
                    question: t('size_guide_faq_4_q'),
                    answer: t('size_guide_faq_4_a')
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
