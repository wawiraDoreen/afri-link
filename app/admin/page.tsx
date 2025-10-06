import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getPlatformStats } from "@/app/actions/admin"
import { StatsCard } from "@/components/admin/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Wallet, ArrowLeftRight, Coins, AlertCircle, Activity } from "lucide-react"
import Link from "next/link"
import { formatActAmount, formatDateTime } from "@/lib/utils/format"
import { Badge } from "@/components/ui/badge"
import { AdminNavBar } from "@/components/admin-nav-bar"

export default async function AdminDashboardPage() {
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

  const statsResult = await getPlatformStats()

  if (!statsResult.success || !statsResult.stats) {
    return <div>Error loading stats</div>
  }

  const { stats } = statsResult

  return (
    <div className="min-h-screen bg-background">
      <AdminNavBar user={{ email: user.email! }} />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Platform Overview</h2>
          <p className="text-muted-foreground">Monitor and manage the AfriLink platform</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Users" value={stats.totalUsers} icon={Users} description="Registered accounts" />
          <StatsCard
            title="Active Wallets"
            value={stats.totalWallets}
            icon={Wallet}
            description="Wallets with activity"
          />
          <StatsCard
            title="Total Transactions"
            value={stats.totalTransactions}
            icon={ArrowLeftRight}
            description="All-time transactions"
          />
          <StatsCard
            title="ACT in Circulation"
            value={formatActAmount(stats.totalActInCirculation)}
            icon={Coins}
            description="Total ACT tokens"
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Pending KYC Approvals
              </CardTitle>
              <CardDescription>Users waiting for KYC verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.pendingKyc}</p>
                  <p className="text-sm text-muted-foreground">Pending reviews</p>
                </div>
                <Link href="/admin/users">
                  <Button>Review KYC</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest platform transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentTransactions.slice(0, 3).map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{tx.transaction_type}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(tx.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatActAmount(tx.amount)} ACT</p>
                      <Badge variant="secondary" className="text-xs">
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/admin/transactions">
                <Button variant="outline" className="mt-4 w-full bg-transparent">
                  View All Transactions
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
