import { NextResponse } from 'next/server'
import { getAllOrders } from '@/lib/database/orders'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const orders = await getAllOrders()
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Orders API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}