import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getAllTransactions } from "@/app/actions/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { formatActAmount, formatDateTime, getStatusColor, truncatePublicKey } from "@/lib/utils/format"
import { AdminNavBar } from "@/components/admin-nav-bar"

export default async function AdminTransactionsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  const transactionsResult = await getAllTransactions(100)

  if (!transactionsResult.success) {
    return <div>Error loading transactions</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavBar user={{ email: user.email! }} />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Transaction Monitoring</h2>
            <p className="text-muted-foreground">View all platform transactions</p>
          </div>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>Complete transaction history across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactionsResult.transactions.map((tx: any) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{tx.transaction_type}</p>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <span className="font-mono">
                          {tx.from_wallet?.stellar_public_key
                            ? truncatePublicKey(tx.from_wallet.stellar_public_key, 6, 6)
                            : "N/A"}
                        </span>
                        <span>→</span>
                        <span className="font-mono">
                          {tx.to_wallet?.stellar_public_key
                            ? truncatePublicKey(tx.to_wallet.stellar_public_key, 6, 6)
                            : "N/A"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{formatDateTime(tx.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatActAmount(tx.amount)} ACT</p>
                    <Badge variant="secondary" className={getStatusColor(tx.status)}>
                      {tx.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      {truncatePublicKey(tx.transaction_hash, 8, 8)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
