'use client'

import { useState, useEffect } from 'react'
import { AdminNavBar } from '@/components/admin-nav-bar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  getBasketComposition,
  updateBasketComposition,
  getReserves,
  addReserve,
  getReserveTransactions,
  getCurrentACTPrice,
  forceUpdateACTPrice,
} from '@/app/actions/reserves'
import { toast } from 'sonner'
import { Loader2, RefreshCw } from 'lucide-react'

export default function ReservesPage() {
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const [basketComposition, setBasketComposition] = useState<any>(null)
  const [reserves, setReserves] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [actPrice, setActPrice] = useState<any>(null)

  const [goldWeight, setGoldWeight] = useState(0.4)
  const [usdWeight, setUsdWeight] = useState(0.3)
  const [eurWeight, setEurWeight] = useState(0.3)
  const [notes, setNotes] = useState('')

  const [assetType, setAssetType] = useState<'gold' | 'usd' | 'eur'>('gold')
  const [amount, setAmount] = useState('')
  const [amountUsd, setAmountUsd] = useState('')
  const [location, setLocation] = useState('')
  const [custodyProvider, setCustodyProvider] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)

    const [basketResult, reservesResult, txResult, priceResult] = await Promise.all([
      getBasketComposition(),
      getReserves(),
      getReserveTransactions(),
      getCurrentACTPrice(),
    ])

    if (basketResult.success) {
      const active = basketResult.data?.find((b: any) => b.is_active)
      setBasketComposition(active)
      if (active) {
        setGoldWeight(parseFloat(active.gold_weight))
        setUsdWeight(parseFloat(active.usd_weight))
        setEurWeight(parseFloat(active.eur_weight))
      }
    }

    if (reservesResult.success) {
      setReserves(reservesResult.data || [])
    }

    if (txResult.success) {
      setTransactions(txResult.data || [])
    }

    if (priceResult.success) {
      setActPrice(priceResult.data)
    }

    setLoading(false)
  }

  async function handleUpdateBasket() {
    if (Math.abs(goldWeight + usdWeight + eurWeight - 1.0) > 0.0001) {
      toast.error('Weights must sum to 1.0')
      return
    }

    setUpdating(true)

    const result = await updateBasketComposition(goldWeight, usdWeight, eurWeight, notes)

    if (result.success) {
      toast.success('Basket composition updated')
      setNotes('')
      loadData()
    } else {
      toast.error(result.error || 'Failed to update basket')
    }

    setUpdating(false)
  }

  async function handleAddReserve() {
    if (!amount || !amountUsd) {
      toast.error('Please fill in all required fields')
      return
    }

    setUpdating(true)

    const result = await addReserve(
      assetType,
      parseFloat(amount),
      parseFloat(amountUsd),
      location,
      custodyProvider
    )

    if (result.success) {
      toast.success('Reserve added successfully')
      setAmount('')
      setAmountUsd('')
      setLocation('')
      setCustodyProvider('')
      loadData()
    } else {
      toast.error(result.error || 'Failed to add reserve')
    }

    setUpdating(false)
  }

  async function handleRefreshPrice() {
    setUpdating(true)

    const result = await forceUpdateACTPrice()

    if (result.success) {
      toast.success('ACT price updated')
      setActPrice(result.data)
    } else {
      toast.error(result.error || 'Failed to update price')
    }

    setUpdating(false)
  }

  const totalWeights = goldWeight + usdWeight + eurWeight
  const weightsValid = Math.abs(totalWeights - 1.0) < 0.0001

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavBar />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">ACT Reserve Management</h1>
            <p className="text-muted-foreground">
              Manage basket composition and reserve holdings
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>ACT Price</CardTitle>
              <CardDescription>Current basket-backed value</CardDescription>
            </CardHeader>
            <CardContent>
              {actPrice ? (
                <div className="space-y-2">
                  <div className="text-3xl font-bold">
                    ${actPrice.price_usd.toFixed(4)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Reserve Ratio: {(actPrice.reserve_ratio * 100).toFixed(2)}%
                  </div>
                  <Button onClick={handleRefreshPrice} disabled={updating} size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">Loading...</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Reserves</CardTitle>
              <CardDescription>Backing ACT supply</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${reserves.reduce((sum, r) => sum + parseFloat(r.amount_usd), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Supply</CardTitle>
              <CardDescription>ACT tokens in circulation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {actPrice?.total_supply.toLocaleString()} ACT
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Basket Composition</CardTitle>
            <CardDescription>
              Adjust the reserve asset weights (must total 100%)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="gold-weight">Gold Weight</Label>
                <Input
                  id="gold-weight"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={goldWeight}
                  onChange={(e) => setGoldWeight(parseFloat(e.target.value) || 0)}
                />
                <p className="text-sm text-muted-foreground">
                  {(goldWeight * 100).toFixed(1)}%
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="usd-weight">USD Weight</Label>
                <Input
                  id="usd-weight"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={usdWeight}
                  onChange={(e) => setUsdWeight(parseFloat(e.target.value) || 0)}
                />
                <p className="text-sm text-muted-foreground">
                  {(usdWeight * 100).toFixed(1)}%
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eur-weight">EUR Weight</Label>
                <Input
                  id="eur-weight"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={eurWeight}
                  onChange={(e) => setEurWeight(parseFloat(e.target.value) || 0)}
                />
                <p className="text-sm text-muted-foreground">
                  {(eurWeight * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Reason for rebalancing..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Total: {(totalWeights * 100).toFixed(1)}%
                </p>
                {!weightsValid && (
                  <p className="text-sm text-destructive">Must equal 100%</p>
                )}
              </div>
              <Button
                onClick={handleUpdateBasket}
                disabled={!weightsValid || updating}
              >
                {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update Basket
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Reserve</CardTitle>
            <CardDescription>Deposit new assets to back ACT supply</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="asset-type">Asset Type</Label>
                <select
                  id="asset-type"
                  className="w-full p-2 border rounded-md"
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value as any)}
                >
                  <option value="gold">Gold (oz)</option>
                  <option value="usd">USD</option>
                  <option value="eur">EUR</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount-usd">Amount (USD)</Label>
                <Input
                  id="amount-usd"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (optional)</Label>
                <Input
                  id="location"
                  placeholder="e.g., Zurich Vault"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="custody">Custody Provider (optional)</Label>
                <Input
                  id="custody"
                  placeholder="e.g., Swiss Gold Custody"
                  value={custodyProvider}
                  onChange={(e) => setCustodyProvider(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={handleAddReserve} disabled={updating}>
              {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Reserve
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Reserves</CardTitle>
            <CardDescription>Physical and fiat holdings backing ACT</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Value (USD)</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Custody</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reserves.map((reserve) => (
                  <TableRow key={reserve.id}>
                    <TableCell className="font-medium uppercase">
                      {reserve.asset_type}
                    </TableCell>
                    <TableCell>
                      {parseFloat(reserve.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      ${parseFloat(reserve.amount_usd).toLocaleString()}
                    </TableCell>
                    <TableCell>{reserve.location || '-'}</TableCell>
                    <TableCell>{reserve.custody_provider || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Reserve deposits and withdrawals</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Value (USD)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 10).map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="capitalize">{tx.transaction_type}</TableCell>
                    <TableCell className="uppercase">{tx.asset_type}</TableCell>
                    <TableCell>{parseFloat(tx.amount).toLocaleString()}</TableCell>
                    <TableCell>${parseFloat(tx.amount_usd).toLocaleString()}</TableCell>
                    <TableCell className="capitalize">{tx.status}</TableCell>
                    <TableCell>
                      {new Date(tx.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
