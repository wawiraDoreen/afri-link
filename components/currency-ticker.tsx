"use client"

import { useEffect, useState } from "react"

interface Currency {
  code: string
  name: string
  symbol: string
  flag: string
  rate: number
  change: number
}

export function CurrencyTicker({ currencies }: { currencies: Currency[] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || currencies.length === 0) {
    return <div className="h-16 bg-foreground" />
  }

  // Triple the currencies for seamless infinite scroll
  const displayCurrencies = [...currencies, ...currencies, ...currencies]

  return (
    <div className="relative overflow-hidden bg-foreground py-4">
      {/* Gradient overlays for fade effect */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-foreground to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-foreground to-transparent" />

      <div className="flex animate-ticker gap-12 whitespace-nowrap">
        {displayCurrencies.map((currency, index) => (
          <div key={`${currency.code}-${index}`} className="flex items-center gap-4 px-6">
            <span className="text-4xl">{currency.flag}</span>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-lg font-bold text-background">{currency.code}</span>
                <span className="font-mono text-2xl font-bold text-primary">{currency.rate.toFixed(4)}</span>
              </div>
              <span className={`text-sm font-semibold ${currency.change >= 0 ? "text-secondary" : "text-accent"}`}>
                {currency.change >= 0 ? "↑" : "↓"} {Math.abs(currency.change).toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
