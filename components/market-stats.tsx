"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Users, ArrowRightLeft, Coins } from "lucide-react"

interface MarketStatsProps {
  totalUsers: number
  totalTransactions: number
  totalVolume: number
  actPrice: number
}

export function MarketStats({ totalUsers, totalTransactions, totalVolume, actPrice }: MarketStatsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3">
            <Coins className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">ACT Price</p>
            <p className="text-2xl font-bold">${actPrice.toFixed(4)}</p>
          </div>
        </div>
      </Card>

      <Card className="border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-secondary/10 p-3">
            <Users className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-accent/10 p-3">
            <ArrowRightLeft className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Transactions</p>
            <p className="text-2xl font-bold">{totalTransactions.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      <Card className="border-2 border-chart-5/20 bg-gradient-to-br from-chart-5/5 to-transparent p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-chart-5/10 p-3">
            <TrendingUp className="h-6 w-6 text-chart-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">24h Volume</p>
            <p className="text-2xl font-bold">${(totalVolume / 1000000).toFixed(2)}M</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
