'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Eye,
  Users,
  Mail,
  Phone,
  Calendar,
  Shield,
  UserCheck,
  UserX
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLocale } from '@/i18n/LocaleProvider'

// Mock users data - In real app, this would come from Firebase
const mockUsers = [
  {
    uid: '1',
    email: 'sarah.ahmed@email.com',
    firstName: 'Sarah',
    lastName: 'Ahmed',
    phone: '+966501234567',
    role: 'user',
    isActive: true,
    createdAt: '2024-01-01T10:30:00Z',
    lastLogin: '2024-01-15T14:20:00Z',
    totalOrders: 5,
    totalSpent: 1495
  },
  {
    uid: '2',
    email: 'fatima.alrashid@email.com',
    firstName: 'Fatima',
    lastName: 'Al-Rashid',
    phone: '+966502345678',
    role: 'user',
    isActive: true,
    createdAt: '2024-01-02T09:15:00Z',
    lastLogin: '2024-01-14T16:45:00Z',
    totalOrders: 3,
    totalSpent: 897
  },
  {
    uid: '3',
    email: 'aisha.khan@email.com',
    firstName: 'Aisha',
    lastName: 'Khan',
    phone: '+966503456789',
    role: 'user',
    isActive: true,
    createdAt: '2024-01-03T11:20:00Z',
    lastLogin: '2024-01-13T10:30:00Z',
    totalOrders: 7,
    totalSpent: 2093
  },
  {
    uid: '4',
    email: 'mariam.hassan@email.com',
    firstName: 'Mariam',
    lastName: 'Hassan',
    phone: '+966504567890',
    role: 'user',
    isActive: false,
    createdAt: '2024-01-04T08:45:00Z',
    lastLogin: '2024-01-10T12:15:00Z',
    totalOrders: 2,
    totalSpent: 398
  },
  {
    uid: '5',
    email: 'noor.alzahra@email.com',
    firstName: 'Noor',
    lastName: 'Al-Zahra',
    phone: '+966505678901',
    role: 'user',
    isActive: true,
    createdAt: '2024-01-05T15:30:00Z',
    lastLogin: '2024-01-12T09:45:00Z',
    totalOrders: 4,
    totalSpent: 1196
  },
  {
    uid: '6',
    email: 'admin@jara.com',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+966506789012',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-15T17:30:00Z',
    totalOrders: 0,
    totalSpent: 0
  },
  // Add more mock users...
  ...Array.from({ length: 15 }, (_, i) => ({
    uid: `${i + 7}`,
    email: `user${i + 7}@email.com`,
    firstName: `User${i + 7}`,
    lastName: 'Test',
    phone: `+96650${(i + 7).toString().padStart(7, '0')}`,
    role: 'user' as const,
    isActive: Math.random() > 0.2,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    totalOrders: Math.floor(Math.random() * 10),
    totalSpent: Math.floor(Math.random() * 2000)
  }))
]

export default function UsersPage() {
  const { t, locale } = useLocale()
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'user': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm)
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && user.isActive) ||
                         (selectedStatus === 'inactive' && !user.isActive)

    return matchesSearch && matchesRole && matchesStatus
  })

  const roles = ['all', 'admin', 'user']
  const statuses = ['all', 'active', 'inactive']

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.uid === userId 
        ? { ...user, isActive: !user.isActive }
        : user
    ))
  }

  const handleChangeUserRole = (userId: string, newRole: string) => {
    setUsers(users.map(user => 
      user.uid === userId 
        ? { ...user, role: newRole }
        : user
    ))
  }

  // Statistics
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.isActive).length
  const adminUsers = users.filter(u => u.role === 'admin').length
  const totalRevenue = users.reduce((sum, user) => sum + user.totalSpent, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('manage_users')}</h1>
          <p className="text-gray-600 mt-2">{t('manage_users_subtitle')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total_users')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> {t('from_last_month')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('active_users')}</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((activeUsers / totalUsers) * 100)}% {t('of_total')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin_users')}</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((adminUsers / totalUsers) * 100)}% {t('of_total')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total_revenue')}</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {t('from_all_users')}
            </p>
          </CardContent>
        </Card>
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
                  placeholder={t('search_users')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="md:w-48">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">{t('all_roles')}</option>
                {roles.slice(1).map(role => (
                  <option key={role} value={role}>
                    {t(`role_${role}`)}
                  </option>
                ))}
              </select>
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
                    {t(`status_${status}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('user')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('contact')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('role')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('orders')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('total_spent')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('last_login')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-emerald-600 font-semibold text-sm">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.uid}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeUserRole(user.uid, e.target.value)}
                        className={`px-2 py-1 text-xs rounded-full border-0 ${getRoleColor(user.role)}`}
                      >
                        <option value="user">{t('role_user')}</option>
                        <option value="admin">{t('role_admin')}</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(user.isActive)}>
                        {user.isActive ? t('status_active') : t('status_inactive')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.totalOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(user.totalSpent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleUserStatus(user.uid)}
                          className={user.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                        >
                          {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('no_users_found')}</h3>
            <p className="text-gray-600">{t('no_users_found_desc')}</p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {t('showing')} {filteredUsers.length} {t('of')} {users.length} {t('users')}
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
