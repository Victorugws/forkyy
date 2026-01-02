'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Globe, ChevronLeft, ChevronRight } from 'lucide-react'
import { CompanyLogo } from './CompanyLogo'
import { PoliticianAvatar } from './PoliticianAvatar'
import DecryptedText from '@/components/DecryptedText'

interface Trade {
  name: string
  position: string
  ticker: string
  action: 'Buy' | 'Sell'
  source: string
  days: string
  value: string
  date: string
}

const mockTrades: Trade[] = [
  { name: 'Ted Cruz', position: 'R SENATE', ticker: 'GS', action: 'Sell', source: 'Spouse', days: '1 day', value: '$100K-$250K', date: '11/11/2025' },
  { name: 'Marjorie Taylor Greene', position: 'R HOUSE GA-14', ticker: 'PG', action: 'Buy', source: 'Undisclosed', days: '1 day', value: '$15K-$50K', date: '11/6/2025' },
  { name: 'Jake Auchincloss', position: 'D HOUSE MA-4', ticker: 'STT', action: 'Sell', source: 'Spouse', days: '2 days', value: '$15K-$50K', date: '11/17/2025' },
  { name: 'Cleo Fields', position: 'D HOUSE LA-6', ticker: 'AAPL', action: 'Buy', source: 'Undisclosed', days: '7 days', value: '$1K-$15K', date: '11/13/2025' },
  { name: 'Marjorie Taylor Greene', position: 'R HOUSE GA-14', ticker: 'V', action: 'Buy', source: 'Undisclosed', days: '7 days', value: '$50K-$100K', date: '11/12/2025' },
  { name: 'Marjorie Taylor Greene', position: 'R HOUSE GA-14', ticker: 'ADP', action: 'Buy', source: 'Undisclosed', days: '2 days', value: '$15K-$50K', date: '11/12/2025' },
  { name: 'Marjorie Taylor Greene', position: 'R HOUSE GA-14', ticker: 'PAYX', action: 'Buy', source: 'Undisclosed', days: '2 days', value: '$15K-$50K', date: '11/12/2025' },
  { name: 'David J. Taylor', position: 'R HOUSE OH-2', ticker: 'HD', action: 'Buy', source: 'Undisclosed', days: '8 days', value: '$1K-$15K', date: '11/11/2025' },
  { name: 'David J. Taylor', position: 'R HOUSE OH-2', ticker: 'RPM', action: 'Buy', source: 'Undisclosed', days: '8 days', value: '$1K-$15K', date: '11/11/2025' },
]

export function PoliticianTrades({ trades: propTrades, loading, selectedCountry = 'United States' }: { trades?: Trade[], loading?: boolean, selectedCountry?: string }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const trades = propTrades || mockTrades

  const filteredTrades = useMemo(() => {
    if (!searchQuery.trim()) return trades
    const query = searchQuery.toLowerCase()
    return trades.filter(trade => 
      trade.name.toLowerCase().includes(query) ||
      trade.ticker.toLowerCase().includes(query) ||
      trade.position.toLowerCase().includes(query)
    )
  }, [trades, searchQuery])

  const paginatedTrades = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredTrades.slice(start, start + itemsPerPage)
  }, [filteredTrades, currentPage])

  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            <DecryptedText text="Trading Activity BETA" animateOn="view" speed={30} />
          </h2>
          <p className="text-sm text-muted-foreground">
            Track stock trades made by members of Congress. All trades are required to be disclosed within 45 days of the transaction date.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="size-4" />
          <span>{selectedCountry}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Select politician..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-[#e6ebf3] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Trades Table */}
      <div className="bg-white/30 backdrop-blur-md border border-[#e6ebf3] rounded-xl overflow-hidden mb-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-4 h-20 animate-pulse border-b border-border/50 last:border-0">
              <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </div>
          ))
        ) : paginatedTrades.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No trades found matching your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Politician</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Transaction</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Filed After</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTrades.map((trade, index) => (
                  <tr
                    key={`${trade.name}-${trade.ticker}-${index}`}
                    className="border-b border-border/50 last:border-0 hover:bg-background/30 transition-colors group"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <PoliticianAvatar name={trade.name} size={40} />
                <div>
                          <div className="text-sm font-medium text-foreground">{trade.name}</div>
                  <div className="text-xs text-muted-foreground">{trade.position}</div>
                </div>
              </div>
                    </td>
                    <td className="px-4 py-4">
                <Link
                  href={`/search?q=${encodeURIComponent(trade.ticker)}+stock`}
                        className="flex items-center gap-2 group/ticker"
                >
                        <CompanyLogo ticker={trade.ticker} companyName={trade.ticker} size={32} />
                        <div>
                    <div className="text-sm font-semibold text-foreground group-hover/ticker:text-primary transition-colors">
                      {trade.ticker}
                    </div>
                          <div className="text-xs text-muted-foreground">{trade.date}</div>
                  </div>
                </Link>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                  <div className={`text-sm font-semibold ${
                          trade.action === 'Buy' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {trade.action}
                  </div>
                        <div className="text-xs text-muted-foreground">{trade.source}</div>
                </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-muted-foreground">{trade.days}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        {trade.value.split('-')[0].includes('$100K') && '$$$$'}
                        {trade.value.split('-')[0].includes('$50K') && '$$$'}
                        {trade.value.split('-')[0].includes('$15K') && '$$'}
                        {trade.value.split('-')[0].includes('$1K') && '$'}
                        <span className="text-sm font-semibold text-foreground">{trade.value}</span>
                </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredTrades.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTrades.length)} of {filteredTrades.length} trades
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-white/20 backdrop-blur-sm border border-[#e6ebf3] hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="px-4 py-1.5 text-sm font-medium text-foreground">
              Page {currentPage}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="bg-white/20 backdrop-blur-sm border border-[#e6ebf3] hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
