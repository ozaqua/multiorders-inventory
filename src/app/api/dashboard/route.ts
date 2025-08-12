import { NextResponse } from 'next/server'
import { getDashboardMetrics, getSalesByChannel, getOrderStatusBreakdown } from '@/lib/database/dashboard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [metrics, channels, statusBreakdown] = await Promise.all([
      getDashboardMetrics(),
      getSalesByChannel(),
      getOrderStatusBreakdown(),
    ])

    return NextResponse.json({
      metrics,
      channels,
      statusBreakdown,
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}