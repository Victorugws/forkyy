'use client'

import {
  TrendingUp,
  Search,
  ChevronRight,
  Plus,
  ChevronLeft
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

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

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('Earnings')
  const [watchlistTab, setWatchlistTab] = useState<'gainers' | 'losers' | 'active'>('gainers')

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 px-6 py-6 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/finance" className="hover:text-primary transition-colors">
            Perplexity Finance
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-foreground">Earnings</span>
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
        {/* Create Watchlist */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Create Watchlist
          </h3>
          <button className="text-muted-foreground hover:text-primary transition-colors">
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
              <button className="p-1 hover:bg-accent rounded transition-colors">
                <Plus className="size-4" />
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
