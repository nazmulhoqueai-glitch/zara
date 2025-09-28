import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/useCartStore'

export function useHydratedCart() {
  const [isHydrated, setIsHydrated] = useState(false)
  const { totals } = useCartStore()
  const { itemCount, subtotal } = totals()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return {
    isHydrated,
    itemCount: isHydrated ? itemCount : 0,
    subtotal: isHydrated ? subtotal : 0,
  }
}
