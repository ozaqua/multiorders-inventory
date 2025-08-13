'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { ProductWithRelations, ProductCategory } from '@/types'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { 
  ArrowLeft,
  Package,
  Edit,
  Settings,
  Layers3,
  Merge,
  Component,
  AlertCircle,
  ArrowRight,
  X
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { PRODUCT_TYPE_RULES } from '@/lib/business-logic/product-rules'

export const dynamic = 'force-dynamic'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  
  const [product, setProduct] = useState<ProductWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showConvertModal, setShowConvertModal] = useState(false)
  const [availableConversions, setAvailableConversions] = useState<ProductCategory[]>([])
  const [converting, setConverting] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        
        // Fetch product details
        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) throw new Error('Failed to fetch product')
        const productData = await response.json()
        setProduct(productData)
        
        // Fetch available conversions
        const conversionResponse = await fetch(`/api/products/${productId}/validate-conversion`)
        if (conversionResponse.ok) {
          const { availableTypes } = await conversionResponse.json()
          setAvailableConversions(availableTypes)
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Failed to load product details')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleConvertType = async (targetType: ProductCategory) => {
    setConverting(true)
    try {
      const response = await fetch(`/api/products/${productId}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType })
      })

      const result = await response.json()
      
      if (response.ok) {
        // Reload product data
        window.location.reload()
      } else {
        alert(result.error || 'Failed to convert product')
      }
    } catch (error) {
      console.error('Conversion error:', error)
      alert('Failed to convert product type')
    } finally {
      setConverting(false)
      setShowConvertModal(false)
    }
  }

  const getTypeIcon = (category: ProductCategory) => {
    switch (category) {
      case 'SIMPLE': return Component
      case 'BUNDLED': return Layers3
      case 'MERGED': return Merge
      default: return Package
    }
  }

  const getTypeColor = (category: ProductCategory) => {
    switch (category) {
      case 'SIMPLE': return 'text-green-600 bg-green-100'
      case 'BUNDLED': return 'text-blue-600 bg-blue-100'
      case 'MERGED': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading product...</span>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{error || 'Product not found'}</div>
        </div>
      </div>
    )
  }

  const TypeIcon = getTypeIcon(product.category || 'CONFIGURABLE')
  const typeColor = getTypeColor(product.category || 'CONFIGURABLE')
  const typeRules = PRODUCT_TYPE_RULES[product.category || 'CONFIGURABLE']

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Product Details</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Product Overview */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-20 h-20 rounded-lg flex items-center justify-center ${typeColor}`}>
              <TypeIcon className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
              <p className="text-gray-600">SKU: {product.sku}</p>
              <div className="flex items-center space-x-3 mt-2">
                <Badge variant="status" status={product.category?.toLowerCase() || 'standard'}>
                  {product.category || 'Configurable'}
                </Badge>
                <Badge variant="status" status={product.status?.toLowerCase() || 'active'}>
                  {product.status}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {product.warehouse?.available || 0}
            </div>
            <div className="text-sm text-gray-500">Available Stock</div>
            {product.category === 'SIMPLE' && (
              <div className="mt-2 text-xs text-green-600 font-medium">
                ✓ Manually Editable
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Type Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Product Type: {product.category || 'Configurable'}</h3>
            <p className="text-sm text-blue-700 mt-1">{typeRules?.description}</p>
            
            {/* Type-specific rules */}
            <div className="mt-3 space-y-1">
              {product.category === 'SIMPLE' && (
                <>
                  <div className="text-xs text-blue-600">• Can be used as component in bundles</div>
                  <div className="text-xs text-blue-600">• Stock levels can be manually edited</div>
                  <div className="text-xs text-blue-600">• Cannot become bundled while used as component</div>
                </>
              )}
              {product.category === 'BUNDLED' && (
                <>
                  <div className="text-xs text-blue-600">• Composed of SIMPLE product components</div>
                  <div className="text-xs text-blue-600">• Cannot be used as component in other bundles</div>
                  <div className="text-xs text-blue-600">• Cannot be merged with other products</div>
                </>
              )}
              {product.category === 'MERGED' && (
                <>
                  <div className="text-xs text-blue-600">• Combines identical products from multiple channels</div>
                  <div className="text-xs text-blue-600">• Cannot be used as component</div>
                  <div className="text-xs text-blue-600">• Cannot be converted to bundle</div>
                </>
              )}
              {(!product.category || product.category === 'CONFIGURABLE') && (
                <>
                  <div className="text-xs text-blue-600">• Can be converted to any other product type</div>
                  <div className="text-xs text-blue-600">• Default state for new products</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Type Conversion Actions */}
      {availableConversions.length > 0 && (
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Product Type Conversion</h3>
          <p className="text-sm text-gray-600 mb-4">
            This product can be converted to the following types:
          </p>
          <div className="flex items-center space-x-3">
            {availableConversions.map((type) => {
              const Icon = getTypeIcon(type)
              return (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowConvertModal(true)
                  }}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>Convert to {type}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )
            })}
          </div>
        </div>
      )}

      {/* Inventory Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Stock</span>
              <span className="text-sm font-medium text-gray-900">
                {product.warehouse?.total || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Available</span>
              <span className="text-sm font-medium text-gray-900">
                {product.warehouse?.available || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">In Orders</span>
              <span className="text-sm font-medium text-gray-900">
                {product.warehouse?.inOrder || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>
          <div className="space-y-3">
            {product.prices?.map((price, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-sm text-gray-600">{price.platform}</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(price.price)}
                </span>
              </div>
            ))}
            {(!product.prices || product.prices.length === 0) && (
              <p className="text-sm text-gray-500">No pricing set</p>
            )}
          </div>
        </div>
      </div>

      {/* Conversion Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Convert Product Type</h2>
                <button
                  onClick={() => setShowConvertModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Select the new product type for this product:
              </p>
              
              <div className="space-y-3">
                {availableConversions.map((type) => {
                  const Icon = getTypeIcon(type)
                  const color = getTypeColor(type)
                  const rules = PRODUCT_TYPE_RULES[type]
                  
                  return (
                    <button
                      key={type}
                      onClick={() => handleConvertType(type)}
                      disabled={converting}
                      className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{type}</div>
                          <div className="text-xs text-gray-500">{rules?.description}</div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </button>
                  )
                })}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowConvertModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}