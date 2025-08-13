import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Mock data for suppliers
const mockSuppliers = [
  {
    id: 'SUP-001',
    name: 'Tech Components Ltd',
    email: 'orders@techcomponents.com',
    phone: '+44 20 7123 4567',
    website: 'www.techcomponents.com',
    address: {
      street: '123 Technology Park',
      city: 'London',
      postcode: 'EC1A 1BB',
      country: 'United Kingdom'
    },
    status: 'active',
    rating: 4.8,
    paymentTerms: 'Net 30',
    currency: 'GBP',
    leadTime: 7,
    minimumOrder: 500,
    categories: ['Electronics', 'Accessories'],
    totalOrders: 45,
    totalSpent: 125750.50,
    lastOrderDate: '2024-01-15T10:30:00Z',
    createdAt: '2023-08-15T09:00:00Z',
    notes: 'Reliable supplier for electronics. Good pricing and fast delivery.'
  },
  {
    id: 'SUP-002',
    name: 'Global Electronics Co',
    email: 'sales@globalelectronics.com',
    phone: '+1 555 123 4567',
    website: 'www.globalelectronics.com',
    address: {
      street: '456 Industrial Blvd',
      city: 'Los Angeles',
      postcode: '90210',
      country: 'United States'
    },
    status: 'active',
    rating: 4.2,
    paymentTerms: 'Net 45',
    currency: 'USD',
    leadTime: 14,
    minimumOrder: 1000,
    categories: ['Electronics', 'Audio Equipment'],
    totalOrders: 23,
    totalSpent: 87250.75,
    lastOrderDate: '2024-01-12T14:20:00Z',
    createdAt: '2023-10-22T11:30:00Z',
    notes: 'Good for bulk orders. Longer lead times but competitive prices.'
  },
  {
    id: 'SUP-003',
    name: 'Fashion Direct Ltd',
    email: 'wholesale@fashiondirect.co.uk',
    phone: '+44 161 234 5678',
    website: 'www.fashiondirect.co.uk',
    address: {
      street: '78 Market Street',
      city: 'Manchester',
      postcode: 'M1 1AA',
      country: 'United Kingdom'
    },
    status: 'pending',
    rating: 0,
    paymentTerms: 'Net 30',
    currency: 'GBP',
    leadTime: 10,
    minimumOrder: 250,
    categories: ['Fashion', 'Accessories'],
    totalOrders: 0,
    totalSpent: 0,
    lastOrderDate: null,
    createdAt: '2024-01-10T16:45:00Z',
    notes: 'New supplier under evaluation. Specializes in fashion items.'
  },
  {
    id: 'SUP-004',
    name: 'Quick Parts Supply',
    email: 'info@quickparts.com',
    phone: '+44 113 345 6789',
    website: 'www.quickparts.com',
    address: {
      street: '92 Industrial Estate',
      city: 'Leeds',
      postcode: 'LS1 2AB',
      country: 'United Kingdom'
    },
    status: 'inactive',
    rating: 3.5,
    paymentTerms: 'Net 15',
    currency: 'GBP',
    leadTime: 5,
    minimumOrder: 100,
    categories: ['Parts', 'Components'],
    totalOrders: 12,
    totalSpent: 15500.25,
    lastOrderDate: '2023-11-20T09:15:00Z',
    createdAt: '2023-05-10T14:00:00Z',
    notes: 'Previously used for small parts. Deactivated due to quality issues.'
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    
    let filteredSuppliers = mockSuppliers
    
    if (status && status !== 'all') {
      filteredSuppliers = filteredSuppliers.filter(supplier => supplier.status === status)
    }
    
    if (category && category !== 'all') {
      filteredSuppliers = filteredSuppliers.filter(supplier => 
        supplier.categories.some(cat => cat.toLowerCase().includes(category.toLowerCase()))
      )
    }

    return NextResponse.json({ 
      suppliers: filteredSuppliers,
      summary: {
        total: mockSuppliers.length,
        active: mockSuppliers.filter(s => s.status === 'active').length,
        pending: mockSuppliers.filter(s => s.status === 'pending').length,
        inactive: mockSuppliers.filter(s => s.status === 'inactive').length,
        totalSpent: mockSuppliers.reduce((sum, s) => sum + s.totalSpent, 0),
        totalOrders: mockSuppliers.reduce((sum, s) => sum + s.totalOrders, 0)
      }
    })
  } catch (error) {
    console.error('Suppliers API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suppliers data' },
      { status: 500 }
    )
  }
}