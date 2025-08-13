'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card'
import { 
  Wrench,
  Upload,
  Download,
  Copy,
  Edit,
  Eye,
  Trash2,
  Plus,
  Search,
  FileText,
  Image as ImageIcon,
  DollarSign,
  Package,
  RefreshCw,
  ExternalLink,
  CheckCircle,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

// Client component - uses dynamic data fetching

interface ListingTemplate {
  id: string
  name: string
  description: string
  platforms: string[]
  category: string
  status: 'active' | 'draft' | 'archived'
  createdAt: string
  updatedAt: string
  usageCount: number
}

interface ListingDraft {
  id: string
  title: string
  platform: string
  category: string
  price: number
  status: 'draft' | 'pending' | 'published' | 'error'
  template?: string
  createdAt: string
  publishedAt?: string
  errorMessage?: string
}

interface BulkAction {
  id: string
  type: 'publish' | 'update_prices' | 'update_inventory' | 'delete'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  itemCount: number
  processedCount: number
  createdAt: string
  completedAt?: string
  errorCount: number
}

const mockTemplates: ListingTemplate[] = [
  {
    id: 'TPL-001',
    name: 'Electronics Standard',
    description: 'Standard template for electronics products with specs',
    platforms: ['ebay', 'amazon', 'shopify'],
    category: 'Electronics',
    status: 'active',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-14T15:30:00Z',
    usageCount: 45
  },
  {
    id: 'TPL-002',
    name: 'Fashion Basic',
    description: 'Basic template for clothing and accessories',
    platforms: ['ebay', 'etsy'],
    category: 'Fashion',
    status: 'active',
    createdAt: '2024-01-08T10:15:00Z',
    updatedAt: '2024-01-12T11:20:00Z',
    usageCount: 23
  },
  {
    id: 'TPL-003',
    name: 'Home & Garden Premium',
    description: 'Premium template with lifestyle images',
    platforms: ['shopify', 'wix'],
    category: 'Home & Garden',
    status: 'draft',
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-15T16:45:00Z',
    usageCount: 0
  }
]

const mockDrafts: ListingDraft[] = [
  {
    id: 'DFT-001',
    title: 'Wireless Bluetooth Headphones - Premium Quality',
    platform: 'ebay',
    category: 'Electronics',
    price: 29.99,
    status: 'draft',
    template: 'TPL-001',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'DFT-002',
    title: 'USB-C Cable 2m Fast Charging',
    platform: 'amazon',
    category: 'Electronics',
    price: 9.99,
    status: 'published',
    template: 'TPL-001',
    createdAt: '2024-01-14T16:20:00Z',
    publishedAt: '2024-01-15T08:15:00Z'
  },
  {
    id: 'DFT-003',
    title: 'Cotton T-Shirt Vintage Style',
    platform: 'etsy',
    category: 'Fashion',
    price: 24.99,
    status: 'error',
    template: 'TPL-002',
    createdAt: '2024-01-15T11:45:00Z',
    errorMessage: 'Missing required images'
  }
]

const mockBulkActions: BulkAction[] = [
  {
    id: 'BLK-001',
    type: 'publish',
    status: 'completed',
    itemCount: 15,
    processedCount: 15,
    createdAt: '2024-01-15T09:00:00Z',
    completedAt: '2024-01-15T09:15:00Z',
    errorCount: 0
  },
  {
    id: 'BLK-002',
    type: 'update_prices',
    status: 'processing',
    itemCount: 8,
    processedCount: 5,
    createdAt: '2024-01-15T11:30:00Z',
    errorCount: 0
  }
]

export const dynamic = 'force-dynamic'

export default function ListingToolsPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'drafts' | 'bulk' | 'history'>('templates')
  const [templates, setTemplates] = useState<ListingTemplate[]>([])
  const [drafts, setDrafts] = useState<ListingDraft[]>([])
  const [bulkActions, setBulkActions] = useState<BulkAction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 600))
        setTemplates(mockTemplates)
        setDrafts(mockDrafts)
        setBulkActions(mockBulkActions)
      } catch (err) {
        console.error('Error fetching listing data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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

  const getStatusBadge = (status: string, type?: 'template' | 'draft' | 'bulk') => {
    if (type === 'template') {
      const variants = {
        active: 'success' as const,
        draft: 'warning' as const,
        archived: 'error' as const
      }
      return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>
    }
    
    if (type === 'draft') {
      const variants = {
        draft: 'warning' as const,
        pending: 'info' as const,
        published: 'success' as const,
        error: 'error' as const
      }
      return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>
    }

    if (type === 'bulk') {
      const variants = {
        pending: 'warning' as const,
        processing: 'info' as const,
        completed: 'success' as const,
        failed: 'error' as const
      }
      return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>
    }

    return <Badge>{status}</Badge>
  }

  const handlePublishDraft = (draftId: string) => {
    setDrafts(prev => prev.map(draft => 
      draft.id === draftId 
        ? { ...draft, status: 'published' as const, publishedAt: new Date().toISOString() }
        : draft
    ))
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(template => template.id !== templateId))
  }

  const handleDeleteDraft = (draftId: string) => {
    setDrafts(prev => prev.filter(draft => draft.id !== draftId))
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading listing tools...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Listing Tools</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage templates, drafts, and bulk listing operations
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
            New Template
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {templates.length}
                </div>
                <div className="text-sm text-gray-500">Templates</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Edit className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {drafts.length}
                </div>
                <div className="text-sm text-gray-500">Drafts</div>
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
                  {drafts.filter(d => d.status === 'published').length}
                </div>
                <div className="text-sm text-gray-500">Published</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Wrench className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {bulkActions.filter(a => a.status === 'processing').length}
                </div>
                <div className="text-sm text-gray-500">Active Jobs</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'templates', label: 'Templates', count: templates.length },
            { id: 'drafts', label: 'Drafts', count: drafts.length },
            { id: 'bulk', label: 'Bulk Actions', count: bulkActions.length },
            { id: 'history', label: 'History', count: 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'templates' | 'drafts' | 'bulk' | 'history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
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

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-blue-100">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex space-x-1">
                          {template.platforms.map(platform => (
                            <span key={platform}>
                              {getPlatformBadge(platform)}
                            </span>
                          ))}
                        </div>
                        {getStatusBadge(template.status, 'template')}
                        <span className="text-sm text-gray-500">
                          Used {template.usageCount} times
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Drafts Tab */}
      {activeTab === 'drafts' && (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <Card key={draft.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-yellow-100">
                      <Edit className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{draft.title}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        {getPlatformBadge(draft.platform)}
                        <span className="text-sm text-gray-600">{draft.category}</span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(draft.price)}
                        </span>
                        {getStatusBadge(draft.status, 'draft')}
                      </div>
                      {draft.errorMessage && (
                        <div className="text-sm text-red-600 mt-1">
                          Error: {draft.errorMessage}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    {draft.status === 'draft' && (
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handlePublishDraft(draft.id)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Publish
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteDraft(draft.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Bulk Actions Tab */}
      {activeTab === 'bulk' && (
        <div className="space-y-6">
          {/* New Bulk Action */}
          <Card>
            <CardHeader>
              <CardTitle>Start New Bulk Action</CardTitle>
              <CardDescription>
                Perform actions on multiple listings at once
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button variant="outline" size="lg" className="h-20">
                  <div className="text-center">
                    <ExternalLink className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm">Bulk Publish</div>
                  </div>
                </Button>
                <Button variant="outline" size="lg" className="h-20">
                  <div className="text-center">
                    <DollarSign className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm">Update Prices</div>
                  </div>
                </Button>
                <Button variant="outline" size="lg" className="h-20">
                  <div className="text-center">
                    <Package className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm">Update Inventory</div>
                  </div>
                </Button>
                <Button variant="outline" size="lg" className="h-20">
                  <div className="text-center">
                    <ImageIcon className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm">Update Images</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active/Recent Bulk Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Actions</h3>
            {bulkActions.map((action) => (
              <Card key={action.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-full bg-purple-100">
                        <Wrench className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {action.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1">
                          {getStatusBadge(action.status, 'bulk')}
                          <span className="text-sm text-gray-600">
                            {action.processedCount} of {action.itemCount} items
                          </span>
                          {action.errorCount > 0 && (
                            <span className="text-sm text-red-600">
                              {action.errorCount} errors
                            </span>
                          )}
                        </div>
                        {action.status === 'processing' && (
                          <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${(action.processedCount / action.itemCount) * 100}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>Started: {formatDate(action.createdAt)}</div>
                      {action.completedAt && (
                        <div>Completed: {formatDate(action.completedAt)}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">History coming soon</h3>
          <p className="mt-1 text-sm text-gray-500">
            View detailed logs of all listing activities and changes.
          </p>
        </div>
      )}
    </div>
  )
}