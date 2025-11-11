'use client'

import { ChevronRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { MarketIndicesGrid } from '@/components/finance/MarketIndicesGrid'
import { CryptoGrid } from '@/components/finance/CryptoGrid'
import { MarketSummary } from '@/components/finance/MarketSummary'
import { EarningsCalendar } from '@/components/finance/EarningsCalendar'
import { StockScreener } from '@/components/finance/StockScreener'
import { PoliticianTrades } from '@/components/finance/PoliticianTrades'
import { WatchlistSidebar } from '@/components/finance/WatchlistSidebar'
import { MarketProgressionChart } from '@/components/finance/MarketProgressionChart'
import { MarketInsights } from '@/components/finance/MarketInsights'
import { CountrySelector, type Country } from '@/components/finance/CountrySelector'
import { useWatchlist } from '@/hooks/useWatchlist'

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
    <div className="flex min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 px-6 py-6 max-w-6xl">
        {/* Breadcrumb and Actions */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/finance" className="hover:text-primary transition-colors">
              Perplexity Finance
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-foreground">{activeTab}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Watchlist Toggle */}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
            >
              <TrendingUp className="size-4" />
              <span className="text-sm font-medium">Watchlist</span>
            </button>

            {/* Country Selector Component */}
            <CountrySelector value={selectedCountry} onChange={handleCountryChange} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-primary/10 text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab.includes('Markets') && (
          <>
            <MarketInsights type="US Markets" data={marketIndices} timeframe={timeframe} />
            <MarketIndicesGrid indices={marketIndices} loading={loading} />
            <MarketProgressionChart
              title={`${selectedCountry} Market Performance`}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />
            <MarketSummary topic={`${selectedCountry} Markets`} />
          </>
        )}

        {activeTab === 'Crypto' && (
          <>
            <MarketInsights type="Crypto" data={cryptoData} timeframe={timeframe} />
            <CryptoGrid cryptos={cryptoData} loading={loading} />
            <MarketProgressionChart
              title="Crypto Market Trends"
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />
            <MarketSummary topic="Crypto" />
          </>
        )}

        {activeTab === 'Earnings' && (
          <>
            <MarketInsights type="Earnings" timeframe={timeframe} />
            <EarningsCalendar />
            <MarketProgressionChart
              title="Earnings Impact"
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />
          </>
        )}

        {activeTab === 'Screener' && (
          <>
            <MarketInsights type="Screener" data={screenerStocks} timeframe={timeframe} />
            <StockScreener
              stocks={screenerStocks}
              loading={loading}
              onAddToWatchlist={addToWatchlist}
              watchlist={watchlist}
            />
            <MarketProgressionChart
              title="Screener Performance"
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />
          </>
        )}

        {activeTab === 'Politicians' && (
          <>
            <MarketInsights type="Politicians" data={politicianTrades} timeframe={timeframe} />
            <PoliticianTrades
              trades={politicianTrades}
              loading={loading}
              selectedCountry={selectedCountry}
            />
            <MarketProgressionChart
              title="Political Trading Impact"
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />
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
  )
}
