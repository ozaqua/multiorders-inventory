'use client'

import { useState, useEffect } from 'react'

import type { ProductWithRelations } from '@/types'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { 
  Search,
  Filter,
  Plus,
  Edit,
  Package,
  Layers3,
  Upload,
  Download,
  Eye,
  Settings
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const bundleCategories = [
  { id: 'all', label: 'All', count: 12 },
  { id: 'configurable', label: 'Configurable', count: 8 },
  { id: 'merged', label: 'Merged', count: 2 },
  { id: 'bundled', label: 'Bundled', count: 2 },
  { id: 'simple', label: 'Simple', count: 0 }
]

interface BundleProduct extends ProductWithRelations {
  components: {
    productId: string
    productName: string
    sku: string
    quantityNeeded: number
    availableStock: number
  }[]
  retailPrice: number
}

// Client component - uses dynamic data fetching

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('bundled')
  const [searchTerm, setSearchTerm] = useState('')
  const [bundles, setBundles] = useState<BundleProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBundle, setSelectedBundle] = useState<BundleProduct | null>(null)
  const [showBundleDetails, setShowBundleDetails] = useState(false)

  useEffect(() => {
    async function fetchBundles() {
      try {
        setLoading(true)
        const response = await fetch('/api/bundles')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch bundle data')
        }

        setBundles(data.bundles as BundleProduct[])
      } catch (err) {
        console.error('Error fetching bundles:', err)
        setError(`Failed to load bundle products: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchBundles()
  }, [])

  const filteredBundles = bundles.filter(bundle => {
    const matchesCategory = activeCategory === 'all' || bundle.category.toLowerCase() === activeCategory
    const matchesSearch = bundle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bundle.sku.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleViewBundle = (bundle: BundleProduct) => {
    setSelectedBundle(bundle)
    setShowBundleDetails(true)
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading bundles...</span>
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
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your product catalog and bundles
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Product
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {bundleCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeCategory === category.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {category.label}
              {category.count > 0 && (
                <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                  {category.count}
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
            Sort by Date
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Total Items: <span className="font-medium">{filteredBundles.length}</span>
          </span>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Actions
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product title or sku"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Bundle Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredBundles.map((bundle) => (
          <div key={bundle.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Layers3 className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{bundle.name}</h3>
                  <p className="text-sm text-gray-600">SKU: {bundle.sku}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="status" status="bundled">Bundle</Badge>
                    <span className="text-sm text-gray-500">
                      {bundle.components.length} components
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {bundle.warehouse?.available || 0}
                </div>
                <div className="text-sm text-gray-500">Available</div>
                <div className="text-lg font-semibold text-green-600 mt-1">
                  {formatCurrency(bundle.retailPrice)}
                </div>
              </div>
            </div>

            {/* Bundle Components */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Bundle Components</h4>
              <div className="space-y-2">
                {bundle.components.map((component, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded flex items-center justify-center border">
                        <Package className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {component.productName}
                        </div>
                        <div className="text-xs text-gray-500">
                          SKU: {component.sku}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-gray-900">
                          {component.quantityNeeded}
                        </div>
                        <div className="text-xs text-gray-500">Qty in Bundle</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-medium ${
                          component.availableStock >= component.quantityNeeded 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {component.availableStock}
                        </div>
                        <div className="text-xs text-gray-500">Available</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-blue-600">
                          {Math.floor(component.availableStock / component.quantityNeeded)}
                        </div>
                        <div className="text-xs text-gray-500">Qty in Bundle</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bundle Actions */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="text-gray-600">Bin Location:</span>
                    <span className="font-medium text-gray-900 ml-2">BA→33</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Supplier:</span>
                    <span className="font-medium text-gray-900 ml-2">Calypso Co.</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Buy Price:</span>
                    <span className="font-medium text-gray-900 ml-2">{formatCurrency(89.58)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewBundle(bundle)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Bundle
                  </Button>
                  <Button variant="primary" size="sm">
                    Bundle
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bundle Details Modal */}
      {showBundleDetails && selectedBundle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Bundle Details</h2>
                <p className="text-sm text-gray-500">{selectedBundle.name}</p>
              </div>
              <button
                onClick={() => setShowBundleDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bundle Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Bundle Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Product Name</label>
                      <div className="text-sm text-gray-900">{selectedBundle.name}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">SKU</label>
                      <div className="text-sm text-gray-900">{selectedBundle.sku}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Retail Price</label>
                      <div className="text-sm text-gray-900">{formatCurrency(selectedBundle.retailPrice)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Available Quantity</label>
                      <div className="text-sm text-gray-900">{selectedBundle.warehouse?.available || 0} units</div>
                    </div>
                  </div>
                </div>

                {/* Components */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Components</h3>
                  <div className="space-y-3">
                    {selectedBundle.components.map((component, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{component.productName}</div>
                          <div className="text-xs text-gray-500">{component.sku}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {component.quantityNeeded} needed
                          </div>
                          <div className="text-xs text-gray-500">
                            {component.availableStock} available
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowBundleDetails(false)}>
                  Close
                </Button>
                <Button variant="primary">
                  Edit Bundle
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredBundles.length === 0 && (
        <div className="text-center py-12">
          <Layers3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bundles found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeCategory === 'all' 
              ? 'Get started by creating your first bundle.' 
              : `No ${activeCategory} bundles found. Try a different category.`}
          </p>
          <div className="mt-6">
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Bundle
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}