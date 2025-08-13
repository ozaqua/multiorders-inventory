'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card'
import { 
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  Calendar,
  Plus,
  Eye,
  RefreshCw,
  DollarSign,
  Package,
  ShoppingCart
} from 'lucide-react'
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils'

// Client component - uses dynamic data fetching

interface Report {
  id: string
  name: string
  description: string
  category: 'sales' | 'inventory' | 'financial' | 'performance'
  type: 'chart' | 'table' | 'summary'
  lastGenerated?: string
  size?: string
  status: 'ready' | 'generating' | 'error'
}

interface ReportData {
  salesOverview: {
    totalSales: number
    totalOrders: number
    averageOrderValue: number
    topProducts: Array<{ name: string; sales: number; quantity: number }>
  }
  inventoryOverview: {
    totalProducts: number
    lowStockItems: number
    outOfStockItems: number
    totalValue: number
  }
  performanceMetrics: {
    conversionRate: number
    returnRate: number
    customerSatisfaction: number
  }
}

const mockReports: Report[] = [
  {
    id: 'RPT-001',
    name: 'Sales Summary Report',
    description: 'Overview of sales performance, revenue, and top-selling products',
    category: 'sales',
    type: 'summary',
    lastGenerated: '2024-01-15T09:00:00Z',
    size: '2.3 MB',
    status: 'ready'
  },
  {
    id: 'RPT-002',
    name: 'Inventory Valuation Report',
    description: 'Current inventory levels, stock values, and reorder recommendations',
    category: 'inventory',
    type: 'table',
    lastGenerated: '2024-01-15T08:30:00Z',
    size: '1.8 MB',
    status: 'ready'
  },
  {
    id: 'RPT-003',
    name: 'Monthly Financial Report',
    description: 'Comprehensive financial overview including P&L and cash flow',
    category: 'financial',
    type: 'summary',
    lastGenerated: '2024-01-14T16:00:00Z',
    size: '4.1 MB',
    status: 'ready'
  },
  {
    id: 'RPT-004',
    name: 'Customer Analysis',
    description: 'Customer behavior, demographics, and purchase patterns',
    category: 'performance',
    type: 'chart',
    status: 'generating'
  },
  {
    id: 'RPT-005',
    name: 'Product Performance',
    description: 'Detailed analysis of product sales, margins, and trends',
    category: 'sales',
    type: 'chart',
    lastGenerated: '2024-01-12T14:20:00Z',
    size: '3.2 MB',
    status: 'ready'
  },
  {
    id: 'RPT-006',
    name: 'Supplier Performance',
    description: 'Supplier delivery times, quality metrics, and cost analysis',
    category: 'performance',
    type: 'table',
    status: 'error'
  }
]

const mockReportData: ReportData = {
  salesOverview: {
    totalSales: 45780.50,
    totalOrders: 234,
    averageOrderValue: 195.64,
    topProducts: [
      { name: 'Wireless Bluetooth Headphones', sales: 8950.00, quantity: 89 },
      { name: 'USB-C Cable 2m', sales: 6420.50, quantity: 214 },
      { name: 'Phone Stand Adjustable', sales: 5230.75, quantity: 156 },
      { name: 'Power Bank 10000mAh', sales: 4870.25, quantity: 67 }
    ]
  },
  inventoryOverview: {
    totalProducts: 89,
    lowStockItems: 12,
    outOfStockItems: 3,
    totalValue: 128450.75
  },
  performanceMetrics: {
    conversionRate: 3.2,
    returnRate: 2.8,
    customerSatisfaction: 4.6
  }
}

export const dynamic = 'force-dynamic'

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'scheduled'>('overview')
  const [reports, setReports] = useState<Report[]>([])
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState<'all' | 'sales' | 'inventory' | 'financial' | 'performance'>('all')
  const [dateRange, setDateRange] = useState('last_30_days')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 800))
        setReports(mockReports)
        setReportData(mockReportData)
      } catch (err) {
        console.error('Error fetching reports data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredReports = reports.filter(report => {
    return filterCategory === 'all' || report.category === filterCategory
  })

  const getCategoryBadge = (category: string) => {
    const variants = {
      sales: 'success' as const,
      inventory: 'info' as const,
      financial: 'warning' as const,
      performance: 'secondary' as const
    }
    return <Badge variant={variants[category as keyof typeof variants] || 'default'}>{category}</Badge>
  }

  const getStatusBadge = (status: Report['status']) => {
    const variants = {
      ready: 'success' as const,
      generating: 'info' as const,
      error: 'error' as const
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chart':
        return <BarChart3 className="h-4 w-4" />
      case 'table':
        return <FileText className="h-4 w-4" />
      case 'summary':
        return <PieChart className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleGenerateReport = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: 'generating' as const }
        : report
    ))

    // Simulate report generation
    setTimeout(() => {
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { 
              ...report, 
              status: 'ready' as const, 
              lastGenerated: new Date().toISOString(),
              size: `${(Math.random() * 5 + 1).toFixed(1)} MB`
            }
          : report
      ))
    }, 3000)
  }

  const handleDownloadReport = (reportId: string) => {
    console.log('Downloading report:', reportId)
    // Simulate download
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading reports...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-600 mt-1">
            Generate insights and analyze your business performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="last_7_days">Last 7 days</option>
            <option value="last_30_days">Last 30 days</option>
            <option value="last_90_days">Last 90 days</option>
            <option value="this_year">This year</option>
          </select>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Custom Range
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'reports', label: 'Reports', count: reports.length },
            { id: 'scheduled', label: 'Scheduled', count: 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'reports' | 'scheduled')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && reportData && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(reportData.salesOverview.totalSales)}
                    </div>
                    <div className="text-sm text-gray-500">Total Sales</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(reportData.salesOverview.totalOrders)}
                    </div>
                    <div className="text-sm text-gray-500">Total Orders</div>
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
                      {formatNumber(reportData.inventoryOverview.totalProducts)}
                    </div>
                    <div className="text-sm text-gray-500">Total Products</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(reportData.salesOverview.averageOrderValue)}
                    </div>
                    <div className="text-sm text-gray-500">Avg Order Value</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Best performing products by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.salesOverview.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.quantity} units sold</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{formatCurrency(product.sales)}</div>
                        <div className="text-sm text-gray-500">#{index + 1}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Inventory Status */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Overview</CardTitle>
                <CardDescription>Current stock status and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium text-red-900">Out of Stock</div>
                      <div className="text-sm text-red-600">Requires immediate attention</div>
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {reportData.inventoryOverview.outOfStockItems}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div>
                      <div className="font-medium text-yellow-900">Low Stock</div>
                      <div className="text-sm text-yellow-600">Below reorder point</div>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {reportData.inventoryOverview.lowStockItems}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-900">Total Inventory Value</div>
                      <div className="text-sm text-green-600">Current stock value</div>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(reportData.inventoryOverview.totalValue)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key business performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {reportData.performanceMetrics.conversionRate}%
                  </div>
                  <div className="text-sm text-gray-600">Conversion Rate</div>
                  <div className="text-xs text-gray-500 mt-1">Visitors to customers</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {reportData.performanceMetrics.returnRate}%
                  </div>
                  <div className="text-sm text-gray-600">Return Rate</div>
                  <div className="text-xs text-gray-500 mt-1">Orders returned</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {reportData.performanceMetrics.customerSatisfaction}
                  </div>
                  <div className="text-sm text-gray-600">Customer Satisfaction</div>
                  <div className="text-xs text-gray-500 mt-1">Average rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as 'all' | 'sales' | 'inventory' | 'financial' | 'performance')}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="sales">Sales</option>
              <option value="inventory">Inventory</option>
              <option value="financial">Financial</option>
              <option value="performance">Performance</option>
            </select>
          </div>

          {/* Reports List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getTypeIcon(report.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{report.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          {getCategoryBadge(report.category)}
                          {getStatusBadge(report.status)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {report.lastGenerated && (
                    <div className="text-sm text-gray-500 mb-4">
                      Last generated: {formatDate(report.lastGenerated)}
                      {report.size && (
                        <span className="ml-2">• {report.size}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    {report.status === 'ready' && (
                      <>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadReport(report.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </>
                    )}
                    
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleGenerateReport(report.id)}
                      disabled={report.status === 'generating'}
                    >
                      {report.status === 'generating' ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Scheduled Tab */}
      {activeTab === 'scheduled' && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Scheduled Reports</h3>
          <p className="mt-1 text-sm text-gray-500">
            Set up automatic report generation and delivery schedules.
          </p>
          <div className="mt-6">
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}