'use client'

import { useState } from 'react'

import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { 
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  totalOrders: number
  totalSpent: number
  lastOrderDate: Date
  status: 'active' | 'inactive'
  tags: string[]
  joinDate: Date
  platform: string[]
}

// Mock customer data
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Tom Jackson',
    email: 'tom13jackson14@gmail.com',
    phone: '5628446625',
    address: {
      street: '14144 New street',
      city: 'Gendville',
      state: 'NY',
      zip: '90111',
      country: 'United States'
    },
    totalOrders: 8,
    totalSpent: 1247.50,
    lastOrderDate: new Date('2025-12-02'),
    status: 'active',
    tags: ['VIP', 'Returning'],
    joinDate: new Date('2024-06-15'),
    platform: ['wix', 'amazon']
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    phone: '5551234567',
    address: {
      street: '892 Oak Avenue',
      city: 'Birmingham',
      state: 'AL',
      zip: '35203',
      country: 'United States'
    },
    totalOrders: 15,
    totalSpent: 2156.75,
    lastOrderDate: new Date('2025-11-28'),
    status: 'active',
    tags: ['VIP', 'High Value'],
    joinDate: new Date('2024-03-20'),
    platform: ['shopify', 'ebay']
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    email: 'mrodriguez@example.com',
    address: {
      street: '1567 Maple Drive',
      city: 'Leicester',
      state: 'LE',
      zip: 'LE1 5DB',
      country: 'United Kingdom'
    },
    totalOrders: 3,
    totalSpent: 487.25,
    lastOrderDate: new Date('2025-11-20'),
    status: 'active',
    tags: ['New Customer'],
    joinDate: new Date('2025-10-12'),
    platform: ['amazon']
  },
  {
    id: '4',
    name: 'Emily Chen',
    email: 'emily.chen@gmail.com',
    phone: '4165551234',
    address: {
      street: '789 Queen Street West',
      city: 'Toronto',
      state: 'ON',
      zip: 'M6J 1G1',
      country: 'Canada'
    },
    totalOrders: 12,
    totalSpent: 1698.40,
    lastOrderDate: new Date('2025-12-01'),
    status: 'active',
    tags: ['Returning', 'Wholesale'],
    joinDate: new Date('2024-08-05'),
    platform: ['wix', 'etsy']
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'jwilson@business.com',
    address: {
      street: '456 Business Park',
      city: 'Halesowen',
      state: 'WM',
      zip: 'B62 8QF',
      country: 'United Kingdom'
    },
    totalOrders: 1,
    totalSpent: 127.99,
    lastOrderDate: new Date('2025-01-15'),
    status: 'inactive',
    tags: ['One-time'],
    joinDate: new Date('2025-01-15'),
    platform: ['ebay']
  }
]

const getPlatformBadge = (platform: string) => {
  const platforms: Record<string, { color: string; name: string }> = {
    wix: { color: 'bg-purple-500', name: 'W' },
    amazon: { color: 'bg-orange-500', name: 'A' },
    ebay: { color: 'bg-blue-500', name: 'E' },
    shopify: { color: 'bg-green-500', name: 'S' },
    etsy: { color: 'bg-orange-600', name: 'Et' }
  }
  
  const config = platforms[platform] || { color: 'bg-gray-500', name: platform.charAt(0).toUpperCase() }
  
  return (
    <div key={platform} className={`w-6 h-6 rounded flex items-center justify-center ${config.color} text-white text-xs font-bold`}>
      {config.name}
    </div>
  )
}

// Force this page to be dynamic to prevent pre-render errors
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [customers] = useState<Customer[]>(mockCustomers)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.address.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowCustomerDetails(true)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your customer database and relationships
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{customers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Customers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {customers.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(
                  customers.reduce((sum, c) => sum + c.totalSpent, 0) / 
                  customers.reduce((sum, c) => sum + c.totalOrders, 0)
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name, email, or city"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              <Badge variant="status" status={customer.status}>
                {customer.status}
              </Badge>
            </div>

            {/* Customer Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{customer.totalOrders}</div>
                <div className="text-xs text-gray-500">Orders</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {formatCurrency(customer.totalSpent)}
                </div>
                <div className="text-xs text-gray-500">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(customer.totalSpent / customer.totalOrders)}
                </div>
                <div className="text-xs text-gray-500">Avg Order</div>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start space-x-2 mb-4">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="text-sm text-gray-600">
                <div>{customer.address.street}</div>
                <div>
                  {customer.address.city}, {customer.address.state} {customer.address.zip}
                </div>
                <div>{customer.address.country}</div>
              </div>
            </div>

            {/* Tags and Platforms */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {customer.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-1">
                {customer.platform.map(platform => getPlatformBadge(platform))}
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <div>Joined: {formatDate(customer.joinDate)}</div>
              <div>Last order: {formatDate(customer.lastOrderDate)}</div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleViewCustomer(customer)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Details Modal */}
      {showCustomerDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Customer Details</h2>
                <p className="text-sm text-gray-500">{selectedCustomer.name}</p>
              </div>
              <button
                onClick={() => setShowCustomerDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <div className="text-sm text-gray-900">{selectedCustomer.name}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <div className="text-sm text-gray-900">{selectedCustomer.email}</div>
                    </div>
                    {selectedCustomer.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <div className="text-sm text-gray-900">{selectedCustomer.phone}</div>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Address</label>
                      <div className="text-sm text-gray-900">
                        <div>{selectedCustomer.address.street}</div>
                        <div>
                          {selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.zip}
                        </div>
                        <div>{selectedCustomer.address.country}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order History */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{selectedCustomer.totalOrders}</div>
                        <div className="text-sm text-gray-500">Total Orders</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(selectedCustomer.totalSpent)}
                        </div>
                        <div className="text-sm text-gray-500">Total Spent</div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatCurrency(selectedCustomer.totalSpent / selectedCustomer.totalOrders)}
                      </div>
                      <div className="text-sm text-gray-500">Average Order Value</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Customer Since</label>
                      <div className="text-sm text-gray-900">{formatDate(selectedCustomer.joinDate)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Last Order</label>
                      <div className="text-sm text-gray-900">{formatDate(selectedCustomer.lastOrderDate)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Platforms</label>
                      <div className="flex items-center space-x-2 mt-1">
                        {selectedCustomer.platform.map(platform => getPlatformBadge(platform))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowCustomerDetails(false)}>
                  Close
                </Button>
                <Button variant="primary">
                  Edit Customer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first customer.'}
          </p>
          <div className="mt-6">
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}