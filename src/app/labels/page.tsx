'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  Tag,
  FileText,
  Printer,
  Download,
  Plus,
  Search,
  Truck,
  Eye,
  RefreshCw
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

// Client component - uses dynamic data fetching

interface Label {
  id: string
  orderId: string
  type: 'shipping' | 'return' | 'manifest'
  status: 'pending' | 'printed' | 'shipped'
  carrier: string
  trackingNumber?: string
  customerName: string
  destination: string
  createdAt: string
  printedAt?: string
}

const mockLabels: Label[] = [
  {
    id: 'LBL-001',
    orderId: 'ORD-12345',
    type: 'shipping',
    status: 'printed',
    carrier: 'Royal Mail',
    trackingNumber: 'RM123456789GB',
    customerName: 'John Smith',
    destination: 'London, UK',
    createdAt: '2024-01-15T10:30:00Z',
    printedAt: '2024-01-15T11:00:00Z'
  },
  {
    id: 'LBL-002',
    orderId: 'ORD-12346',
    type: 'shipping',
    status: 'pending',
    carrier: 'DPD',
    customerName: 'Jane Doe',
    destination: 'Manchester, UK',
    createdAt: '2024-01-15T11:15:00Z'
  },
  {
    id: 'LBL-003',
    orderId: 'ORD-12347',
    type: 'return',
    status: 'printed',
    carrier: 'Royal Mail',
    trackingNumber: 'RM123456790GB',
    customerName: 'Bob Johnson',
    destination: 'Birmingham, UK',
    createdAt: '2024-01-15T09:45:00Z',
    printedAt: '2024-01-15T10:15:00Z'
  },
  {
    id: 'MAN-001',
    orderId: 'BATCH-001',
    type: 'manifest',
    status: 'printed',
    carrier: 'Royal Mail',
    customerName: 'Batch Shipment',
    destination: 'Multiple',
    createdAt: '2024-01-15T08:00:00Z',
    printedAt: '2024-01-15T08:30:00Z'
  }
]

export const dynamic = 'force-dynamic'

export default function LabelsPage() {
  const [labels, setLabels] = useState<Label[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'shipping' | 'return' | 'manifest'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'printed' | 'shipped'>('all')

  useEffect(() => {
    // Simulate API call
    const fetchLabels = async () => {
      try {
        setLoading(true)
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500))
        setLabels(mockLabels)
      } catch (err) {
        console.error('Error fetching labels:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLabels()
  }, [])

  const filteredLabels = labels.filter(label => {
    const matchesSearch = 
      label.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      label.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      label.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      label.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || label.type === filterType
    const matchesStatus = filterStatus === 'all' || label.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: Label['status']) => {
    const variants = {
      pending: 'warning' as const,
      printed: 'success' as const,
      shipped: 'info' as const
    }
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const getTypeBadge = (type: Label['type']) => {
    const variants = {
      shipping: 'default' as const,
      return: 'warning' as const,
      manifest: 'info' as const
    }
    return <Badge variant={variants[type]}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>
  }

  const handlePrintLabel = (labelId: string) => {
    console.log('Printing label:', labelId)
    // Simulate printing
    setLabels(prev => prev.map(label => 
      label.id === labelId 
        ? { ...label, status: 'printed' as const, printedAt: new Date().toISOString() }
        : label
    ))
  }

  const handleBulkPrint = () => {
    console.log('Bulk printing pending labels')
    const pendingLabels = filteredLabels.filter(label => label.status === 'pending')
    setLabels(prev => prev.map(label => 
      pendingLabels.some(pl => pl.id === label.id)
        ? { ...label, status: 'printed' as const, printedAt: new Date().toISOString() }
        : label
    ))
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading labels...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Labels & Manifests</h1>
          <p className="text-sm text-gray-600 mt-1">
            Generate and manage shipping labels and manifests
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleBulkPrint}
            disabled={!filteredLabels.some(l => l.status === 'pending')}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Pending ({filteredLabels.filter(l => l.status === 'pending').length})
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Label
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Tag className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {labels.length}
                </div>
                <div className="text-sm text-gray-500">Total Labels</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {labels.filter(l => l.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Printer className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {labels.filter(l => l.status === 'printed').length}
                </div>
                <div className="text-sm text-gray-500">Printed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {labels.filter(l => l.status === 'shipped').length}
                </div>
                <div className="text-sm text-gray-500">Shipped</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search labels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'shipping' | 'return' | 'manifest')}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="shipping">Shipping</option>
            <option value="return">Return</option>
            <option value="manifest">Manifest</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'printed' | 'shipped')}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="printed">Printed</option>
            <option value="shipped">Shipped</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {filteredLabels.length} of {labels.length} labels
        </div>
      </div>

      {/* Labels Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Label ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carrier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLabels.map((label, index) => (
                  <tr key={label.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{label.id}</div>
                      {label.trackingNumber && (
                        <div className="text-sm text-gray-500">{label.trackingNumber}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800">
                        {label.orderId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(label.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(label.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {label.carrier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {label.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {label.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{formatDate(label.createdAt)}</div>
                      {label.printedAt && (
                        <div className="text-xs text-green-600">
                          Printed: {formatDate(label.printedAt)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2 justify-end">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {label.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePrintLabel(label.id)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
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
      {filteredLabels.length === 0 && !loading && (
        <div className="text-center py-12">
          <Tag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No labels found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Get started by creating your first shipping label.'}
          </p>
          <div className="mt-6">
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Label
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}