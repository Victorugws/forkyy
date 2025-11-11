'use client'

import { ChevronRight, Globe, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { MarketIndicesGrid } from '@/components/finance/MarketIndicesGrid'
import { CryptoGrid } from '@/components/finance/CryptoGrid'
import { MarketSummary } from '@/components/finance/MarketSummary'
import { EarningsCalendar } from '@/components/finance/EarningsCalendar'
import { StockScreener } from '@/components/finance/StockScreener'
import { PoliticianTrades } from '@/components/finance/PoliticianTrades'
import { WatchlistSidebar } from '@/components/finance/WatchlistSidebar'

const countries = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Japan', 'China', 'India']
const tabs = ['US Markets', 'Crypto', 'Earnings', 'Screener', 'Politicians']

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('US Markets')
  const [myWatchlist, setMyWatchlist] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState('United States')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)

  // Dynamic data states
  const [marketIndices, setMarketIndices] = useState<any[]>([])
  const [cryptoData, setCryptoData] = useState<any[]>([])
  const [screenerStocks, setScreenerStocks] = useState<any[]>([])
  const [politicianTrades, setPoliticianTrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

        {/* Tab Content */}
        {activeTab === 'US Markets' && (
          <>
            <MarketIndicesGrid indices={marketIndices} loading={loading} />
            <MarketSummary topic="US Markets" />
          </>
        )}

        {activeTab === 'Crypto' && (
          <>
            <CryptoGrid cryptos={cryptoData} loading={loading} />
            <MarketSummary topic="Crypto" />
          </>
        )}

        {activeTab === 'Earnings' && (
          <EarningsCalendar />
        )}

        {activeTab === 'Screener' && (
          <StockScreener
            stocks={screenerStocks}
            loading={loading}
            onAddToWatchlist={addToWatchlist}
            watchlist={myWatchlist}
          />
        )}

        {activeTab === 'Politicians' && (
          <PoliticianTrades
            trades={politicianTrades}
            loading={loading}
            selectedCountry={selectedCountry}
          />
        )}
      </div>

      {/* Right Sidebar */}
      <WatchlistSidebar
        myWatchlist={myWatchlist}
        onAddToWatchlist={addToWatchlist}
        onRemoveFromWatchlist={removeFromWatchlist}
      />
    </div>
  )
}
