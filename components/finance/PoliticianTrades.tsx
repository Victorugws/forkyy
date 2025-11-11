'use client'

import Link from 'next/link'
import { Globe } from 'lucide-react'

interface Trade {
  name: string
  position: string
  ticker: string
  action: string
  shares: string
  value: string
  date: string
}

interface PoliticianTradesProps {
  trades: Trade[]
  loading?: boolean
  selectedCountry?: string
}

export function PoliticianTrades({ trades, loading, selectedCountry = 'United States' }: PoliticianTradesProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Congressional Stock Trading</h2>
        <span className="text-sm text-muted-foreground flex items-center gap-2">
          <Globe className="size-4" />
          {selectedCountry}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Track stock trades made by members of Congress. All trades are required to be disclosed within 45 days of the transaction date.
      </p>

      {/* Politicians Trades List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-border bg-card h-24 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </div>
          ))
        ) : (
          trades.map((trade, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {trade.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {trade.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{trade.position}</div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center">
                  <Link
                    href={`/search?q=${encodeURIComponent(trade.ticker)}+stock`}
                    className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors"
                  >
                    {trade.ticker}
                  </Link>
                  <div className="text-xs text-muted-foreground">Stock</div>
                </div>

                <div className="text-center">
                  <div className={`text-sm font-semibold ${
                    trade.action === 'Purchased' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {trade.action}
                  </div>
                  <div className="text-xs text-muted-foreground">{trade.shares}</div>
                </div>

                <div className="text-center min-w-[80px]">
                  <div className="text-sm font-semibold text-foreground">{trade.value}</div>
                  <div className="text-xs text-muted-foreground">Value</div>
                </div>

                <div className="text-right min-w-[100px]">
                  <div className="text-xs text-muted-foreground">{trade.date}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
