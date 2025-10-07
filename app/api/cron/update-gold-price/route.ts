import { NextResponse } from 'next/server'
import { goldPriceService } from '@/lib/services/gold-price-service'
import { actPriceService } from '@/lib/services/act-price-service'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const goldPrice = await goldPriceService.getCurrentGoldPrice()

    const saved = await actPriceService.updateAssetPrice('gold', goldPrice, 'cron_gold_update')

    const actPrice = await actPriceService.calculateACTPrice()
    const actSaved = await actPriceService.saveACTPrice(actPrice)

    return NextResponse.json({
      success: saved && actSaved,
      goldPrice,
      actPrice: actPrice.price_usd,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Error updating gold price:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  return GET(request)
}
