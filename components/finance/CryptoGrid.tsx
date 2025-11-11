'use client'

import Link from 'next/link'

interface CryptoData {
  name: string
  ticker: string
  symbol: string
  price: string
  change: string
  negative: boolean
}

interface CryptoGridProps {
  cryptos: CryptoData[]
  loading?: boolean
}

export function CryptoGrid({ cryptos, loading }: CryptoGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border border-border bg-card h-28 animate-pulse">
            <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {cryptos.map((crypto) => (
        <Link
          key={crypto.name}
          href={`/search?q=${encodeURIComponent(crypto.name)}+cryptocurrency`}
          className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group"
        >
          <div className="text-xs text-muted-foreground mb-1">{crypto.name}</div>
          <div className="text-xs text-muted-foreground mb-2">{crypto.ticker} · {crypto.symbol}</div>
          <div className="text-2xl font-bold text-foreground mb-1">{crypto.price}</div>
          <div className={`text-sm font-medium ${crypto.negative ? 'text-red-500' : 'text-green-500'}`}>
            {crypto.change}
          </div>
        </Link>
      ))}
    </div>
  )
}
