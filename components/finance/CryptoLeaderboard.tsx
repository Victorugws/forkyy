'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import DecryptedText from '@/components/DecryptedText'

interface CryptoItem {
  id: string
  name: string
  symbol: string
  icon?: string
  vol24h: string
  volChg24h: number
  price: string
  priceChg24h: number
  fundingRate: number
}

export function CryptoLeaderboard() {
  const [sortColumn, setSortColumn] = useState<'vol24h' | 'price'>('vol24h')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Mock data - in production, fetch from Coinbase API
  const cryptoData: CryptoItem[] = [
    {
      id: 'btc',
      name: 'Bitcoin',
      symbol: 'BTCUSD',
      vol24h: '$1.1B',
      volChg24h: -60.87,
      price: '$85K',
      priceChg24h: -0.53,
      fundingRate: 0
    },
    {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'ETHUSD',
      vol24h: '$348.04M',
      volChg24h: -58.31,
      price: '$2.8K',
      priceChg24h: -1.29,
      fundingRate: 0.04
    },
    {
      id: 'zec',
      name: 'Zcash',
      symbol: 'ZECUSD',
      vol24h: '$260.81M',
      volChg24h: 1.72,
      price: '$519.72',
      priceChg24h: -14.85,
      fundingRate: 3.46
    },
    {
      id: 'xrp',
      name: 'XRP',
      symbol: 'XRPUSD',
      vol24h: '$259.64M',
      volChg24h: -48.77,
      price: '$1.931',
      priceChg24h: -2.52,
      fundingRate: 0.52
    },
    {
      id: 'sol',
      name: 'Solana',
      symbol: 'SOLUSD',
      vol24h: '$218.63M',
      volChg24h: -59.03,
      price: '$127.48',
      priceChg24h: -1.6,
      fundingRate: 0.78
    },
    {
      id: 'int',
      name: 'Intuition',
      symbol: 'TRUSTUSD',
      vol24h: '$44.87M',
      volChg24h: 282.29,
      price: '$0.222',
      priceChg24h: -10.93,
      fundingRate: 59.85
    }
  ]

  const handleSort = (column: 'vol24h' | 'price') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  const SortIcon = ({ column }: { column: 'vol24h' | 'price' }) => {
    if (sortColumn !== column) return <ChevronDown className="size-3 opacity-30" />
    return sortDirection === 'desc' ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">
            <DecryptedText text="Leaderboard" animateOn="view" speed={30} />
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Data from spot transactions on Coinbase
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm border border-[#e6ebf3] text-xs">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Coinbase</span>
          </div>
        </div>
      </div>

      <div className="bg-white/30 backdrop-blur-md border border-[#e6ebf3] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-1">
                    Asset
                  </div>
                </th>
                <th
                  className="text-right px-4 py-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('vol24h')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Vol 24H
                    <SortIcon column="vol24h" />
                  </div>
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">
                  Vol Chg 24H
                </th>
                <th
                  className="text-right px-4 py-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Price
                    <SortIcon column="price" />
                  </div>
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">
                  Price Chg 24H
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">
                  Funding Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {cryptoData.map((crypto, index) => (
                <tr
                  key={crypto.id}
                  className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-[#e6ebf3] bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {crypto.symbol.slice(0, 1)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{crypto.name}</div>
                        <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium">
                    {crypto.vol24h}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`text-sm font-medium ${
                      crypto.volChg24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {crypto.volChg24h >= 0 ? '+' : ''}{crypto.volChg24h}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium">
                    {crypto.price}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`text-sm font-medium ${
                      crypto.priceChg24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {crypto.priceChg24h >= 0 ? '+' : ''}{crypto.priceChg24h}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`text-sm font-medium ${
                      crypto.fundingRate >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {crypto.fundingRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
