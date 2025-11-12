'use client'

import Link from 'next/link'
import { Plus, Check } from 'lucide-react'
import { MiniChart } from './MiniChart'
import { CompanyLogo } from './CompanyLogo'

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
  onAddToWatchlist?: (ticker: string) => void
  watchlist?: string[]
}

// Generate sample chart data
function generateChartData(negative: boolean): number[] {
  const baseValue = 100
  const data: number[] = [baseValue]

  for (let i = 1; i < 20; i++) {
    const trend = negative ? -0.2 : 0.2
    const random = (Math.random() - 0.5) * 3
    const newValue = data[i - 1] + trend + random
    data.push(newValue)
  }

  return data
}

export function MarketIndicesGrid({ indices, loading, onAddToWatchlist, watchlist = [] }: MarketIndicesGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border border-border bg-card h-32 animate-pulse">
            <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {indices.map((index) => {
        const chartData = generateChartData(index.negative)
        const isInWatchlist = watchlist.includes(index.ticker)

        return (
          <div
            key={index.name}
            className="relative p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group"
          >
            <Link
              href={`/search?q=${encodeURIComponent(index.name)}+stock+market`}
              className="block"
            >
              <div className="flex items-center gap-3 mb-3">
                <CompanyLogo ticker={index.ticker} companyName={index.name} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{index.name}</div>
                  <div className="text-xs text-muted-foreground">{index.ticker}</div>
                </div>
              </div>
              <div className="flex items-end justify-between mb-2">
                <div className="text-2xl font-bold text-foreground">{index.price}</div>
                <MiniChart data={chartData} width={60} height={30} positive={!index.negative} />
              </div>
              <div className={`text-sm font-medium ${index.negative ? 'text-red-500' : 'text-green-500'}`}>
                {index.change}
              </div>
            </Link>
            {onAddToWatchlist && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('Add to watchlist clicked:', index.ticker)
                  onAddToWatchlist(index.ticker)
                }}
                disabled={isInWatchlist}
                className={`absolute top-2 right-2 p-2 rounded-lg transition-all z-10 ${
                  isInWatchlist
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-primary/10 text-primary hover:bg-primary/20 opacity-0 group-hover:opacity-100'
                }`}
                style={{ pointerEvents: 'auto' }}
                title={isInWatchlist ? 'Added to watchlist' : 'Add to watchlist'}
              >
                {isInWatchlist ? <Check className="size-4" /> : <Plus className="size-4" />}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
