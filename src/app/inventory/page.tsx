'use client'

import { useState, useEffect } from 'react'

import { getAllProducts, getProductsByCategory } from '@/lib/database/products'
import type { ProductWithRelations, ProductCategory } from '@/types'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { 
  Search,
  Filter,
  Columns3,
  SortDesc,
  Settings,
  Upload,
  Download,
  Plus,
  Package,
  Tag as TagIcon,
  Eye
} from 'lucide-react'

const categories = [
  { id: 'all', label: 'All', count: 89 },
  { id: 'configurable', label: 'Configurable', count: 0 },
  { id: 'merged', label: 'Merged', count: 0 },
  { id: 'bundled', label: 'Bundled', count: 0 },
  { id: 'simple', label: 'Simple', count: 89 }
]

const platforms = [
  { name: 'amazon', color: 'bg-orange-500', textColor: 'text-white' },
  { name: 'ebay', color: 'bg-blue-500', textColor: 'text-white' },
  { name: 'shopify', color: 'bg-green-500', textColor: 'text-white' },
  { name: 'wix', color: 'bg-purple-500', textColor: 'text-white' },
  { name: 'etsy', color: 'bg-orange-600', textColor: 'text-white' }
]

// Force this page to be dynamic to prevent pre-render errors
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function InventoryPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<ProductWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        let productsData: ProductWithRelations[]
        
        if (activeCategory === 'all') {
          productsData = await getAllProducts()
        } else {
          productsData = await getProductsByCategory(activeCategory.toUpperCase() as ProductCategory)
        }
        
        setProducts(productsData)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(`Failed to load products: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [activeCategory])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getPlatformBadge = (platformName: string) => {
    const platform = platforms.find(p => p.name === platformName.toLowerCase())
    if (!platform) return null
    
    return (
      <div key={platformName} className={`w-6 h-6 rounded flex items-center justify-center ${platform.color} ${platform.textColor} text-xs font-bold`}>
        {platformName.charAt(0).toUpperCase()}
      </div>
    )
  }

  // Get platforms from product prices
  const getProductPlatforms = (product: ProductWithRelations): string[] => {
    return product.prices.map(price => price.platform.toLowerCase())
  }

  const getStockColor = (available: number, total: number) => {
    if (available <= 0) return 'text-red-600 bg-red-50'
    if (available < total * 0.2) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

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
          <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your products across all sales channels
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
          {categories.map((category) => (
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
            <Columns3 className="h-4 w-4 mr-2" />
            Columns
          </Button>
          <Button variant="outline" size="sm">
            <SortDesc className="h-4 w-4 mr-2" />
            Sort by Date
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Total Items: <span className="font-medium">{filteredProducts.length}</span>
          </span>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Actions
            </Button>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Lister
            </Button>
            <Button variant="ghost" size="sm">
              <TagIcon className="h-4 w-4 mr-2" />
              Tag
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
            placeholder="Search by product title or sku"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ASIN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tag
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warehouse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reorder Point
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
              </tr>
              {/* Warehouse sub-headers */}
              <tr className="bg-gray-50 border-t">
                <th colSpan={7}></th>
                <th className="px-6 py-2">
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                    <span>TOTAL</span>
                    <span>IN-ORDER</span>
                    <span>AVAILABLE</span>
                  </div>
                </th>
                <th colSpan={2}></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product, index) => (
                <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {getProductPlatforms(product).map(platform => getPlatformBadge(platform))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs">
                      {product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.asin || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.tag && (
                      <Badge variant="status" status={product.tag === 'M' ? 'active' : 'default'}>
                        {product.tag}
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="font-medium text-gray-900">
                        {product.warehouse?.total || 0}
                      </span>
                      <span className="text-gray-600">
                        {product.warehouse?.inOrder || 0}
                      </span>
                      <span className={`font-medium px-2 py-1 rounded text-center ${getStockColor(product.warehouse?.available || 0, product.warehouse?.total || 0)}`}>
                        {product.warehouse?.available || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {product.reorderPoint ? (
                      <span className="font-medium text-gray-900">{product.reorderPoint}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {product.prices.map((price) => (
                        <div key={price.platform} className="text-sm">
                          <span className="font-medium">${price.price}</span>
                        </div>
                      ))}
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
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredProducts.length}</span> of{' '}
          <span className="font-medium">{filteredProducts.length}</span> results
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}