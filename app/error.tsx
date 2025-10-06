"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"
import { useEffect } from "react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[v0] Error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="mt-6 text-4xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-center text-muted-foreground">We encountered an error while processing your request.</p>
      <Button onClick={reset} size="lg" className="mt-8">
        <RefreshCw className="mr-2 h-5 w-5" />
        Try Again
      </Button>
    </div>
  )
}
