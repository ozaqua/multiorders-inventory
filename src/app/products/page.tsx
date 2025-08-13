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
  Settings,
  ArrowUpDown,
  MoreVertical,
  Merge,
  Component
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Product Type Tabs - matching your business logic
const productTabs = [
  { 
    id: 'all', 
    label: 'All Inventory', 
    description: 'All undesignated products that can be converted to other types',
    icon: Package
  },
  { 
    id: 'simple', 
    label: 'Simple Products', 
    description: 'Warehouse component SKUs - only products with editable stock',
    icon: Component
  },
  { 
    id: 'merged', 
    label: 'Merged Products', 
    description: 'Identical products combined from multiple sales channels',
    icon: Merge
  },
  { 
    id: 'bundled', 
    label: 'Bundled Products', 
    description: 'Products composed of Simple product components',
    icon: Layers3
  }
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

export const dynamic = 'force-dynamic'

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [allProducts, setAllProducts] = useState<ProductWithRelations[]>([])
  const [bundles, setBundles] = useState<BundleProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProductData() {
      try {
        setLoading(true)
        
        // Fetch both regular products and bundles in parallel
        const [productsResponse, bundlesResponse] = await Promise.all([
          fetch('/api/inventory'),
          fetch('/api/bundles')
        ])

        if (!productsResponse.ok || !bundlesResponse.ok) {
          throw new Error('Failed to fetch product data')
        }

        const productsData = await productsResponse.json()
        const bundlesData = await bundlesResponse.json()

        setAllProducts(productsData.products || [])
        setBundles(bundlesData.bundles || [])
      } catch (err) {
        console.error('Error fetching product data:', err)
        setError(`Failed to load products: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [])

  // Filter products based on active tab and business rules
  const getFilteredProducts = () => {
    let filteredData: (ProductWithRelations | BundleProduct)[] = []
    
    switch (activeTab) {
      case 'all':
        // All inventory - undesignated products (configurable by default)
        filteredData = allProducts.filter(product => 
          product.category === 'CONFIGURABLE' || !product.category
        )
        break
      case 'simple':
        // Simple products - warehouse components with editable stock
        filteredData = allProducts.filter(product => 
          product.category === 'SIMPLE'
        )
        break
      case 'merged':
        // Merged products - combined from multiple channels
        filteredData = allProducts.filter(product => 
          product.category === 'MERGED'
        )
        break
      case 'bundled':
        // Bundled products - contain components
        filteredData = bundles
        break
      default:
        filteredData = allProducts
    }

    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filteredData
  }

  const filteredProducts = getFilteredProducts()
  const currentTab = productTabs.find(tab => tab.id === activeTab)

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading products...</span>
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
            Manage inventory across all product types and sales channels
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

      {/* Product Type Tabs - Horizontal like Multiorders screenshots */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {productTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                  {activeTab === 'bundled' ? bundles.length : 
                   activeTab === 'all' ? allProducts.filter(p => !p.category || p.category === 'CONFIGURABLE').length :
                   allProducts.filter(p => p.category === tab.id.toUpperCase()).length}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Current Tab Description */}
      {currentTab && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <currentTab.icon className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900">{currentTab.label}</h3>
              <p className="text-sm text-blue-700">{currentTab.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products or SKUs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            <span className="font-medium">{filteredProducts.length}</span> products
          </span>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Actions
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          {currentTab && <currentTab.icon className="mx-auto h-12 w-12 text-gray-400" />}
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No {currentTab?.label.toLowerCase()} found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? `No products match "${searchTerm}". Try adjusting your search.`
              : currentTab?.description}
          </p>
          <div className="mt-6">
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Create {currentTab?.label.replace(' Products', '')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Product Card Component
function ProductCard({ product }: { 
  product: ProductWithRelations | BundleProduct
}) {
  const isBundle = 'components' in product
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
            {isBundle ? (
              <Layers3 className="h-8 w-8 text-blue-600" />
            ) : (
              <Package className="h-8 w-8 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-600">SKU: {product.sku}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="status" status={product.category?.toLowerCase() || 'standard'}>
                {product.category || 'Standard'}
              </Badge>
              {isBundle && (
                <span className="text-sm text-gray-500">
                  {product.components.length} components
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right flex items-center space-x-6">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {product.warehouse?.available || 0}
            </div>
            <div className="text-sm text-gray-500">Available</div>
          </div>
          {isBundle && (
            <div>
              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(product.retailPrice)}
              </div>
              <div className="text-sm text-gray-500">Retail Price</div>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bundle Components Display */}
      {isBundle && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Bundle Components</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {product.components.map((component, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Component className="h-4 w-4 text-gray-600" />
                  <div>
                    <div className="text-xs font-medium text-gray-900">
                      {component.productName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {component.sku}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-gray-900">
                    {component.quantityNeeded}×
                  </div>
                  <div className={`text-xs ${
                    component.availableStock >= component.quantityNeeded 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {component.availableStock} avail
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}