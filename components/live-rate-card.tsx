"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface LiveRateCardProps {
  flag: string
  code: string
  name: string
  rate: number
  change: number
  symbol: string
}

export function LiveRateCard({ flag, code, name, rate, change, symbol }: LiveRateCardProps) {
  const isPositive = change >= 0

  return (
    <Card className="group relative overflow-hidden border-2 p-6 transition-all hover:scale-105 hover:border-primary hover:shadow-xl">
      <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-primary/5 transition-all group-hover:scale-150" />

      <div className="relative">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{flag}</span>
            <div>
              <h3 className="text-xl font-bold">{code}</h3>
              <p className="text-sm text-muted-foreground">{name}</p>
            </div>
          </div>
          <div className={`rounded-full p-2 ${isPositive ? "bg-secondary/10" : "bg-accent/10"}`}>
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-secondary" />
            ) : (
              <TrendingDown className="h-5 w-5 text-accent" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{rate.toFixed(4)}</span>
            <span className="text-lg text-muted-foreground">{symbol}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${isPositive ? "text-secondary" : "text-accent"}`}>
              {isPositive ? "+" : ""}
              {change.toFixed(2)}%
            </span>
            <span className="text-xs text-muted-foreground">vs ACT</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
