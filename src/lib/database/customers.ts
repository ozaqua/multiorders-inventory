// Customer database operations

import prisma from '../db'
import type { Customer, CustomerStatus, Platform } from '../db'

export interface CustomerWithRelations extends Customer {
  address?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  } | null
  tags: { tag: string }[]
  platforms: { platform: Platform }[]
  _count: {
    orders: number
  }
}

// Get all customers with their relations
export async function getAllCustomers(): Promise<CustomerWithRelations[]> {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        address: true,
        tags: {
          select: {
            tag: true,
          },
        },
        platforms: {
          select: {
            platform: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        totalSpent: 'desc',
      },
    })

    return customers
  } catch (error) {
    console.error('Error fetching customers:', error)
    throw new Error('Failed to fetch customers')
  }
}

// Get customer by ID
export async function getCustomerById(customerId: string): Promise<CustomerWithRelations | null> {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        address: true,
        tags: {
          select: {
            tag: true,
          },
        },
        platforms: {
          select: {
            platform: true,
          },
        },
        orders: {
          select: {
            id: true,
            orderId: true,
            platform: true,
            total: true,
            status: true,
            orderDate: true,
          },
          orderBy: {
            orderDate: 'desc',
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    })

    return customer
  } catch (error) {
    console.error('Error fetching customer by ID:', error)
    throw new Error('Failed to fetch customer')
  }
}

// Create a new customer
export async function createCustomer(data: {
  name: string
  email: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  tags?: string[]
  platforms?: Platform[]
  status?: CustomerStatus
}) {
  try {
    return await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status || 'ACTIVE',
        address: data.address
          ? {
              create: {
                street: data.address.street,
                city: data.address.city,
                state: data.address.state,
                zip: data.address.zip,
                country: data.address.country,
              },
            }
          : undefined,
        tags: data.tags
          ? {
              create: data.tags.map((tag) => ({ tag })),
            }
          : undefined,
        platforms: data.platforms
          ? {
              create: data.platforms.map((platform) => ({ platform })),
            }
          : undefined,
      },
      include: {
        address: true,
        tags: true,
        platforms: true,
      },
    })
  } catch (error) {
    console.error('Error creating customer:', error)
    throw new Error('Failed to create customer')
  }
}

// Update customer
export async function updateCustomer(
  customerId: string,
  data: {
    name?: string
    email?: string
    phone?: string
    status?: CustomerStatus
    address?: {
      street: string
      city: string
      state: string
      zip: string
      country: string
    }
  }
) {
  try {
    return await prisma.customer.update({
      where: { id: customerId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status,
        address: data.address
          ? {
              upsert: {
                create: {
                  street: data.address.street,
                  city: data.address.city,
                  state: data.address.state,
                  zip: data.address.zip,
                  country: data.address.country,
                },
                update: {
                  street: data.address.street,
                  city: data.address.city,
                  state: data.address.state,
                  zip: data.address.zip,
                  country: data.address.country,
                },
              },
            }
          : undefined,
      },
      include: {
        address: true,
        tags: true,
        platforms: true,
      },
    })
  } catch (error) {
    console.error('Error updating customer:', error)
    throw new Error('Failed to update customer')
  }
}

// Add tag to customer
export async function addCustomerTag(customerId: string, tag: string) {
  try {
    return await prisma.customerTag.create({
      data: {
        customerId,
        tag,
      },
    })
  } catch (error) {
    console.error('Error adding customer tag:', error)
    throw new Error('Failed to add customer tag')
  }
}

// Remove tag from customer
export async function removeCustomerTag(customerId: string, tag: string) {
  try {
    return await prisma.customerTag.delete({
      where: {
        customerId_tag: {
          customerId,
          tag,
        },
      },
    })
  } catch (error) {
    console.error('Error removing customer tag:', error)
    throw new Error('Failed to remove customer tag')
  }
}

// Search customers
export async function searchCustomers(query: string): Promise<CustomerWithRelations[]> {
  try {
    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { address: { city: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: {
        address: true,
        tags: {
          select: { tag: true },
        },
        platforms: {
          select: { platform: true },
        },
        _count: {
          select: { orders: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return customers
  } catch (error) {
    console.error('Error searching customers:', error)
    throw new Error('Failed to search customers')
  }
}

// Get customer statistics
export async function getCustomerStats() {
  try {
    const [totalCustomers, activeCustomers, totalRevenue] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({
        where: { status: 'ACTIVE' },
      }),
      prisma.customer.aggregate({
        _sum: { totalSpent: true },
      }),
    ])

    const totalOrders = await prisma.customer.aggregate({
      _sum: { totalOrders: true },
    })

    const avgOrderValue = totalRevenue._sum.totalSpent && totalOrders._sum.totalOrders
      ? totalRevenue._sum.totalSpent / totalOrders._sum.totalOrders
      : 0

    return {
      totalCustomers,
      activeCustomers,
      totalRevenue: totalRevenue._sum.totalSpent || 0,
      avgOrderValue,
    }
  } catch (error) {
    console.error('Error fetching customer statistics:', error)
    throw new Error('Failed to fetch customer statistics')
  }
}

// Update customer order statistics (called after order creation)
export async function updateCustomerOrderStats(customerId: string, orderTotal: number) {
  try {
    return await prisma.customer.update({
      where: { id: customerId },
      data: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: orderTotal },
        lastOrderDate: new Date(),
      },
    })
  } catch (error) {
    console.error('Error updating customer order stats:', error)
    throw new Error('Failed to update customer order statistics')
  }
}

// Delete customer
export async function deleteCustomer(customerId: string) {
  try {
    return await prisma.customer.delete({
      where: { id: customerId },
    })
  } catch (error) {
    console.error('Error deleting customer:', error)
    throw new Error('Failed to delete customer')
  }
}