import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { WalletCard } from "@/components/wallet-card"
import { SendMoneyForm } from "@/components/send-money-form"
import { TransactionList } from "@/components/transaction-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Plus } from "lucide-react"
import NavBar from "@/components/nav-bar"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  console.log("[v0] Profile fetch:", { profile, profileError })

  const { data: wallet, error: walletError } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  console.log("[v0] Wallet fetch:", { wallet, walletError })

  const { data: transactions, error: transactionsError } = await supabase
    .from("transactions")
    .select(
      `
      *,
      from_wallet:from_wallet_id(stellar_public_key),
      to_wallet:to_wallet_id(stellar_public_key)
    `,
    )
    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(10)

  console.log("[v0] Transactions fetch:", { transactions, transactionsError })

  // If no wallet, show setup screen
  if (!wallet) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-6">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                <Wallet className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Create Your Wallet</CardTitle>
            <CardDescription>
              Get started by creating your Pesa-Afrik wallet to send and receive ACT tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/wallet/create" method="POST">
              <Button type="submit" className="w-full" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Wallet
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar user={{ email: user.email!, isAdmin: profile?.role === "admin" }} />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-muted-foreground">Manage your ACT tokens and transactions</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <WalletCard balance={wallet.balance} publicKey={wallet.stellar_public_key} />
            <SendMoneyForm />
          </div>

          <div className="lg:col-span-1">
            <TransactionList transactions={transactions || []} userWalletId={wallet.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
