'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Plus, X as XIcon } from 'lucide-react'
import Link from 'next/link'
import { CompanyLogo } from './CompanyLogo'
import { PortfolioTracker } from './PortfolioTracker'
import { PriceAlerts } from './PriceAlerts'
import { MarketStatus } from './MarketStatus'
import { QuickStats } from './QuickStats'
import { TrendingTopics } from './TrendingTopics'

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
  selectedCountry?: string
}

export function WatchlistSidebar({ myWatchlist, onAddToWatchlist, onRemoveFromWatchlist, selectedCountry = 'United States', isOpen, onClose }: WatchlistSidebarProps & { isOpen?: boolean; onClose?: () => void }) {
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
        console.log('Fetching market movers for country:', selectedCountry)
        const res = await fetch(`/api/finance?type=screener&country=${encodeURIComponent(selectedCountry)}`)
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
  }, [selectedCountry])

  // Fetch watchlist stock prices
  useEffect(() => {
    const fetchWatchlistPrices = async () => {
      if (myWatchlist.length === 0) {
        setWatchlistStocks([])
        return
      }

      try {
        // Fetch all watchlist stocks (simplified - would batch in real implementation)
        console.log('Fetching watchlist prices for country:', selectedCountry)
        const res = await fetch(`/api/finance?type=screener&country=${encodeURIComponent(selectedCountry)}`)
        const data = await res.json()

        if (data.success || data.fallback) {
          const allStocks = data.data || []
          
          // Create a map of available stocks for quick lookup
          const stockMap = new Map(
            allStocks.map((s: any) => [s.ticker.toUpperCase(), s])
          )

          // For each ticker in watchlist, either use fetched data or create placeholder
          const watchlistData = myWatchlist.map((ticker: string) => {
            const stock = stockMap.get(ticker.toUpperCase())
            if (stock) {
              return {
                name: stock.name || ticker,
                ticker: ticker,
                price: stock.price || 'N/A',
                change: stock.change || '0.00%',
                positive: parseFloat(stock.change || '0') > 0
              }
            } else {
              // Show ticker even if we don't have price data yet
              return {
                name: ticker,
                ticker: ticker,
                price: 'Loading...',
                change: '0.00%',
                positive: true
              }
            }
          })

          setWatchlistStocks(watchlistData)
        } else {
          // If API fails, still show watchlist items with placeholder data
          const watchlistData = myWatchlist.map((ticker: string) => ({
            name: ticker,
            ticker: ticker,
            price: 'Loading...',
            change: '0.00%',
            positive: true
          }))
          setWatchlistStocks(watchlistData)
        }
      } catch (error) {
        console.error('Error fetching watchlist prices:', error)
        // On error, still show watchlist items with placeholder data
        const watchlistData = myWatchlist.map((ticker: string) => ({
          name: ticker,
          ticker: ticker,
          price: 'Loading...',
          change: '0.00%',
          positive: true
        }))
        setWatchlistStocks(watchlistData)
      }
    }

    fetchWatchlistPrices()
  }, [myWatchlist, selectedCountry])

  const currentStocks = activeTab === 'gainers' ? gainers : activeTab === 'losers' ? losers : activeStocks

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative right-0 top-0 bottom-0 z-50
        w-80 lg:w-80 border-l border-border bg-background p-4 space-y-4
        transform transition-transform duration-300 lg:transform-none
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        {/* Close button for mobile */}
        {onClose && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onClose()
            }}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Close sidebar"
          >
            <XIcon className="size-5" />
          </button>
        )}

        {/* Watchlist Section */}
        <div className="rounded-2xl neu-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <TrendingUp className="size-3.5" />
            My Watchlist
          </h3>
          <span className="text-xs text-muted-foreground">{myWatchlist.length}</span>
        </div>

        {myWatchlist.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
              <Plus className="size-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Add stocks to track
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {watchlistStocks.map((stock) => (
              <div
                key={stock.ticker}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors group"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <CompanyLogo ticker={stock.ticker} companyName={stock.name} size={28} />
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/search?q=${encodeURIComponent(stock.ticker)}+stock`}
                      className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate block"
                    >
                      {stock.ticker}
                    </Link>
                    <div className="text-xs text-muted-foreground truncate">{stock.name}</div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-1.5">
                  <div>
                    <div className="text-xs font-medium text-foreground">{stock.price}</div>
                    <div className={`text-xs ${stock.positive ? 'text-green-500' : 'text-red-500'}`}>
                      {stock.change}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onRemoveFromWatchlist(stock.ticker)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                    aria-label={`Remove ${stock.ticker} from watchlist`}
                  >
                    <XIcon className="size-2.5 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Market Movers Section */}
      <div className="rounded-2xl neu-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Market Movers</h3>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-3">
          {[
            { id: 'gainers' as const, label: 'Gainers' },
            { id: 'losers' as const, label: 'Losers' },
            { id: 'active' as const, label: 'Active' }
          ].map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setActiveTab(tab.id)
              }}
              className={`flex-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
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
        <div className="space-y-1.5">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-2 rounded-lg h-12 animate-pulse bg-muted"></div>
            ))
          ) : (
            currentStocks.map((stock) => (
              <Link
                key={stock.ticker}
                href={`/search?q=${encodeURIComponent(stock.ticker)}+stock`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors group"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <CompanyLogo ticker={stock.ticker} companyName={stock.name} size={28} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {stock.ticker}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{stock.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-foreground">{stock.price}</div>
                  <div className={`text-xs ${stock.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {stock.change}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="[&>div]:mb-0">
        <PortfolioTracker compact={true} />
      </div>

      {/* Price Alerts Section */}
      <div className="[&>div]:mb-0">
        <PriceAlerts compact={true} />
      </div>

      {/* Market Status Section */}
      <MarketStatus compact={true} />

      {/* Quick Stats Section */}
      <QuickStats compact={true} />

      {/* Trending Topics Section */}
      <TrendingTopics compact={true} />
      </div>
    </>
  )
}
