import { createClient } from '@/lib/supabase/server'

export interface ExchangeRateAPI {
  fetchRates(baseCurrency: string): Promise<Record<string, number>>
}

class ExchangeRateAPIProvider implements ExchangeRateAPI {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.EXCHANGE_RATE_API_KEY || ''
    this.baseUrl = process.env.EXCHANGE_RATE_API_URL || 'https://v6.exchangerate-api.com/v6'
  }

  async fetchRates(baseCurrency: string = 'USD'): Promise<Record<string, number>> {
    if (!this.apiKey) {
      console.warn('EXCHANGE_RATE_API_KEY not configured, using fallback rates')
      return this.getFallbackRates()
    }

    try {
      const response = await fetch(`${this.baseUrl}/${this.apiKey}/latest/${baseCurrency}`, {
        next: { revalidate: 3600 }
      })

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()

      if (data.result !== 'success') {
        throw new Error(`API error: ${data['error-type']}`)
      }

      return data.conversion_rates
    } catch (error) {
      console.error('Error fetching from ExchangeRate-API:', error)
      return this.getFallbackRates()
    }
  }

  private getFallbackRates(): Record<string, number> {
    return {
      NGN: 750.0,
      GHS: 12.0,
      KES: 130.0,
      ZAR: 18.5,
      TZS: 2500.0,
      UGX: 3700.0,
      RWF: 1100.0,
      ETB: 55.0,
      EGP: 31.0,
      MAD: 10.0,
      ZWL: 322.0,
      ZMW: 20.0,
      MWK: 1050.0,
      BWP: 13.5,
      MZN: 64.0,
      EUR: 0.92,
      GBP: 0.79,
    }
  }
}

class FixerIOProvider implements ExchangeRateAPI {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.FIXER_API_KEY || ''
    this.baseUrl = process.env.FIXER_API_URL || 'https://api.fixer.io'
  }

  async fetchRates(baseCurrency: string = 'USD'): Promise<Record<string, number>> {
    if (!this.apiKey) {
      throw new Error('FIXER_API_KEY not configured')
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/latest?access_key=${this.apiKey}&base=${baseCurrency}`,
        { next: { revalidate: 3600 } }
      )

      if (!response.ok) {
        throw new Error(`Fixer API responded with status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(`Fixer API error: ${JSON.stringify(data.error)}`)
      }

      return data.rates
    } catch (error) {
      console.error('Error fetching from Fixer.io:', error)
      throw error
    }
  }
}

class OpenExchangeRatesProvider implements ExchangeRateAPI {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.OPEN_EXCHANGE_RATES_KEY || ''
    this.baseUrl = process.env.OPEN_EXCHANGE_RATES_URL || 'https://openexchangerates.org/api'
  }

  async fetchRates(baseCurrency: string = 'USD'): Promise<Record<string, number>> {
    if (!this.apiKey) {
      throw new Error('OPEN_EXCHANGE_RATES_KEY not configured')
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/latest.json?app_id=${this.apiKey}&base=${baseCurrency}`,
        { next: { revalidate: 3600 } }
      )

      if (!response.ok) {
        throw new Error(`Open Exchange Rates API responded with status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(`Open Exchange Rates API error: ${data.description}`)
      }

      return data.rates
    } catch (error) {
      console.error('Error fetching from Open Exchange Rates:', error)
      throw error
    }
  }
}

class CurrencyAPIProvider implements ExchangeRateAPI {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.CURRENCY_API_KEY || ''
    this.baseUrl = process.env.CURRENCY_API_URL || 'https://api.currencyapi.com'
  }

  async fetchRates(baseCurrency: string = 'USD'): Promise<Record<string, number>> {
    if (!this.apiKey) {
      throw new Error('CURRENCY_API_KEY not configured')
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/v3/latest?apikey=${this.apiKey}&base_currency=${baseCurrency}`,
        { next: { revalidate: 3600 } }
      )

      if (!response.ok) {
        throw new Error(`Currency API responded with status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(`Currency API error: ${data.error.message}`)
      }

      const rates: Record<string, number> = {}
      Object.entries(data.data).forEach(([currency, info]: [string, any]) => {
        rates[currency] = info.value
      })

      return rates
    } catch (error) {
      console.error('Error fetching from Currency API:', error)
      throw error
    }
  }
}

export class ExchangeRateService {
  private provider: ExchangeRateAPI

  constructor() {
    this.provider = this.getProvider()
  }

  private async getSupabaseClient() {
    return await createClient()
  }

  private getProvider(): ExchangeRateAPI {
    const primaryProvider = process.env.PRIMARY_EXCHANGE_RATE_API || 'exchangerate'

    switch (primaryProvider) {
      case 'fixer':
        return new FixerIOProvider()
      case 'openexchange':
        return new OpenExchangeRatesProvider()
      case 'currencyapi':
        return new CurrencyAPIProvider()
      case 'exchangerate':
      default:
        return new ExchangeRateAPIProvider()
    }
  }

  async updateAllRates(): Promise<{ success: boolean; updated: number; errors: string[] }> {
    const errors: string[] = []
    let updated = 0

    try {
      const supabase = await this.getSupabaseClient()
      const rates = await this.provider.fetchRates('USD')

      const africanCurrencies = [
        'NGN', 'GHS', 'KES', 'ZAR', 'TZS', 'UGX', 'RWF',
        'ETB', 'EGP', 'MAD', 'ZWL', 'ZMW', 'MWK', 'BWP', 'MZN'
      ]

      const majorCurrencies = ['EUR', 'GBP']

      const currenciesToUpdate = [...africanCurrencies, ...majorCurrencies, 'ACT']

      for (const currencyCode of currenciesToUpdate) {
        try {
          let rate = 1.0

          if (currencyCode === 'ACT') {
            rate = 1.0
          } else {
            rate = rates[currencyCode] || 1.0
          }

          const { data: currency } = await supabase
            .from('currencies')
            .select('id')
            .eq('code', currencyCode)
            .single()

          if (currency) {
            const { data: existingRate } = await supabase
              .from('exchange_rates')
              .select('id')
              .eq('from_currency', 'USD')
              .eq('to_currency', currencyCode)
              .single()

            if (existingRate) {
              const { error } = await supabase
                .from('exchange_rates')
                .update({
                  rate: rate,
                  updated_at: new Date().toISOString()
                })
                .eq('id', existingRate.id)

              if (!error) updated++
            } else {
              const { error } = await supabase
                .from('exchange_rates')
                .insert({
                  from_currency: 'USD',
                  to_currency: currencyCode,
                  rate: rate
                })

              if (!error) updated++
            }
          }
        } catch (error: any) {
          errors.push(`Failed to update ${currencyCode}: ${error.message}`)
        }
      }

      return {
        success: errors.length === 0,
        updated,
        errors
      }
    } catch (error: any) {
      errors.push(`Failed to fetch rates: ${error.message}`)
      return {
        success: false,
        updated,
        errors
      }
    }
  }

  async getRate(fromCurrency: string, toCurrency: string): Promise<number | null> {
    const supabase = await this.getSupabaseClient()

    const { data, error } = await supabase
      .from('exchange_rates')
      .select('rate')
      .eq('from_currency', fromCurrency)
      .eq('to_currency', toCurrency)
      .single()

    if (error || !data) {
      console.error(`Error fetching rate for ${fromCurrency} to ${toCurrency}:`, error)
      return null
    }

    return parseFloat(data.rate)
  }

  async convertAmount(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<number | null> {
    if (fromCurrency === toCurrency) {
      return amount
    }

    const rate = await this.getRate(fromCurrency, toCurrency)

    if (rate === null) {
      return null
    }

    return amount * rate
  }
}

export const exchangeRateService = new ExchangeRateService()
