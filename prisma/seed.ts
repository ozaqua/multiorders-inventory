// Database seeding script for Multiorders Inventory Management System

import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create suppliers first
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        name: 'Calypso Co.',
        email: 'orders@calypso-co.com',
        phone: '+1-555-0123',
        address: '123 Supplier St, Business City, BC 12345',
        isActive: true,
        notes: 'Primary clothing and accessories supplier',
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'TechParts Ltd',
        email: 'sales@techparts.com',
        phone: '+1-555-0456',
        address: '456 Tech Ave, Electronics City, EC 67890',
        isActive: true,
        notes: 'Electronics and gadgets supplier',
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'Office Essentials Inc',
        email: 'info@office-essentials.com',
        phone: '+1-555-0789',
        address: '789 Office Blvd, Business Park, BP 54321',
        isActive: true,
        notes: 'Office supplies and stationery',
      },
    }),
  ])

  console.log(`✅ Created ${suppliers.length} suppliers`)

  // Create customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Tom Jackson',
        email: 'tom13jackson14@gmail.com',
        phone: '5628446625',
        status: 'ACTIVE',
        totalOrders: 8,
        totalSpent: 1247.50,
        lastOrderDate: new Date('2025-12-02'),
        address: {
          create: {
            street: '14144 New street',
            city: 'Gendville',
            state: 'NY',
            zip: '90111',
            country: 'United States',
          },
        },
        tags: {
          create: [
            { tag: 'VIP' },
            { tag: 'Returning' },
          ],
        },
        platforms: {
          create: [
            { platform: 'SHOPIFY' },
            { platform: 'ETSY' },
          ],
        },
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@email.com',
        phone: '5551234567',
        status: 'ACTIVE',
        totalOrders: 15,
        totalSpent: 2156.75,
        lastOrderDate: new Date('2025-11-28'),
        address: {
          create: {
            street: '892 Oak Avenue',
            city: 'Birmingham',
            state: 'AL',
            zip: '35203',
            country: 'United States',
          },
        },
        tags: {
          create: [
            { tag: 'VIP' },
            { tag: 'High Value' },
          ],
        },
        platforms: {
          create: [
            { platform: 'SHOPIFY' },
            { platform: 'EBAY' },
          ],
        },
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Michael Rodriguez',
        email: 'mrodriguez@example.com',
        status: 'ACTIVE',
        totalOrders: 3,
        totalSpent: 487.25,
        lastOrderDate: new Date('2025-11-20'),
        address: {
          create: {
            street: '1567 Maple Drive',
            city: 'Leicester',
            state: 'LE',
            zip: 'LE1 5DB',
            country: 'United Kingdom',
          },
        },
        tags: {
          create: [
            { tag: 'New Customer' },
          ],
        },
        platforms: {
          create: [
            { platform: 'EBAY' },
          ],
        },
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Emily Chen',
        email: 'emily.chen@gmail.com',
        phone: '4165551234',
        status: 'ACTIVE',
        totalOrders: 12,
        totalSpent: 1698.40,
        lastOrderDate: new Date('2025-12-01'),
        address: {
          create: {
            street: '789 Queen Street West',
            city: 'Toronto',
            state: 'ON',
            zip: 'M6J 1G1',
            country: 'Canada',
          },
        },
        tags: {
          create: [
            { tag: 'Returning' },
            { tag: 'Wholesale' },
          ],
        },
        platforms: {
          create: [
            { platform: 'SHOPIFY' },
            { platform: 'ETSY' },
          ],
        },
      },
    }),
    prisma.customer.create({
      data: {
        name: 'James Wilson',
        email: 'jwilson@business.com',
        status: 'INACTIVE',
        totalOrders: 1,
        totalSpent: 127.99,
        lastOrderDate: new Date('2025-01-15'),
        address: {
          create: {
            street: '456 Business Park',
            city: 'Halesowen',
            state: 'WM',
            zip: 'B62 8QF',
            country: 'United Kingdom',
          },
        },
        tags: {
          create: [
            { tag: 'One-time' },
          ],
        },
        platforms: {
          create: [
            { platform: 'EBAY' },
          ],
        },
      },
    }),
  ])

  console.log(`✅ Created ${customers.length} customers`)

  // Create simple products
  const simpleProducts = await Promise.all([
    prisma.product.create({
      data: {
        name: 'A4 Paper',
        sku: 'VAR-PROD-1',
        category: 'SIMPLE',
        supplierId: suppliers[2].id, // Office Essentials
        reorderPoint: 0,
        tag: 'M',
        status: 'ACTIVE',
        warehouse: {
          create: {
            total: 0,
            inOrder: 2,
            available: -2,
            awaiting: 82,
            binLocation: 'A1-23',
          },
        },
        prices: {
          create: [
            { platform: 'MULTIORDERS', price: 12.99 },
            { platform: 'EBAY', price: 14.99 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pencil Box Blue Type',
        sku: 'KS-Z458-MA',
        category: 'SIMPLE',
        supplierId: suppliers[2].id,
        reorderPoint: 0,
        tag: 'M',
        status: 'ACTIVE',
        warehouse: {
          create: {
            total: 3,
            inOrder: 2,
            available: 1,
            awaiting: 2,
            binLocation: 'B2-15',
          },
        },
        prices: {
          create: [
            { platform: 'MULTIORDERS', price: 8.99 },
            { platform: 'EBAY', price: 9.99 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Screen Shine Wipes',
        sku: 'V1R-850D-2',
        category: 'SIMPLE',
        supplierId: suppliers[1].id, // TechParts
        reorderPoint: 500,
        tag: 'M',
        status: 'ACTIVE',
        warehouse: {
          create: {
            total: 78,
            inOrder: 0,
            available: 78,
            awaiting: 33,
            binLocation: 'C3-08',
          },
        },
        prices: {
          create: [
            { platform: 'MULTIORDERS', price: 15.99 },
            { platform: 'EBAY', price: 17.99 },
            { platform: 'SHOPIFY', price: 16.99 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'DW Clock Red Stripe',
        sku: 'KIZ-B35-KA21',
        category: 'SIMPLE',
        supplierId: suppliers[1].id,
        reorderPoint: 0,
        tag: 'M',
        status: 'ACTIVE',
        warehouse: {
          create: {
            total: 16,
            inOrder: 0,
            available: 16,
            awaiting: 0,
            binLocation: 'D4-12',
          },
        },
        prices: {
          create: [
            { platform: 'MULTIORDERS', price: 24.99 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Tea Cup Brown',
        sku: '3E-KO24-SPNA',
        category: 'SIMPLE',
        supplierId: suppliers[0].id, // Calypso Co.
        reorderPoint: 0,
        tag: 'M',
        status: 'ACTIVE',
        warehouse: {
          create: {
            total: 19,
            inOrder: 0,
            available: 19,
            awaiting: 0,
            binLocation: 'E5-06',
          },
        },
        prices: {
          create: [
            { platform: 'MULTIORDERS', price: 18.99 },
            { platform: 'SHOPIFY', price: 19.99 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Silver Keyboard White Caps',
        sku: '2M-H7E3-NYQO',
        category: 'SIMPLE',
        supplierId: suppliers[1].id,
        reorderPoint: 15,
        tag: 'M',
        status: 'LOW_STOCK',
        warehouse: {
          create: {
            total: 2,
            inOrder: 0,
            available: 2,
            awaiting: 0,
            binLocation: 'F6-09',
          },
        },
        prices: {
          create: [
            { platform: 'MULTIORDERS', price: 79.99 },
            { platform: 'EBAY', price: 84.99 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Battery Charger Four Slot',
        sku: 'NE-2H1A-CIK2',
        category: 'SIMPLE',
        supplierId: suppliers[1].id,
        reorderPoint: 0,
        tag: 'M',
        status: 'ACTIVE',
        warehouse: {
          create: {
            total: 5,
            inOrder: 0,
            available: 5,
            awaiting: 0,
            binLocation: 'G7-03',
          },
        },
        prices: {
          create: [
            { platform: 'MULTIORDERS', price: 45.99 },
          ],
        },
      },
    }),
  ])

  console.log(`✅ Created ${simpleProducts.length} simple products`)

  // Create configurable products (multi-channel)
  const configurableProducts = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Triple Mango OX Passion Nic Salt',
        sku: 'Oxva-OXP-passion-001-10ml-10mg',
        category: 'CONFIGURABLE',
        supplierId: suppliers[0].id,
        reorderPoint: 120,
        status: 'ACTIVE',
        warehouse: {
          create: {
            total: 15,
            inOrder: 4,
            available: 2,
            awaiting: 0,
            binLocation: 'H8-11',
          },
        },
        prices: {
          create: [
            { platform: 'SHOPIFY', price: 14.75 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Spearmint 70/30 By Ferocious Flavours',
        sku: 'FerociousFlavours-020-120ml',
        category: 'CONFIGURABLE',
        supplierId: suppliers[0].id,
        reorderPoint: 0,
        tag: 'M',
        status: 'ACTIVE',
        warehouse: {
          create: {
            total: 28,
            inOrder: 7,
            available: 1,
            awaiting: 0,
            binLocation: 'I9-05',
          },
        },
        prices: {
          create: [
            { platform: 'SHOPIFY', price: 27.25 },
            { platform: 'EBAY', price: 27.25 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Heizen Strawberry 70/30 By Ferocious',
        sku: 'FerociousFlavours-019-120ml',
        category: 'CONFIGURABLE',
        supplierId: suppliers[0].id,
        reorderPoint: 0,
        status: 'ACTIVE',
        warehouse: {
          create: {
            total: 1,
            inOrder: 0,
            available: 2,
            awaiting: 0,
            binLocation: 'J10-08',
          },
        },
        prices: {
          create: [
            { platform: 'SHOPIFY', price: 24.25 },
          ],
        },
      },
    }),
  ])

  console.log(`✅ Created ${configurableProducts.length} configurable products`)

  // Create component products for bundles
  const componentProducts = await Promise.all([
    prisma.product.create({
      data: {
        name: "Men's Shirt M",
        sku: 'MS-M-46',
        category: 'SIMPLE',
        supplierId: suppliers[0].id,
        status: 'ACTIVE',
        warehouse: {
          create: {
            total: 36,
            inOrder: 0,
            available: 36,
            awaiting: 5,
            binLocation: 'K11-02',
          },
        },
        prices: {
          create: [
            { platform: 'EBAY', price: 29.99 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Men's Socks M",
        sku: 'MS-S-46',
        category: 'SIMPLE',
        supplierId: suppliers[0].id,
        status: 'ACTIVE',
        warehouse: {
          create: {
            total: 125,
            inOrder: 0,
            available: 125,
            awaiting: 0,
            binLocation: 'L12-07',
          },
        },
        prices: {
          create: [
            { platform: 'EBAY', price: 12.99 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Men's Pants M",
        sku: 'MP-M-45',
        category: 'SIMPLE',
        supplierId: suppliers[0].id,
        status: 'ACTIVE',
        warehouse: {
          create: {
            total: 13,
            inOrder: 0,
            available: 13,
            awaiting: 2,
            binLocation: 'M13-01',
          },
        },
        prices: {
          create: [
            { platform: 'EBAY', price: 49.99 },
          ],
        },
      },
    }),
  ])

  console.log(`✅ Created ${componentProducts.length} component products`)

  // Create bundled products
  const bundleProduct = await prisma.product.create({
    data: {
      name: "Men's Clothing Deal",
      sku: 'DB-48',
      category: 'BUNDLED',
      supplierId: suppliers[0].id,
      reorderPoint: 0,
      status: 'ACTIVE',
      warehouse: {
        create: {
          total: 12,
          inOrder: 0,
          available: 12,
          awaiting: 0,
          binLocation: 'BA-33',
        },
      },
      prices: {
        create: [
          { platform: 'EBAY', price: 136.48 },
        ],
      },
    },
  })

  // Create bundle components
  await Promise.all([
    prisma.bundleComponent.create({
      data: {
        bundleId: bundleProduct.id,
        componentId: componentProducts[0].id, // Men's Shirt M
        quantityNeeded: 5,
      },
    }),
    prisma.bundleComponent.create({
      data: {
        bundleId: bundleProduct.id,
        componentId: componentProducts[1].id, // Men's Socks M
        quantityNeeded: 0,
      },
    }),
    prisma.bundleComponent.create({
      data: {
        bundleId: bundleProduct.id,
        componentId: componentProducts[2].id, // Men's Pants M
        quantityNeeded: 1,
      },
    }),
  ])

  console.log(`✅ Created bundle product with components`)

  // Create orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        orderId: '10086',
        customerId: customers[0].id, // Tom Jackson
        platform: 'SHOPIFY',
        status: 'NEW',
        total: 78.00,
        currency: 'USD',
        paid: true,
        orderDate: new Date('2025-12-02T17:41:00'),
        shippingAddress: {
          create: {
            name: 'Tom Jackson',
            street: '14144 New street',
            city: 'Gendville',
            state: 'NY',
            zip: '90111',
            country: 'United States',
          },
        },
        items: {
          create: [
            {
              productName: 'Bomber Jacket',
              quantity: 1,
              price: 78.00,
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        orderId: '156845',
        customerId: customers[1].id, // Sarah Mitchell
        platform: 'SHOPIFY',
        status: 'NEW',
        total: 176.00,
        currency: 'USD',
        paid: true,
        orderDate: new Date('2025-12-02T17:41:00'),
        shippingAddress: {
          create: {
            name: 'Sarah Mitchell',
            street: '892 Oak Avenue',
            city: 'Birmingham',
            state: 'AL',
            zip: '35203',
            country: 'United States',
          },
        },
        items: {
          create: [
            {
              productName: 'Manganiello Shirt',
              quantity: 2,
              price: 88.00,
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        orderId: '111-1481331-2363411',
        customerId: customers[2].id, // Michael Rodriguez
        platform: 'EBAY',
        status: 'IN_PROGRESS',
        total: 107.51,
        currency: 'USD',
        paid: true,
        orderDate: new Date('2025-12-02T17:41:00'),
        shippingAddress: {
          create: {
            name: 'Michael Rodriguez',
            street: '1567 Maple Drive',
            city: 'Leicester',
            state: 'LE',
            zip: 'LE1 5DB',
            country: 'United Kingdom',
          },
        },
        items: {
          create: [
            {
              productName: 'Leather Vest',
              quantity: 1,
              price: 107.51,
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        orderId: '112-1475613-0439468',
        customerId: customers[3].id, // Emily Chen
        platform: 'EBAY',
        status: 'SHIPPED',
        total: 135.31,
        currency: 'USD',
        paid: true,
        trackingNumber: '584548567631',
        orderDate: new Date('2025-12-02T17:41:00'),
        shippingAddress: {
          create: {
            name: 'Emily Chen',
            street: '789 Queen Street West',
            city: 'Toronto',
            state: 'ON',
            zip: 'M6J 1G1',
            country: 'Canada',
          },
        },
        items: {
          create: [
            {
              productName: 'Blazer Jacket',
              quantity: 1,
              price: 135.31,
            },
          ],
        },
      },
    }),
  ])

  console.log(`✅ Created ${orders.length} orders`)

  // Create platform integrations
  const integrations = await Promise.all([
    prisma.platformIntegration.create({
      data: {
        platform: 'EBAY',
        status: 'LIVE',
        region: 'US',
        syncEnabled: true,
        productCount: 145,
        lastSync: new Date(),
      },
    }),
    prisma.platformIntegration.create({
      data: {
        platform: 'EBAY',
        status: 'LIVE',
        syncEnabled: true,
        productCount: 89,
        lastSync: new Date(),
      },
    }),
    prisma.platformIntegration.create({
      data: {
        platform: 'SHOPIFY',
        status: 'INTEGRATING',
        syncEnabled: false,
        productCount: 0,
      },
    }),
    prisma.platformIntegration.create({
      data: {
        platform: 'SHOPIFY',
        status: 'LIVE',
        syncEnabled: true,
        productCount: 67,
        lastSync: new Date(),
      },
    }),
    prisma.platformIntegration.create({
      data: {
        platform: 'ETSY',
        status: 'ERRORED',
        syncEnabled: false,
        productCount: 23,
        lastError: 'API authentication failed',
        errorCount: 3,
      },
    }),
  ])

  console.log(`✅ Created ${integrations.length} platform integrations`)

  console.log('🎉 Database seeding completed successfully!')
  console.log('\nSummary:')
  console.log(`- ${suppliers.length} suppliers`)
  console.log(`- ${customers.length} customers`)
  console.log(`- ${simpleProducts.length + configurableProducts.length + componentProducts.length + 1} products`)
  console.log(`- ${orders.length} orders`)
  console.log(`- ${integrations.length} platform integrations`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })