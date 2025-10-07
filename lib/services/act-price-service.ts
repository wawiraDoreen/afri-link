import { createClient } from '@/lib/supabase/server'

export interface AssetPrice {
  gold: number
  usd: number
  eur: number
}

export interface BasketComposition {
  gold_weight: number
  usd_weight: number
  eur_weight: number
}

export interface ACTPrice {
  price_usd: number
  total_reserve_usd: number
  reserve_ratio: number
  gold_component_usd: number
  usd_component: number
  eur_component_usd: number
  total_supply: number
  calculated_at: Date
}

export interface ReserveBalance {
  gold: number
  usd: number
  eur: number
  total_usd: number
}

export class ACTPriceService {
  constructor() {}

  private async getSupabaseClient() {
    return await createClient()
  }

  async getCurrentAssetPrices(): Promise<AssetPrice> {
    const supabase = await this.getSupabaseClient()
    const { data, error } = await supabase
      .from('asset_prices')
      .select('asset_type, price_usd')
      .order('fetched_at', { ascending: false })

    if (error) {
      console.error('Error fetching asset prices:', error)
      return { gold: 2000, usd: 1, eur: 1.08 }
    }

    const prices: AssetPrice = { gold: 2000, usd: 1, eur: 1.08 }

    data?.forEach((price: any) => {
      if (price.asset_type === 'gold') {
        prices.gold = parseFloat(price.price_usd)
      } else if (price.asset_type === 'usd') {
        prices.usd = parseFloat(price.price_usd)
      } else if (price.asset_type === 'eur') {
        prices.eur = parseFloat(price.price_usd)
      }
    })

    return prices
  }

  async getActiveBasketComposition(): Promise<BasketComposition> {
    const supabase = await this.getSupabaseClient()
    const { data, error } = await supabase
      .from('act_basket_composition')
      .select('gold_weight, usd_weight, eur_weight')
      .eq('is_active', true)
      .single()

    if (error || !data) {
      console.error('Error fetching basket composition:', error)
      return { gold_weight: 0.4, usd_weight: 0.3, eur_weight: 0.3 }
    }

    return {
      gold_weight: parseFloat(data.gold_weight),
      usd_weight: parseFloat(data.usd_weight),
      eur_weight: parseFloat(data.eur_weight),
    }
  }

  async getReserveBalances(): Promise<ReserveBalance> {
    const supabase = await this.getSupabaseClient()
    const { data, error } = await supabase
      .from('act_reserves')
      .select('asset_type, amount, amount_usd')

    if (error || !data) {
      console.error('Error fetching reserves:', error)
      return { gold: 0, usd: 0, eur: 0, total_usd: 0 }
    }

    const reserves: ReserveBalance = { gold: 0, usd: 0, eur: 0, total_usd: 0 }

    data.forEach((reserve: any) => {
      const amount = parseFloat(reserve.amount)
      const amountUsd = parseFloat(reserve.amount_usd)

      if (reserve.asset_type === 'gold') {
        reserves.gold = amount
      } else if (reserve.asset_type === 'usd') {
        reserves.usd = amount
      } else if (reserve.asset_type === 'eur') {
        reserves.eur = amount
      }

      reserves.total_usd += amountUsd
    })

    return reserves
  }

  async calculateACTPrice(): Promise<ACTPrice> {
    const assetPrices = await this.getCurrentAssetPrices()
    const basket = await this.getActiveBasketComposition()
    const reserves = await this.getReserveBalances()

    const totalSupply = 1000000

    const goldComponentUsd = reserves.gold * assetPrices.gold
    const usdComponent = reserves.usd * assetPrices.usd
    const eurComponentUsd = reserves.eur * assetPrices.eur

    const totalReserveUsd = goldComponentUsd + usdComponent + eurComponentUsd

    const priceUsd = totalSupply > 0 ? totalReserveUsd / totalSupply : 1.0

    const reserveRatio = totalSupply > 0 ? totalReserveUsd / (totalSupply * priceUsd) : 1.0

    return {
      price_usd: priceUsd,
      total_reserve_usd: totalReserveUsd,
      reserve_ratio: reserveRatio,
      gold_component_usd: goldComponentUsd,
      usd_component: usdComponent,
      eur_component_usd: eurComponentUsd,
      total_supply: totalSupply,
      calculated_at: new Date(),
    }
  }

  async saveACTPrice(price: ACTPrice): Promise<boolean> {
    const supabase = await this.getSupabaseClient()
    const { data: basketData } = await supabase
      .from('act_basket_composition')
      .select('id')
      .eq('is_active', true)
      .single()

    const { error } = await supabase
      .from('act_price_history')
      .insert({
        price_usd: price.price_usd,
        total_supply: price.total_supply,
        total_reserve_usd: price.total_reserve_usd,
        reserve_ratio: price.reserve_ratio,
        gold_component_usd: price.gold_component_usd,
        usd_component: price.usd_component,
        eur_component_usd: price.eur_component_usd,
        basket_composition_id: basketData?.id,
        calculated_at: price.calculated_at,
      })

    if (error) {
      console.error('Error saving ACT price:', error)
      return false
    }

    return true
  }

  async getLatestACTPrice(): Promise<ACTPrice | null> {
    const supabase = await this.getSupabaseClient()
    const { data, error } = await supabase
      .from('act_price_history')
      .select('*')
      .order('calculated_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return null
    }

    return {
      price_usd: parseFloat(data.price_usd),
      total_reserve_usd: parseFloat(data.total_reserve_usd),
      reserve_ratio: parseFloat(data.reserve_ratio),
      gold_component_usd: parseFloat(data.gold_component_usd),
      usd_component: parseFloat(data.usd_component),
      eur_component_usd: parseFloat(data.eur_component_usd),
      total_supply: parseFloat(data.total_supply),
      calculated_at: new Date(data.calculated_at),
    }
  }

  async updateAssetPrice(
    assetType: 'gold' | 'usd' | 'eur',
    priceUsd: number,
    source: string
  ): Promise<boolean> {
    const supabase = await this.getSupabaseClient()
    const { error } = await supabase
      .from('asset_prices')
      .insert({
        asset_type: assetType,
        price_usd: priceUsd,
        price_source: source,
        fetched_at: new Date().toISOString(),
      })

    if (error) {
      console.error(`Error updating ${assetType} price:`, error)
      return false
    }

    return true
  }

  async getReserveRatio(): Promise<number> {
    const price = await this.calculateACTPrice()
    return price.reserve_ratio
  }

  async needsRebalancing(threshold: number = 0.8): Promise<boolean> {
    const ratio = await this.getReserveRatio()
    return ratio < threshold
  }
}

export const actPriceService = new ACTPriceService()
