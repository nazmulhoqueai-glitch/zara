'use client'

import { useState, useEffect } from 'react'
import { 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  DollarSign,
  Eye,
  Plus
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getAllProducts } from '@/lib/products'
import { useLocale } from '@/i18n/LocaleProvider'
import { getAllUsers, getAllOrders } from '@/lib/users-orders'

// Real data will be fetched from Firebase

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  recentOrders: Array<{
    id: string
    customer: string
    product: string
    amount: number
    status: string
    date: string
  }>
  topProducts: Array<{
    id: string
    name: string
    sales: number
    revenue: number
  }>
}

export default function AdminDashboard() {
  const { t, locale } = useLocale()
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: []
  })
  const [loading, setLoading] = useState(true)

  // Load dashboard data from Firebase
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        const [products, users, orders] = await Promise.all([
          getAllProducts(),
          getAllUsers(),
          getAllOrders()
        ])

        // Calculate revenue
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

        // Get recent orders (last 5)
        const recentOrders = orders.slice(0, 5).map(order => ({
          id: order.id,
          customer: order.customer.name,
          product: order.items[0]?.name || 'Multiple items',
          amount: order.total,
          status: order.status,
          date: new Date(order.createdAt).toLocaleDateString()
        }))

        // Get top products (mock for now - would need order analytics)
        const topProducts = products.slice(0, 5).map(product => ({
          id: product.id,
          name: product.name,
          sales: Math.floor(Math.random() * 50) + 1, // Mock sales data
          revenue: Math.floor(Math.random() * 5000) + 100 // Mock revenue data
        }))

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalRevenue,
          recentOrders,
          topProducts
        })
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        // Keep default empty stats
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const formatPrice = (price: number) => {
    if (locale === 'ar') {
      return `${price} ${t('currency_sar')}`
    }
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    return t(`order_status_${status}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('admin_dashboard')}</h1>
          <p className="text-gray-600 mt-2">{t('admin_dashboard_subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {t('add_product')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total_products')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> {t('from_last_month')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total_orders')}</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> {t('from_last_month')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total_users')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> {t('from_last_month')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total_revenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+23%</span> {t('from_last_month')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('recent_orders')}</CardTitle>
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  {t('view_all')}
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatPrice(order.amount)}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>{t('top_products')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-semibold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} {t('sales')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatPrice(product.revenue)}</p>
                    <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-emerald-600 h-2 rounded-full" 
                        style={{ width: `${(product.sales / 50) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('quick_actions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/products/new">
              <Button variant="outline" className="w-full h-20 flex-col">
                <Package className="w-6 h-6 mb-2" />
                {t('add_new_product')}
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline" className="w-full h-20 flex-col">
                <ShoppingBag className="w-6 h-6 mb-2" />
                {t('manage_orders')}
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full h-20 flex-col">
                <Users className="w-6 h-6 mb-2" />
                {t('manage_users')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
