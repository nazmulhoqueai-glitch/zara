'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Eye,
  ShoppingBag,
  Calendar,
  User,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLocale } from '@/i18n/LocaleProvider'

import { getAllOrders, updateOrderStatus, Order } from '@/lib/users-orders'

export default function OrdersPage() {
  const { t, locale } = useLocale()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all')

  // Load orders from Firebase
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true)
        const firebaseOrders = await getAllOrders()
        setOrders(firebaseOrders)
      } catch (error) {
        console.error('Error loading orders:', error)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
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

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'apple_pay': return '🍎'
      case 'credit_card': return '💳'
      case 'bank_transfer': return '🏦'
      default: return '💰'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    const matchesPayment = selectedPaymentMethod === 'all' || order.paymentMethod === selectedPaymentMethod

    return matchesSearch && matchesStatus && matchesPayment
  })

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']
  const paymentMethods = ['all', 'apple_pay', 'credit_card', 'bank_transfer']

  const handleStatusChange = async (orderId: string, newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(orders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      ))
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('manage_orders')}</h1>
          <p className="text-gray-600 mt-2">{t('manage_orders_subtitle')}</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={t('search_orders')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">{t('all_status')}</option>
                {statuses.slice(1).map(status => (
                  <option key={status} value={status}>
                    {t(`order_status_${status}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Filter */}
            <div className="md:w-48">
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">{t('all_payment_methods')}</option>
                {paymentMethods.slice(1).map(method => (
                  <option key={method} value={method}>
                    {t(`payment_${method}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      {t(`order_status_${order.status}`)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Customer Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{order.customer.name}</span>
                      </div>
                      <p className="text-sm text-gray-600">{order.customer.email}</p>
                      <p className="text-sm text-gray-600">{order.customer.phone}</p>
                    </div>

                    {/* Order Details */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {order.items.length} {t('item')}{order.items.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {getPaymentMethodIcon(order.paymentMethod)} {t(`payment_${order.paymentMethod}`)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">{t('order_items')}</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              {t('size')}: {item.size} • {t('color')}: {item.color} • {t('quantity')}: {item.quantity}
                            </p>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex flex-col gap-3 lg:min-w-[200px]">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">
                      {formatPrice(order.total)}
                    </p>
                    <p className="text-sm text-gray-500">{t('total')}</p>
                  </div>

                  {/* Status Update */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('update_status')}
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="pending">{t('order_status_pending')}</option>
                      <option value="processing">{t('order_status_processing')}</option>
                      <option value="shipped">{t('order_status_shipped')}</option>
                      <option value="delivered">{t('order_status_delivered')}</option>
                      <option value="cancelled">{t('order_status_cancelled')}</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      {t('view')}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('no_orders_found')}</h3>
            <p className="text-gray-600">{t('no_orders_found_desc')}</p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {t('showing')} {filteredOrders.length} {t('of')} {orders.length} {t('orders')}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              {t('previous')}
            </Button>
            <Button variant="outline" size="sm" disabled>
              {t('next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
