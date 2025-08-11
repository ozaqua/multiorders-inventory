// Database client and utilities for INVENTREE PLUS

import { PrismaClient } from '../generated/prisma'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Prevent multiple instances of Prisma Client in development
const prisma = globalThis.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasourceUrl: process.env.DATABASE_URL,
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma

// Export types for use in components
export type {
  Product,
  WarehouseStock,
  ProductPrice,
  BundleComponent,
  PlatformProduct,
  Customer,
  CustomerAddress,
  CustomerTag,
  CustomerPlatform,
  Order,
  OrderItem,
  OrderShippingAddress,
  Supplier,
  PlatformIntegration,
  DashboardMetric,
  ProductCategory,
  ProductStatus,
  Platform,
  CustomerStatus,
  OrderStatus,
  IntegrationStatus,
} from '../generated/prisma'