'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card'
import { 
  Truck,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Star,
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Clock,
  RefreshCw,
  Users,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

// Client component - uses dynamic data fetching

interface SupplierAddress {
  street: string
  city: string
  postcode: string
  country: string
}

interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  website: string
  address: SupplierAddress
  status: 'active' | 'pending' | 'inactive'
  rating: number
  paymentTerms: string
  currency: string
  leadTime: number
  minimumOrder: number
  categories: string[]
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  createdAt: string
  notes: string
}

interface SupplierSummary {
  total: number
  active: number
  pending: number
  inactive: number
  totalSpent: number
  totalOrders: number
}

export const dynamic = 'force-dynamic'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [summary, setSummary] = useState<SupplierSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'inactive'>('all')
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchSuppliers()
  }, [filterStatus])

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const url = new URL('/api/suppliers', window.location.origin)
      if (filterStatus !== 'all') {
        url.searchParams.set('status', filterStatus)
      }
      
      const response = await fetch(url.toString())
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch suppliers')
      }

      setSuppliers(data.suppliers)
      setSummary(data.summary)
    } catch (err) {
      console.error('Error fetching suppliers:', err)
      setError(`Failed to load suppliers: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase())) ||
      supplier.address.city.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const getStatusBadge = (status: Supplier['status']) => {
    const variants = {
      active: 'success' as const,
      pending: 'warning' as const,
      inactive: 'error' as const
    }
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    )
  }

  const handleViewDetails = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setShowDetails(true)
  }

  const handleStatusChange = (supplierId: string, newStatus: Supplier['status']) => {
    setSuppliers(prev => prev.map(supplier => 
      supplier.id === supplierId 
        ? { ...supplier, status: newStatus }
        : supplier
    ))
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading suppliers...</span>
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
          <h1 className="text-2xl font-semibold text-gray-900">Suppliers</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your supplier relationships and contacts
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Package className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {summary.total}
                  </div>
                  <div className="text-sm text-gray-500">Total Suppliers</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {summary.active}
                  </div>
                  <div className="text-sm text-gray-500">Active</div>
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
                <div className="p-3 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {summary.inactive}
                  </div>
                  <div className="text-sm text-gray-500">Inactive</div>
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
                    {formatCurrency(summary.totalSpent)}
                  </div>
                  <div className="text-sm text-gray-500">Total Spent</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100">
                  <Package className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {summary.totalOrders}
                  </div>
                  <div className="text-sm text-gray-500">Total Orders</div>
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
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'pending' | 'inactive')}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {filteredSuppliers.length} of {suppliers.length} suppliers
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-full bg-blue-100">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{supplier.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusBadge(supplier.status)}
                      {supplier.rating > 0 ? (
                        renderStars(supplier.rating)
                      ) : (
                        <span className="text-sm text-gray-500">No rating</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(supplier)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{supplier.address.city}, {supplier.address.country}</span>
                </div>
                {supplier.website && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Globe className="h-4 w-4" />
                    <a href={`https://${supplier.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      {supplier.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {supplier.categories.map(category => (
                    <Badge key={category} variant="secondary" size="sm">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Business Details */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <div className="text-gray-600">Payment Terms</div>
                  <div className="font-medium text-gray-900">{supplier.paymentTerms}</div>
                </div>
                <div>
                  <div className="text-gray-600">Lead Time</div>
                  <div className="font-medium text-gray-900">{supplier.leadTime} days</div>
                </div>
                <div>
                  <div className="text-gray-600">Min Order</div>
                  <div className="font-medium text-gray-900">{formatCurrency(supplier.minimumOrder)}</div>
                </div>
                <div>
                  <div className="text-gray-600">Currency</div>
                  <div className="font-medium text-gray-900">{supplier.currency}</div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{supplier.totalOrders}</div>
                    <div className="text-gray-600">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(supplier.totalSpent)}</div>
                    <div className="text-gray-600">Total Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">
                      {supplier.lastOrderDate ? 'Last Order' : 'Never Ordered'}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {supplier.lastOrderDate ? formatDate(supplier.lastOrderDate) : '-'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              {supplier.status === 'pending' && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusChange(supplier.id, 'active')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(supplier.id, 'inactive')}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Details Modal */}
      {showDetails && selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Supplier Details</h2>
                <p className="text-sm text-gray-500">{selectedSupplier.name}</p>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Company Name</label>
                      <div className="text-sm text-gray-900">{selectedSupplier.name}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <div className="text-sm text-gray-900">{selectedSupplier.email}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <div className="text-sm text-gray-900">{selectedSupplier.phone}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Website</label>
                      <div className="text-sm text-gray-900">{selectedSupplier.website}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Address</label>
                      <div className="text-sm text-gray-900">
                        {selectedSupplier.address.street}<br />
                        {selectedSupplier.address.city}, {selectedSupplier.address.postcode}<br />
                        {selectedSupplier.address.country}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Business Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedSupplier.status)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Rating</label>
                      <div className="mt-1">{renderStars(selectedSupplier.rating)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Payment Terms</label>
                      <div className="text-sm text-gray-900">{selectedSupplier.paymentTerms}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Currency</label>
                      <div className="text-sm text-gray-900">{selectedSupplier.currency}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Lead Time</label>
                      <div className="text-sm text-gray-900">{selectedSupplier.leadTime} days</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Minimum Order</label>
                      <div className="text-sm text-gray-900">{formatCurrency(selectedSupplier.minimumOrder)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSupplier.categories.map(category => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Performance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{selectedSupplier.totalOrders}</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(selectedSupplier.totalSpent)}</div>
                    <div className="text-sm text-gray-600">Total Spent</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Member Since</div>
                    <div className="text-sm font-medium text-gray-900">{formatDate(selectedSupplier.createdAt)}</div>
                  </div>
                </div>
              </div>

              {selectedSupplier.notes && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
                  <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {selectedSupplier.notes}
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Supplier
                </Button>
                <Button variant="primary">
                  <Plus className="h-4 w-4 mr-2" />
                  New Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredSuppliers.length === 0 && !loading && (
        <div className="text-center py-12">
          <Truck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No suppliers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Get started by adding your first supplier.'}
          </p>
          <div className="mt-6">
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}