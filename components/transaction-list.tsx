"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDownLeft, ArrowUpRight, History } from "lucide-react"
import { formatActAmount, formatDateTime, getStatusColor, truncatePublicKey } from "@/lib/utils/format"
import type { Transaction } from "@/lib/types/database"

interface TransactionListProps {
  transactions: Transaction[]
  userWalletId: string
}

export function TransactionList({ transactions, userWalletId }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
          <CardDescription>Your transaction history will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No transactions yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Recent Transactions
        </CardTitle>
        <CardDescription>Your latest ACT token transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const isReceived = transaction.to_wallet_id === userWalletId
            const otherWallet = isReceived
              ? (transaction as any).from_wallet?.stellar_public_key
              : (transaction as any).to_wallet?.stellar_public_key

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isReceived ? "bg-success/10" : "bg-muted"
                    }`}
                  >
                    {isReceived ? (
                      <ArrowDownLeft className="h-5 w-5 text-success" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {isReceived ? "Received" : "Sent"} {transaction.transaction_type}
                    </p>
                    {otherWallet && (
                      <p className="text-sm text-muted-foreground font-mono">{truncatePublicKey(otherWallet, 6, 6)}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{formatDateTime(transaction.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${isReceived ? "text-success" : "text-foreground"}`}>
                    {isReceived ? "+" : "-"}
                    {formatActAmount(transaction.amount)} ACT
                  </p>
                  <Badge variant="secondary" className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
