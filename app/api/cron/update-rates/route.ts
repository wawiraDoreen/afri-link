import { NextResponse } from 'next/server'
import { exchangeRateService } from '@/lib/services/exchange-rate-service'
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

    const autoUpdate = process.env.AUTO_UPDATE_RATES !== 'false'

    if (!autoUpdate) {
      return NextResponse.json({
        success: false,
        message: 'Automatic rate updates are disabled'
      })
    }

    const results = {
      exchangeRates: { success: false, updated: 0, errors: [] as string[] },
      goldPrice: { success: false, price: 0, error: null as string | null },
      actPrice: { success: false, price: 0, error: null as string | null }
    }

    try {
      const exchangeResult = await exchangeRateService.updateAllRates()
      results.exchangeRates = exchangeResult
    } catch (error: any) {
      results.exchangeRates.errors.push(error.message)
    }

    try {
      const goldPrice = await goldPriceService.getCurrentGoldPrice()
      const goldSaved = await actPriceService.updateAssetPrice('gold', goldPrice, 'cron_job')

      results.goldPrice = {
        success: goldSaved,
        price: goldPrice,
        error: goldSaved ? null : 'Failed to save gold price'
      }
    } catch (error: any) {
      results.goldPrice.error = error.message
    }

    try {
      const actPrice = await actPriceService.calculateACTPrice()
      const actSaved = await actPriceService.saveACTPrice(actPrice)

      results.actPrice = {
        success: actSaved,
        price: actPrice.price_usd,
        error: actSaved ? null : 'Failed to save ACT price'
      }
    } catch (error: any) {
      results.actPrice.error = error.message
    }

    const overallSuccess =
      results.exchangeRates.success &&
      results.goldPrice.success &&
      results.actPrice.success

    return NextResponse.json({
      success: overallSuccess,
      timestamp: new Date().toISOString(),
      results
    })
  } catch (error: any) {
    console.error('Error in cron job:', error)
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
