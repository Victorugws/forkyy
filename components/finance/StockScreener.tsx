'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { CompanyLogo } from './CompanyLogo'

interface Stock {
  name: string
  ticker: string
  price: string
  change: string
  marketCap: string
  volume: string
}

interface StockScreenerProps {
  stocks: Stock[]
  loading?: boolean
  onAddToWatchlist?: (ticker: string) => void
  watchlist?: string[]
}

export function StockScreener({ stocks, loading, onAddToWatchlist, watchlist = [] }: StockScreenerProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Stock Screener</h2>
        <span className="text-sm text-muted-foreground">
          {stocks.length} stocks found
        </span>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Company</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Ticker</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Change</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Market Cap</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Volume</th>
              {onAddToWatchlist && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-4" colSpan={7}>
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                  </td>
                </tr>
              ))
            ) : (
              stocks.map((stock, index) => {
                const isInWatchlist = watchlist.includes(stock.ticker)
                return (
                  <tr
                    key={index}
                    className="border-t border-border hover:bg-accent/50 transition-colors group"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={`/search?q=${encodeURIComponent(stock.ticker)}+stock`}
                        className="flex items-center gap-3 group-hover:text-primary transition-colors"
                      >
                        <CompanyLogo ticker={stock.ticker} companyName={stock.name} size={32} />
                        <span className="text-sm font-medium text-foreground group-hover:text-primary line-clamp-1">
                          {stock.name}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-muted-foreground">{stock.ticker}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm font-medium text-foreground">{stock.price}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className={`text-sm font-medium ${stock.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.change}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm text-muted-foreground">{stock.marketCap}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm text-muted-foreground">{stock.volume}</span>
                    </td>
                    {onAddToWatchlist && (
                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('Add to watchlist button clicked for:', stock.ticker)
                            console.log('Is already in watchlist?', isInWatchlist)
                            onAddToWatchlist(stock.ticker)
                          }}
                          disabled={isInWatchlist}
                          className={`flex items-center gap-1 px-4 py-2 rounded-md transition-colors ml-auto text-xs font-medium cursor-pointer ${
                            isInWatchlist
                              ? 'bg-muted text-muted-foreground cursor-not-allowed'
                              : 'bg-primary/10 text-primary hover:bg-primary/20'
                          }`}
                          style={{ pointerEvents: 'auto' }}
                        >
                          <Plus className="size-4" />
                          {isInWatchlist ? 'Added' : 'Add'}
                        </button>
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
