import { Product, Bundle } from '@/types'

// Mock data matching multiorders screenshots
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'A4 Paper',
    sku: 'VAR-PROD-1',
    category: 'simple',
    store: ['multiorders'],
    warehouse: {
      total: 0,
      inOrder: 2,
      available: -2,
      awaiting: 82
    },
    reorderPoint: 0,
    tag: 'M',
    price: {},
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2', 
    name: 'Pencil Box Blue Type',
    sku: 'KS-Z458-MA',
    category: 'simple',
    store: ['multiorders'],
    warehouse: {
      total: 3,
      inOrder: 2,
      available: 1,
      awaiting: 2
    },
    reorderPoint: 0,
    tag: 'M',
    price: {},
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Screen Shine Wipes',
    sku: 'V1R-850D-2',
    category: 'simple',
    store: ['multiorders'],
    warehouse: {
      total: 78,
      inOrder: 0,
      available: 78,
      awaiting: 33
    },
    reorderPoint: 500,
    tag: 'M',
    price: {},
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'DW Clock Red Stripe',
    sku: 'KIZ-B35-KA21',
    category: 'simple',
    store: ['multiorders'],
    warehouse: {
      total: 16,
      inOrder: 0,
      available: 16,
      awaiting: 0
    },
    reorderPoint: 0,
    tag: 'M',
    price: {},
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'Synthetic Green Flower',
    sku: 'JS-MUZ-ZK79',
    category: 'bundled',
    store: ['multiorders'],
    warehouse: {
      total: 0,
      inOrder: 2,
      available: -2,
      awaiting: 0
    },
    reorderPoint: 0,
    tag: 'B',
    price: {},
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    name: 'Bucket Small Blue',
    sku: 'ZP-PI56-0VHW',
    category: 'bundled',
    store: ['multiorders'],
    warehouse: {
      total: 2,
      inOrder: 0,
      available: 2,
      awaiting: 1
    },
    reorderPoint: 0,
    tag: 'B',
    price: {},
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '7',
    name: 'Tea Cup Brown',
    sku: '3E-KO24-SPNA',
    category: 'simple',
    store: ['multiorders'],
    warehouse: {
      total: 19,
      inOrder: 0,
      available: 19,
      awaiting: 0
    },
    reorderPoint: 0,
    tag: 'M',
    price: {},
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '8',
    name: 'Silver Keyboard White Caps',
    sku: '2M-H7E3-NYQO',
    category: 'simple',
    store: ['multiorders'],
    warehouse: {
      total: 2,
      inOrder: 0,
      available: 2,
      awaiting: 0
    },
    reorderPoint: 15,
    tag: 'M',
    price: {},
    status: 'low-stock',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '9',
    name: 'Battery Charger Four Slot',
    sku: 'NE-2H1A-CIK2',
    category: 'simple',
    store: ['multiorders'],
    warehouse: {
      total: 5,
      inOrder: 0,
      available: 5,
      awaiting: 0
    },
    reorderPoint: 0,
    tag: 'M',
    price: {},
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Multi-channel products (matching advanced screenshot)
export const multiChannelProducts: Product[] = [
  {
    id: 'mc1',
    name: 'Triple Mango OX Passion Nic Salt',
    sku: 'Oxva-OXP-passion-001-10ml-10mg',
    category: 'configurable',
    store: ['wix'],
    warehouse: {
      total: 15,
      inOrder: 4,
      available: 2,
      awaiting: 0
    },
    reorderPoint: 120,
    price: {
      wix: 14.75
    },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'mc2',
    name: 'Spearmint 70/30 By Ferocious Flavours',
    sku: 'FerociousFlavours-020-120ml',
    category: 'configurable',
    store: ['wix', 'ebay'],
    warehouse: {
      total: 28,
      inOrder: 7,
      available: 1,
      awaiting: 0
    },
    reorderPoint: 0,
    tag: 'M',
    price: {
      wix: 27.25,
      ebay: 27.25
    },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'mc3',
    name: 'Heizen Strawberry 70/30 By Ferocious',
    sku: 'FerociousFlavours-019-120ml',
    category: 'configurable',
    store: ['wix'],
    warehouse: {
      total: 1,
      inOrder: 0,
      available: 2,
      awaiting: 0
    },
    reorderPoint: 0,
    price: {
      wix: 24.25
    },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Bundle components matching the screenshot
export const mockBundles: Bundle[] = [
  {
    id: 'bundle1',
    name: "Men's Clothing Deal",
    sku: 'DB-48',
    category: 'bundled',
    store: ['amazon'],
    warehouse: {
      total: 12,
      inOrder: 0,
      available: 12,
      awaiting: 0
    },
    components: [
      {
        productId: 'comp1',
        productName: "Men's Shirt M",
        sku: 'MS-M-46',
        quantityNeeded: 5,
        availableStock: 36
      },
      {
        productId: 'comp2', 
        productName: "Men's Socks M",
        sku: 'MS-S-46',
        quantityNeeded: 0,
        availableStock: 125
      },
      {
        productId: 'comp3',
        productName: "Men's Pants M", 
        sku: 'MP-M-45',
        quantityNeeded: 1,
        availableStock: 13
      }
    ],
    retailPrice: 136.48,
    reorderPoint: 0,
    price: {},
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]