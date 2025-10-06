"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface ExchangeRate {
  id: string
  currency_code: string
  rate_to_act: number
  updated_at: string
  currency: {
    name: string
    symbol: string
  }
}

interface ExchangeRatesTableProps {
  rates: ExchangeRate[]
}

export function ExchangeRatesTable({ rates }: ExchangeRatesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Exchange Rates</CardTitle>
        <CardDescription>Live exchange rates for ACT token</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Currency</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="text-right">Rate (to ACT)</TableHead>
              <TableHead className="text-right">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rates.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell className="font-medium">{rate.currency.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{rate.currency_code}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono">{rate.rate_to_act.toFixed(4)}</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {new Date(rate.updated_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
