// Product database operations

import prisma from '../db'
import type { Product, ProductCategory, ProductStatus, Platform } from '../db'

export interface ProductWithRelations extends Product {
  warehouse?: {
    total: number
    inOrder: number
    available: number
    awaiting: number
  } | null
  prices: { platform: Platform; price: number }[]
  supplier?: { name: string } | null
  bundleComponents?: {
    component: { name: string; sku: string }
    quantityNeeded: number
  }[]
}

// Get all products with warehouse and pricing data
export async function getAllProducts(): Promise<ProductWithRelations[]> {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not configured')
    }
    const products = await prisma.product.findMany({
      include: {
        warehouse: {
          select: {
            total: true,
            inOrder: true,
            available: true,
            awaiting: true,
          },
        },
        prices: {
          select: {
            platform: true,
            price: true,
          },
          where: {
            isActive: true,
          },
        },
        supplier: {
          select: {
            name: true,
          },
        },
        inBundles: {
          include: {
            component: {
              select: {
                name: true,
                sku: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return products.map((product) => ({
      ...product,
      bundleComponents: product.inBundles.map((bundle) => ({
        component: bundle.component,
        quantityNeeded: bundle.quantityNeeded,
      })),
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products')
  }
}

// Get products by category
export async function getProductsByCategory(category: ProductCategory): Promise<ProductWithRelations[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        category,
      },
      include: {
        warehouse: true,
        prices: {
          where: { isActive: true },
        },
        supplier: {
          select: { name: true },
        },
        inBundles: {
          include: {
            component: {
              select: {
                name: true,
                sku: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return products.map((product) => ({
      ...product,
      bundleComponents: product.inBundles.map((bundle) => ({
        component: bundle.component,
        quantityNeeded: bundle.quantityNeeded,
      })),
    }))
  } catch (error) {
    console.error('Error fetching products by category:', error)
    throw new Error('Failed to fetch products by category')
  }
}

// Get bundled products with their components
export async function getBundledProducts() {
  try {
    const bundles = await prisma.product.findMany({
      where: {
        category: 'BUNDLED',
      },
      include: {
        warehouse: true,
        prices: {
          where: { isActive: true },
        },
        supplier: {
          select: { name: true },
        },
        inBundles: {
          include: {
            component: {
              include: {
                warehouse: {
                  select: {
                    available: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return bundles.map((bundle) => ({
      ...bundle,
      components: bundle.inBundles.map((bundleComponent) => ({
        productId: bundleComponent.component.id,
        productName: bundleComponent.component.name,
        sku: bundleComponent.component.sku,
        quantityNeeded: bundleComponent.quantityNeeded,
        availableStock: bundleComponent.component.warehouse?.available || 0,
      })),
      retailPrice: bundle.prices.find((p) => p.platform === 'EBAY')?.price || 0,
    }))
  } catch (error) {
    console.error('Error fetching bundled products:', error)
    throw new Error('Failed to fetch bundled products')
  }
}

// Create a new product
export async function createProduct(data: {
  name: string
  sku: string
  category: ProductCategory
  description?: string
  reorderPoint?: number
  tag?: string
  asin?: string
  weight?: number
  weightUnit?: string
  supplierId?: string
  buyPrice?: number
  status?: ProductStatus
  warehouse?: {
    total: number
    inOrder: number
    available: number
    awaiting: number
    binLocation?: string
  }
  prices?: { platform: Platform; price: number; currency?: string }[]
}) {
  try {
    return await prisma.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        category: data.category,
        description: data.description,
        reorderPoint: data.reorderPoint,
        tag: data.tag,
        asin: data.asin,
        weight: data.weight,
        weightUnit: data.weightUnit,
        supplierId: data.supplierId,
        buyPrice: data.buyPrice,
        status: data.status || 'ACTIVE',
        warehouse: data.warehouse
          ? {
              create: {
                total: data.warehouse.total,
                inOrder: data.warehouse.inOrder,
                available: data.warehouse.available,
                awaiting: data.warehouse.awaiting,
                binLocation: data.warehouse.binLocation,
              },
            }
          : undefined,
        prices: data.prices
          ? {
              create: data.prices.map((price) => ({
                platform: price.platform,
                price: price.price,
                currency: price.currency || 'USD',
              })),
            }
          : undefined,
      },
      include: {
        warehouse: true,
        prices: true,
        supplier: true,
      },
    })
  } catch (error) {
    console.error('Error creating product:', error)
    throw new Error('Failed to create product')
  }
}

// Update product stock
export async function updateProductStock(
  productId: string,
  stock: {
    total?: number
    inOrder?: number
    available?: number
    awaiting?: number
    binLocation?: string
  }
) {
  try {
    return await prisma.warehouseStock.upsert({
      where: {
        productId,
      },
      update: stock,
      create: {
        productId,
        total: stock.total || 0,
        inOrder: stock.inOrder || 0,
        available: stock.available || 0,
        awaiting: stock.awaiting || 0,
        binLocation: stock.binLocation,
      },
    })
  } catch (error) {
    console.error('Error updating product stock:', error)
    throw new Error('Failed to update product stock')
  }
}

// Search products by name or SKU
export async function searchProducts(query: string): Promise<ProductWithRelations[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        warehouse: true,
        prices: {
          where: { isActive: true },
        },
        supplier: {
          select: { name: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return products
  } catch (error) {
    console.error('Error searching products:', error)
    throw new Error('Failed to search products')
  }
}

// Get low stock products
export async function getLowStockProducts(): Promise<ProductWithRelations[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        warehouse: {
          available: {
            lt: 10 // Simplified low stock threshold
          },
        },
      },
      include: {
        warehouse: true,
        prices: {
          where: { isActive: true },
        },
        supplier: {
          select: { name: true },
        },
      },
    })

    return products
  } catch (error) {
    console.error('Error fetching low stock products:', error)
    throw new Error('Failed to fetch low stock products')
  }
}

// Delete product
export async function deleteProduct(productId: string) {
  try {
    return await prisma.product.delete({
      where: { id: productId },
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    throw new Error('Failed to delete product')
  }
}

// Get product by ID with full relations
export async function getProductById(productId: string): Promise<ProductWithRelations | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        warehouse: true,
        prices: {
          where: { isActive: true },
        },
        supplier: true,
        inBundles: {
          include: {
            component: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
              include: {
                warehouse: {
                  select: {
                    available: true,
                  },
                },
              },
            },
          },
        },
        platformProducts: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!product) return null

    return {
      ...product,
      bundleComponents: product.inBundles.map((bundle) => ({
        component: bundle.component,
        quantityNeeded: bundle.quantityNeeded,
      })),
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    throw new Error('Failed to fetch product')
  }
}