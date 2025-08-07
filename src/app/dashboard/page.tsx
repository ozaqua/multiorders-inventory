import { formatCurrency, formatNumber } from '@/lib/utils'
import { Download, Calendar } from 'lucide-react'
import Button from '@/components/ui/Button'

// Mock data matching multiorders screenshots
const dashboardMetrics = {
  newOrders: 1267,
  sales: 47692.19,
  totalOrders: 1268,
  unitsSold: 1576,
  lowStock: 2094,
  returnCustomers: 12,
  returnCustomersPercent: 17.67,
  newClients: 1137
}

const orderStatuses = [
  { status: 'New', count: 61, color: 'bg-blue-500' },
  { status: 'Prepared', count: 4, color: 'bg-yellow-500' },
  { status: 'In-Progress', count: 48, color: 'bg-orange-500' },
  { status: 'Pending', count: 20, color: 'bg-gray-500' },
  { status: 'Shipped', count: 428, color: 'bg-green-500' },
]

const salesByChannel = [
  { name: 'Wix clothing', amount: 12356.04, color: 'bg-blue-500' },
  { name: 'Wix phone cases', amount: 12304.00, color: 'bg-green-500' },
  { name: 'eBay', amount: 11444.18, color: 'bg-yellow-500' },
  { name: 'Amazon US', amount: 10902.24, color: 'bg-red-500' },
  { name: 'Amazon UK', amount: 10094.04, color: 'bg-purple-500' },
  { name: 'Shopify clothing', amount: 5379.84, color: 'bg-indigo-500' },
  { name: 'Etsy', amount: 5231.04, color: 'bg-pink-500' },
]

export default function DashboardPage() {
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
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Dashboard Options
        </Button>
      </div>

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
              {salesByChannel.map((channel) => (
                <div key={channel.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-sm ${channel.color}`}></div>
                    <span className="text-gray-600 truncate">{channel.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(channel.amount)}
                  </span>
                </div>
              ))}
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
                {dashboardMetrics.returnCustomers} ({dashboardMetrics.returnCustomersPercent}%)
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