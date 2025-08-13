/**
 * INVENTREE+ Product Type Business Logic
 * 
 * Core business rules based on 5+ years of bundle management expertise:
 * 
 * Product Type Hierarchy:
 * 1. ALL/CONFIGURABLE - Default undesignated products (can be converted)
 * 2. SIMPLE - Warehouse component SKUs (only editable stock)
 * 3. MERGED - Combined multi-channel products
 * 4. BUNDLED - Composed of SIMPLE product components
 */

import type { ProductCategory } from '@/types'
import prisma from '@/lib/db'

// Product Type Conversion Rules
export const PRODUCT_TYPE_RULES = {
  SIMPLE: {
    canBecomeBundled: 'Must not be used as component in any bundle',
    canBecomeMerged: 'Cannot be merged if used as component',
    editableStock: true,
    canBeComponent: true,
    description: 'Warehouse component SKUs - only products with manually editable stock levels'
  },
  BUNDLED: {
    canBeComponent: false,
    canBeMerged: false,
    requiresComponents: true,
    componentsType: 'SIMPLE only',
    description: 'Products composed of SIMPLE product components'
  },
  MERGED: {
    canBeComponent: false,
    canBecomeBundled: false,
    combinesChannels: true,
    description: 'Identical products combined from multiple sales channels'
  },
  CONFIGURABLE: {
    canConvertTo: ['SIMPLE', 'BUNDLED', 'MERGED'],
    isDefault: true,
    description: 'Default undesignated products that can be converted to other types'
  }
}

/**
 * Check if a product can be converted to a specific type
 */
export async function canConvertProductType(
  productId: string,
  targetType: ProductCategory
): Promise<{ allowed: boolean; reason?: string }> {
  
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      bundleComponents: true, // Where this product is a component
      inBundles: true, // Where this product is the bundle parent
      platformProducts: true // Channel connections
    }
  })

  if (!product) {
    return { allowed: false, reason: 'Product not found' }
  }

  const currentType = product.category

  // Check conversion rules based on current and target type
  switch (currentType) {
    case 'SIMPLE':
      if (targetType === 'BUNDLED') {
        // SIMPLE → BUNDLED: Check if used as component anywhere
        if (product.bundleComponents.length > 0) {
          return {
            allowed: false,
            reason: 'Cannot convert to BUNDLED while being used as a component in other bundles. Remove from all bundles first.'
          }
        }
        return { allowed: true }
      }
      if (targetType === 'MERGED') {
        // SIMPLE → MERGED: Check if used as component
        if (product.bundleComponents.length > 0) {
          return {
            allowed: false,
            reason: 'Cannot merge SIMPLE products that are used as components'
          }
        }
        return { allowed: true }
      }
      break

    case 'BUNDLED':
      if (targetType === 'SIMPLE') {
        // BUNDLED → SIMPLE: Must remove all components first
        if (product.inBundles.length > 0) {
          return {
            allowed: false,
            reason: 'Remove all bundle components before converting to SIMPLE'
          }
        }
        return { allowed: true }
      }
      if (targetType === 'MERGED') {
        return {
          allowed: false,
          reason: 'BUNDLED products cannot be merged'
        }
      }
      break

    case 'MERGED':
      if (targetType === 'BUNDLED') {
        return {
          allowed: false,
          reason: 'MERGED products cannot become bundles'
        }
      }
      if (targetType === 'SIMPLE') {
        // MERGED → SIMPLE: Must unmerge first
        if (product.platformProducts.length > 1) {
          return {
            allowed: false,
            reason: 'Unmerge products from all channels before converting to SIMPLE'
          }
        }
        return { allowed: true }
      }
      break

    case 'CONFIGURABLE':
      // CONFIGURABLE can convert to any type
      return { allowed: true }

    default:
      return { allowed: false, reason: 'Invalid product type' }
  }

  return { allowed: false, reason: 'Conversion not permitted' }
}

/**
 * Check if a product can be used as a component in a bundle
 */
export async function canBeComponent(productId: string): Promise<boolean> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { category: true }
  })

  if (!product) return false

  // Only SIMPLE products can be components
  return product.category === 'SIMPLE'
}

/**
 * Check if stock can be manually edited for a product
 */
export function canEditStock(category: ProductCategory): boolean {
  // Only SIMPLE products have manually editable stock
  return category === 'SIMPLE'
}

/**
 * Get available conversion options for a product
 */
export async function getAvailableConversions(
  productId: string
): Promise<ProductCategory[]> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      bundleComponents: true,
      inBundles: true,
      platformProducts: true
    }
  })

  if (!product) return []

  const availableTypes: ProductCategory[] = []
  const possibleTypes: ProductCategory[] = ['SIMPLE', 'BUNDLED', 'MERGED', 'CONFIGURABLE']

  for (const targetType of possibleTypes) {
    if (targetType === product.category) continue
    
    const result = await canConvertProductType(productId, targetType)
    if (result.allowed) {
      availableTypes.push(targetType)
    }
  }

  return availableTypes
}

/**
 * Validate bundle component selection
 */
export async function validateBundleComponents(
  componentIds: string[]
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = []
  
  for (const componentId of componentIds) {
    const product = await prisma.product.findUnique({
      where: { id: componentId },
      select: { 
        category: true, 
        name: true,
        sku: true
      }
    })

    if (!product) {
      errors.push(`Product ${componentId} not found`)
      continue
    }

    if (product.category !== 'SIMPLE') {
      errors.push(`${product.name} (${product.sku}) is not a SIMPLE product and cannot be used as a component`)
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Convert a product to a different type
 */
export async function convertProductType(
  productId: string,
  targetType: ProductCategory
): Promise<{ success: boolean; error?: string }> {
  
  // Validate conversion is allowed
  const canConvert = await canConvertProductType(productId, targetType)
  if (!canConvert.allowed) {
    return { success: false, error: canConvert.reason }
  }

  try {
    // Perform the conversion
    await prisma.product.update({
      where: { id: productId },
      data: { 
        category: targetType,
        updatedAt: new Date()
      }
    })

    // If converting to SIMPLE, ensure warehouse stock record exists
    if (targetType === 'SIMPLE') {
      await prisma.warehouseStock.upsert({
        where: { productId },
        create: {
          productId,
          total: 0,
          available: 0,
          inOrder: 0,
          awaiting: 0,
          reserved: 0
        },
        update: {} // No update needed if already exists
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Error converting product type:', error)
    return { 
      success: false, 
      error: 'Failed to convert product type'
    }
  }
}

/**
 * Create a bundle from selected components
 */
export async function createBundle(
  bundleData: {
    name: string
    sku: string
    components: Array<{
      productId: string
      quantityNeeded: number
    }>
  }
): Promise<{ success: boolean; bundleId?: string; error?: string }> {
  
  // Validate all components are SIMPLE products
  const componentIds = bundleData.components.map(c => c.productId)
  const validation = await validateBundleComponents(componentIds)
  
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.join(', ')
    }
  }

  try {
    // Create the bundle product
    const bundle = await prisma.product.create({
      data: {
        name: bundleData.name,
        sku: bundleData.sku,
        category: 'BUNDLED',
        status: 'ACTIVE',
        warehouse: {
          create: {
            total: 0,
            available: 0,
            inOrder: 0,
            awaiting: 0,
            reserved: 0
          }
        }
      }
    })

    // Create bundle component relationships
    for (const component of bundleData.components) {
      await prisma.bundleComponent.create({
        data: {
          bundleId: bundle.id,
          componentId: component.productId,
          quantityNeeded: component.quantityNeeded
        }
      })
    }

    // Calculate initial bundle availability based on components
    await updateBundleAvailability(bundle.id)

    return {
      success: true,
      bundleId: bundle.id
    }
  } catch (error) {
    console.error('Error creating bundle:', error)
    return {
      success: false,
      error: 'Failed to create bundle'
    }
  }
}

/**
 * Update bundle availability based on component stock
 */
export async function updateBundleAvailability(bundleId: string): Promise<void> {
  const bundle = await prisma.product.findUnique({
    where: { id: bundleId },
    include: {
      inBundles: {
        include: {
          component: {
            include: {
              warehouse: true
            }
          }
        }
      },
      warehouse: true
    }
  })

  if (!bundle || bundle.category !== 'BUNDLED') return

  // Calculate maximum bundles that can be made
  let maxBundles = Infinity
  
  for (const bundleComponent of bundle.inBundles) {
    const componentStock = bundleComponent.component.warehouse?.available || 0
    const possibleBundles = Math.floor(componentStock / bundleComponent.quantityNeeded)
    maxBundles = Math.min(maxBundles, possibleBundles)
  }

  // Update bundle warehouse stock
  if (bundle.warehouse) {
    await prisma.warehouseStock.update({
      where: { id: bundle.warehouse.id },
      data: {
        available: maxBundles === Infinity ? 0 : maxBundles,
        total: maxBundles === Infinity ? 0 : maxBundles
      }
    })
  }
}

/**
 * Merge products from multiple channels
 */
export async function mergeProducts(
  productIds: string[],
  mergedName: string
): Promise<{ success: boolean; mergedId?: string; error?: string }> {
  
  // Validate all products can be merged
  for (const productId of productIds) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        bundleComponents: true
      }
    })

    if (!product) {
      return { success: false, error: `Product ${productId} not found` }
    }

    if (product.category === 'BUNDLED') {
      return { success: false, error: 'Cannot merge BUNDLED products' }
    }

    if (product.category === 'SIMPLE' && product.bundleComponents.length > 0) {
      return { 
        success: false, 
        error: `Cannot merge ${product.name} - it's used as a component in bundles`
      }
    }
  }

  try {
    // Create the merged product
    const mergedProduct = await prisma.product.create({
      data: {
        name: mergedName,
        sku: `MERGED-${Date.now()}`,
        category: 'MERGED',
        status: 'ACTIVE',
        warehouse: {
          create: {
            total: 0,
            available: 0,
            inOrder: 0,
            awaiting: 0,
            reserved: 0
          }
        }
      }
    })

    // Link platform products to the merged product
    for (const productId of productIds) {
      await prisma.platformProduct.updateMany({
        where: { productId },
        data: { productId: mergedProduct.id }
      })
    }

    // Calculate combined inventory
    await updateMergedProductInventory(mergedProduct.id)

    return {
      success: true,
      mergedId: mergedProduct.id
    }
  } catch (error) {
    console.error('Error merging products:', error)
    return {
      success: false,
      error: 'Failed to merge products'
    }
  }
}

/**
 * Update merged product inventory from all channels
 */
async function updateMergedProductInventory(mergedProductId: string): Promise<void> {
  const platformProducts = await prisma.platformProduct.findMany({
    where: { productId: mergedProductId },
    include: {
      product: {
        include: {
          warehouse: true
        }
      }
    }
  })

  // Sum inventory from all channels
  const totalInventory = platformProducts.reduce((sum, pp) => {
    return sum + (pp.product.warehouse?.available || 0)
  }, 0)

  // Update merged product inventory
  await prisma.warehouseStock.updateMany({
    where: { productId: mergedProductId },
    data: {
      available: totalInventory,
      total: totalInventory
    }
  })
}