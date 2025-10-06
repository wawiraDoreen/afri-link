"use client"

import { useEffect, useState } from "react"

interface ForexRateDisplayProps {
  fromCurrency: string
  toCurrency: string
  rate: number
  flag: string
  change: number
  className?: string
}

export function ForexRateDisplay({
  fromCurrency,
  toCurrency,
  rate,
  flag,
  change,
  className = "",
}: ForexRateDisplayProps) {
  const [displayRate, setDisplayRate] = useState(rate)
  const [isAnimating, setIsAnimating] = useState(false)
  const isPositive = change >= 0

  useEffect(() => {
    // Simulate live rate updates with small fluctuations
    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 0.0001
      setDisplayRate((prev) => {
        const newRate = prev + fluctuation
        return newRate > 0 ? newRate : prev
      })
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 300)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border-2 border-border bg-card p-6 transition-all hover:border-primary hover:shadow-2xl ${className}`}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative space-y-4">
        {/* Currency pair header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-5xl animate-pulse">{flag}</span>
            <div>
              <div className="font-mono text-2xl font-bold tracking-tight">
                {fromCurrency}/{toCurrency}
              </div>
              <div className="text-sm text-muted-foreground">Exchange Rate</div>
            </div>
          </div>

          {/* Change indicator */}
          <div
            className={`rounded-lg px-3 py-1 text-sm font-bold ${
              isPositive ? "bg-secondary/20 text-secondary" : "bg-accent/20 text-accent"
            }`}
          >
            {isPositive ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
          </div>
        </div>

        {/* Rate display */}
        <div className="space-y-1">
          <div
            className={`font-mono text-5xl font-bold tabular-nums transition-all ${
              isAnimating ? "scale-105 text-primary" : ""
            }`}
          >
            {displayRate.toFixed(4)}
          </div>
          <div className="text-sm text-muted-foreground">
            1 {fromCurrency} = {displayRate.toFixed(4)} {toCurrency}
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
          <span className="text-xs font-semibold text-secondary">LIVE</span>
        </div>
      </div>
    </div>
  )
}
