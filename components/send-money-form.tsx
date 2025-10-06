"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { sendAct } from "@/app/actions/transactions"
import { toast } from "sonner"
import { Send } from "lucide-react"

export function SendMoneyForm() {
  const [recipientKey, setRecipientKey] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await sendAct(recipientKey, amount, description)

      if (result.success) {
        toast.success("Transaction successful!", {
          description: `Sent ${amount} ACT`,
        })
        setRecipientKey("")
        setAmount("")
        setDescription("")
      } else {
        toast.error("Transaction failed", {
          description: result.error,
        })
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send ACT Tokens
        </CardTitle>
        <CardDescription>Transfer ACT tokens to another wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Wallet Address</Label>
            <Input
              id="recipient"
              placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              value={recipientKey}
              onChange={(e) => setRecipientKey(e.target.value)}
              required
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (ACT)</Label>
            <Input
              id="amount"
              type="number"
              step="0.0000001"
              min="0.0000001"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="What's this payment for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send ACT"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
