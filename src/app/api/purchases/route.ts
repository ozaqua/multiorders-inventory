import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Mock data for purchases
const mockPurchases = [
  {
    id: 'PUR-001',
    orderNumber: 'PO-2024-0015',
    supplierId: 'SUP-001',
    supplierName: 'Tech Components Ltd',
    status: 'received',
    orderDate: '2024-01-10T09:00:00Z',
    expectedDate: '2024-01-20T09:00:00Z',
    receivedDate: '2024-01-18T14:30:00Z',
    totalAmount: 1250.50,
    items: [
      {
        id: 'ITM-001',
        productName: 'USB-C Cables',
        sku: 'USB-C-2M-001',
        quantity: 50,
        unitPrice: 8.99,
        received: 50,
        status: 'received'
      },
      {
        id: 'ITM-002',
        productName: 'Phone Stands',
        sku: 'PST-ADJ-001',
        quantity: 25,
        unitPrice: 12.99,
        received: 25,
        status: 'received'
      }
    ]
  },
  {
    id: 'PUR-002',
    orderNumber: 'PO-2024-0016',
    supplierId: 'SUP-002',
    supplierName: 'Global Electronics Co',
    status: 'pending',
    orderDate: '2024-01-14T11:15:00Z',
    expectedDate: '2024-01-25T09:00:00Z',
    totalAmount: 2100.75,
    items: [
      {
        id: 'ITM-003',
        productName: 'Bluetooth Headphones',
        sku: 'WBH-BLK-001',
        quantity: 100,
        unitPrice: 18.50,
        received: 0,
        status: 'pending'
      },
      {
        id: 'ITM-004',
        productName: 'Power Banks',
        sku: 'PB-10000-BLK',
        quantity: 30,
        unitPrice: 22.75,
        received: 0,
        status: 'pending'
      }
    ]
  },
  {
    id: 'PUR-003',
    orderNumber: 'PO-2024-0017',
    supplierId: 'SUP-001',
    supplierName: 'Tech Components Ltd',
    status: 'partial',
    orderDate: '2024-01-15T16:30:00Z',
    expectedDate: '2024-01-28T09:00:00Z',
    totalAmount: 875.25,
    items: [
      {
        id: 'ITM-005',
        productName: 'Wireless Chargers',
        sku: 'WC-15W-BLK',
        quantity: 40,
        unitPrice: 15.99,
        received: 25,
        status: 'partial'
      },
      {
        id: 'ITM-006',
        productName: 'Screen Protectors',
        sku: 'SP-GLASS-001',
        quantity: 100,
        unitPrice: 3.25,
        received: 0,
        status: 'pending'
      }
    ]
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const supplierId = searchParams.get('supplier')
    
    let filteredPurchases = mockPurchases
    
    if (status && status !== 'all') {
      filteredPurchases = filteredPurchases.filter(purchase => purchase.status === status)
    }
    
    if (supplierId && supplierId !== 'all') {
      filteredPurchases = filteredPurchases.filter(purchase => purchase.supplierId === supplierId)
    }

    return NextResponse.json({ 
      purchases: filteredPurchases,
      summary: {
        total: mockPurchases.length,
        pending: mockPurchases.filter(p => p.status === 'pending').length,
        partial: mockPurchases.filter(p => p.status === 'partial').length,
        received: mockPurchases.filter(p => p.status === 'received').length,
        totalValue: mockPurchases.reduce((sum, p) => sum + p.totalAmount, 0)
      }
    })
  } catch (error) {
    console.error('Purchases API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchases data' },
      { status: 500 }
    )
  }
}