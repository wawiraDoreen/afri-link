"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowDownUp, TrendingUp } from "lucide-react"
import { convertCurrency, createExchangeOrder } from "@/app/actions/exchange"

interface Currency {
  code: string
  name: string
  symbol: string
}

interface CurrencyConverterProps {
  currencies: Currency[]
}

export function CurrencyConverter({ currencies }: CurrencyConverterProps) {
  const [fromCurrency, setFromCurrency] = useState("ACT")
  const [toCurrency, setToCurrency] = useState("USD")
  const [amount, setAmount] = useState("100")
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [rate, setRate] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (amount && Number.parseFloat(amount) > 0) {
      handleConvert()
    }
  }, [fromCurrency, toCurrency, amount])

  const handleConvert = async () => {
    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setConvertedAmount(null)
      setRate(null)
      return
    }

    const result = await convertCurrency(fromCurrency, toCurrency, amountNum)

    if (result.error || !result.data) {
      setMessage({ type: "error", text: result.error || "Conversion failed" })
      setConvertedAmount(null)
      setRate(null)
    } else {
      setConvertedAmount(result.data.convertedAmount)
      setRate(result.data.rate)
      setMessage(null)
    }
  }

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const handleExchange = async () => {
    setLoading(true)
    setMessage(null)

    const amountNum = Number.parseFloat(amount)
    const result = await createExchangeOrder(fromCurrency, toCurrency, amountNum)

    if (result.error) {
      setMessage({ type: "error", text: result.error })
    } else {
      setMessage({ type: "success", text: "Exchange completed successfully!" })
      setAmount("100")
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Currency Converter
        </CardTitle>
        <CardDescription>Convert between ACT and other currencies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="from-amount">From</Label>
            <div className="flex gap-2">
              <Input
                id="from-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
                className="flex-1"
              />
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" size="icon" onClick={handleSwap} className="rounded-full bg-transparent">
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to-amount">To</Label>
            <div className="flex gap-2">
              <Input
                id="to-amount"
                type="number"
                value={convertedAmount?.toFixed(2) || "0.00"}
                readOnly
                className="flex-1 bg-muted"
              />
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {rate && (
          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="text-muted-foreground">Exchange Rate</p>
            <p className="font-medium">
              1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
            </p>
          </div>
        )}

        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Button onClick={handleExchange} disabled={loading || !convertedAmount} className="w-full">
          {loading ? "Processing..." : "Exchange Now"}
        </Button>
      </CardContent>
    </Card>
  )
}
