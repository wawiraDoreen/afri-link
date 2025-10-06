import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CurrencyConverter } from "@/components/currency-converter"
import { ExchangeRatesTable } from "@/components/exchange-rates-table"
import { getExchangeRates, getCurrencies } from "@/app/actions/exchange"
import NavBar from "@/components/nav-bar"

export default async function ExchangePage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

  const [ratesResult, currenciesResult] = await Promise.all([getExchangeRates(), getCurrencies()])

  const rates = ratesResult.data || []
  const currencies = currenciesResult.data || []

  return (
    <div className="min-h-screen bg-background">
      <NavBar user={{ email: user.email!, isAdmin: profile?.role === "admin" }} />

      <main className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Currency Exchange</h1>
          <p className="text-muted-foreground">Convert ACT tokens to other currencies at live market rates</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <CurrencyConverter currencies={currencies} />
          <ExchangeRatesTable rates={rates} />
        </div>
      </main>
    </div>
  )
}
