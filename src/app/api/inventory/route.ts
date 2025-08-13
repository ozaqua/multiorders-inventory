import { NextResponse } from 'next/server'
import { getAllProducts, getProductsByCategory } from '@/lib/database/products'
import type { ProductCategory } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    let products
    if (category && category !== 'all') {
      products = await getProductsByCategory(category.toUpperCase() as ProductCategory)
    } else {
      products = await getAllProducts()
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Inventory API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory data' },
      { status: 500 }
    )
  }
}