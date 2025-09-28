'use client'

import { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { LocaleProvider } from '@/i18n/LocaleProvider'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <AuthProvider>
      <LocaleProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </LocaleProvider>
    </AuthProvider>
  )
}
