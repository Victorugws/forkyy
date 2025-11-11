'use client'

import Link from 'next/link'

interface MarketIndex {
  name: string
  ticker: string
  price: string
  change: string
  negative: boolean
}

interface MarketIndicesGridProps {
  indices: MarketIndex[]
  loading?: boolean
}

export function MarketIndicesGrid({ indices, loading }: MarketIndicesGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
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
      {indices.map((index) => (
        <Link
          key={index.name}
          href={`/search?q=${encodeURIComponent(index.name)}+stock+market`}
          className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group"
        >
          <div className="text-xs text-muted-foreground mb-1">{index.name}</div>
          <div className="text-xs text-muted-foreground mb-2">{index.ticker}</div>
          <div className="text-2xl font-bold text-foreground mb-1">{index.price}</div>
          <div className={`text-sm font-medium ${index.negative ? 'text-red-500' : 'text-green-500'}`}>
            {index.change}
          </div>
        </Link>
      ))}
    </div>
  )
}
