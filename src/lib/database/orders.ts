// Order database operations

import prisma from '../db'
import type { Order, OrderStatus, Platform } from '../db'
import { updateCustomerOrderStats } from './customers'

export interface OrderWithRelations extends Order {
  customer: {
    id: string
    name: string
    email: string
  }
  items: {
    id: string
    productName: string
    sku?: string | null
    quantity: number
    price: number
    product?: {
      id: string
      name: string
    } | null
  }[]
  shippingAddress?: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  } | null
}

// Get all orders with relations
export async function getAllOrders(): Promise<OrderWithRelations[]> {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not configured')
    }
    const orders = await prisma.order.findMany({
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          select: {
            id: true,
            productName: true,
            sku: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
      orderBy: {
        orderDate: 'desc',
      },
    })

    return orders
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw new Error('Failed to fetch orders')
  }
}

// Get orders by status
export async function getOrdersByStatus(status: OrderStatus): Promise<OrderWithRelations[]> {
  try {
    const orders = await prisma.order.findMany({
      where: { status },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          select: {
            id: true,
            productName: true,
            sku: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
      orderBy: {
        orderDate: 'desc',
      },
    })

    return orders
  } catch (error) {
    console.error('Error fetching orders by status:', error)
    throw new Error('Failed to fetch orders by status')
  }
}

// Get orders by platform
export async function getOrdersByPlatform(platform: Platform): Promise<OrderWithRelations[]> {
  try {
    const orders = await prisma.order.findMany({
      where: { platform },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          select: {
            id: true,
            productName: true,
            sku: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
      orderBy: {
        orderDate: 'desc',
      },
    })

    return orders
  } catch (error) {
    console.error('Error fetching orders by platform:', error)
    throw new Error('Failed to fetch orders by platform')
  }
}

// Create a new order
export async function createOrder(data: {
  orderId: string
  customerId: string
  platform: Platform
  total: number
  currency?: string
  paid?: boolean
  status?: OrderStatus
  trackingNumber?: string
  shippingAddress?: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  items: {
    productId?: string
    productName: string
    sku?: string
    quantity: number
    price: number
  }[]
  orderDate?: Date
}) {
  try {
    const order = await prisma.order.create({
      data: {
        orderId: data.orderId,
        customerId: data.customerId,
        platform: data.platform,
        total: data.total,
        currency: data.currency || 'USD',
        paid: data.paid || false,
        status: data.status || 'NEW',
        trackingNumber: data.trackingNumber,
        orderDate: data.orderDate || new Date(),
        shippingAddress: data.shippingAddress
          ? {
              create: {
                name: data.shippingAddress.name,
                street: data.shippingAddress.street,
                city: data.shippingAddress.city,
                state: data.shippingAddress.state,
                zip: data.shippingAddress.zip,
                country: data.shippingAddress.country,
              },
            }
          : undefined,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            sku: item.sku,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        customer: true,
        items: true,
        shippingAddress: true,
      },
    })

    // Update customer order statistics
    await updateCustomerOrderStats(data.customerId, data.total)

    return order
  } catch (error) {
    console.error('Error creating order:', error)
    throw new Error('Failed to create order')
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: OrderStatus, trackingNumber?: string) {
  try {
    return await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        trackingNumber,
        updatedAt: new Date(),
      },
      include: {
        customer: true,
        items: true,
        shippingAddress: true,
      },
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    throw new Error('Failed to update order status')
  }
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<OrderWithRelations | null> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          select: {
            id: true,
            productName: true,
            sku: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
    })

    return order
  } catch (error) {
    console.error('Error fetching order by ID:', error)
    throw new Error('Failed to fetch order')
  }
}

// Search orders
export async function searchOrders(query: string): Promise<OrderWithRelations[]> {
  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { orderId: { contains: query, mode: 'insensitive' } },
          { customer: { name: { contains: query, mode: 'insensitive' } } },
          { customer: { email: { contains: query, mode: 'insensitive' } } },
          { items: { some: { productName: { contains: query, mode: 'insensitive' } } } },
          { trackingNumber: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          select: {
            id: true,
            productName: true,
            sku: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
      orderBy: {
        orderDate: 'desc',
      },
    })

    return orders
  } catch (error) {
    console.error('Error searching orders:', error)
    throw new Error('Failed to search orders')
  }
}

// Get order statistics
export async function getOrderStats() {
  try {
    const [totalOrders, newOrders, salesData, ordersByStatus] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: { status: 'NEW' },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ])

    // Get recent orders (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentOrders = await prisma.order.count({
      where: {
        orderDate: {
          gte: thirtyDaysAgo,
        },
      },
    })

    // Calculate units sold
    const unitsQuery = await prisma.orderItem.aggregate({
      _sum: { quantity: true },
    })

    return {
      totalOrders,
      newOrders,
      totalSales: salesData._sum.total || 0,
      unitsSold: unitsQuery._sum.quantity || 0,
      recentOrders,
      ordersByStatus: ordersByStatus.reduce((acc, curr) => {
        acc[curr.status] = curr._count.status
        return acc
      }, {} as Record<string, number>),
    }
  } catch (error) {
    console.error('Error fetching order statistics:', error)
    throw new Error('Failed to fetch order statistics')
  }
}

// Get sales by platform
export async function getSalesByPlatform() {
  try {
    const salesByPlatform = await prisma.order.groupBy({
      by: ['platform'],
      _sum: { total: true },
      _count: { platform: true },
      orderBy: {
        _sum: { total: 'desc' },
      },
    })

    return salesByPlatform.map((item) => ({
      platform: item.platform,
      totalSales: item._sum.total || 0,
      orderCount: item._count.platform,
    }))
  } catch (error) {
    console.error('Error fetching sales by platform:', error)
    throw new Error('Failed to fetch sales by platform')
  }
}

// Get daily sales data for charts
export async function getDailySalesData(days: number = 30) {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const dailySales = await prisma.$queryRaw`
      SELECT 
        DATE(order_date) as date,
        platform,
        SUM(total) as total_sales,
        COUNT(*) as order_count
      FROM orders
      WHERE order_date >= ${startDate}
      GROUP BY DATE(order_date), platform
      ORDER BY date DESC, platform
    `

    return dailySales
  } catch (error) {
    console.error('Error fetching daily sales data:', error)
    throw new Error('Failed to fetch daily sales data')
  }
}

// Delete order
export async function deleteOrder(orderId: string) {
  try {
    return await prisma.order.delete({
      where: { id: orderId },
    })
  } catch (error) {
    console.error('Error deleting order:', error)
    throw new Error('Failed to delete order')
  }
}