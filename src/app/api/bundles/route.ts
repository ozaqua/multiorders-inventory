import { NextResponse } from 'next/server'
import { getBundledProducts } from '@/lib/database/products'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const bundles = await getBundledProducts()
    return NextResponse.json({ bundles })
  } catch (error) {
    console.error('Bundles API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bundle data' },
      { status: 500 }
    )
  }
}