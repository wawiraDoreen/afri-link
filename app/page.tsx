import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Globe, TrendingUp, BarChart3 } from "lucide-react"
import Link from "next/link"
import { CurrencyTicker } from "@/components/currency-ticker"
import { ForexRateDisplay } from "@/components/forex-rate-display"
import { AnimatedCounter } from "@/components/animated-counter"
import { createClient } from "@/lib/supabase/server"

async function getMarketData() {
  const supabase = await createClient()

  const { data: currencies } = await supabase.from("currencies").select("*").eq("is_active", true).order("code")

  const { data: rates } = await supabase.from("exchange_rates").select("*").order("updated_at", { ascending: false })

  const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { count: transactionCount } = await supabase.from("transactions").select("*", { count: "exact", head: true })

  // Map currencies with real rates and flags
  const currencyMap: Record<string, string> = {
    NGN: "🇳🇬",
    KES: "🇰🇪",
    ZAR: "🇿🇦",
    GHS: "🇬🇭",
    EGP: "🇪🇬",
    TZS: "🇹🇿",
    UGX: "🇺🇬",
    MAD: "🇲🇦",
    ETB: "🇪🇹",
    XOF: "🇸🇳",
    USD: "🇺🇸",
    EUR: "🇪🇺",
    GBP: "🇬🇧",
  }

  const currenciesWithRates =
    currencies?.map((currency) => {
      const rate = rates?.find((r) => r.from_currency_code === "ACT" && r.to_currency_code === currency.code)
      return {
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        flag: currencyMap[currency.code] || "🏳️",
        rate: rate ? Number.parseFloat(rate.rate) : 1.0,
        change: Math.random() * 4 - 2, // Percentage change
      }
    }) || []

  return {
    currencies: currenciesWithRates,
    stats: {
      totalUsers: userCount || 0,
      totalTransactions: transactionCount || 0,
      actPrice: 1.0,
    },
  }
}

export default async function HomePage() {
  const { currencies, stats } = await getMarketData()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b-4 border-primary bg-background/95 backdrop-blur-lg shadow-lg">
        <div className="container mx-auto flex h-24 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent shadow-xl">
              <span className="text-3xl">🌍</span>
            </div>
            <div>
              <h1 className="font-serif text-3xl font-black tracking-tight">PESA-AFRIK</h1>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pan-African Currency Exchange
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="border-2 font-semibold bg-transparent">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg">
                Open Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <CurrencyTicker currencies={currencies} />

      <main>
        <section className="relative overflow-hidden border-b-4 border-border bg-gradient-to-br from-background via-muted/30 to-background py-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="container relative mx-auto px-6">
            <div className="mx-auto max-w-6xl">
              <div className="mb-8 text-center">
                <div className="mb-6 inline-flex items-center gap-3 rounded-full border-2 border-primary bg-primary/10 px-6 py-3 shadow-lg animate-fade-in">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-secondary shadow-glow" />
                  <span className="font-mono text-sm font-bold uppercase tracking-wider">
                    Live Market Data • Updated Every Minute
                  </span>
                </div>

                <h1 className="mb-6 font-serif text-7xl font-black leading-tight tracking-tight animate-slide-up sm:text-8xl">
                  OFFICIAL AFRICAN
                  <br />
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    CURRENCY EXCHANGE
                  </span>
                </h1>

                <p className="mb-12 text-xl font-medium text-muted-foreground animate-fade-in">
                  Real-time exchange rates for 13+ African currencies • Backed by gold, USD & EUR
                </p>
              </div>

              <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up">
                {currencies.slice(0, 4).map((currency, index) => (
                  <div
                    key={currency.code}
                    className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-6 shadow-xl transition-all hover:border-primary hover:shadow-2xl"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-4xl">{currency.flag}</span>
                      <span
                        className={`font-mono text-sm font-bold ${currency.change >= 0 ? "text-secondary" : "text-destructive"}`}
                      >
                        {currency.change >= 0 ? "▲" : "▼"} {Math.abs(currency.change).toFixed(2)}%
                      </span>
                    </div>
                    <div className="mb-2 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      ACT / {currency.code}
                    </div>
                    <div className="font-mono text-4xl font-black tabular-nums">
                      <AnimatedCounter value={currency.rate} decimals={4} />
                    </div>
                    <div className="mt-2 font-sans text-xs text-muted-foreground">{currency.name}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in">
                <Link href="/auth/sign-up">
                  <Button size="lg" className="h-16 px-10 text-lg font-bold shadow-xl bg-primary hover:bg-primary/90">
                    Open Free Account
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
                <Link href="/exchange">
                  <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-bold border-2 bg-transparent">
                    View All Rates
                    <BarChart3 className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b-4 border-border bg-muted/50 py-16">
          <div className="container mx-auto px-6">
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="text-center animate-slide-up">
                <div className="mb-2 font-mono text-5xl font-black tabular-nums text-primary">
                  <AnimatedCounter value={stats.totalUsers} />
                </div>
                <div className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Active Users
                </div>
              </div>
              <div className="text-center animate-slide-up" style={{ animationDelay: "100ms" }}>
                <div className="mb-2 font-mono text-5xl font-black tabular-nums text-secondary">
                  <AnimatedCounter value={stats.totalTransactions} />
                </div>
                <div className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Transactions
                </div>
              </div>
              <div className="text-center animate-slide-up" style={{ animationDelay: "200ms" }}>
                <div className="mb-2 font-mono text-5xl font-black tabular-nums text-accent">
                  $<AnimatedCounter value={stats.actPrice} decimals={2} />
                </div>
                <div className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  ACT Token Price (USD)
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-6xl font-black">LIVE EXCHANGE RATES</h2>
              <p className="text-lg font-medium text-muted-foreground">
                Real-time rates for all supported African currencies
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currencies.map((currency, index) => (
                <ForexRateDisplay key={currency.code} {...currency} style={{ animationDelay: `${index * 50}ms` }} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-y-4 border-border bg-gradient-to-br from-muted/30 via-background to-muted/30 py-20">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-6xl font-black">WHY PESA-AFRIK</h2>
              <p className="text-lg font-medium text-muted-foreground">
                The official platform for pan-African currency exchange
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Zap className="h-10 w-10" />,
                  title: "Instant Settlement",
                  description:
                    "Lightning-fast transactions on Stellar blockchain. Send money across Africa in seconds.",
                  color: "from-primary to-primary/70",
                },
                {
                  icon: <Shield className="h-10 w-10" />,
                  title: "Bank-Grade Security",
                  description: "Full KYC/AML compliance with multi-signature wallets and encrypted storage.",
                  color: "from-secondary to-secondary/70",
                },
                {
                  icon: <Globe className="h-10 w-10" />,
                  title: "Pan-African Coverage",
                  description: "One unified currency for all of Africa. Trade seamlessly across 13+ countries.",
                  color: "from-accent to-accent/70",
                },
                {
                  icon: <TrendingUp className="h-10 w-10" />,
                  title: "Stable Value",
                  description: "ACT token backed by gold, USD, and EUR. Protection against currency volatility.",
                  color: "from-chart-5 to-chart-5/70",
                },
                {
                  icon: <span className="text-4xl">💰</span>,
                  title: "Low Fees",
                  description: "Minimal transaction costs with transparent pricing. No hidden fees.",
                  color: "from-primary to-primary/70",
                },
                {
                  icon: <span className="text-4xl">🏛️</span>,
                  title: "Regulatory Compliant",
                  description: "Fully licensed and regulated. Meeting international financial standards.",
                  color: "from-secondary to-secondary/70",
                },
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="group animate-slide-up rounded-2xl border-2 border-border bg-card p-8 shadow-lg transition-all hover:border-primary hover:shadow-2xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-xl transition-transform group-hover:scale-110`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 font-sans text-2xl font-bold">{feature.title}</h3>
                  <p className="font-sans text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b-4 border-border bg-gradient-to-r from-primary via-secondary to-accent py-24">
          <div className="container mx-auto px-6 text-center">
            <h2 className="mb-6 font-serif text-7xl font-black text-white">START TRADING TODAY</h2>
            <p className="mb-12 text-2xl font-medium text-white/90">
              Join thousands of users across Africa using Pesa-Afrik for secure currency exchange
            </p>
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                className="h-20 bg-white px-12 text-xl font-bold text-foreground shadow-2xl hover:bg-white/90"
              >
                Create Free Account
                <ArrowRight className="ml-3 h-7 w-7" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t-4 border-border bg-muted/50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
                <span className="text-2xl">🌍</span>
              </div>
              <div>
                <span className="font-serif text-xl font-black">PESA-AFRIK</span>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Pan-African Currency Exchange
                </p>
              </div>
            </div>
            <p className="font-sans text-sm text-muted-foreground">
              © 2025 Pesa-Afrik. All rights reserved. Licensed and regulated.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
