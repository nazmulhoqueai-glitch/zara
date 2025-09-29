import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { MessageSquare } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleProvider'

export function Footer() {
  const { t } = useLocale()
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Image 
                src="/Images/Logo/Logo.png" 
                alt="JARA Logo" 
                width={48}
                height={48}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('footer_brand_description')}
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="https://www.instagram.com/zaara_abayah?igsh=NThkYWh1enh0bzNj&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="https://www.tiktok.com/@zaaraabayah?_t=ZS-906kVouhI8q&_r=1" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <MessageSquare className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer_quick_links')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  {t('nav_home')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  {t('nav_products')}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  {t('nav_categories')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  {t('nav_about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer_contact_link')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer_customer_service')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer_shipping_info')}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer_returns_exchanges')}
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer_size_guide')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer_faq')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer_privacy_policy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer_contact')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300 text-sm">info@jara-fashion.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300 text-sm">+966 50 123 4567</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  {t('address_en')}<br />
                  {t('address_ar')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 {t('brand')}. {t('footer_rights')}
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">{t('footer_payment_methods')}</span>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-5 bg-gray-700 rounded text-xs flex items-center justify-center text-gray-300">
                  Apple Pay
                </div>
                <div className="w-8 h-5 bg-gray-700 rounded text-xs flex items-center justify-center text-gray-300">
                  SAR
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
