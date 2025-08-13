import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        warehouse: true,
        prices: {
          where: { isActive: true }
        },
        supplier: {
          select: { name: true }
        },
        bundleComponents: {
          include: {
            bundle: {
              select: {
                id: true,
                name: true,
                sku: true
              }
            }
          }
        },
        inBundles: {
          include: {
            component: {
              select: {
                id: true,
                name: true,
                sku: true,
                warehouse: {
                  select: {
                    available: true
                  }
                }
              }
            }
          }
        },
        platformProducts: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}