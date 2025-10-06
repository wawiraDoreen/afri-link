'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, XCircle, Database } from 'lucide-react'

export default function SetupDbPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const initializeDatabase = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/init-db', {
        method: 'POST',
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl">Database Setup</CardTitle>
          </div>
          <CardDescription>Initialize the Pesa-Afrik database with all required tables</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold">This will create:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>User profiles table</li>
              <li>Wallets table (for Stellar accounts)</li>
              <li>Currencies table (13+ African currencies)</li>
              <li>Exchange rates table</li>
              <li>Transactions table</li>
              <li>KYC documents table</li>
              <li>Seed data for currencies and exchange rates</li>
            </ul>
          </div>

          <Button onClick={initializeDatabase} disabled={loading} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Initializing Database...
              </>
            ) : (
              <>
                <Database className="mr-2 h-5 w-5" />
                Initialize Database
              </>
            )}
          </Button>

          {result && (
            <Card className={result.success ? 'border-green-500' : 'border-red-500'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.success ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Success!
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      Error
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.success && (
                  <div className="space-y-1">
                    <p className="text-sm text-green-600">
                      Database initialized successfully!
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <p>✅ {result.successCount} statements executed</p>
                      {result.errorCount > 0 && <p>⚠️ {result.errorCount} errors</p>}
                    </div>
                  </div>
                )}

                {!result.success && (
                  <div className="space-y-2">
                    <p className="text-sm text-red-600">{result.error}</p>
                    {result.results && result.results.length > 0 && (
                      <div className="max-h-40 overflow-y-auto text-xs bg-muted/50 rounded p-2">
                        {result.results.map((r: any, i: number) => (
                          <div key={i} className="mb-2">
                            <p className="font-mono text-red-600">{r.error}</p>
                            <p className="text-muted-foreground">{r.statement}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {result.success && (
                  <Button asChild className="w-full mt-4">
                    <a href="/auth/sign-up">Continue to Sign Up</a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          <div className="text-xs text-muted-foreground text-center">
            Note: This is a one-time setup. If tables already exist, they will not be modified.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
