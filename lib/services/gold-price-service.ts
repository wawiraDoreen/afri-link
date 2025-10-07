export interface GoldPriceAPI {
  fetchGoldPrice(): Promise<number>
}

class GoldAPIProvider implements GoldPriceAPI {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.GOLD_API_KEY || ''
    this.baseUrl = process.env.GOLD_API_URL || 'https://www.goldapi.io/api'
  }

  async fetchGoldPrice(): Promise<number> {
    if (!this.apiKey) {
      console.warn('GOLD_API_KEY not configured, using fallback price')
      return 2000.0
    }

    try {
      const response = await fetch(`${this.baseUrl}/XAU/USD`, {
        headers: {
          'x-access-token': this.apiKey,
        },
        next: { revalidate: 1800 }
      })

      if (!response.ok) {
        throw new Error(`GoldAPI responded with status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(`GoldAPI error: ${data.error}`)
      }

      return data.price || 2000.0
    } catch (error) {
      console.error('Error fetching from GoldAPI:', error)
      return 2000.0
    }
  }
}

class MetalsLiveProvider implements GoldPriceAPI {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.METALS_LIVE_API_URL || 'https://metals-api.com/api'
  }

  async fetchGoldPrice(): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/latest?base=USD&symbols=XAU`, {
        next: { revalidate: 1800 }
      })

      if (!response.ok) {
        throw new Error(`Metals.live API responded with status: ${response.status}`)
      }

      const data = await response.json()

      if (data.rates && data.rates.XAU) {
        return 1 / data.rates.XAU
      }

      return 2000.0
    } catch (error) {
      console.error('Error fetching from Metals.live:', error)
      return 2000.0
    }
  }
}

class MetalsAPIProvider implements GoldPriceAPI {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.METALS_API_KEY || ''
    this.baseUrl = process.env.METALS_API_URL || 'https://metals-api.com/api'
  }

  async fetchGoldPrice(): Promise<number> {
    if (!this.apiKey) {
      throw new Error('METALS_API_KEY not configured')
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/latest?access_key=${this.apiKey}&base=USD&symbols=XAU`,
        { next: { revalidate: 1800 } }
      )

      if (!response.ok) {
        throw new Error(`Metals-API responded with status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(`Metals-API error: ${JSON.stringify(data.error)}`)
      }

      if (data.rates && data.rates.XAU) {
        return 1 / data.rates.XAU
      }

      return 2000.0
    } catch (error) {
      console.error('Error fetching from Metals-API:', error)
      throw error
    }
  }
}

class ManualGoldPriceProvider implements GoldPriceAPI {
  async fetchGoldPrice(): Promise<number> {
    return 2000.0
  }
}

export class GoldPriceService {
  private provider: GoldPriceAPI

  constructor() {
    this.provider = this.getProvider()
  }

  private getProvider(): GoldPriceAPI {
    const primaryProvider = process.env.PRIMARY_GOLD_API || 'goldapi'

    switch (primaryProvider) {
      case 'metalslive':
        return new MetalsLiveProvider()
      case 'metalsapi':
        return new MetalsAPIProvider()
      case 'goldapi':
        return new GoldAPIProvider()
      case 'manual':
      default:
        return new ManualGoldPriceProvider()
    }
  }

  async getCurrentGoldPrice(): Promise<number> {
    try {
      const price = await this.provider.fetchGoldPrice()

      if (!price || price <= 0) {
        console.warn('Invalid gold price received, using fallback')
        return 2000.0
      }

      return price
    } catch (error) {
      console.error('Error getting gold price:', error)
      return 2000.0
    }
  }

  async getGoldPricePerOunce(): Promise<number> {
    return await this.getCurrentGoldPrice()
  }

  async getGoldPricePerGram(): Promise<number> {
    const pricePerOunce = await this.getCurrentGoldPrice()
    return pricePerOunce / 31.1035
  }

  async convertGoldToUSD(goldAmount: number, unit: 'oz' | 'g' = 'oz'): Promise<number> {
    const price = unit === 'oz'
      ? await this.getGoldPricePerOunce()
      : await this.getGoldPricePerGram()

    return goldAmount * price
  }

  async convertUSDToGold(usdAmount: number, unit: 'oz' | 'g' = 'oz'): Promise<number> {
    const price = unit === 'oz'
      ? await this.getGoldPricePerOunce()
      : await this.getGoldPricePerGram()

    return usdAmount / price
  }
}

export const goldPriceService = new GoldPriceService()
