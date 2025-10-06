import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TransactionList } from "@/components/transaction-list"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import NavBar from "@/components/nav-bar" // Import NavBar component

export default async function TransactionsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

  // Get user's wallet
  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  if (!wallet) {
    redirect("/dashboard")
  }

  // Get all transactions
  const { data: transactions } = await supabase
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
    .limit(50)

  return (
    <div className="min-h-screen bg-background">
      <NavBar user={{ email: user.email!, isAdmin: profile?.role === "admin" }} />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Transaction History</h2>
            <p className="text-muted-foreground">View all your ACT token transactions</p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl">
          <TransactionList transactions={transactions || []} userWalletId={wallet.id} />
        </div>
      </main>
    </div>
  )
}
