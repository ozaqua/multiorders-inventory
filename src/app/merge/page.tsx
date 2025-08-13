'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  GitMerge,
  Search,
  Package,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Client component - uses dynamic data fetching

interface Product {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  platform: string
  asin?: string
  status: 'active' | 'inactive' | 'merged'
}

interface MergeCandidate {
  id: string
  primaryProduct: Product
  duplicates: Product[]
  similarity: number
  status: 'pending' | 'approved' | 'merged' | 'rejected'
  mergedAt?: string
}

const mockProducts: Product[] = [
  {
    id: 'PROD-001',
    name: 'Wireless Bluetooth Headphones - Black',
    sku: 'WBH-BLK-001',
    price: 29.99,
    stock: 15,
    platform: 'ebay',
    status: 'active'
  },
  {
    id: 'PROD-002',
    name: 'Wireless Bluetooth Headphones Black',
    sku: 'WBH-001-BLK',
    price: 29.99,
    stock: 8,
    platform: 'amazon',
    asin: 'B08XYZ123',
    status: 'active'
  },
  {
    id: 'PROD-003',
    name: 'BT Headphones - Black Color',
    sku: 'BTHP-BLK-V1',
    price: 31.99,
    stock: 12,
    platform: 'shopify',
    status: 'active'
  }
]

const mockMergeCandidates: MergeCandidate[] = [
  {
    id: 'MERGE-001',
    primaryProduct: mockProducts[0],
    duplicates: [mockProducts[1], mockProducts[2]],
    similarity: 92,
    status: 'pending'
  },
  {
    id: 'MERGE-002',
    primaryProduct: {
      id: 'PROD-004',
      name: 'USB-C Cable 2m',
      sku: 'USB-C-2M-001',
      price: 9.99,
      stock: 25,
      platform: 'ebay',
      status: 'active'
    },
    duplicates: [
      {
        id: 'PROD-005',
        name: 'USB Type-C Cable 2 Meter',
        sku: 'USBC-2MTR-V1',
        price: 9.99,
        stock: 18,
        platform: 'amazon',
        asin: 'B08ABC456',
        status: 'active'
      }
    ],
    similarity: 88,
    status: 'approved'
  },
  {
    id: 'MERGE-003',
    primaryProduct: {
      id: 'PROD-006',
      name: 'Phone Stand Adjustable',
      sku: 'PST-ADJ-001',
      price: 14.99,
      stock: 20,
      platform: 'shopify',
      status: 'active'
    },
    duplicates: [
      {
        id: 'PROD-007',
        name: 'Adjustable Phone Stand',
        sku: 'APS-STD-V2',
        price: 15.99,
        stock: 0,
        platform: 'ebay',
        status: 'active'
      }
    ],
    similarity: 95,
    status: 'merged',
    mergedAt: '2024-01-14T15:30:00Z'
  }
]

export const dynamic = 'force-dynamic'

export default function MergePage() {
  const [mergeCandidates, setMergeCandidates] = useState<MergeCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'merged' | 'rejected'>('all')
  const [selectedCandidate, setSelectedCandidate] = useState<MergeCandidate | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Simulate API call
    const fetchMergeCandidates = async () => {
      try {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 800))
        setMergeCandidates(mockMergeCandidates)
      } catch (err) {
        console.error('Error fetching merge candidates:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMergeCandidates()
  }, [])

  const filteredCandidates = mergeCandidates.filter(candidate => {
    const matchesSearch = 
      candidate.primaryProduct.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.primaryProduct.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.duplicates.some(dup => 
        dup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dup.sku.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const handleApprove = (candidateId: string) => {
    setMergeCandidates(prev => prev.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, status: 'approved' as const }
        : candidate
    ))
  }

  const handleReject = (candidateId: string) => {
    setMergeCandidates(prev => prev.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, status: 'rejected' as const }
        : candidate
    ))
  }

  const handleMerge = (candidateId: string) => {
    setMergeCandidates(prev => prev.map(candidate => 
      candidate.id === candidateId 
        ? { 
            ...candidate, 
            status: 'merged' as const, 
            mergedAt: new Date().toISOString() 
          }
        : candidate
    ))
  }

  const handleViewDetails = (candidate: MergeCandidate) => {
    setSelectedCandidate(candidate)
    setShowDetails(true)
  }

  const getStatusBadge = (status: MergeCandidate['status']) => {
    const variants = {
      pending: 'warning' as const,
      approved: 'info' as const,
      merged: 'success' as const,
      rejected: 'error' as const
    }
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return 'text-green-600'
    if (similarity >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPlatformBadge = (platform: string) => {
    const colors = {
      amazon: 'bg-orange-500 text-white',
      ebay: 'bg-blue-500 text-white',
      shopify: 'bg-green-500 text-white',
      wix: 'bg-purple-500 text-white',
      etsy: 'bg-orange-600 text-white'
    }
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[platform as keyof typeof colors] || 'bg-gray-500 text-white'}`}>
        {platform.toUpperCase()}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Analyzing products for duplicates...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Product Merge</h1>
          <p className="text-sm text-gray-600 mt-1">
            Find and merge duplicate products across platforms
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Scan for Duplicates
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Manual Merge
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <GitMerge className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {mergeCandidates.length}
                </div>
                <div className="text-sm text-gray-500">Merge Candidates</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {mergeCandidates.filter(c => c.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-500">Pending Review</div>
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
                  {mergeCandidates.filter(c => c.status === 'merged').length}
                </div>
                <div className="text-sm text-gray-500">Merged</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {mergeCandidates.reduce((total, candidate) => 
                    total + candidate.duplicates.length + 1, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Products</div>
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
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'approved' | 'merged' | 'rejected')}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="merged">Merged</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {filteredCandidates.length} of {mergeCandidates.length} candidates
        </div>
      </div>

      {/* Merge Candidates */}
      <div className="space-y-6">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <GitMerge className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">{candidate.id}</span>
                    {getStatusBadge(candidate.status)}
                  </div>
                  <div className={`text-sm font-medium ${getSimilarityColor(candidate.similarity)}`}>
                    {candidate.similarity}% Match
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(candidate)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                  
                  {candidate.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(candidate.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApprove(candidate.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    </>
                  )}
                  
                  {candidate.status === 'approved' && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleMerge(candidate.id)}
                    >
                      <GitMerge className="h-4 w-4 mr-2" />
                      Merge Now
                    </Button>
                  )}
                </div>
              </div>

              {/* Product Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Primary Product */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-green-800">Primary Product</span>
                    {getPlatformBadge(candidate.primaryProduct.platform)}
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-gray-900">{candidate.primaryProduct.name}</div>
                    <div className="text-sm text-gray-600">SKU: {candidate.primaryProduct.sku}</div>
                    {candidate.primaryProduct.asin && (
                      <div className="text-sm text-gray-600">ASIN: {candidate.primaryProduct.asin}</div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(candidate.primaryProduct.price)}
                      </span>
                      <span className="text-sm text-gray-600">
                        Stock: {candidate.primaryProduct.stock}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <ArrowRight className="h-8 w-8 text-gray-400" />
                </div>

                {/* Duplicates */}
                <div className="space-y-3">
                  {candidate.duplicates.map((duplicate, index) => (
                    <div key={duplicate.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-yellow-800">
                          Duplicate {index + 1}
                        </span>
                        {getPlatformBadge(duplicate.platform)}
                      </div>
                      <div className="space-y-2">
                        <div className="font-medium text-gray-900">{duplicate.name}</div>
                        <div className="text-sm text-gray-600">SKU: {duplicate.sku}</div>
                        {duplicate.asin && (
                          <div className="text-sm text-gray-600">ASIN: {duplicate.asin}</div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(duplicate.price)}
                          </span>
                          <span className="text-sm text-gray-600">
                            Stock: {duplicate.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCandidates.length === 0 && !loading && (
        <div className="text-center py-12">
          <GitMerge className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No merge candidates found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Run a duplicate scan to find potential merges.'}
          </p>
          <div className="mt-6">
            <Button variant="primary">
              <RefreshCw className="h-4 w-4 mr-2" />
              Scan for Duplicates
            </Button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Merge Details</h2>
                <p className="text-sm text-gray-500">{selectedCandidate.id}</p>
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
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Primary Product</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <div className="text-sm text-gray-900">{selectedCandidate.primaryProduct.name}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">SKU</label>
                        <div className="text-sm text-gray-900">{selectedCandidate.primaryProduct.sku}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Price</label>
                        <div className="text-sm text-gray-900">{formatCurrency(selectedCandidate.primaryProduct.price)}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Stock</label>
                        <div className="text-sm text-gray-900">{selectedCandidate.primaryProduct.stock}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Duplicate Products</h3>
                  <div className="space-y-4">
                    {selectedCandidate.duplicates.map((duplicate) => (
                      <div key={duplicate.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Name</label>
                            <div className="text-sm text-gray-900">{duplicate.name}</div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">SKU</label>
                            <div className="text-sm text-gray-900">{duplicate.sku}</div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Price</label>
                            <div className="text-sm text-gray-900">{formatCurrency(duplicate.price)}</div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Stock</label>
                            <div className="text-sm text-gray-900">{duplicate.stock}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
                {selectedCandidate.status === 'pending' && (
                  <>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        handleReject(selectedCandidate.id)
                        setShowDetails(false)
                      }}
                    >
                      Reject
                    </Button>
                    <Button 
                      variant="primary"
                      onClick={() => {
                        handleApprove(selectedCandidate.id)
                        setShowDetails(false)
                      }}
                    >
                      Approve Merge
                    </Button>
                  </>
                )}
                {selectedCandidate.status === 'approved' && (
                  <Button 
                    variant="success"
                    onClick={() => {
                      handleMerge(selectedCandidate.id)
                      setShowDetails(false)
                    }}
                  >
                    Merge Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}