import { NextRequest, NextResponse } from 'next/server'
import { convertProductType } from '@/lib/business-logic/product-rules'
import type { ProductCategory } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { targetType } = await request.json()
    
    if (!targetType) {
      return NextResponse.json(
        { error: 'Target type is required' },
        { status: 400 }
      )
    }

    const result = await convertProductType(params.id, targetType as ProductCategory)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: `Product converted to ${targetType}`
    })
  } catch (error) {
    console.error('Product conversion error:', error)
    return NextResponse.json(
      { error: 'Failed to convert product type' },
      { status: 500 }
    )
  }
}