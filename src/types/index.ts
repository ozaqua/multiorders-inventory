// Re-export database types for use throughout the application
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

// Re-export enhanced types from database operations
export type { ProductWithRelations } from '../lib/database/products'
export type { CustomerWithRelations } from '../lib/database/customers'
export type { OrderWithRelations } from '../lib/database/orders'

// Legacy types for backward compatibility (will be updated in components)
export interface LegacyProduct {
  id: string
  name: string
  sku: string
  image?: string
  category: 'simple' | 'configurable' | 'merged' | 'bundled'
  store: string[]  // ['amazon', 'ebay', 'shopify', 'wix', 'etsy']
  warehouse: {
    total: number
    inOrder: number
    available: number
    awaiting: number
  }
  reorderPoint?: number
  tag?: string
  asin?: string
  weight?: number
  weightUnit?: string
  supplierName?: string
  buyPrice?: number
  price: {
    amazon?: number
    ebay?: number 
    shopify?: number
    wix?: number
    etsy?: number
  }
  status: 'active' | 'inactive' | 'low-stock' | 'out-of-stock'
  createdAt: Date
  updatedAt: Date
}

export interface LegacyBundle extends LegacyProduct {
  category: 'bundled'
  components: LegacyBundleComponent[]
  retailPrice: number
}

export interface LegacyBundleComponent {
  productId: string
  productName: string
  sku: string
  quantityNeeded: number
  availableStock: number
}

export interface LegacyOrder {
  id: string
  orderId: string
  platform: 'amazon' | 'ebay' | 'shopify' | 'wix' | 'etsy'
  customer: {
    name: string
    email?: string
    address: string
  }
  items: LegacyOrderItem[]
  status: 'new' | 'prepared' | 'in-progress' | 'pending' | 'shipped' | 'cancelled'
  total: number
  currency: string
  date: Date
  trackingNumber?: string
  paid: boolean
}

export interface LegacyOrderItem {
  productName: string
  sku?: string
  quantity: number
  price: number
}

export interface DashboardMetrics {
  newOrders: number
  sales: number
  totalOrders: number
  unitsSold: number
  lowStock: number
  returnCustomers: number
  newClients: number
  returnCustomersPercent?: number
}

export interface SalesData {
  date: string
  [platform: string]: number | string  // Dynamic platform sales
}

export interface Integration {
  platform: 'amazon' | 'ebay' | 'shopify' | 'wix' | 'etsy'
  region?: string
  status: 'live' | 'integrating' | 'errored'
  lastImport?: Date
  productCount: number
  syncEnabled: boolean
}