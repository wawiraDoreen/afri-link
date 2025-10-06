"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { truncatePublicKey, formatActAmount } from "@/lib/utils/format"
import { toast } from "sonner"

interface WalletCardProps {
  balance: number
  publicKey: string
}

export function WalletCard({ balance, publicKey }: WalletCardProps) {
  const [showFullKey, setShowFullKey] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicKey)
    toast.success("Public key copied to clipboard")
  }

  return (
    <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground shadow-xl">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium opacity-90">Total Balance</p>
            <p className="mt-2 text-4xl font-bold tracking-tight">{formatActAmount(balance)} ACT</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium opacity-90">Wallet Address</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullKey(!showFullKey)}
                className="h-8 text-primary-foreground hover:bg-primary-foreground/10"
              >
                {showFullKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-primary-foreground/10 p-3">
              <code className="flex-1 text-sm font-mono">{showFullKey ? publicKey : truncatePublicKey(publicKey)}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
