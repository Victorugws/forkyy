'use client'

import { TrendingUp, TrendingDown, DollarSign, BarChart3, LineChart } from 'lucide-react'
import { useState } from 'react'
import { PageMorphWrapper, usePageMorph } from '@/components/PageMorphWrapper'

const marketData = [
  { symbol: 'SPY', name: 'S&P 500 ETF', price: 452.31, change: 2.34, changePercent: 0.52, trending: 'up' },
  { symbol: 'QQQ', name: 'Nasdaq 100 ETF', price: 378.92, change: -1.23, changePercent: -0.32, trending: 'down' },
  { symbol: 'DIA', name: 'Dow Jones ETF', price: 356.78, change: 0.89, changePercent: 0.25, trending: 'up' },
  { symbol: 'BTC-USD', name: 'Bitcoin', price: 43250.50, change: 523.40, changePercent: 1.22, trending: 'up' }
]

const topMovers = [
  { symbol: 'NVDA', name: 'NVIDIA Corp', change: 5.67, trending: 'up' },
  { symbol: 'TSLA', name: 'Tesla Inc', change: -3.21, trending: 'down' },
  { symbol: 'AAPL', name: 'Apple Inc', change: 2.89, trending: 'up' },
  { symbol: 'MSFT', name: 'Microsoft Corp', change: 1.45, trending: 'up' }
]

export default function FinanceMorphPage() {
  const { shouldSkipMorph } = usePageMorph()
  const [activeTab, setActiveTab] = useState<'markets' | 'crypto' | 'stocks'>('markets')

  return (
    <PageMorphWrapper
      skipMorph={shouldSkipMorph}
      eyeDuration={2500}
      showBinaryLoading={true}
    >
      <div className="flex flex-col min-h-screen bg-background">
        {/* Header Section with Neumorphic Styling */}
        <div className="neu-card border-b border-border/20">
          <div className="container max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="neu-raised rounded-full p-3">
                <TrendingUp className="size-6 text-green-500" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Finance</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mb-6">
              Real-time market data, financial insights, and portfolio tracking
            </p>

            {/* Tab Navigation */}
            <div className="flex gap-2">
              {(['markets', 'crypto', 'stocks'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all capitalize ${
                    activeTab === tab
                      ? 'neu-raised text-foreground shadow-neu'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container max-w-7xl mx-auto px-6 py-10 flex-1">
          {/* Market Overview Cards */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Market Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {marketData.map((market) => (
                <div
                  key={market.symbol}
                  className="neu-card rounded-2xl p-6 hover:shadow-neu-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{market.symbol}</h3>
                      <p className="text-xs text-muted-foreground">{market.name}</p>
                    </div>
                    <div className={`neu-inset rounded-full p-2 ${market.trending === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {market.trending === 'up' ? (
                        <TrendingUp className="size-4" />
                      ) : (
                        <TrendingDown className="size-4" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">
                        ${market.price.toLocaleString()}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${market.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      <span>{market.change >= 0 ? '+' : ''}{market.change}</span>
                      <span className="neu-inset px-2 py-0.5 rounded-md">
                        {market.changePercent >= 0 ? '+' : ''}{market.changePercent}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Top Movers */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Top Movers</h2>
            <div className="neu-card rounded-2xl p-6">
              <div className="space-y-4">
                {topMovers.map((mover, index) => (
                  <div
                    key={mover.symbol}
                    className="flex items-center justify-between py-3 border-b border-border/20 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="neu-inset rounded-xl w-10 h-10 flex items-center justify-center">
                        <span className="text-sm font-bold text-foreground">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{mover.symbol}</h4>
                        <p className="text-xs text-muted-foreground">{mover.name}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 ${mover.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      <span className="text-sm font-semibold">
                        {mover.change >= 0 ? '+' : ''}{mover.change}%
                      </span>
                      {mover.trending === 'up' ? (
                        <TrendingUp className="size-4" />
                      ) : (
                        <TrendingDown className="size-4" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Quick Stats */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Quick Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: DollarSign, label: 'Total Volume', value: '$234.5B', change: '+12.3%' },
                { icon: BarChart3, label: 'Market Cap', value: '$45.2T', change: '+5.1%' },
                { icon: LineChart, label: 'Active Traders', value: '2.3M', change: '+8.7%' }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="neu-card rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="neu-inset rounded-full p-2">
                      <stat.icon className="size-5 text-primary" />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-green-500">{stat.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageMorphWrapper>
  )
}
