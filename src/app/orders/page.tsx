'use client'

import { useState } from 'react'
import { Order } from '@/types'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { 
  Search,
  Filter,
  Columns3,
  SortDesc,
  Printer,
  Mail,
  MoreHorizontal,
  Download,
  Upload,
  Plus,
  Eye
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

// Mock orders data matching multiorders screenshots
const mockOrders: Order[] = [
  {
    id: '1',
    orderId: '10086',
    platform: 'wix',
    customer: {
      name: 'Tom Jackson',
      email: 'tom13jackson14@gmail.com',
      address: '14144 New street, Gendville, NY 90111, United States'
    },
    items: [
      {
        productName: 'Bomber Jacket',
        quantity: 1,
        price: 78.00
      }
    ],
    status: 'new',
    total: 78.00,
    currency: 'USD',
    date: new Date('2025-12-02T17:41:00'),
    paid: true
  },
  {
    id: '2',
    orderId: '156845',
    platform: 'wix',
    customer: {
      name: 'Customer Name',
      address: 'Customer Address'
    },
    items: [
      {
        productName: 'Manganiello Shirt',
        quantity: 2,
        price: 88.00
      }
    ],
    status: 'new',
    total: 176.00,
    currency: 'USD',
    date: new Date('2025-12-02T17:41:00'),
    paid: true
  },
  {
    id: '3',
    orderId: '69863',
    platform: 'wix',
    customer: {
      name: 'Customer Name',
      address: 'Customer Address'
    },
    items: [
      {
        productName: 'Leather Vest',
        quantity: 1,
        price: 119.00
      }
    ],
    status: 'new',
    total: 119.00,
    currency: 'USD',
    date: new Date('2025-12-02T17:41:00'),
    paid: true
  },
  {
    id: '4',
    orderId: '121271',
    platform: 'wix',
    customer: {
      name: 'Customer Name',
      address: 'Customer Address'
    },
    items: [
      {
        productName: 'SweetPrint Jacket',
        quantity: 1,
        price: 99.00
      }
    ],
    status: 'new',
    total: 99.00,
    currency: 'USD',
    date: new Date('2025-12-02T17:41:00'),
    paid: true
  },
  {
    id: '5',
    orderId: '121251',
    platform: 'wix',
    customer: {
      name: 'Customer Name',
      address: 'Customer Address'
    },
    items: [
      {
        productName: 'T-Shirt',
        quantity: 1,
        price: 69.00
      }
    ],
    status: 'in-progress',
    total: 69.00,
    currency: 'USD',
    date: new Date('2025-12-02T17:41:00'),
    paid: true
  },
  {
    id: '6',
    orderId: '111-1481331-2363411',
    platform: 'amazon',
    customer: {
      name: 'Customer Name',
      address: 'Customer Address'
    },
    items: [
      {
        productName: 'Leather Vest',
        quantity: 1,
        price: 107.51
      }
    ],
    status: 'in-progress',
    total: 107.51,
    currency: 'USD',
    date: new Date('2025-12-02T17:41:00'),
    paid: true
  },
  {
    id: '7',
    orderId: '121191',
    platform: 'wix',
    customer: {
      name: 'Customer Name',
      address: 'Customer Address'
    },
    items: [
      {
        productName: 'Crochet Shirt',
        quantity: 1,
        price: 93.84
      }
    ],
    status: 'cancelled',
    total: 93.84,
    currency: 'USD',
    date: new Date('2025-12-02T17:41:00'),
    paid: true
  },
  {
    id: '8',
    orderId: '112-1475613-0439468',
    platform: 'amazon',
    customer: {
      name: 'Customer Name',
      address: 'Customer Address'
    },
    items: [
      {
        productName: 'Blazer Jacket',
        quantity: 1,
        price: 135.31
      }
    ],
    status: 'shipped',
    total: 135.31,
    currency: 'USD',
    date: new Date('2025-12-02T17:41:00'),
    trackingNumber: '584548567631',
    paid: true
  },
  {
    id: '9',
    orderId: '10021',
    platform: 'wix',
    customer: {
      name: 'Customer Name',
      address: 'Customer Address'
    },
    items: [
      {
        productName: 'Connect Jacket',
        quantity: 1,
        price: 99.00
      }
    ],
    status: 'in-progress',
    total: 99.00,
    currency: 'USD',
    date: new Date('2025-12-02T17:41:00'),
    paid: true
  }
]

const orderStatusTabs = [
  { id: 'new', label: 'New', count: 4 },
  { id: 'in-progress', label: 'In-Progress', count: 113 },
  { id: 'shipped', label: 'Shipped', count: 0 },
  { id: 'all', label: 'All', count: 0 },
  { id: 'amazon-mcf', label: 'Amazon MCF', count: 0 },
  { id: 'amazon-fba', label: 'Amazon FBA', count: 0 },
  { id: 'cancelled', label: 'Cancelled', count: 0 },
  { id: 'pending', label: 'Pending', count: 1459 }
]

const getPlatformBadge = (platform: string) => {
  const platforms: Record<string, { color: string; name: string }> = {
    wix: { color: 'bg-purple-500', name: 'Wix' },
    amazon: { color: 'bg-orange-500', name: 'Amazon' },
    ebay: { color: 'bg-blue-500', name: 'eBay' },
    shopify: { color: 'bg-green-500', name: 'Shopify' },
    etsy: { color: 'bg-orange-600', name: 'Etsy' }
  }
  
  const config = platforms[platform] || { color: 'bg-gray-500', name: platform }
  
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-6 h-6 rounded flex items-center justify-center ${config.color} text-white text-xs font-bold`}>
        {platform === 'wix' ? 'W' : platform === 'amazon' ? 'A' : platform.charAt(0).toUpperCase()}
      </div>
      <span className="text-sm text-gray-600">{config.name}</span>
    </div>
  )
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [orders] = useState<Order[]>(mockOrders)

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesTab && matchesSearch
  })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage orders across all your sales channels
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Order
          </Button>
        </div>
      </div>

      {/* Order Status Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {orderStatusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Columns3 className="h-4 w-4 mr-2" />
            Columns
          </Button>
          <Button variant="outline" size="sm">
            <SortDesc className="h-4 w-4 mr-2" />
            Sort
          </Button>
          <Button variant="outline" size="sm">
            Reset Width
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Total Items: <span className="font-medium">{filteredOrders.length}</span>
          </span>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="ghost" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="ghost" size="sm">
              Change Status
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order, customer or shipping destination"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order, index) => (
                <tr key={order.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {getPlatformBadge(order.platform)}
                      <div className="text-sm font-medium text-gray-900">
                        {order.orderId}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(order.date)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx}>{item.productName}</div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(order.total, order.currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.paid ? (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✗</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="status" status={order.status}>
                      {order.status === 'new' ? 'New' :
                       order.status === 'in-progress' ? 'In-Progress' :
                       order.status === 'shipped' ? 'Shipped' :
                       order.status === 'cancelled' ? 'Cancelled' : 
                       order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.trackingNumber || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">1</span>
          <span className="text-sm text-gray-500">/ 1082</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
              <button
                key={page}
                className={`px-3 py-1 rounded text-sm ${
                  page === 1 ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="px-3 py-1 text-sm text-gray-500">...</span>
            <button className="px-3 py-1 rounded text-sm text-gray-500 hover:text-gray-700">10</button>
          </div>
        </div>
      </div>
    </div>
  )
}