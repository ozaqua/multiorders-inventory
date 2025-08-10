// Database client and utilities for Multiorders Inventory Management System

import { PrismaClient } from '../generated/prisma'

declare global {
  var prisma: PrismaClient | undefined
}

// Prevent multiple instances of Prisma Client in development
const prisma = globalThis.prisma ?? new PrismaClient()

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