import { NextRequest, NextResponse } from 'next/server'
import { canConvertProductType, getAvailableConversions } from '@/lib/business-logic/product-rules'
import type { ProductCategory } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const targetType = searchParams.get('targetType')
    
    if (targetType) {
      // Check specific conversion
      const result = await canConvertProductType(params.id, targetType as ProductCategory)
      return NextResponse.json(result)
    } else {
      // Get all available conversions
      const availableTypes = await getAvailableConversions(params.id)
      return NextResponse.json({ availableTypes })
    }
  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate conversion' },
      { status: 500 }
    )
  }
}