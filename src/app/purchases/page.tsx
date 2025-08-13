'use client'

import { useState, useEffect, useCallback } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  DollarSign,
  Package,
  Search,
  Plus,
  Eye,
  Edit,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertTriangle,
  Receipt
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

// Client component - uses dynamic data fetching

interface PurchaseItem {
  id: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  received: number
  status: 'pending' | 'partial' | 'received'
}

interface Purchase {
  id: string
  orderNumber: string
  supplierId: string
  supplierName: string
  status: 'pending' | 'partial' | 'received' | 'cancelled'
  orderDate: string
  expectedDate: string
  receivedDate?: string
  totalAmount: number
  items: PurchaseItem[]
}

interface PurchaseSummary {
  total: number
  pending: number
  partial: number
  received: number
  totalValue: number
}

export const dynamic = 'force-dynamic'

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [summary, setSummary] = useState<PurchaseSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'partial' | 'received'>('all')
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true)
      const url = new URL('/api/purchases', window.location.origin)
      if (filterStatus !== 'all') {
        url.searchParams.set('status', filterStatus)
      }
      
      const response = await fetch(url.toString())
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch purchases')
      }

      setPurchases(data.purchases)
      setSummary(data.summary)
    } catch (err) {
      console.error('Error fetching purchases:', err)
      setError(`Failed to load purchases: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }, [filterStatus])

  useEffect(() => {
    fetchPurchases()
  }, [fetchPurchases])

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = 
      purchase.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.items.some(item => 
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    return matchesSearch
  })

  const getStatusBadge = (status: Purchase['status']) => {
    const variants = {
      pending: 'warning' as const,
      partial: 'info' as const,
      received: 'success' as const,
      cancelled: 'error' as const
    }
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const getStatusIcon = (status: Purchase['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'partial':
        return <AlertTriangle className="h-5 w-5 text-blue-600" />
      case 'received':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const handleViewDetails = (purchase: Purchase) => {
    setSelectedPurchase(purchase)
    setShowDetails(true)
  }

  const handleReceiveItems = (purchaseId: string) => {
    setPurchases(prev => prev.map(purchase => 
      purchase.id === purchaseId 
        ? { 
            ...purchase, 
            status: 'received' as const,
            receivedDate: new Date().toISOString(),
            items: purchase.items.map(item => ({
              ...item,
              received: item.quantity,
              status: 'received' as const
            }))
          }
        : purchase
    ))
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading purchases...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Purchases</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage purchase orders and inventory receiving
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import PO
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Purchase Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Receipt className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {summary.total}
                  </div>
                  <div className="text-sm text-gray-500">Total Orders</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {summary.pending}
                  </div>
                  <div className="text-sm text-gray-500">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <AlertTriangle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {summary.partial}
                  </div>
                  <div className="text-sm text-gray-500">Partial</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {summary.received}
                  </div>
                  <div className="text-sm text-gray-500">Received</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(summary.totalValue)}
                  </div>
                  <div className="text-sm text-gray-500">Total Value</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, suppliers, products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'partial' | 'received')}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="received">Received</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {filteredPurchases.length} of {purchases.length} orders
        </div>
      </div>

      {/* Purchases List */}
      <div className="space-y-4">
        {filteredPurchases.map((purchase) => (
          <Card key={purchase.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(purchase.status)}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{purchase.orderNumber}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600">{purchase.supplierName}</span>
                      {getStatusBadge(purchase.status)}
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(purchase.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(purchase)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  {purchase.status !== 'received' && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleReceiveItems(purchase.id)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Receive
                    </Button>
                  )}
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Order Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="text-gray-900">{formatDate(purchase.orderDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected:</span>
                      <span className="text-gray-900">{formatDate(purchase.expectedDate)}</span>
                    </div>
                    {purchase.receivedDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Received:</span>
                        <span className="text-green-600">{formatDate(purchase.receivedDate)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Items Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="text-gray-900">{purchase.items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Quantity:</span>
                      <span className="text-gray-900">
                        {purchase.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Received:</span>
                      <span className="text-gray-900">
                        {purchase.items.reduce((sum, item) => sum + item.received, 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Progress</h4>
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: `${(purchase.items.reduce((sum, item) => sum + item.received, 0) / 
                                   purchase.items.reduce((sum, item) => sum + item.quantity, 0)) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((purchase.items.reduce((sum, item) => sum + item.received, 0) / 
                                  purchase.items.reduce((sum, item) => sum + item.quantity, 0)) * 100)}% Complete
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Preview */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Items ({purchase.items.length})</h4>
                  <Button variant="ghost" size="sm" onClick={() => handleViewDetails(purchase)}>
                    View All Items
                  </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {purchase.items.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{item.productName}</div>
                        <div className="text-sm text-gray-600">{item.sku}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {item.received}/{item.quantity}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(item.unitPrice)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {purchase.items.length > 2 && (
                    <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg text-sm text-gray-500">
                      +{purchase.items.length - 2} more items
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Details Modal */}
      {showDetails && selectedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Purchase Order Details</h2>
                <p className="text-sm text-gray-500">{selectedPurchase.orderNumber}</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Supplier</label>
                      <div className="text-sm text-gray-900">{selectedPurchase.supplierName}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedPurchase.status)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Total Amount</label>
                      <div className="text-lg font-bold text-gray-900">{formatCurrency(selectedPurchase.totalAmount)}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Dates</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Order Date</label>
                      <div className="text-sm text-gray-900">{formatDate(selectedPurchase.orderDate)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Expected Date</label>
                      <div className="text-sm text-gray-900">{formatDate(selectedPurchase.expectedDate)}</div>
                    </div>
                    {selectedPurchase.receivedDate && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Received Date</label>
                        <div className="text-sm text-green-600">{formatDate(selectedPurchase.receivedDate)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ordered</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Received</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPurchase.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">{item.productName}</td>
                          <td className="px-4 py-4 text-sm text-gray-500">{item.sku}</td>
                          <td className="px-4 py-4 text-sm text-gray-900 text-center">{item.quantity}</td>
                          <td className="px-4 py-4 text-sm text-gray-900 text-center">{item.received}</td>
                          <td className="px-4 py-4 text-sm text-gray-900 text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="px-4 py-4 text-sm text-gray-900 text-right">{formatCurrency(item.unitPrice * item.quantity)}</td>
                          <td className="px-4 py-4 text-center">
                            <Badge variant={item.status === 'received' ? 'success' : item.status === 'partial' ? 'info' : 'warning'}>
                              {item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Order
                </Button>
                {selectedPurchase.status !== 'received' && (
                  <Button variant="primary" onClick={() => {
                    handleReceiveItems(selectedPurchase.id)
                    setShowDetails(false)
                  }}>
                    <Package className="h-4 w-4 mr-2" />
                    Mark as Received
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredPurchases.length === 0 && !loading && (
        <div className="text-center py-12">
          <Receipt className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No purchase orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Get started by creating your first purchase order.'}
          </p>
          <div className="mt-6">
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              New Purchase Order
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}