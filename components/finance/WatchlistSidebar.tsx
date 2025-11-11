'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Plus, X } from 'lucide-react'
import Link from 'next/link'

interface Stock {
  name: string
  ticker: string
  price: string
  change: string
  positive?: boolean
}

interface WatchlistSidebarProps {
  myWatchlist: string[]
  onAddToWatchlist: (ticker: string) => void
  onRemoveFromWatchlist: (ticker: string) => void
}

export function WatchlistSidebar({ myWatchlist, onAddToWatchlist, onRemoveFromWatchlist }: WatchlistSidebarProps) {
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers' | 'active'>('gainers')
  const [gainers, setGainers] = useState<Stock[]>([])
  const [losers, setLosers] = useState<Stock[]>([])
  const [activeStocks, setActiveStocks] = useState<Stock[]>([])
  const [watchlistStocks, setWatchlistStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch market movers data
  useEffect(() => {
    const fetchMarketMovers = async () => {
      setLoading(true)
      try {
        // In a real implementation, this would fetch from Finnhub's gainers/losers API
        // For now, using screener data as a proxy
        const res = await fetch('/api/finance?type=screener')
        const data = await res.json()

        if (data.success || data.fallback) {
          const stocks = data.data || []

          // Sort by change percentage (gainers)
          const sortedGainers = [...stocks]
            .sort((a, b) => parseFloat(b.change) - parseFloat(a.change))
            .slice(0, 4)
            .map((s: any) => ({
              name: s.name,
              ticker: s.ticker,
              price: s.price,
              change: s.change,
              positive: parseFloat(s.change) > 0
            }))

          // Sort by change percentage (losers - reverse)
          const sortedLosers = [...stocks]
            .sort((a, b) => parseFloat(a.change) - parseFloat(b.change))
            .slice(0, 4)
            .map((s: any) => ({
              name: s.name,
              ticker: s.ticker,
              price: s.price,
              change: s.change,
              positive: parseFloat(s.change) > 0
            }))

          // Most active (by volume)
          const sortedActive = [...stocks]
            .slice(0, 4)
            .map((s: any) => ({
              name: s.name,
              ticker: s.ticker,
              price: s.price,
              change: s.change,
              positive: parseFloat(s.change) > 0
            }))

          setGainers(sortedGainers)
          setLosers(sortedLosers)
          setActiveStocks(sortedActive)
        }
      } catch (error) {
        console.error('Error fetching market movers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMarketMovers()

    // Refresh every 60 seconds
    const interval = setInterval(fetchMarketMovers, 60000)
    return () => clearInterval(interval)
  }, [])

  // Fetch watchlist stock prices
  useEffect(() => {
    const fetchWatchlistPrices = async () => {
      if (myWatchlist.length === 0) {
        setWatchlistStocks([])
        return
      }

      try {
        // Fetch all watchlist stocks (simplified - would batch in real implementation)
        const res = await fetch('/api/finance?type=screener')
        const data = await res.json()

        if (data.success || data.fallback) {
          const allStocks = data.data || []
          const watchlistData = allStocks
            .filter((s: any) => myWatchlist.includes(s.ticker))
            .map((s: any) => ({
              name: s.name,
              ticker: s.ticker,
              price: s.price,
              change: s.change,
              positive: parseFloat(s.change) > 0
            }))

          setWatchlistStocks(watchlistData)
        }
      } catch (error) {
        console.error('Error fetching watchlist prices:', error)
      }
    }

    fetchWatchlistPrices()
  }, [myWatchlist])

  const currentStocks = activeTab === 'gainers' ? gainers : activeTab === 'losers' ? losers : activeStocks

  return (
    <div className="w-80 border-l border-border p-6 space-y-6">
      {/* Watchlist Section */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="size-4" />
            My Watchlist
          </h3>
          <span className="text-xs text-muted-foreground">{myWatchlist.length} stocks</span>
        </div>

        {myWatchlist.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Plus className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Add stocks to track them here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {watchlistStocks.map((stock) => (
              <div
                key={stock.ticker}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/search?q=${encodeURIComponent(stock.ticker)}+stock`}
                    className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate block"
                  >
                    {stock.ticker}
                  </Link>
                  <div className="text-xs text-muted-foreground truncate">{stock.name}</div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <div className="text-sm font-medium text-foreground">{stock.price}</div>
                    <div className={`text-xs ${stock.positive ? 'text-green-500' : 'text-red-500'}`}>
                      {stock.change}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveFromWatchlist(stock.ticker)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                    aria-label={`Remove ${stock.ticker} from watchlist`}
                  >
                    <X className="size-3 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Market Movers Section */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-semibold text-foreground mb-4">Market Movers</h3>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { id: 'gainers' as const, label: 'Gainers' },
            { id: 'losers' as const, label: 'Losers' },
            { id: 'active' as const, label: 'Active' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stocks List */}
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 rounded-lg h-14 animate-pulse bg-muted"></div>
            ))
          ) : (
            currentStocks.map((stock) => (
              <Link
                key={stock.ticker}
                href={`/search?q=${encodeURIComponent(stock.ticker)}+stock`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {stock.ticker}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{stock.price}</div>
                  <div className={`text-xs ${stock.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {stock.change}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
