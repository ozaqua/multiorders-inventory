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
export function validateProduct(data: any): ProductInput {
  const errors: string[] = []

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Product name is required and must be a non-empty string')
  }

  if (!data.sku || typeof data.sku !== 'string' || data.sku.trim().length === 0) {
    errors.push('SKU is required and must be a non-empty string')
  }

  if (!data.category || !['SIMPLE', 'CONFIGURABLE', 'MERGED', 'BUNDLED'].includes(data.category)) {
    errors.push('Category must be one of: SIMPLE, CONFIGURABLE, MERGED, BUNDLED')
  }

  if (data.reorderPoint !== undefined && (typeof data.reorderPoint !== 'number' || data.reorderPoint < 0)) {
    errors.push('Reorder point must be a non-negative number')
  }

  if (data.weight !== undefined && (typeof data.weight !== 'number' || data.weight < 0)) {
    errors.push('Weight must be a non-negative number')
  }

  if (data.buyPrice !== undefined && (typeof data.buyPrice !== 'number' || data.buyPrice < 0)) {
    errors.push('Buy price must be a non-negative number')
  }

  if (errors.length > 0) {
    throw new ValidationError(`Product validation failed: ${errors.join(', ')}`)
  }

  return {
    name: data.name.trim(),
    sku: data.sku.trim().toUpperCase(),
    category: data.category,
    description: data.description?.trim(),
    reorderPoint: data.reorderPoint,
    tag: data.tag?.trim(),
    asin: data.asin?.trim(),
    weight: data.weight,
    weightUnit: data.weightUnit || 'kg',
    supplierId: data.supplierId,
    buyPrice: data.buyPrice,
  }
}

export function validateCustomer(data: any): CustomerInput {
  const errors: string[] = []

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Customer name is required and must be a non-empty string')
  }

  if (!data.email || typeof data.email !== 'string' || !isValidEmail(data.email)) {
    errors.push('Valid email address is required')
  }

  if (data.phone && (typeof data.phone !== 'string' || data.phone.trim().length === 0)) {
    errors.push('Phone must be a non-empty string if provided')
  }

  if (data.address) {
    if (!data.address.street || typeof data.address.street !== 'string') {
      errors.push('Address street is required')
    }
    if (!data.address.city || typeof data.address.city !== 'string') {
      errors.push('Address city is required')
    }
    if (!data.address.state || typeof data.address.state !== 'string') {
      errors.push('Address state is required')
    }
    if (!data.address.zip || typeof data.address.zip !== 'string') {
      errors.push('Address zip is required')
    }
    if (!data.address.country || typeof data.address.country !== 'string') {
      errors.push('Address country is required')
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(`Customer validation failed: ${errors.join(', ')}`)
  }

  return {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim(),
    address: data.address ? {
      street: data.address.street.trim(),
      city: data.address.city.trim(),
      state: data.address.state.trim(),
      zip: data.address.zip.trim(),
      country: data.address.country.trim(),
    } : undefined,
  }
}

export function validateOrder(data: any): OrderInput {
  const errors: string[] = []

  if (!data.orderId || typeof data.orderId !== 'string' || data.orderId.trim().length === 0) {
    errors.push('Order ID is required and must be a non-empty string')
  }

  if (!data.customerId || typeof data.customerId !== 'string') {
    errors.push('Customer ID is required')
  }

  if (!data.platform || !['EBAY', 'SHOPIFY', 'ETSY'].includes(data.platform)) {
    errors.push('Platform must be one of: EBAY, SHOPIFY, ETSY')
  }

  if (typeof data.total !== 'number' || data.total < 0) {
    errors.push('Total must be a non-negative number')
  }

  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.push('Order must have at least one item')
  } else {
    data.items.forEach((item: any, index: number) => {
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
    orderId: data.orderId.trim(),
    customerId: data.customerId,
    platform: data.platform,
    total: data.total,
    currency: data.currency || 'USD',
    paid: data.paid || false,
    items: data.items.map((item: any) => ({
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