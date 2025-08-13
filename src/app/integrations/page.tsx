'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  Plug,
  CheckCircle,
  AlertCircle,
  Plus,
  Settings,
  RefreshCw,
  ExternalLink,
  Activity,
  Zap,
  Shield,
  Globe
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

// Client component - uses dynamic data fetching

interface Integration {
  id: string
  name: string
  description: string
  category: 'marketplace' | 'shipping' | 'accounting' | 'marketing' | 'analytics'
  logo: string
  status: 'connected' | 'disconnected' | 'error' | 'pending'
  version?: string
  connectedAt?: string
  lastSync?: string
  syncFrequency: string
  features: string[]
  metrics?: {
    ordersImported: number
    productssynced: number
    errors: number
  }
}

interface AvailableIntegration {
  id: string
  name: string
  description: string
  category: string
  logo: string
  features: string[]
  pricing: 'free' | 'premium' | 'enterprise'
  popular?: boolean
}

const mockIntegrations: Integration[] = [
  {
    id: 'ebay-001',
    name: 'eBay',
    description: 'Connect your eBay store to sync listings, orders, and inventory',
    category: 'marketplace',
    logo: '🛒',
    status: 'connected',
    version: '2.1.4',
    connectedAt: '2023-09-15T10:30:00Z',
    lastSync: '2024-01-15T08:00:00Z',
    syncFrequency: 'Every 15 minutes',
    features: ['Order Import', 'Inventory Sync', 'Listing Management', 'Price Updates'],
    metrics: {
      ordersImported: 1234,
      productssynced: 89,
      errors: 2
    }
  },
  {
    id: 'amazon-001',
    name: 'Amazon Seller Central',
    description: 'Integrate with Amazon to manage your seller account',
    category: 'marketplace',
    logo: '📦',
    status: 'connected',
    version: '1.8.2',
    connectedAt: '2023-11-20T14:15:00Z',
    lastSync: '2024-01-15T07:45:00Z',
    syncFrequency: 'Every 30 minutes',
    features: ['FBA Orders', 'Inventory Management', 'Product Catalog', 'Reports'],
    metrics: {
      ordersImported: 856,
      productssynced: 67,
      errors: 0
    }
  },
  {
    id: 'shopify-001',
    name: 'Shopify',
    description: 'Connect your Shopify store for seamless order and product sync',
    category: 'marketplace',
    logo: '🛍️',
    status: 'error',
    version: '3.2.1',
    connectedAt: '2023-12-05T09:20:00Z',
    lastSync: '2024-01-14T18:30:00Z',
    syncFrequency: 'Every 10 minutes',
    features: ['Order Sync', 'Product Updates', 'Customer Data', 'Webhook Support'],
    metrics: {
      ordersImported: 445,
      productssynced: 78,
      errors: 15
    }
  },
  {
    id: 'royal-mail-001',
    name: 'Royal Mail',
    description: 'Generate shipping labels and track packages',
    category: 'shipping',
    logo: '📮',
    status: 'connected',
    version: '1.4.0',
    connectedAt: '2023-10-10T11:45:00Z',
    lastSync: '2024-01-15T09:15:00Z',
    syncFrequency: 'On demand',
    features: ['Label Generation', 'Tracking', 'Manifest Creation', 'Address Validation'],
    metrics: {
      ordersImported: 0,
      productssynced: 0,
      errors: 0
    }
  },
  {
    id: 'quickbooks-001',
    name: 'QuickBooks',
    description: 'Sync financial data with QuickBooks accounting software',
    category: 'accounting',
    logo: '💼',
    status: 'disconnected',
    syncFrequency: 'Daily',
    features: ['Invoice Sync', 'Expense Tracking', 'Tax Reports', 'Financial Analytics']
  }
]

const mockAvailableIntegrations: AvailableIntegration[] = [
  {
    id: 'wix-001',
    name: 'Wix',
    description: 'Connect your Wix eCommerce store',
    category: 'marketplace',
    logo: '🌐',
    features: ['Order Import', 'Product Sync', 'Inventory Updates'],
    pricing: 'free',
    popular: true
  },
  {
    id: 'etsy-001',
    name: 'Etsy',
    description: 'Manage your Etsy shop listings and orders',
    category: 'marketplace',
    logo: '🎨',
    features: ['Listing Management', 'Order Processing', 'Shop Analytics'],
    pricing: 'premium'
  },
  {
    id: 'dhl-001',
    name: 'DHL',
    description: 'International shipping and tracking',
    category: 'shipping',
    logo: '✈️',
    features: ['International Shipping', 'Real-time Tracking', 'Customs Forms'],
    pricing: 'enterprise'
  },
  {
    id: 'google-analytics-001',
    name: 'Google Analytics',
    description: 'Track website and sales performance',
    category: 'analytics',
    logo: '📊',
    features: ['Traffic Analysis', 'Conversion Tracking', 'Custom Reports'],
    pricing: 'free',
    popular: true
  },
  {
    id: 'mailchimp-001',
    name: 'Mailchimp',
    description: 'Email marketing and customer communication',
    category: 'marketing',
    logo: '📧',
    features: ['Email Campaigns', 'Customer Segmentation', 'Automation'],
    pricing: 'premium'
  }
]

export const dynamic = 'force-dynamic'

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<'connected' | 'available' | 'marketplace'>('connected')
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [availableIntegrations, setAvailableIntegrations] = useState<AvailableIntegration[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 600))
        setIntegrations(mockIntegrations)
        setAvailableIntegrations(mockAvailableIntegrations)
      } catch (err) {
        console.error('Error fetching integrations data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusBadge = (status: Integration['status']) => {
    const variants = {
      connected: 'success' as const,
      disconnected: 'secondary' as const,
      error: 'error' as const,
      pending: 'warning' as const
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }


  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'marketplace':
        return <Globe className="h-4 w-4" />
      case 'shipping':
        return <Activity className="h-4 w-4" />
      case 'accounting':
        return <Shield className="h-4 w-4" />
      case 'marketing':
        return <Zap className="h-4 w-4" />
      case 'analytics':
        return <Activity className="h-4 w-4" />
      default:
        return <Plug className="h-4 w-4" />
    }
  }

  const getPricingBadge = (pricing: string) => {
    const variants = {
      free: 'success' as const,
      premium: 'warning' as const,
      enterprise: 'info' as const
    }
    return <Badge variant={variants[pricing as keyof typeof variants] || 'default'}>{pricing}</Badge>
  }

  const handleConnect = (integrationId: string) => {
    console.log('Connecting to:', integrationId)
    // Simulate connection process
  }

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'disconnected' as const }
        : integration
    ))
  }

  const handleSync = (integrationId: string) => {
    console.log('Syncing:', integrationId)
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, lastSync: new Date().toISOString() }
        : integration
    ))
  }

  const handleViewDetails = (integration: Integration) => {
    setSelectedIntegration(integration)
    setShowDetails(true)
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading integrations...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Integrations</h1>
          <p className="text-sm text-gray-600 mt-1">
            Connect your favorite tools and services to streamline your workflow
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Browse Marketplace
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Custom Integration
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {integrations.filter(i => i.status === 'connected').length}
                </div>
                <div className="text-sm text-gray-500">Connected</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Plug className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {availableIntegrations.length}
                </div>
                <div className="text-sm text-gray-500">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {integrations.filter(i => i.status === 'error').length}
                </div>
                <div className="text-sm text-gray-500">Errors</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {integrations.reduce((sum, i) => sum + (i.metrics?.ordersImported || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Orders Synced</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'connected', label: 'Connected', count: integrations.filter(i => i.status === 'connected').length },
            { id: 'available', label: 'Available', count: availableIntegrations.length },
            { id: 'marketplace', label: 'Marketplace', count: 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'connected' | 'available' | 'marketplace')}
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

      {/* Connected Tab */}
      {activeTab === 'connected' && (
        <div className="space-y-4">
          {integrations.map((integration) => (
            <Card key={integration.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{integration.logo}</div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">{integration.name}</h3>
                        {getStatusBadge(integration.status)}
                        {integration.version && (
                          <span className="text-sm text-gray-500">v{integration.version}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{integration.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          {getCategoryIcon(integration.category)}
                          <span className="capitalize">{integration.category}</span>
                        </div>
                        <div>Sync: {integration.syncFrequency}</div>
                        {integration.lastSync && (
                          <div>Last sync: {formatDate(integration.lastSync)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(integration)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    
                    {integration.status === 'connected' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(integration.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync
                      </Button>
                    )}
                    
                    <Button
                      variant={integration.status === 'connected' ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => integration.status === 'connected' 
                        ? handleDisconnect(integration.id) 
                        : handleConnect(integration.id)}
                    >
                      {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </div>

                {/* Metrics */}
                {integration.metrics && integration.status === 'connected' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{integration.metrics.ordersImported}</div>
                        <div className="text-gray-600">Orders Imported</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{integration.metrics.productssynced}</div>
                        <div className="text-gray-600">Products Synced</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xl font-bold ${integration.metrics.errors > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                          {integration.metrics.errors}
                        </div>
                        <div className="text-gray-600">Sync Errors</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Available Tab */}
      {activeTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableIntegrations.map((integration) => (
            <Card key={integration.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">{integration.logo}</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{integration.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                  
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="flex items-center space-x-1">
                      {getCategoryIcon(integration.category)}
                      <span className="text-sm text-gray-500 capitalize">{integration.category}</span>
                    </div>
                    {getPricingBadge(integration.pricing)}
                    {integration.popular && (
                      <Badge variant="info" size="sm">Popular</Badge>
                    )}
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
                    <div className="space-y-1">
                      {integration.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="text-sm text-gray-600">• {feature}</div>
                      ))}
                      {integration.features.length > 3 && (
                        <div className="text-sm text-gray-500">+{integration.features.length - 3} more</div>
                      )}
                    </div>
                  </div>

                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleConnect(integration.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Marketplace Tab */}
      {activeTab === 'marketplace' && (
        <div className="text-center py-12">
          <ExternalLink className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Integration Marketplace</h3>
          <p className="mt-1 text-sm text-gray-500">
            Browse hundreds of integrations from our marketplace partners.
          </p>
          <div className="mt-6">
            <Button variant="primary">
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Marketplace
            </Button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{selectedIntegration.logo}</div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedIntegration.name}</h2>
                  <p className="text-sm text-gray-500">{selectedIntegration.description}</p>
                </div>
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
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedIntegration.status)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Version</label>
                      <div className="text-sm text-gray-900">{selectedIntegration.version || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Sync Frequency</label>
                      <div className="text-sm text-gray-900">{selectedIntegration.syncFrequency}</div>
                    </div>
                    {selectedIntegration.connectedAt && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Connected At</label>
                        <div className="text-sm text-gray-900">{formatDate(selectedIntegration.connectedAt)}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
                  <div className="space-y-2">
                    {selectedIntegration.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-900">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedIntegration.metrics && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{selectedIntegration.metrics.ordersImported}</div>
                      <div className="text-sm text-gray-600">Orders Imported</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{selectedIntegration.metrics.productssynced}</div>
                      <div className="text-sm text-gray-600">Products Synced</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className={`text-2xl font-bold ${selectedIntegration.metrics.errors > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {selectedIntegration.metrics.errors}
                      </div>
                      <div className="text-sm text-gray-600">Sync Errors</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
                {selectedIntegration.status === 'connected' && (
                  <Button variant="primary" onClick={() => {
                    handleSync(selectedIntegration.id)
                    setShowDetails(false)
                  }}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State for Connected */}
      {activeTab === 'connected' && integrations.filter(i => i.status === 'connected').length === 0 && (
        <div className="text-center py-12">
          <Plug className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No connected integrations</h3>
          <p className="mt-1 text-sm text-gray-500">
            Connect your first integration to start syncing data.
          </p>
          <div className="mt-6">
            <Button variant="primary" onClick={() => setActiveTab('available')}>
              <Plus className="h-4 w-4 mr-2" />
              Browse Integrations
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}