'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLocale } from '@/i18n/LocaleProvider'
import { Shield, Eye, Lock, Database, Users, Mail } from 'lucide-react'

export default function PrivacyPage() {
  const { t } = useLocale()

  const privacySections = [
    {
      icon: Database,
      title: t('privacy_data_collection_title'),
      description: t('privacy_data_collection_description'),
      points: [
        t('privacy_data_collection_point_1'),
        t('privacy_data_collection_point_2'),
        t('privacy_data_collection_point_3'),
        t('privacy_data_collection_point_4')
      ]
    },
    {
      icon: Shield,
      title: t('privacy_data_usage_title'),
      description: t('privacy_data_usage_description'),
      points: [
        t('privacy_data_usage_point_1'),
        t('privacy_data_usage_point_2'),
        t('privacy_data_usage_point_3'),
        t('privacy_data_usage_point_4')
      ]
    },
    {
      icon: Lock,
      title: t('privacy_data_protection_title'),
      description: t('privacy_data_protection_description'),
      points: [
        t('privacy_data_protection_point_1'),
        t('privacy_data_protection_point_2'),
        t('privacy_data_protection_point_3'),
        t('privacy_data_protection_point_4')
      ]
    },
    {
      icon: Eye,
      title: t('privacy_cookies_title'),
      description: t('privacy_cookies_description'),
      points: [
        t('privacy_cookies_point_1'),
        t('privacy_cookies_point_2'),
        t('privacy_cookies_point_3'),
        t('privacy_cookies_point_4')
      ]
    }
  ]

  const userRights = [
    { right: t('privacy_right_1'), description: t('privacy_right_1_desc') },
    { right: t('privacy_right_2'), description: t('privacy_right_2_desc') },
    { right: t('privacy_right_3'), description: t('privacy_right_3_desc') },
    { right: t('privacy_right_4'), description: t('privacy_right_4_desc') },
    { right: t('privacy_right_5'), description: t('privacy_right_5_desc') }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('privacy_title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('privacy_subtitle')}
          </p>
          <div className="mt-6">
            <Badge className="bg-emerald-600 text-white px-4 py-2">
              {t('privacy_last_updated')}
            </Badge>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-16">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('privacy_introduction_title')}
                </h2>
                <p className="text-gray-600 leading-relaxed max-w-4xl mx-auto">
                  {t('privacy_introduction_content')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-12 mb-16">
          {privacySections.map((section, index) => {
            const Icon = section.icon
            return (
              <div key={index}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <CardTitle className="text-xl">
                        {section.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">
                      {section.description}
                    </p>
                    <div className="space-y-3">
                      {section.points.map((point, pointIndex) => (
                        <div key={pointIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700">{point}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        {/* User Rights */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('privacy_user_rights_title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('privacy_user_rights_subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userRights.map((right, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {right.right}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {right.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-16">
          <Card className="bg-gray-900 text-white">
            <CardContent className="pt-8">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <Users className="w-8 h-8 text-emerald-400" />
                  <h2 className="text-3xl font-bold">
                    {t('privacy_contact_title')}
                  </h2>
                </div>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  {t('privacy_contact_description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-emerald-400" />
                    <span className="text-gray-300">privacy@zaarasarafi.com</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Policy Updates */}
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
                    {t('privacy_updates_title')}
                  </h3>
                  <div className="space-y-2 text-blue-800">
                    <p>{t('privacy_updates_note_1')}</p>
                    <p>{t('privacy_updates_note_2')}</p>
                    <p>{t('privacy_updates_note_3')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legal Information */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {t('privacy_legal_title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">
                    {t('privacy_legal_company')}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    ZAARA Fashion Store<br />
                    Jeddah Serafi Mega Mall<br />
                    1st Floor Gate No 1/6<br />
                    Jeddah, Saudi Arabia
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">
                    {t('privacy_legal_jurisdiction')}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {t('privacy_legal_jurisdiction_content')}
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
