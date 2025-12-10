'use client'

import { ChevronRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { CustomDock } from '@/components/CustomDock'
import { IconWrapper } from '@/components/ui/icons'
import { MarketIndicesGrid } from '@/components/finance/MarketIndicesGrid'
import { CryptoGrid } from '@/components/finance/CryptoGrid'
import { EarningsCalendar } from '@/components/finance/EarningsCalendar'
import { StockScreener } from '@/components/finance/StockScreener'
import { PoliticianTrades } from '@/components/finance/PoliticianTrades'
import { WatchlistSidebar } from '@/components/finance/WatchlistSidebar'
import { MarketProgressionChart } from '@/components/finance/MarketProgressionChart'
import { MarketInsights } from '@/components/finance/MarketInsights'
import { CountrySelector, type Country } from '@/components/finance/CountrySelector'
import { RecentDevelopments } from '@/components/finance/RecentDevelopments'
import { PopularSpaces } from '@/components/finance/PopularSpaces'
import { Standouts } from '@/components/finance/Standouts'
import { CryptoLeaderboard } from '@/components/finance/CryptoLeaderboard'
import { CoinbaseIndex } from '@/components/finance/CoinbaseIndex'
import { useWatchlist } from '@/hooks/useWatchlist'
import { MarketMovers } from '@/components/finance/MarketMovers'
import { SectorPerformance } from '@/components/finance/SectorPerformance'
import { EconomicCalendar } from '@/components/finance/EconomicCalendar'
import { PriceAlerts } from '@/components/finance/PriceAlerts'
import { PortfolioTracker } from '@/components/finance/PortfolioTracker'
import { MarketOverview } from '@/components/finance/MarketOverview'

export default function FinancePage() {
  const [selectedCountry, setSelectedCountry] = useState('United States')

  // Dynamic tabs based on selected country
  const tabs = [
    selectedCountry === 'United States' ? 'US Markets' : selectedCountry === 'United Kingdom' ? 'UK Markets' : selectedCountry === 'Canada' ? 'Canada Markets' : `${selectedCountry} Markets`,
    'Crypto',
    'Earnings',
    'Screener',
    'Politicians'
  ]

  const [activeTab, setActiveTab] = useState(tabs[0])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D')

  // Use watchlist hook
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()

  // Dynamic data states
  const [marketIndices, setMarketIndices] = useState<any[]>([])
  const [cryptoData, setCryptoData] = useState<any[]>([])
  const [screenerStocks, setScreenerStocks] = useState<any[]>([])
  const [politicianTrades, setPoliticianTrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch financial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch all data in parallel
        const [stocksRes, cryptoRes, screenerRes, politiciansRes] = await Promise.all([
          fetch('/api/finance?type=stocks'),
          fetch('/api/finance?type=crypto'),
          fetch('/api/finance?type=screener'),
          fetch('/api/finance?type=politicians')
        ])

        const [stocksData, cryptoDataRes, screenerData, politiciansData] = await Promise.all([
          stocksRes.json(),
          cryptoRes.json(),
          screenerRes.json(),
          politiciansRes.json()
        ])

        if (stocksData.success || stocksData.fallback) {
          setMarketIndices(stocksData.data)
        }
        if (cryptoDataRes.success || cryptoDataRes.fallback) {
          setCryptoData(cryptoDataRes.data)
        }
        if (screenerData.success || screenerData.fallback) {
          setScreenerStocks(screenerData.data)
        }
        if (politiciansData.success || politiciansData.fallback) {
          setPoliticianTrades(politiciansData.data)
        }
      } catch (error) {
        console.error('Error fetching finance data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Refresh data every 60 seconds
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleCountryChange = (country: Country) => {
    console.log('Finance page: Country changed to:', country.name)
    setSelectedCountry(country.name)

    // Update active tab to match new country if on Markets tab
    if (activeTab.includes('Markets')) {
      const newMarketTab = country.name === 'United States' ? 'US Markets' : country.name === 'United Kingdom' ? 'UK Markets' : country.name === 'Canada' ? 'Canada Markets' : `${country.name} Markets`
      setActiveTab(newMarketTab)
    }

    // Refetch all financial data with new country
    const fetchDataForCountry = async () => {
      setLoading(true)
      try {
        // Fetch all data in parallel with country parameter
        const [stocksRes, cryptoRes, screenerRes, politiciansRes] = await Promise.all([
          fetch(`/api/finance?type=stocks&country=${encodeURIComponent(country.name)}`),
          fetch(`/api/finance?type=crypto&country=${encodeURIComponent(country.name)}`),
          fetch(`/api/finance?type=screener&country=${encodeURIComponent(country.name)}`),
          fetch(`/api/finance?type=politicians&country=${encodeURIComponent(country.name)}`)
        ])

        const [stocksData, cryptoDataRes, screenerData, politiciansData] = await Promise.all([
          stocksRes.json(),
          cryptoRes.json(),
          screenerRes.json(),
          politiciansRes.json()
        ])

        if (stocksData.success || stocksData.fallback) {
          setMarketIndices(stocksData.data)
        }
        if (cryptoDataRes.success || cryptoDataRes.fallback) {
          setCryptoData(cryptoDataRes.data)
        }
        if (screenerData.success || screenerData.fallback) {
          setScreenerStocks(screenerData.data)
        }
        if (politiciansData.success || politiciansData.fallback) {
          setPoliticianTrades(politiciansData.data)
        }

        console.log('Data refetched for country:', country.name)
      } catch (error) {
        console.error('Error fetching data for country:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDataForCountry()
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <CustomDock />
      <div className="flex flex-1">
        {/* Main Content */}
        <div className="flex-1 px-6 py-6 max-w-6xl">
        {/* Breadcrumb and Actions */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/finance" className="hover:text-primary transition-colors">
              ORB AI Finance
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-foreground">{activeTab}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Watchlist Toggle */}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg neu-button"
            >
              <IconWrapper>
                <TrendingUp className="size-4" />
              </IconWrapper>
              <span className="text-sm font-medium">Watchlist</span>
            </button>

            {/* Country Selector Component */}
            <CountrySelector value={selectedCountry} onChange={handleCountryChange} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8 pb-4 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'text-primary neu-card'
                  : 'neu-button hover:neu-inset text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Market Overview - Always visible for context */}
        <div className="mb-8">
          <MarketOverview />
        </div>

        {/* Tab Content */}
        {activeTab.includes('Markets') && (
          <>
            {/* Market Summary & Insights */}
            <div className="mb-8">
              <MarketInsights type="US Markets" data={marketIndices} timeframe={timeframe} />
            </div>
            
            {/* Primary Market Data */}
            <div className="mb-8">
              <MarketIndicesGrid
                indices={marketIndices}
                loading={loading}
                onAddToWatchlist={addToWatchlist}
                watchlist={watchlist}
              />
            </div>
            
            {/* Market Movers - Combined View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <MarketMovers type="gainers" limit={5} />
              <MarketMovers type="losers" limit={5} />
            </div>
            
            {/* Sector Analysis */}
            <div className="mb-8">
              <SectorPerformance />
            </div>
            
            {/* Recent Market Developments */}
            <div className="mb-8">
              <RecentDevelopments topic={`${selectedCountry} Markets`} limit={4} />
            </div>
            
            {/* Standout Performers */}
            <div className="mb-8">
              <Standouts type="stocks" />
            </div>
            
            {/* Popular Research Spaces */}
            <div className="mb-8">
              <PopularSpaces type="markets" />
            </div>
          </>
        )}

        {activeTab === 'Crypto' && (
          <>
            {/* Crypto Summary & Insights */}
            <div className="mb-8">
              <MarketInsights type="Crypto" data={cryptoData} timeframe={timeframe} />
            </div>
            
            {/* Primary Crypto Data */}
            <div className="mb-8">
              <CryptoGrid cryptos={cryptoData} loading={loading} />
            </div>
            
            {/* Crypto Market Movers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <MarketMovers type="gainers" limit={5} />
              <MarketMovers type="most-active" limit={5} />
            </div>
            
            {/* Crypto Leaderboard */}
            <div className="mb-8">
              <CryptoLeaderboard />
            </div>
            
            {/* Coinbase Index */}
            <div className="mb-8">
              <CoinbaseIndex />
            </div>
            
            {/* Recent Crypto Developments */}
            <div className="mb-8">
              <RecentDevelopments topic="Crypto" limit={4} />
            </div>
            
            {/* Standout Cryptocurrencies */}
            <div className="mb-8">
              <Standouts type="crypto" />
            </div>
            
            {/* Popular Research Spaces */}
            <div className="mb-8">
              <PopularSpaces type="crypto" />
            </div>
          </>
        )}

        {activeTab === 'Earnings' && (
          <>
            {/* Earnings Summary */}
            <div className="mb-8">
              <MarketInsights type="Earnings" timeframe={timeframe} />
            </div>
            
            {/* Earnings Calendar */}
            <div className="mb-8">
              <EarningsCalendar />
            </div>
            
            {/* Economic Calendar */}
            <div className="mb-8">
              <EconomicCalendar />
            </div>
            
            {/* Earnings Impact Analysis */}
            <div className="mb-8">
              <MarketProgressionChart
                title="Earnings Impact"
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
              />
            </div>
          </>
        )}

        {activeTab === 'Screener' && (
          <>
            {/* Screener Summary */}
            <div className="mb-8">
              <MarketInsights type="Screener" data={screenerStocks} timeframe={timeframe} />
            </div>
            
            {/* Stock Screener Tool */}
            <div className="mb-8">
              <StockScreener
                stocks={screenerStocks}
                loading={loading}
                onAddToWatchlist={addToWatchlist}
                watchlist={watchlist}
              />
            </div>
            
            {/* Screener Performance Analysis */}
            <div className="mb-8">
              <MarketProgressionChart
                title="Screener Performance"
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
              />
            </div>
          </>
        )}

        {activeTab === 'Politicians' && (
          <>
            {/* Political Trading Summary */}
            <div className="mb-8">
              <MarketInsights type="Politicians" data={politicianTrades} timeframe={timeframe} />
            </div>
            
            {/* Politician Trades List */}
            <div className="mb-8">
              <PoliticianTrades
                trades={politicianTrades}
                loading={loading}
                selectedCountry={selectedCountry}
              />
            </div>
            
            {/* Political Trading Impact Analysis */}
            <div className="mb-8">
              <MarketProgressionChart
                title="Political Trading Impact"
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
              />
            </div>
          </>
        )}
      </div>

      {/* Right Sidebar */}
      <WatchlistSidebar
        myWatchlist={watchlist}
        onAddToWatchlist={addToWatchlist}
        onRemoveFromWatchlist={removeFromWatchlist}
        selectedCountry={selectedCountry}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      </div>
    </div>
  )
}
