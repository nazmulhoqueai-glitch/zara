'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export function AuthRedirect() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/profile')
      }
    }
  }, [user, loading, router])

  return null // This component doesn't render anything
}

export default AuthRedirect
