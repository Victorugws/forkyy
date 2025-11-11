'use client'

import {
  TrendingUp,
  Search,
  ChevronRight,
  Plus,
  ChevronLeft,
  X,
  Globe,
  ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const countries = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Japan', 'China', 'India']

const tabs = ['US Markets', 'Crypto', 'Earnings', 'Screener', 'Politicians']

const weekDays = [
  { day: 'Sun', date: 'Nov 9', calls: 'No Calls' },
  { day: 'Mon', date: 'Nov 10', calls: '117 Calls' },
  { day: 'Tue', date: 'Nov 11', calls: '34 Calls', active: true },
  { day: 'Wed', date: 'Nov 12', calls: '80 Calls' },
  { day: 'Thu', date: 'Nov 13', calls: '82 Calls' },
  { day: 'Fri', date: 'Nov 14', calls: '22 Calls' },
  { day: 'Sat', date: 'Nov 15', calls: 'No Calls' }
]

const earningsCalls = [
  { name: 'Sea Limited', ticker: 'SE', time: '1:30 PM', quarter: 'Q3 \'25' },
  {
    name: 'Occidental Petroleum Corporation',
    ticker: 'OXY',
    time: '7:00 PM',
    quarter: 'Q3 \'25'
  },
  {
    name: 'Occidental Petroleum Corporation',
    ticker: 'OXY-WT',
    time: '7:00 PM',
    quarter: 'Q3 \'25'
  },
  {
    name: 'AngloGold Ashanti Plc',
    ticker: 'AU',
    time: '6:30 PM',
    quarter: 'Q3 \'25'
  },
  {
    name: 'Nebius Group N.V.',
    ticker: 'NBIS',
    time: '2:00 PM',
    quarter: 'Q3 \'25'
  },
  {
    name: 'Rigetti Computing, Inc.',
    ticker: 'RGTIW',
    time: '2:30 PM',
    quarter: 'Q3 \'25'
  },
  { name: 'Oklo Inc.', ticker: 'OKLO', time: '11:00 PM', quarter: 'Q3 \'25' }
]

const watchlistStocks = [
  { name: 'Alphabet Inc.', ticker: 'GOOG', price: '$290.59', change: '+3.89%', positive: true },
  { name: 'Meta Platforms, Inc.', ticker: 'META', price: '$631.76', change: '+1.62%', positive: true },
  { name: 'Accenture plc', ticker: 'ACN', price: '$244.55', change: '-0.49%', positive: false },
  { name: 'Tesla, Inc.', ticker: 'TSLA', price: '$445.23', change: '+3.66%', positive: true },
  { name: 'Microsoft Corporation', ticker: 'MSFT', price: '$506.00', change: '+1.85%', positive: true }
]

const gainersStocks = [
  { name: 'Cogent Biosciences, Inc.', ticker: 'COGT', price: '$32.46', change: '+119.03%' },
  { name: 'Hitek Global Inc.', ticker: 'HKT', price: '$4.15', change: '+89.50%' },
  { name: 'Robo.ai Inc.', ticker: 'AI10', price: '$0.68', change: '+32.24%' },
  { name: 'Ironwood Pharmaceuticals,...', ticker: 'IRWD', price: '$2.53', change: '+31.77%' }
]

const sectors = [
  { name: 'Technology', value: '$295.53', change: '+2.56%', positive: true },
  { name: 'Energy', value: '$90.35', change: '+0.90%', positive: true }
]

const cryptoData = [
  { name: 'Bitcoin', ticker: 'BTCUSD', symbol: 'CRYPTO', price: '$104,890.68', change: '-1.03%', negative: true },
  { name: 'Ethereum', ticker: 'ETHUSD', symbol: 'CRYPTO', price: '$3,548.91', change: '-0.49%', negative: true },
  { name: 'Solana', ticker: 'SOLUSD', symbol: 'CRYPTO', price: '$163.90', change: '-2.04%', negative: true },
  { name: 'Coin 50', ticker: 'COIN50USD', symbol: '', price: '$447.81', change: '-1.45%', negative: true }
]

const marketIndices = [
  { name: 'S&P Futures', ticker: 'S&P', price: '6,846', change: '-0.14%', negative: true },
  { name: 'NASDAQ Fut', ticker: 'NASDAQ', price: '25,650.25', change: '-0.13%', negative: true },
  { name: 'Dow Futures', ticker: 'Dow', price: '47,443', change: '-0.04%', negative: true },
  { name: 'VIX', ticker: 'INDEX', price: '176', change: '+3.07%', negative: false }
]

const screenerStocks = [
  { name: 'Palantir Technologies Inc.', ticker: 'PLTR', price: '$89.35', change: '+8.92%', marketCap: '$192.5B', volume: '82.5M' },
  { name: 'Nvidia Corporation', ticker: 'NVDA', price: '$145.28', change: '+5.87%', marketCap: '$3.58T', volume: '156.2M' },
  { name: 'Tesla, Inc.', ticker: 'TSLA', price: '$445.23', change: '+3.66%', marketCap: '$1.42T', volume: '98.4M' },
  { name: 'Advanced Micro Devices', ticker: 'AMD', price: '$118.67', change: '+4.35%', marketCap: '$192.1B', volume: '67.8M' },
  { name: 'Amazon.com, Inc.', ticker: 'AMZN', price: '$218.45', change: '+2.18%', marketCap: '$2.28T', volume: '45.3M' },
  { name: 'Microsoft Corporation', ticker: 'MSFT', price: '$506.00', change: '+1.85%', marketCap: '$3.76T', volume: '32.1M' }
]

const politicianTrades = [
  { name: 'Nancy Pelosi', position: 'Representative', ticker: 'NVDA', action: 'Purchased', shares: '50 call options', value: '$500K', date: 'Nov 8, 2025' },
  { name: 'Josh Gottheimer', position: 'Representative', ticker: 'MSFT', action: 'Purchased', shares: '100-500', value: '$15K-$50K', date: 'Nov 7, 2025' },
  { name: 'Michael McCaul', position: 'Representative', ticker: 'TSLA', action: 'Sold', shares: '500-1000', value: '$50K-$100K', date: 'Nov 6, 2025' },
  { name: 'Dan Crenshaw', position: 'Representative', ticker: 'PLTR', action: 'Purchased', shares: '100-500', value: '$10K-$50K', date: 'Nov 5, 2025' },
  { name: 'Tommy Tuberville', position: 'Senator', ticker: 'AMZN', action: 'Purchased', shares: '50-100', value: '$15K-$50K', date: 'Nov 4, 2025' }
]

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('US Markets')
  const [watchlistTab, setWatchlistTab] = useState<'gainers' | 'losers' | 'active'>('gainers')
  const [myWatchlist, setMyWatchlist] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState('United States')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)

  useEffect(() => {
    // Load saved watchlist from localStorage
    const saved = localStorage.getItem('stockWatchlist')
    if (saved) {
      setMyWatchlist(JSON.parse(saved))
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.country-dropdown')) {
        setShowCountryDropdown(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const addToWatchlist = (ticker: string) => {
    setMyWatchlist(prev => {
      const newWatchlist = [...prev, ticker]
      localStorage.setItem('stockWatchlist', JSON.stringify(newWatchlist))
      return newWatchlist
    })
  }

  const removeFromWatchlist = (ticker: string) => {
    setMyWatchlist(prev => {
      const newWatchlist = prev.filter(t => t !== ticker)
      localStorage.setItem('stockWatchlist', JSON.stringify(newWatchlist))
      return newWatchlist
    })
  }

  const isInWatchlist = (ticker: string) => myWatchlist.includes(ticker)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 px-6 py-6 max-w-6xl">
        {/* Breadcrumb and Country Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/finance" className="hover:text-primary transition-colors">
              Perplexity Finance
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-foreground">{activeTab}</span>
          </div>

          {/* Country Selector */}
          <div className="relative country-dropdown">
            <button
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
            >
              <Globe className="size-4" />
              <span className="text-sm font-medium">{selectedCountry}</span>
              <ChevronDown className="size-4" />
            </button>
            {showCountryDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-lg z-50">
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => {
                      setSelectedCountry(country)
                      setShowCountryDropdown(false)
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent transition-colors first:rounded-t-xl last:rounded-b-xl ${
                      selectedCountry === country ? 'bg-accent text-primary' : 'text-foreground'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab
                  ? 'bg-primary/10 text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* US Markets Content */}
        {activeTab === 'US Markets' && (
          <>
            {/* Market Indices Grid */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {marketIndices.map((index) => (
                <Link
                  key={index.name}
                  href={`/search?q=${index.name}+stock+market`}
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

            {/* Market Summary */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Market Summary</h2>
                <span className="text-sm text-muted-foreground">Updated 50 seconds ago</span>
              </div>
              <div className="space-y-4">
                <div className="p-6 rounded-xl border border-border bg-card">
                  <h3 className="font-semibold text-foreground mb-3">Stocks Surge as Senate Advances Shutdown Deal</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    US stocks surged Monday after bipartisan progress to end the longest federal government shutdown in history. The S&P 500 rose 1.54% and the Nasdaq 100 jumped 2.20%, led by Big Tech and AI-linked names after last week's sell-off.
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                  <h3 className="font-semibold text-foreground mb-3">Technology and AI Lead Gains</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Nvidia soared nearly 6%, Palantir gained almost 9%, and Alphabet rose 4% as investors rotated back into AI and tech stocks. The move was fueled by optimism about fiscal clarity and improved risk appetite following the shutdown agreement.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Crypto Content */}
        {activeTab === 'Crypto' && (
          <>
            {/* Crypto Cards Grid */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {cryptoData.map((crypto) => (
                <Link
                  key={crypto.name}
                  href={`/search?q=${crypto.name}+cryptocurrency`}
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

            {/* Market Summary */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Market Summary</h2>
                <span className="text-sm text-muted-foreground">Updated 4 minutes ago</span>
              </div>
              <div className="space-y-4">
                <div className="p-6 rounded-xl border border-border bg-card">
                  <h3 className="font-semibold text-foreground mb-3">Bitcoin Holds Above Key $105,000 Level Despite Profit-Taking</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Bitcoin rebounded from weekend lows below $100,000 after Senate progress to end the U.S. government shutdown improved risk appetite. However, selling pressure returned Tuesday, keeping BTC pinned just above $105,000 despite bullish positioning and recent institutional purchases.
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                  <h3 className="font-semibold text-foreground mb-3">Ethereum and Solana Lag Behind, Weighed by Treasury Rotation and Market Volatility</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ethereum and Solana saw muted declines alongside major crypto treasury companies pivoting toward safer havens for higher returns amid lingering uncertainty. NFT market activity remains sensitive to macro shifts and sentiment swings.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Earnings Content */}
        {activeTab === 'Earnings' && (
          <>
            {/* Earnings Calendar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Earnings Calendar
                </h2>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-accent transition-colors">
                    <ChevronLeft className="size-4" />
                  </button>
                  <button className="px-4 py-1.5 rounded-lg bg-accent text-sm font-medium">
                    Today
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-accent transition-colors">
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-3 mb-6">
                {weekDays.map((day) => (
                  <button
                    key={day.day}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      day.active
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <div className="text-sm font-medium text-foreground mb-1">
                      {day.day}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {day.date}
                    </div>
                    <div
                      className={`text-xs font-medium ${
                        day.active ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {day.calls}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Earnings Calls List */}
            <div className="space-y-2 mb-8">
              {earningsCalls.map((call, index) => (
                <Link
                  key={index}
                  href={`/search?q=${call.ticker}+earnings`}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-lg font-bold">
                      {call.ticker.substring(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {call.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {call.ticker}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {call.quarter}
                    </div>
                    <div className="text-sm text-muted-foreground">{call.time}</div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Screener Content */}
        {activeTab === 'Screener' && (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Stock Screener</h2>
                <span className="text-sm text-muted-foreground">Top momentum stocks</span>
              </div>

              {/* Filter Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                  High Growth
                </button>
                <button className="px-3 py-1.5 rounded-full bg-accent text-foreground text-xs font-medium border border-border hover:border-primary/50 transition-colors">
                  Large Cap
                </button>
                <button className="px-3 py-1.5 rounded-full bg-accent text-foreground text-xs font-medium border border-border hover:border-primary/50 transition-colors">
                  Tech Sector
                </button>
                <button className="px-3 py-1.5 rounded-full bg-accent text-foreground text-xs font-medium border border-border hover:border-primary/50 transition-colors">
                  High Volume
                </button>
              </div>

              {/* Screener Results Table */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Company</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Ticker</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Price</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Change</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Market Cap</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {screenerStocks.map((stock, index) => (
                      <tr
                        key={index}
                        className="border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <Link href={`/search?q=${stock.ticker}+stock`} className="font-medium text-foreground hover:text-primary transition-colors">
                            {stock.name}
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-muted-foreground">{stock.ticker}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="font-semibold text-foreground">{stock.price}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-sm font-medium text-green-500">{stock.change}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-sm text-muted-foreground">{stock.marketCap}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-sm text-muted-foreground">{stock.volume}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Politicians Content */}
        {activeTab === 'Politicians' && (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Congressional Stock Trading</h2>
                <span className="text-sm text-muted-foreground">Recent transactions</span>
              </div>

              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Track stock trades made by members of Congress. All trades are required to be disclosed within 45 days of the transaction date.
              </p>

              {/* Politicians Trades List */}
              <div className="space-y-3">
                {politicianTrades.map((trade, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{trade.name}</h3>
                        <p className="text-xs text-muted-foreground">{trade.position}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{trade.date}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-muted-foreground">Ticker: </span>
                        <Link href={`/search?q=${trade.ticker}+stock`} className="font-medium text-primary hover:underline">
                          {trade.ticker}
                        </Link>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Action: </span>
                        <span className={`font-medium ${trade.action === 'Purchased' ? 'text-green-500' : 'text-red-500'}`}>
                          {trade.action}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Shares: </span>
                        <span className="font-medium text-foreground">{trade.shares}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Value: </span>
                        <span className="font-medium text-foreground">{trade.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border">
                <p className="text-xs text-muted-foreground">
                  <strong>Disclaimer:</strong> This data is for informational purposes only and should not be considered investment advice.
                  Congressional stock trades are publicly disclosed information from official government filings.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Ask any question about finance"
            className="w-full rounded-2xl border border-input bg-card px-12 py-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-96 border-l border-border p-6 space-y-6">
        {/* My Watchlist */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            My Watchlist {myWatchlist.length > 0 && `(${myWatchlist.length})`}
          </h3>
          <button
            onClick={() => {
              if (confirm('Clear all watchlist items?')) {
                setMyWatchlist([])
                localStorage.removeItem('stockWatchlist')
              }
            }}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <TrendingUp className="size-5" />
          </button>
        </div>

        {/* Watchlist Stocks */}
        <div className="space-y-2">
          {watchlistStocks.map((stock, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-xs font-bold">
                  {stock.ticker.substring(0, 1)}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {stock.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stock.ticker}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">
                  {stock.price}
                </div>
                <div
                  className={`text-xs font-medium ${stock.positive ? 'text-green-500' : 'text-red-500'}`}
                >
                  {stock.change}
                </div>
              </div>
              <button
                onClick={() => {
                  if (isInWatchlist(stock.ticker)) {
                    removeFromWatchlist(stock.ticker)
                  } else {
                    addToWatchlist(stock.ticker)
                  }
                }}
                className={`p-1 rounded transition-colors ${
                  isInWatchlist(stock.ticker)
                    ? 'bg-primary/10 hover:bg-primary/20 text-primary'
                    : 'hover:bg-accent'
                }`}
                title={isInWatchlist(stock.ticker) ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                {isInWatchlist(stock.ticker) ? (
                  <X className="size-4" />
                ) : (
                  <Plus className="size-4" />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Gainers/Losers/Active Tabs */}
        <div className="border-t border-border pt-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setWatchlistTab('gainers')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                watchlistTab === 'gainers'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-muted-foreground hover:text-foreground'
              }`}
            >
              Gainers
            </button>
            <button
              onClick={() => setWatchlistTab('losers')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                watchlistTab === 'losers'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-muted-foreground hover:text-foreground'
              }`}
            >
              Losers
            </button>
            <button
              onClick={() => setWatchlistTab('active')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                watchlistTab === 'active'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-muted-foreground hover:text-foreground'
              }`}
            >
              Active
            </button>
          </div>

          <div className="space-y-2">
            {gainersStocks.map((stock, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-accent flex items-center justify-center text-xs font-bold">
                    {stock.ticker.substring(0, 1)}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-foreground">
                      {stock.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stock.ticker}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-foreground">
                    {stock.price}
                  </div>
                  <div className="text-xs font-medium text-green-500">
                    {stock.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equity Sectors */}
        <div className="border-t border-border pt-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Equity Sectors
          </h3>
          <div className="space-y-3">
            {sectors.map((sector, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-card"
              >
                <div className="text-sm font-medium text-foreground">
                  {sector.name}
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-foreground">
                    {sector.value}
                  </div>
                  <div
                    className={`text-xs font-medium ${sector.positive ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {sector.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
