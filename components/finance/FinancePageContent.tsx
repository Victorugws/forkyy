'use client'

import { useState } from 'react'
import { generateId } from 'ai'
import { ChatOverlay } from '@/components/chat/ChatOverlay'
import { MarketOverview } from '@/components/finance/MarketOverview'
import { MarketMovers } from '@/components/finance/MarketMovers'
import { MarketIndicesGrid } from '@/components/finance/MarketIndicesGrid'
import { WatchlistSidebar } from '@/components/finance/WatchlistSidebar'
import { CountrySelector, Country } from '@/components/finance/CountrySelector'
import { Standouts } from '@/components/finance/Standouts'
import { CryptoGrid } from '@/components/finance/CryptoGrid'
import { CryptoLeaderboard } from '@/components/finance/CryptoLeaderboard'
import { CoinbaseIndex } from '@/components/finance/CoinbaseIndex'
import { RecentDevelopments } from '@/components/finance/RecentDevelopments'
import { SectorPerformance } from '@/components/finance/SectorPerformance'
import { PopularSpaces } from '@/components/finance/PopularSpaces'
import { MarketInsights } from '@/components/finance/MarketInsights'
import { EarningsCalendar } from '@/components/finance/EarningsCalendar'
import { PoliticianTrades } from '@/components/finance/PoliticianTrades'
import { StockScreener } from '@/components/finance/StockScreener'

export function FinancePageContent() {
  const [selectedCountry, setSelectedCountry] = useState<string>('United States')
  const [activeTab, setActiveTab] = useState<'US Markets' | 'Crypto' | 'Earnings' | 'Screener' | 'Politicians'>('US Markets')
  const [myWatchlist, setMyWatchlist] = useState<string[]>(['NVDA', 'TSLA', 'PLTR', 'MSFT'])
  const [showChatOverlay, setShowChatOverlay] = useState(false)
  const [chatQuery, setChatQuery] = useState('')
  const [chatId, setChatId] = useState<string | undefined>(undefined)

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country.name)
  }

  const handleAddToWatchlist = (ticker: string) => {
    if (!myWatchlist.includes(ticker)) {
      setMyWatchlist([...myWatchlist, ticker])
    }
  }

  const handleRemoveFromWatchlist = (ticker: string) => {
    setMyWatchlist(myWatchlist.filter(t => t !== ticker))
  }

  const handleComponentExpand = (query: string) => {
    setChatQuery(query)
    setChatId(generateId())
    setShowChatOverlay(true)
  }

  return (
    <>
      {/* Chat Overlay */}
      {showChatOverlay && (
        <ChatOverlay
          initialQuery={chatQuery}
          chatId={chatId}
          onClose={() => {
            setShowChatOverlay(false)
            setChatQuery('')
            setChatId(undefined)
          }}
        />
      )}
    <div className="flex gap-6" style={{ minHeight: 'fit-content' }}>
      {/* Main Content Area */}
      <div className="flex-1">
        {/* Breadcrumbs and Country Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Perplexity Finance</span>
            <span>/</span>
            <span className="text-foreground">{activeTab}</span>
          </div>
          <CountrySelector value={selectedCountry} onChange={handleCountryChange} />
        </div>

        {/* Market Category Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {(['US Markets', 'Crypto', 'Earnings', 'Screener', 'Politicians'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === tab
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
              )}
            </button>
          ))}
        </div>

        {/* Tab-specific content */}
        {activeTab === 'US Markets' && (
          <>
            {/* Market Overview Cards */}
            <MarketOverview onExpand={handleComponentExpand} />

            {/* AI Commentary - Market Insights (after first row for US Markets) */}
            <MarketInsights type="US Markets" timeframe="1D" />

            {/* Recent Developments */}
            <RecentDevelopments topic={activeTab} />

            {/* Market Indices Grid */}
            <MarketIndicesGrid
              onAddToWatchlist={handleAddToWatchlist}
              watchlist={myWatchlist}
            />

            {/* Standouts */}
            <Standouts type="stocks" />

            {/* Sector Performance */}
            <SectorPerformance />

            {/* Popular Spaces */}
            <PopularSpaces type="markets" />
          </>
        )}

        {activeTab === 'Crypto' && (
          <>
            {/* AI Commentary - Market Insights (directly under title) */}
            <MarketInsights type="Crypto" timeframe="1D" />

            {/* Popular Spaces for Crypto */}
            <PopularSpaces type="crypto" />

            {/* Coinbase 50 Index */}
            <CoinbaseIndex />

            {/* Crypto Grid */}
            <CryptoGrid
              cryptos={[
                { name: 'Bitcoin', ticker: 'BTCUSD', symbol: 'BTCUSD', price: '$84,550.42', change: '-0.62%', negative: true },
                { name: 'Ethereum', ticker: 'ETHUSD', symbol: 'ETHUSD', price: '$2,750.12', change: '-0.52%', negative: true },
                { name: 'Solana', ticker: 'SOLUSD', symbol: 'SOLUSD', price: '$127.45', change: '-0.84%', negative: true },
                { name: 'Coin 50', ticker: 'COIN50USD', symbol: 'COIN50USD', price: '$354.88', change: '-1.21%', negative: true },
              ]}
            />

            {/* Recent Developments */}
            <RecentDevelopments topic={activeTab} />

            {/* Standouts */}
            <Standouts type="crypto" />

            {/* Crypto Leaderboard */}
            <CryptoLeaderboard />
          </>
        )}

        {activeTab === 'Earnings' && (
          <>
            {/* AI Commentary - Market Insights (directly under title) */}
            <MarketInsights type="Earnings" timeframe="1D" />

            {/* Earnings Calendar */}
            <EarningsCalendar />

            {/* Recent Developments */}
            <RecentDevelopments topic={activeTab} />

            {/* Popular Spaces */}
            <PopularSpaces type="markets" />
          </>
        )}

        {activeTab === 'Screener' && (
          <>
            {/* AI Commentary - Market Insights (directly under title) */}
            <MarketInsights type="Screener" timeframe="1D" />

            {/* Stock Screener */}
            <StockScreener
              stocks={[
                { name: 'Tesla, Inc.', ticker: 'TSLA', price: '$391.09', change: '-1.05%', marketCap: '$1.2T', volume: '89.3M' },
                { name: 'Microsoft Corporation', ticker: 'MSFT', price: '$472.12', change: '-1.32%', marketCap: '$3.5T', volume: '28.5M' },
                { name: 'NVIDIA Corporation', ticker: 'NVDA', price: '$178.88', change: '-0.97%', marketCap: '$4.4T', volume: '52.1M' },
              ]}
              onAddToWatchlist={handleAddToWatchlist}
              watchlist={myWatchlist}
            />
          </>
        )}

        {activeTab === 'Politicians' && (
          <>
            {/* AI Commentary - Market Insights (directly under title) */}
            <MarketInsights type="Politicians" timeframe="1D" />

            {/* Politician Trades */}
            <PoliticianTrades
              selectedCountry={selectedCountry}
            />
          </>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-80 flex-shrink-0">
        <WatchlistSidebar
          myWatchlist={myWatchlist}
          onAddToWatchlist={handleAddToWatchlist}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
          selectedCountry={selectedCountry}
        />
      </div>
    </div>
    </>
  )
}
