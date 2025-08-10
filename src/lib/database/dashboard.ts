// Dashboard metrics and analytics operations

import prisma from '../db'
import { getOrderStats } from './orders'
import { getCustomerStats } from './customers'
import { getLowStockProducts } from './products'

export interface DashboardMetrics {
  newOrders: number
  sales: number
  totalOrders: number
  unitsSold: number
  lowStock: number
  returnCustomers: number
  newClients: number
  returnCustomersPercent: number
}

export interface SalesData {
  date: string
  [platform: string]: number | string
}

// Get comprehensive dashboard metrics
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const [orderStats, customerStats, lowStockProducts] = await Promise.all([
      getOrderStats(),
      getCustomerStats(),
      getLowStockProducts(),
    ])

    // Calculate return customers (customers with more than 1 order)
    const customersWithMultipleOrders = await prisma.customer.count({
      where: {
        totalOrders: {
          gt: 1,
        },
      },
    })

    // Calculate new customers (joined in last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const newCustomers = await prisma.customer.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    })

    const returnCustomersPercent = customerStats.totalCustomers > 0
      ? (customersWithMultipleOrders / customerStats.totalCustomers) * 100
      : 0

    return {
      newOrders: orderStats.newOrders,
      sales: orderStats.totalSales,
      totalOrders: orderStats.totalOrders,
      unitsSold: orderStats.unitsSold,
      lowStock: lowStockProducts.length,
      returnCustomers: customersWithMultipleOrders,
      newClients: newCustomers,
      returnCustomersPercent: Math.round(returnCustomersPercent * 100) / 100,
    }
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    throw new Error('Failed to fetch dashboard metrics')
  }
}

// Get sales data for charts
export async function getSalesChartData(days: number = 30): Promise<SalesData[]> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const salesData = await prisma.$queryRaw<Record<string, unknown>[]>`
      SELECT 
        DATE(order_date) as date,
        platform,
        SUM(total) as total
      FROM orders
      WHERE order_date >= ${startDate} AND paid = true
      GROUP BY DATE(order_date), platform
      ORDER BY date DESC
    `

    // Transform the data to the expected format
    const chartData = salesData.reduce((acc: Record<string, Record<string, unknown>>, row: Record<string, unknown>) => {
      const dateStr = (row.date as Date).toISOString().split('T')[0] // YYYY-MM-DD format
      
      if (!acc[dateStr]) {
        acc[dateStr] = { date: dateStr }
      }
      
      acc[dateStr][(row.platform as string).toLowerCase()] = Number(row.total)
      
      return acc
    }, {})

    return Object.values(chartData) as SalesData[]
  } catch (error) {
    console.error('Error fetching sales chart data:', error)
    throw new Error('Failed to fetch sales chart data')
  }
}

// Get top selling products
export async function getTopSellingProducts(limit: number = 10) {
  try {
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productName'],
      _sum: {
        quantity: true,
      },
      _count: {
        productName: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    })

    return topProducts.map((item) => ({
      productName: item.productName,
      totalQuantitySold: item._sum.quantity || 0,
      totalOrders: item._count.productName,
    }))
  } catch (error) {
    console.error('Error fetching top selling products:', error)
    throw new Error('Failed to fetch top selling products')
  }
}

// Get order status breakdown
export async function getOrderStatusBreakdown() {
  try {
    const statusBreakdown = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
      orderBy: {
        _count: {
          status: 'desc',
        },
      },
    })

    return statusBreakdown.map((item) => ({
      status: item.status,
      count: item._count.status,
    }))
  } catch (error) {
    console.error('Error fetching order status breakdown:', error)
    throw new Error('Failed to fetch order status breakdown')
  }
}

// Get sales by channel/platform
export async function getSalesByChannel() {
  try {
    const channelSales = await prisma.order.groupBy({
      by: ['platform'],
      _sum: {
        total: true,
      },
      _count: {
        platform: true,
      },
      where: {
        paid: true,
      },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
    })

    return channelSales.map((item) => ({
      platform: item.platform,
      totalSales: item._sum.total || 0,
      orderCount: item._count.platform,
    }))
  } catch (error) {
    console.error('Error fetching sales by channel:', error)
    throw new Error('Failed to fetch sales by channel')
  }
}

// Get customer geographic data
export async function getCustomerGeographicData() {
  try {
    const geographicData = await prisma.customerAddress.groupBy({
      by: ['city', 'country'],
      _count: {
        city: true,
      },
      orderBy: {
        _count: {
          city: 'desc',
        },
      },
      take: 10,
    })

    return geographicData.map((item) => ({
      city: item.city,
      country: item.country,
      customerCount: item._count.city,
    }))
  } catch (error) {
    console.error('Error fetching customer geographic data:', error)
    throw new Error('Failed to fetch customer geographic data')
  }
}

// Get inventory alerts
export async function getInventoryAlerts() {
  try {
    const [outOfStock, lowStock] = await Promise.all([
      prisma.product.count({
        where: {
          warehouse: {
            available: {
              lte: 0,
            },
          },
        },
      }),
      prisma.product.count({
        where: {
          warehouse: {
            available: {
              lt: 10 // Simplified: products with less than 10 units are considered low stock
            }
          }
        },
      }),
    ])

    return {
      outOfStock,
      lowStock,
    }
  } catch (error) {
    console.error('Error fetching inventory alerts:', error)
    throw new Error('Failed to fetch inventory alerts')
  }
}

// Cache dashboard metrics (for performance)
export async function cacheDashboardMetrics() {
  try {
    const metrics = await getDashboardMetrics()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Store main dashboard metrics
    await prisma.dashboardMetric.upsert({
      where: {
        metricType_date_platform: {
          metricType: 'daily_dashboard_metrics',
          date: today,
          platform: 'MULTIORDERS',
        },
      },
      update: {
        jsonValue: JSON.stringify(metrics),
      },
      create: {
        metricType: 'daily_dashboard_metrics',
        date: today,
        jsonValue: JSON.stringify(metrics),
      },
    })

    return metrics
  } catch (error) {
    console.error('Error caching dashboard metrics:', error)
    throw new Error('Failed to cache dashboard metrics')
  }
}

// Get cached dashboard metrics
export async function getCachedDashboardMetrics(): Promise<DashboardMetrics | null> {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const cached = await prisma.dashboardMetric.findUnique({
      where: {
        metricType_date_platform: {
          metricType: 'daily_dashboard_metrics',
          date: today,
          platform: 'MULTIORDERS',
        },
      },
    })

    return cached?.jsonValue ? JSON.parse(cached.jsonValue) : null
  } catch (error) {
    console.error('Error fetching cached dashboard metrics:', error)
    return null
  }
}