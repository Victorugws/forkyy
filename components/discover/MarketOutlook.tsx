'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

interface MarketItem {
  id: string
  name: string
  symbol: string
  value: string
  change: number
  changePercent: number
  chartData: number[]
}

export function MarketOutlook() {
  // Mock data - in production, fetch from finance API
  const markets: MarketItem[] = [
    {
      id: 'sp500',
      name: 'S&P Futures',
      symbol: 'S&P FUT.',
      value: '6,620.25',
      change: -9.1,
      changePercent: -0.14,
      chartData: [6630, 6628, 6625, 6623, 6622, 6620, 6619, 6618, 6620, 6620.25]
    },
    {
      id: 'nasdaq',
      name: 'NASDAQ',
      symbol: 'NASDAQ',
      value: '24,305.5',
      change: -9.75,
      changePercent: -0.04,
      chartData: [24310, 24312, 24308, 24305, 24303, 24302, 24304, 24305, 24306, 24305.5]
    },
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTCUSD',
      value: '$84,536.02',
      change: -0.61,
      changePercent: -0.61,
      chartData: [84600, 84580, 84570, 84560, 84550, 84545, 84540, 84538, 84536, 84536.02]
    },
    {
      id: 'vix',
      name: 'VIX',
      symbol: 'VIX',
      value: '23.43',
      change: -1.17,
      changePercent: -1.17,
      chartData: [23.6, 23.55, 23.5, 23.48, 23.46, 23.45, 23.44, 23.43, 23.43, 23.43]
    }
  ]

  return (
    <div className="neu-card p-5 rounded-xl mb-4">
      <h3 className="text-sm font-semibold mb-4">Market Outlook</h3>

      <div className="space-y-4">
        {markets.map((market) => (
          <div key={market.id} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-xs font-medium mb-0.5">{market.symbol}</div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${
                  market.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {market.changePercent >= 0 ? '+' : ''}{market.changePercent}%
                </span>
                <span className="text-xs text-muted-foreground">
                  {market.change >= 0 ? '+' : ''}{market.change}
                </span>
              </div>
            </div>

            {/* Mini sparkline chart */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-8">
                <MiniSparkline
                  data={market.chartData}
                  isPositive={market.changePercent >= 0}
                />
              </div>
              <div className="text-xs font-medium w-16 text-right">
                {market.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MiniSparkline({ data, isPositive }: { data: number[], isPositive: boolean }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const width = 100
  const height = 100

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  })

  const pathD = `M ${points.join(' L ')}`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full"
      preserveAspectRatio="none"
    >
      <path
        d={pathD}
        fill="none"
        stroke={isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
