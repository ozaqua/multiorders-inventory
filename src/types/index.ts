// Core entities based on multiorders screenshots

export interface Product {
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

export interface Bundle extends Product {
  category: 'bundled'
  components: BundleComponent[]
  retailPrice: number
}

export interface BundleComponent {
  productId: string
  productName: string
  sku: string
  quantityNeeded: number
  availableStock: number
}

export interface Order {
  id: string
  orderId: string
  platform: 'amazon' | 'ebay' | 'shopify' | 'wix' | 'etsy'
  customer: {
    name: string
    email?: string
    address: string
  }
  items: OrderItem[]
  status: 'new' | 'prepared' | 'in-progress' | 'pending' | 'shipped' | 'cancelled'
  total: number
  currency: string
  date: Date
  trackingNumber?: string
  paid: boolean
}

export interface OrderItem {
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