'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLocale } from '@/i18n/LocaleProvider'
import { Heart, Users, Award, Shield, Globe, Star } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const { t } = useLocale()

  const features = [
    {
      icon: Heart,
      title: t('about_quality_title'),
      description: t('about_quality_description')
    },
    {
      icon: Users,
      title: t('about_community_title'),
      description: t('about_community_description')
    },
    {
      icon: Award,
      title: t('about_excellence_title'),
      description: t('about_excellence_description')
    },
    {
      icon: Shield,
      title: t('about_trust_title'),
      description: t('about_trust_description')
    }
  ]

  const stats = [
    { label: t('about_customers'), value: '10,000+' },
    { label: t('about_products'), value: '500+' },
    { label: t('about_years'), value: '5+' },
    { label: t('about_satisfaction'), value: '98%' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('about_title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('about_subtitle')}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <Card>
            <CardContent className="pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    {t('about_story_title')}
                  </h2>
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>{t('about_story_paragraph1')}</p>
                    <p>{t('about_story_paragraph2')}</p>
                    <p>{t('about_story_paragraph3')}</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                    <Globe className="w-24 h-24 text-emerald-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('about_features_title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('about_features_subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-emerald-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
            <CardContent className="pt-8">
              <div className="text-center">
                <Star className="w-16 h-16 mx-auto mb-6 text-emerald-200" />
                <h2 className="text-3xl font-bold mb-6">
                  {t('about_mission_title')}
                </h2>
                <p className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
                  {t('about_mission_description')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('about_values_title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('about_values_subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: t('about_value_modesty'), description: t('about_value_modesty_desc') },
              { title: t('about_value_quality'), description: t('about_value_quality_desc') },
              { title: t('about_value_community'), description: t('about_value_community_desc') }
            ].map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gray-900 text-white">
            <CardContent className="pt-8">
              <h2 className="text-3xl font-bold mb-6">
                {t('about_cta_title')}
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                {t('about_cta_description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-lg cursor-pointer">
                    {t('about_cta_shop')}
                  </Badge>
                </Link>
                <Link href="/contact">
                  <Badge variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-6 py-3 text-lg cursor-pointer">
                    {t('about_cta_contact')}
                  </Badge>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
