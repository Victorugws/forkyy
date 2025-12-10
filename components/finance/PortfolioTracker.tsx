'use client'

import { TrendingUp, TrendingDown, Plus, PieChart } from 'lucide-react'
import { MiniChart } from './MiniChart'
import { CompanyLogo } from './CompanyLogo'

interface Holding {
  symbol: string
  name: string
  shares: number
  avgPrice: string
  currentPrice: string
  value: string
  gain: string
  gainPercent: string
  isPositive: boolean
}

const mockHoldings: Holding[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 10,
    avgPrice: '$175.00',
    currentPrice: '$185.50',
    value: '$1,855.00',
    gain: '+$105.00',
    gainPercent: '+6.00%',
    isPositive: true,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    shares: 5,
    avgPrice: '$365.00',
    currentPrice: '$378.90',
    value: '$1,894.50',
    gain: '+$69.50',
    gainPercent: '+3.81%',
    isPositive: true,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    shares: 8,
    avgPrice: '$140.00',
    currentPrice: '$142.80',
    value: '$1,142.40',
    gain: '+$22.40',
    gainPercent: '+2.00%',
    isPositive: true,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    shares: 15,
    avgPrice: '$255.00',
    currentPrice: '$248.50',
    value: '$3,727.50',
    gain: '-$97.50',
    gainPercent: '-2.55%',
    isPositive: false,
  },
]

function generateChartData(isPositive: boolean): number[] {
  const baseValue = 100
  const data: number[] = [baseValue]
  const trend = isPositive ? 0.2 : -0.2

  for (let i = 1; i < 20; i++) {
    const random = (Math.random() - 0.5) * 3
    const newValue = data[i - 1] + trend + random
    data.push(newValue)
  }

  return data
}

interface PortfolioTrackerProps {
  compact?: boolean
}

export function PortfolioTracker({ compact = false }: PortfolioTrackerProps) {
  const totalValue = mockHoldings.reduce((sum, h) => sum + parseFloat(h.value.replace(/[$,]/g, '')), 0)
  const totalGain = mockHoldings.reduce((sum, h) => {
    const gain = parseFloat(h.gain.replace(/[$,+]/g, ''))
    return sum + gain
  }, 0)
  const totalGainPercent = ((totalGain / (totalValue - totalGain)) * 100).toFixed(2)

  if (compact) {
    // Compact version for sidebar
    return (
      <div className="neu-card p-4 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-foreground" />
            <h3 className="text-base font-semibold text-foreground">Portfolio</h3>
          </div>
          <button className="p-1.5 rounded-lg neu-button hover:neu-inset transition-all">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mb-4 p-3 rounded-lg bg-background/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground mb-0.5">Total Value</div>
              <div className="text-lg font-bold text-foreground">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-0.5">Gain/Loss</div>
              <div className={`text-base font-bold flex items-center gap-1 justify-end ${
                totalGain >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {totalGain >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>
                  {totalGain >= 0 ? '+' : ''}${Math.abs(totalGain).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className={`text-xs font-medium ${
                totalGain >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {totalGainPercent >= 0 ? '+' : ''}{totalGainPercent}%
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {mockHoldings.map((holding) => (
            <div
              key={holding.symbol}
              className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-background/50 transition-colors cursor-pointer"
            >
              <CompanyLogo ticker={holding.symbol} companyName={holding.name} size={32} />
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">{holding.symbol}</div>
                <div className="text-xs text-muted-foreground truncate">{holding.shares} @ {holding.avgPrice}</div>
              </div>

              <div className="flex-shrink-0 text-right">
                <div className="text-xs font-semibold text-foreground">{holding.value}</div>
                <div className={`text-xs flex items-center gap-0.5 justify-end ${
                  holding.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {holding.isPositive ? (
                    <TrendingUp className="w-2.5 h-2.5" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5" />
                  )}
                  <span>{holding.gainPercent}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Full version for main content
  return (
    <div className="neu-card p-6 rounded-2xl mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-foreground" />
          <h3 className="text-xl font-bold text-foreground">Portfolio</h3>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg neu-button text-sm font-medium hover:neu-inset transition-all">
          <Plus className="w-4 h-4" />
          Add Holding
        </button>
      </div>

      <div className="mb-6 p-4 rounded-lg bg-background/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Value</div>
            <div className="text-2xl font-bold text-foreground">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Total Gain/Loss</div>
            <div className={`text-xl font-bold flex items-center gap-1 ${
              totalGain >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {totalGain >= 0 ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              <span>
                {totalGain >= 0 ? '+' : ''}${Math.abs(totalGain).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className={`text-sm font-medium ${
              totalGain >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {totalGainPercent >= 0 ? '+' : ''}{totalGainPercent}%
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {mockHoldings.map((holding) => (
          <div
            key={holding.symbol}
            className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-background/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <CompanyLogo ticker={holding.symbol} companyName={holding.name} size={48} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground truncate">{holding.name}</div>
                <div className="text-sm text-muted-foreground">
                  {holding.shares} shares @ {holding.avgPrice}
                </div>
              </div>

              <div className="hidden md:block flex-shrink-0 w-20">
                <MiniChart data={generateChartData(holding.isPositive)} isPositive={holding.isPositive} />
              </div>

              <div className="flex-shrink-0 text-right">
                <div className="font-semibold text-foreground">{holding.value}</div>
                <div className={`text-sm flex items-center gap-1 justify-end ${
                  holding.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {holding.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{holding.gainPercent}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

