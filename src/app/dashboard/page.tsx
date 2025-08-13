'use client'

import { useState, useEffect } from 'react'
import { formatCurrency } from '@/lib/utils'
import { Download, Calendar, RefreshCw, Filter } from 'lucide-react'
import Button from '@/components/ui/Button'

interface DashboardData {
  metrics: {
    newOrders: number
    sales: number
    totalOrders: number
    unitsSold: number
    lowStock: number
    returnCustomers: number
    newClients: number
    returnCustomersPercent: number
  }
  channels: Array<{
    platform: string
    totalSales: number
    orderCount: number
  }>
  statusBreakdown: Array<{
    status: string
    count: number
  }>
}

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        const response = await fetch('/api/dashboard')
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch dashboard data')
        }

        setData(result)
      } catch (err) {
        console.error('Error fetching dashboard:', err)
        setError(`Failed to load dashboard: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Filter By Date: Last Month
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Dashboard Options
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Today's Active Order Status */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Today&apos;s Active Order Status</h2>
        <div className="grid grid-cols-5 gap-6">
          {[
            { label: 'New', count: data?.statusBreakdown.find(s => s.status === 'NEW')?.count || 61, color: 'text-blue-600' },
            { label: 'Prepared', count: 4, color: 'text-green-600' },
            { label: 'In-Progress', count: data?.statusBreakdown.find(s => s.status === 'IN_PROGRESS')?.count || 48, color: 'text-orange-600' },
            { label: 'Pending', count: 20, color: 'text-yellow-600' },
            { label: 'Shipped', count: data?.statusBreakdown.find(s => s.status === 'SHIPPED')?.count || 428, color: 'text-purple-600' }
          ].map((status) => (
            <div key={status.label} className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-1">{status.label}</div>
              <div className={`text-3xl font-bold ${status.color}`}>{status.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Sales */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-600 mb-1">Total Sales</h2>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(93347.37)}
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Total Sales Per Channel */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Total Sales Per Channel</h2>
        <div className="grid grid-cols-7 gap-4">
          {[
            { name: 'Wix clothing', amount: 12356.04, color: 'bg-blue-500' },
            { name: 'Wix phone cases', amount: 12304.00, color: 'bg-green-500' },
            { name: 'eBay', amount: 11444.18, color: 'bg-yellow-500' },
            { name: 'Amazon US', amount: 10902.24, color: 'bg-red-500' },
            { name: 'Amazon UK', amount: 10094.04, color: 'bg-purple-500' },
            { name: 'Shopify clothing', amount: 5379.84, color: 'bg-indigo-500' },
            { name: 'Etsy', amount: 5231.04, color: 'bg-blue-600' }
          ].map((channel) => (
            <div key={channel.name} className="text-center">
              <div className={`w-4 h-4 ${channel.color} rounded mb-2 mx-auto`}></div>
              <div className="text-xs font-medium text-gray-900">{channel.name}</div>
              <div className="text-sm text-gray-600">{formatCurrency(channel.amount)}</div>
            </div>
          ))}
        </div>

        {/* Sales Chart */}
        <div className="mt-6 h-64 relative">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Y-axis labels */}
            {[0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000].map((value, i) => (
              <g key={value}>
                <text x="5" y={240 - (i * 24)} className="text-xs fill-gray-400">
                  USD {value}.00
                </text>
              </g>
            ))}

            {/* Sample bars for 30 days */}
            {Array.from({ length: 30 }, (_, i) => {
              const x = 60 + (i * 15)
              const height1 = Math.random() * 60 + 20
              const height2 = Math.random() * 40 + 10
              const height3 = Math.random() * 30 + 10
              const height4 = Math.random() * 20 + 5
              
              return (
                <g key={i}>
                  <rect x={x} y={240 - height1} width="12" height={height1} className="fill-blue-500" />
                  <rect x={x} y={240 - height1 - height2} width="12" height={height2} className="fill-green-500" />
                  <rect x={x} y={240 - height1 - height2 - height3} width="12" height={height3} className="fill-yellow-500" />
                  <rect x={x} y={240 - height1 - height2 - height3 - height4} width="12" height={height4} className="fill-red-500" />
                  
                  <text x={x + 6} y={255} className="text-xs fill-gray-400 text-anchor-middle">
                    {String(i + 1).padStart(2, '0')}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Bottom Row - Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Active Order Age */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Active Order Age</h2>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="50" fill="none" stroke="#f59e0b" strokeWidth="12" 
                        strokeDasharray="157 157" strokeDashoffset="0" />
              </svg>
            </div>
            
            <div className="space-y-3">
              {[
                { status: '1 Day', count: 0, color: 'bg-blue-500' },
                { status: '2 Days', count: 0, color: 'bg-green-500' },
                { status: '3+ Days', count: 22, color: 'bg-yellow-500' },
                { status: 'Overdue', count: 0, color: 'bg-red-500' }
              ].map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 ${item.color} rounded`}></div>
                    <span className="text-sm text-gray-600">{item.status}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Integration Status */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Integration Status</h2>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="50" fill="none" stroke="#3b82f6" strokeWidth="12" 
                        strokeDasharray="94 314" strokeDashoffset="0" />
                <circle cx="64" cy="64" r="50" fill="none" stroke="#10b981" strokeWidth="12" 
                        strokeDasharray="157 314" strokeDashoffset="-94" />
                <circle cx="64" cy="64" r="50" fill="none" stroke="#f59e0b" strokeWidth="12" 
                        strokeDasharray="63 314" strokeDashoffset="-251" />
              </svg>
            </div>
            
            <div className="space-y-3">
              {[
                { status: 'Live', count: 6, color: 'bg-blue-500' },
                { status: 'Integrating', count: 12, color: 'bg-green-500' },
                { status: 'Errored', count: 10, color: 'bg-yellow-500' }
              ].map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 ${item.color} rounded`}></div>
                    <span className="text-sm text-gray-600">{item.status}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}