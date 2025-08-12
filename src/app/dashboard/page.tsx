'use client'

import { useState, useEffect } from 'react'

import { formatCurrency, formatNumber } from '@/lib/utils'
import { Download, Calendar, Plus, RefreshCw } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card'
import type { DashboardMetrics } from '@/types'

interface SalesChannel {
  platform: string
  totalSales: number
  orderCount: number
}

// Client component - uses dynamic data fetching

export default function DashboardPage() {
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null)
  const [salesByChannel, setSalesByChannel] = useState<SalesChannel[]>([])
  const [orderStatuses, setOrderStatuses] = useState<{ status: string; count: number; color: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        const response = await fetch('/api/dashboard')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch dashboard data')
        }

        setDashboardMetrics(data.metrics)
        setSalesByChannel(data.channels)
        
        // Map status breakdown to display format with colors
        const statusColors: Record<string, string> = {
          NEW: 'bg-blue-500',
          PREPARED: 'bg-yellow-500',
          IN_PROGRESS: 'bg-orange-500',
          PENDING: 'bg-gray-500',
          SHIPPED: 'bg-green-500',
          CANCELLED: 'bg-red-500',
        }

        const formattedStatuses = data.statusBreakdown.map((item: { status: string; count: number }) => ({
          status: item.status.replace('_', '-').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
          count: item.count,
          color: statusColors[item.status] || 'bg-gray-500',
        }))

        setOrderStatuses(formattedStatuses)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(`Failed to load dashboard data: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])
  const handleTestToast = (type: 'success' | 'error' | 'warning' | 'default') => {
    const messages = {
      success: { title: 'Order Updated!', description: 'Order #1234 has been successfully shipped.' },
      error: { title: 'Sync Failed', description: 'Unable to connect to eBay API. Please check your credentials.' },
      warning: { title: 'Low Stock Alert', description: '3 products are running low on inventory.' },
      default: { title: 'System Notice', description: 'Regular maintenance scheduled for tonight.' }
    }
    // For now, just console log instead of using toast
    console.log('Toast would show:', messages[type])
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading dashboard...</span>
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

  if (!dashboardMetrics) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center text-gray-500">No dashboard data available</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Filter By Date:</span>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm">
              <option>Last Month</option>
              <option>This Month</option>
              <option>Last 7 days</option>
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
            Dashboard Options
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
            Quick Add
          </Button>
        </div>
      </div>

      {/* Enhanced Components Demo */}
      <Card className="mb-6" variant="elevated" hover>
        <CardHeader>
          <CardTitle>Enhanced UI Components Demo</CardTitle>
          <CardDescription>
            Testing the new Button, Badge, Card, and Toast components with loading states and icons.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge variant="success" dot>Active</Badge>
            <Badge variant="warning" size="sm">Low Stock</Badge>
            <Badge variant="error" size="lg">Out of Stock</Badge>
            <Badge variant="info" dot>In Transit</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="success" size="sm" onClick={() => handleTestToast('success')}>
              Success Toast
            </Button>
            <Button variant="danger" size="sm" onClick={() => handleTestToast('error')}>
              Error Toast  
            </Button>
            <Button variant="secondary" size="sm" onClick={() => handleTestToast('warning')}>
              Warning Toast
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              loading 
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Loading Button
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Status Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Today&apos;s Active Order Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {orderStatuses.map((status) => (
            <div key={status.status} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-sm text-gray-600">{status.status}</div>
              <div className="text-3xl font-bold text-gray-900 my-2">{status.count}</div>
              <div className={`h-2 ${status.color} rounded-full mx-auto w-12`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Total Sales */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Total Sales</h3>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-4">
            {formatCurrency(dashboardMetrics.sales)}
          </div>
          
          {/* Sales by Channel */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Total Sales Per Channel</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {salesByChannel.map((channel, index) => {
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-indigo-500', 'bg-pink-500']
                const color = colors[index % colors.length]
                
                return (
                  <div key={channel.platform} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-sm ${color}`}></div>
                      <span className="text-gray-600 truncate">{channel.platform}</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(channel.totalSales)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-6">
          {/* Metrics Row 1 */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-sm text-gray-600">New Orders</div>
              <div className="text-2xl font-bold text-red-600">{formatNumber(dashboardMetrics.newOrders)}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-sm text-gray-600">Sales</div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardMetrics.sales)}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-sm text-gray-600">Total Orders</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(dashboardMetrics.totalOrders)}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-sm text-gray-600">Units Sold</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(dashboardMetrics.unitsSold)}</div>
            </div>
          </div>

          {/* Metrics Row 2 */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-sm text-gray-600">Low Stock</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(dashboardMetrics.lowStock)}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-sm text-gray-600">Return Customers</div>
              <div className="text-2xl font-bold text-gray-900">
                {dashboardMetrics.returnCustomers} ({dashboardMetrics.returnCustomersPercent || 0}%)
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-sm text-gray-600">New Clients</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(dashboardMetrics.newClients)}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-sm text-gray-600">Period</div>
              <div className="text-sm font-medium text-gray-900">Last Month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Cities and Countries */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Cities and Countries</h3>
          <div className="space-y-3">
            {[
              { name: 'LONDON', percentage: 5.4, count: 68 },
              { name: 'BIRMINGHAM', percentage: 1.9, count: 24 },
              { name: 'LEICESTER', percentage: 1.6, count: 20 },
              { name: 'HALESOWEN', percentage: 1.2, count: 15 },
              { name: 'HASTINGS', percentage: 1.0, count: 13 },
            ].map((city) => (
              <div key={city.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{city.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${city.percentage * 10}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{city.percentage}% ({city.count})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Stock */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Stock</h3>
          <div className="space-y-4">
            {['UK', 'eBay', 'Shopify', 'eBay', 'US'].map((platform, index) => (
              <div key={`${platform}-${index}`} className="text-center">
                <div className="text-sm text-gray-600 mb-2">{platform}</div>
                <div className="h-20 bg-gray-100 rounded flex items-end justify-center overflow-hidden">
                  <div className="flex items-end h-full">
                    <div className="bg-blue-500 w-4 mr-1" style={{ height: '60%' }}></div>
                    <div className="bg-yellow-500 w-4 mr-1" style={{ height: '30%' }}></div>
                    <div className="bg-red-500 w-4" style={{ height: '40%' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-4 mt-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>In</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Out</span>
            </div>
          </div>
        </div>

        {/* Purchases by hour */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Purchases by hour (last 7 days)</h3>
          <div className="space-y-1">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 w-8">{i + 1}.00</span>
                <div className="flex-1 grid grid-cols-7 gap-px">
                  {['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'].map((day) => (
                    <div
                      key={day}
                      className={`h-3 rounded-sm ${
                        Math.random() > 0.7 ? 'bg-blue-500' : 
                        Math.random() > 0.4 ? 'bg-blue-300' : 'bg-gray-100'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
          </div>
        </div>
      </div>
    </div>
  )
}