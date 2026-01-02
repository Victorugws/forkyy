'use client'

import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { MiniChart } from './MiniChart'
import { CompanyLogo } from './CompanyLogo'
import DecryptedText from '@/components/DecryptedText'

interface Mover {
  symbol: string
  name: string
  price: string
  change: string
  changePercent: string
  volume: string
  isGainer: boolean
}

interface MarketMoversProps {
  type?: 'gainers' | 'losers' | 'most-active'
  limit?: number
}

const mockGainers: Mover[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: '$185.50', change: '+$5.20', changePercent: '+2.89%', volume: '45.2M', isGainer: true },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$378.90', change: '+$8.45', changePercent: '+2.28%', volume: '28.5M', isGainer: true },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$485.20', change: '+$12.30', changePercent: '+2.60%', volume: '52.1M', isGainer: true },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$142.80', change: '+$3.15', changePercent: '+2.25%', volume: '31.8M', isGainer: true },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: '$152.40', change: '+$2.90', changePercent: '+1.94%', volume: '38.7M', isGainer: true },
]

const mockLosers: Mover[] = [
  { symbol: 'TSLA', name: 'Tesla Inc.', price: '$248.50', change: '-$8.20', changePercent: '-3.19%', volume: '89.3M', isGainer: false },
  { symbol: 'META', name: 'Meta Platforms', price: '$312.40', change: '-$6.80', changePercent: '-2.13%', volume: '22.4M', isGainer: false },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: '$425.60', change: '-$9.50', changePercent: '-2.18%', volume: '15.2M', isGainer: false },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: '$128.30', change: '-$3.40', changePercent: '-2.58%', volume: '67.8M', isGainer: false },
  { symbol: 'INTC', name: 'Intel Corp.', price: '$42.15', change: '-$1.20', changePercent: '-2.77%', volume: '41.5M', isGainer: false },
]

const mockMostActive: Mover[] = [
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: '$445.20', change: '+$2.10', changePercent: '+0.47%', volume: '125.8M', isGainer: true },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', price: '$378.50', change: '+$1.85', changePercent: '+0.49%', volume: '98.3M', isGainer: true },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: '$248.50', change: '-$8.20', changePercent: '-3.19%', volume: '89.3M', isGainer: false },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$485.20', change: '+$12.30', changePercent: '+2.60%', volume: '52.1M', isGainer: true },
  { symbol: 'AAPL', name: 'Apple Inc.', price: '$185.50', change: '+$5.20', changePercent: '+2.89%', volume: '45.2M', isGainer: true },
]

function generateChartData(isGainer: boolean): number[] {
  const baseValue = 100
  const data: number[] = [baseValue]
  const trend = isGainer ? 0.3 : -0.3

  for (let i = 1; i < 20; i++) {
    const random = (Math.random() - 0.5) * 4
    const newValue = data[i - 1] + trend + random
    data.push(newValue)
  }

  return data
}

export function MarketMovers({ type = 'gainers', limit = 5 }: MarketMoversProps) {
  const data = type === 'gainers' ? mockGainers : type === 'losers' ? mockLosers : mockMostActive
  const displayData = data.slice(0, limit)

  const title = type === 'gainers' ? 'Top Gainers' : type === 'losers' ? 'Top Losers' : 'Most Active'

  return (
    <div className="bg-white/30 backdrop-blur-md border border-[#e6ebf3] p-6 rounded-2xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground">
          <DecryptedText text={title} animateOn="view" speed={30} />
        </h3>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {displayData.map((mover, index) => (
          <div
            key={mover.symbol}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <CompanyLogo ticker={mover.symbol} companyName={mover.name} size={48} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground truncate">{mover.name}</div>
                <div className="text-sm text-muted-foreground">{mover.symbol}</div>
              </div>

              <div className="hidden md:block flex-shrink-0 w-20">
                <MiniChart data={generateChartData(mover.isGainer)} positive={mover.isGainer} />
              </div>

              <div className="flex-shrink-0 text-right">
                <div className="font-semibold text-foreground">{mover.price}</div>
                <div className={`text-sm flex items-center gap-1 justify-end ${
                  mover.isGainer ? 'text-green-600' : 'text-red-600'
                }`}>
                  {mover.isGainer ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  <span>{mover.changePercent}</span>
                </div>
              </div>

              <div className="hidden lg:block flex-shrink-0 text-right w-24">
                <div className="text-sm text-muted-foreground">Vol</div>
                <div className="text-sm font-medium text-foreground">{mover.volume}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

