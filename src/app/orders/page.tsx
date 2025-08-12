'use client'

import { useState, useEffect } from 'react'

import type { OrderWithRelations } from '@/lib/database/orders'
import { getAllOrders } from '@/lib/database/orders'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { 
  Search,
  Filter,
  Columns3,
  Eye
} from 'lucide-react'
import { formatCurrency, formatDate, cn } from '@/lib/utils'

// Client component - uses dynamic data fetching

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Additional state for UI
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/orders')
        const fetchedOrders = await response.json()
        if (response.ok) {
          setOrders(fetchedOrders)
        } else {
          throw new Error(fetchedOrders.error || 'Failed to fetch orders')
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err)
        setError(`Failed to load orders: ${err instanceof Error ? err.message : 'Unknown error'}`)
        // Use fallback empty data for now
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-8">Loading orders...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-8 text-red-600">
          {error}
          <div className="mt-4 text-sm text-gray-500">
            This feature requires database setup. See documentation for setup instructions.
          </div>
        </div>
      </div>
    )
  }

  // Temporary fallback orders for demonstration
  const mockOrders: OrderWithRelations[] = [
  {
    id: '1',
    createdAt: new Date('2025-12-02T17:41:00'),
    updatedAt: new Date('2025-12-02T17:41:00'),
    orderId: '10086',
    customerId: '1',
    platform: 'SHOPIFY',
    status: 'NEW',
    total: 78.00,
    currency: 'USD',
    paid: true,
    trackingNumber: null,
    orderDate: new Date('2025-12-02T17:41:00'),
    customer: {
      id: '1',
      name: 'Tom Jackson',
      email: 'tom13jackson14@gmail.com'
    },
    items: [
      {
        id: '1',
        productName: 'Bomber Jacket',
        quantity: 1,
        price: 78.00
      }
    ]
  }
]

  // Use database orders if available, otherwise fallback to mock data
  const currentOrders = orders.length > 0 ? orders : mockOrders
  const filteredOrders = currentOrders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'new' && order.status === 'NEW') ||
      (activeTab === 'in-progress' && order.status === 'IN_PROGRESS') ||
      (activeTab === 'shipped' && order.status === 'SHIPPED')
    
    return matchesSearch && matchesTab
  })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with search and filters */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Columns3 className="h-4 w-4 mr-2" />
            Columns
          </Button>
        </div>
      </div>

      {/* Order count and pagination info */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">Showing {filteredOrders.length} orders</p>
      </div>

      {/* Status tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'all', name: 'All', count: currentOrders.length },
            { id: 'new', name: 'New', count: currentOrders.filter(o => o.status === 'NEW').length },
            { id: 'in-progress', name: 'In Progress', count: currentOrders.filter(o => o.status === 'IN_PROGRESS').length },
            { id: 'shipped', name: 'Shipped', count: currentOrders.filter(o => o.status === 'SHIPPED').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">#{order.orderId}</div>
                    {getPlatformBadge(order.platform)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                    <div className="text-sm text-gray-500">{order.customer.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {order.items.map((item, index) => (
                      <div key={index}>
                        {item.quantity}x {item.productName}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="status" status={order.status.toLowerCase()}>
                    {order.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate('orderDate' in order ? order.orderDate : new Date())}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.total)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.paid ? '✓ Paid' : '○ Unpaid'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const getPlatformBadge = (platform: string) => {
  const platforms: Record<string, { color: string; name: string }> = {
    ebay: { color: 'bg-blue-500', name: 'eBay' },
    shopify: { color: 'bg-green-500', name: 'Shopify' },
    etsy: { color: 'bg-orange-600', name: 'Etsy' },
    multiorders: { color: 'bg-blue-600', name: 'INVENTREE PLUS' }
  }
  
  const config = platforms[platform.toLowerCase()] || { color: 'bg-gray-500', name: platform }
  
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-6 h-6 rounded flex items-center justify-center ${config.color} text-white text-xs font-bold`}>
        {platform.charAt(0).toUpperCase()}
      </div>
      <span className="text-sm text-gray-600">{config.name}</span>
    </div>
  )
}
