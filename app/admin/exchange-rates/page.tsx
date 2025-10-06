import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getExchangeRates } from "@/app/actions/exchange"
import { updateExchangeRate } from "@/app/actions/exchange"
import { TrendingUp } from "lucide-react"

export default async function AdminExchangeRatesPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("user_id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/dashboard")
  }

  const ratesResult = await getExchangeRates()
  const rates = ratesResult.data || []

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Exchange Rates</h1>
        <p className="text-muted-foreground">Update currency exchange rates for the platform</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rates.map((rate: any) => (
          <Card key={rate.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {rate.currency.name}
              </CardTitle>
              <CardDescription>{rate.currency_code}</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={updateExchangeRate} className="space-y-4">
                <input type="hidden" name="currencyCode" value={rate.currency_code} />
                <div className="space-y-2">
                  <Label htmlFor={`rate-${rate.currency_code}`}>Rate to ACT</Label>
                  <Input
                    id={`rate-${rate.currency_code}`}
                    name="newRate"
                    type="number"
                    step="0.0001"
                    defaultValue={rate.rate_to_act}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Update Rate
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
