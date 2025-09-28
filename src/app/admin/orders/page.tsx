'use client'

import { useState } from 'react'
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

// Mock orders data - In real app, this would come from Firebase
const mockOrders = [
  {
    id: 'ORD-001',
    customer: {
      name: 'Sarah Ahmed',
      email: 'sarah.ahmed@email.com',
      phone: '+966501234567'
    },
    items: [
      {
        id: '1',
        name: 'Elegant Purple Borka',
        price: 299,
        quantity: 1,
        size: 'M',
        color: 'Purple',
        image: '/images/products/borka-purple-1.jpg'
      }
    ],
    total: 299,
    status: 'processing',
    paymentMethod: 'credit_card',
    shippingAddress: {
      name: 'Sarah Ahmed',
      street: 'King Fahd Road, Building 123',
      city: 'Riyadh',
      postalCode: '12345',
      country: 'Saudi Arabia'
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'ORD-002',
    customer: {
      name: 'Fatima Al-Rashid',
      email: 'fatima.alrashid@email.com',
      phone: '+966502345678'
    },
    items: [
      {
        id: '2',
        name: 'Classic Black Abaya',
        price: 199,
        quantity: 1,
        size: 'L',
        color: 'Black',
        image: '/images/products/abaya-black-1.jpg'
      },
      {
        id: '3',
        name: 'Royal Blue Borka',
        price: 349,
        quantity: 1,
        size: 'M',
        color: 'Blue',
        image: '/images/products/borka-blue-1.jpg'
      }
    ],
    total: 548,
    status: 'shipped',
    paymentMethod: 'apple_pay',
    shippingAddress: {
      name: 'Fatima Al-Rashid',
      street: 'Prince Mohammed bin Salman Road',
      city: 'Jeddah',
      postalCode: '23456',
      country: 'Saudi Arabia'
    },
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T16:45:00Z'
  },
  {
    id: 'ORD-003',
    customer: {
      name: 'Aisha Khan',
      email: 'aisha.khan@email.com',
      phone: '+966503456789'
    },
    items: [
      {
        id: '1',
        name: 'Elegant Purple Borka',
        price: 299,
        quantity: 2,
        size: 'S',
        color: 'Purple',
        image: '/images/products/borka-purple-1.jpg'
      }
    ],
    total: 598,
    status: 'delivered',
    paymentMethod: 'bank_transfer',
    shippingAddress: {
      name: 'Aisha Khan',
      street: 'Al Olaya Street, Tower 456',
      city: 'Riyadh',
      postalCode: '34567',
      country: 'Saudi Arabia'
    },
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-14T11:30:00Z'
  },
  {
    id: 'ORD-004',
    customer: {
      name: 'Mariam Hassan',
      email: 'mariam.hassan@email.com',
      phone: '+966504567890'
    },
    items: [
      {
        id: '2',
        name: 'Classic Black Abaya',
        price: 199,
        quantity: 1,
        size: 'XL',
        color: 'Black',
        image: '/images/products/abaya-black-1.jpg'
      }
    ],
    total: 199,
    status: 'pending',
    paymentMethod: 'credit_card',
    shippingAddress: {
      name: 'Mariam Hassan',
      street: 'Corniche Road, Villa 789',
      city: 'Dammam',
      postalCode: '45678',
      country: 'Saudi Arabia'
    },
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  },
  {
    id: 'ORD-005',
    customer: {
      name: 'Noor Al-Zahra',
      email: 'noor.alzahra@email.com',
      phone: '+966505678901'
    },
    items: [
      {
        id: '3',
        name: 'Royal Blue Borka',
        price: 349,
        quantity: 1,
        size: 'L',
        color: 'Blue',
        image: '/images/products/borka-blue-1.jpg'
      }
    ],
    total: 349,
    status: 'processing',
    paymentMethod: 'apple_pay',
    shippingAddress: {
      name: 'Noor Al-Zahra',
      street: 'Al Khobar Corniche, Apartment 101',
      city: 'Khobar',
      postalCode: '56789',
      country: 'Saudi Arabia'
    },
    createdAt: '2024-01-11T12:00:00Z',
    updatedAt: '2024-01-11T12:00:00Z'
  }
]

export default function OrdersPage() {
  const { t, locale } = useLocale()
  const [orders, setOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all')

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

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    ))
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
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
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
