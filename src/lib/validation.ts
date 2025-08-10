// Data validation utilities

import { ValidationError } from './errors'

export interface ProductInput {
  name: string
  sku: string
  category: 'SIMPLE' | 'CONFIGURABLE' | 'MERGED' | 'BUNDLED'
  description?: string
  reorderPoint?: number
  tag?: string
  asin?: string
  weight?: number
  weightUnit?: string
  supplierId?: string
  buyPrice?: number
}

export interface CustomerInput {
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
}

export interface OrderInput {
  orderId: string
  customerId: string
  platform: 'EBAY' | 'SHOPIFY' | 'ETSY'
  total: number
  currency?: string
  paid?: boolean
  items: {
    productId?: string
    productName: string
    sku?: string
    quantity: number
    price: number
  }[]
}

// Validation functions
export function validateProduct(data: unknown): ProductInput {
  const errors: string[] = []
  const input = data as Record<string, unknown>

  if (!input.name || typeof input.name !== 'string' || input.name.trim().length === 0) {
    errors.push('Product name is required and must be a non-empty string')
  }

  if (!input.sku || typeof input.sku !== 'string' || input.sku.trim().length === 0) {
    errors.push('SKU is required and must be a non-empty string')
  }

  if (!input.category || !['SIMPLE', 'CONFIGURABLE', 'MERGED', 'BUNDLED'].includes(input.category as string)) {
    errors.push('Category must be one of: SIMPLE, CONFIGURABLE, MERGED, BUNDLED')
  }

  if (input.reorderPoint !== undefined && (typeof input.reorderPoint !== 'number' || input.reorderPoint < 0)) {
    errors.push('Reorder point must be a non-negative number')
  }

  if (input.weight !== undefined && (typeof input.weight !== 'number' || input.weight < 0)) {
    errors.push('Weight must be a non-negative number')
  }

  if (input.buyPrice !== undefined && (typeof input.buyPrice !== 'number' || input.buyPrice < 0)) {
    errors.push('Buy price must be a non-negative number')
  }

  if (errors.length > 0) {
    throw new ValidationError(`Product validation failed: ${errors.join(', ')}`)
  }

  return {
    name: (input.name as string).trim(),
    sku: (input.sku as string).trim().toUpperCase(),
    category: input.category as 'SIMPLE' | 'CONFIGURABLE' | 'MERGED' | 'BUNDLED',
    description: (input.description as string)?.trim(),
    reorderPoint: input.reorderPoint as number | undefined,
    tag: (input.tag as string)?.trim(),
    asin: (input.asin as string)?.trim(),
    weight: input.weight as number | undefined,
    weightUnit: (input.weightUnit as string) || 'kg',
    supplierId: input.supplierId as string | undefined,
    buyPrice: input.buyPrice as number | undefined,
  }
}

export function validateCustomer(data: unknown): CustomerInput {
  const errors: string[] = []
  const input = data as Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

  if (!input.name || typeof input.name !== 'string' || input.name.trim().length === 0) {
    errors.push('Customer name is required and must be a non-empty string')
  }

  if (!input.email || typeof input.email !== 'string' || !isValidEmail(input.email)) {
    errors.push('Valid email address is required')
  }

  if (input.phone && (typeof input.phone !== 'string' || input.phone.trim().length === 0)) {
    errors.push('Phone must be a non-empty string if provided')
  }

  if (input.address) {
    if (!input.address.street || typeof input.address.street !== 'string') {
      errors.push('Address street is required')
    }
    if (!input.address.city || typeof input.address.city !== 'string') {
      errors.push('Address city is required')
    }
    if (!input.address.state || typeof input.address.state !== 'string') {
      errors.push('Address state is required')
    }
    if (!input.address.zip || typeof input.address.zip !== 'string') {
      errors.push('Address zip is required')
    }
    if (!input.address.country || typeof input.address.country !== 'string') {
      errors.push('Address country is required')
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(`Customer validation failed: ${errors.join(', ')}`)
  }

  return {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim(),
    address: input.address ? {
      street: input.address.street.trim(),
      city: input.address.city.trim(),
      state: input.address.state.trim(),
      zip: input.address.zip.trim(),
      country: input.address.country.trim(),
    } : undefined,
  }
}

export function validateOrder(data: unknown): OrderInput {
  const errors: string[] = []
  const input = data as Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

  if (!input.orderId || typeof input.orderId !== 'string' || input.orderId.trim().length === 0) {
    errors.push('Order ID is required and must be a non-empty string')
  }

  if (!input.customerId || typeof input.customerId !== 'string') {
    errors.push('Customer ID is required')
  }

  if (!input.platform || !['EBAY', 'SHOPIFY', 'ETSY'].includes(input.platform)) {
    errors.push('Platform must be one of: EBAY, SHOPIFY, ETSY')
  }

  if (typeof input.total !== 'number' || input.total < 0) {
    errors.push('Total must be a non-negative number')
  }

  if (!Array.isArray(input.items) || input.items.length === 0) {
    errors.push('Order must have at least one item')
  } else {
    input.items.forEach((item: any, index: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (!item.productName || typeof item.productName !== 'string') {
        errors.push(`Item ${index + 1}: Product name is required`)
      }
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be a positive number`)
      }
      if (typeof item.price !== 'number' || item.price < 0) {
        errors.push(`Item ${index + 1}: Price must be a non-negative number`)
      }
    })
  }

  if (errors.length > 0) {
    throw new ValidationError(`Order validation failed: ${errors.join(', ')}`)
  }

  return {
    orderId: input.orderId.trim(),
    customerId: input.customerId,
    platform: input.platform,
    total: input.total,
    currency: input.currency || 'USD',
    paid: input.paid || false,
    items: input.items.map((item: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      productId: item.productId,
      productName: item.productName.trim(),
      sku: item.sku?.trim(),
      quantity: item.quantity,
      price: item.price,
    })),
  }
}

// Helper functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateSKU(sku: string): boolean {
  // SKU should be alphanumeric with hyphens, 3-50 characters
  const skuRegex = /^[A-Z0-9-]{3,50}$/
  return skuRegex.test(sku.toUpperCase())
}

export function validatePhoneNumber(phone: string): boolean {
  // Basic international phone number validation
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/
  return phoneRegex.test(phone)
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

export function validatePaginationParams(page?: number, limit?: number): { page: number; limit: number } {
  const validatedPage = Math.max(1, page || 1)
  const validatedLimit = Math.min(100, Math.max(1, limit || 10))
  
  return { page: validatedPage, limit: validatedLimit }
}