'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { useState, useEffect } from 'react'

interface StandoutStock {
  id: string
  symbol: string
  name: string
  exchange: string
  price: number
  change: number
  changePercent: number
  volume: string
  marketCap: string
  peRatio?: string
  dividendYield?: string
  description: string
  chartData: { time: string; price: number }[]
  prevClose: number
}

interface StandoutsProps {
  type?: 'stocks' | 'crypto'
}

export function Standouts({ type = 'stocks' }: StandoutsProps) {
  const [standouts, setStandouts] = useState<StandoutStock[]>([])

  useEffect(() => {
    // Mock data - in production, fetch from API
    const mockStandouts: StandoutStock[] = type === 'stocks' ? [
      {
        id: 'ROST',
        symbol: 'ROST',
        name: 'Ross Stores, Inc.',
        exchange: 'NASDAQ',
        price: 174,
        change: 8.41,
        changePercent: 5.09,
        volume: '7.5M',
        marketCap: '56.59B',
        peRatio: '27.19',
        dividendYield: '0.91%',
        prevClose: 160.50,
        description: 'Ross Stores shares surged after posting better-than-expected quarterly earnings, raising full-year guidance, and receiving analyst price target upgrades, reflecting strong sales growth and positive holiday outlook.',
        chartData: generateMockChartData(160, 174, 20)
      },
      {
        id: 'PCAR',
        symbol: 'PCAR',
        name: 'PACCAR Inc',
        exchange: 'NASDAQ',
        price: 102.99,
        change: 5.52,
        changePercent: 5.66,
        volume: '5.45M',
        marketCap: '54.09B',
        peRatio: '20.19',
        dividendYield: '4.19%',
        prevClose: 97.60,
        description: 'PACCAR shares surged today as broad market optimism lifted industrial stocks, and following analyst upgrades despite recent mixed earnings and revenue results.',
        chartData: generateMockChartData(97, 103, 20)
      },
      {
        id: 'CTSH',
        symbol: 'CTSH',
        name: 'Cognizant Technology Solutions Corporation',
        exchange: 'NASDAQ',
        price: 75.98,
        change: 3.82,
        changePercent: 5.29,
        volume: '7.52M',
        marketCap: '37.34B',
        peRatio: '17.59',
        dividendYield: '1.63%',
        prevClose: 72.35,
        description: 'Cognizant Technology Solutions (CTSH) shares jumped significantly today after analysts at William Blair upgraded the stock, citing positive momentum, strong organic growth, and increased optimism for the company\'s AI strategy and sector demand following meetings with company leadership.',
        chartData: generateMockChartData(72, 76, 20)
      }
    ] : [
      {
        id: 'QNTUSD',
        symbol: 'QNTUSD',
        name: 'Quant USD',
        exchange: 'CRYPTO',
        price: 75.52,
        change: 4.22,
        changePercent: 5.92,
        volume: '23.99M',
        marketCap: '1.1B',
        prevClose: 71.52,
        description: 'QNTUSD rallied significantly today following a widely circulated \'buy signal\' alert on social media, which boosted investor sentiment and triggered a surge in trading activity.',
        chartData: generateMockChartData(68, 76, 30)
      },
      {
        id: 'FETUSD',
        symbol: 'FETUSD',
        name: 'Fetch.ai USD',
        exchange: 'CRYPTO',
        price: 0.27,
        change: -0.02,
        changePercent: -8.40,
        volume: '137.41M',
        marketCap: '220.69M',
        prevClose: 0.29,
        description: 'Fetch.ai experienced a significant price drop today due to whale capitulation, as large holders liquidated substantial positions on Binance amid bear market pressures and ongoing declines in user activity and protocol value within the DeFi sector.',
        chartData: generateMockChartData(0.31, 0.27, 30)
      }
    ]

    setStandouts(mockStandouts)
  }, [type])

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Standouts</h2>
        {type === 'crypto' && (
          <p className="text-xs text-muted-foreground">
            Constituent coins from the Coinbase 50 Index
          </p>
        )}
      </div>

      <div className="space-y-6">
        {standouts.map((stock) => (
          <div
            key={stock.id}
            className="neu-card p-6 rounded-xl hover:neu-raised transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg neu-inset bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">
                    {stock.symbol.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{stock.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {stock.symbol} · {stock.exchange}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold">${stock.price.toFixed(2)}</div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stock.changePercent >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="mb-4">
              <div className="relative h-32 w-full">
                <IntradayChart data={stock.chartData} isPositive={stock.changePercent >= 0} prevClose={stock.prevClose} currentPrice={stock.price} />
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Volume</p>
                <p className="text-sm font-medium">{stock.volume}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
                <p className="text-sm font-medium">{stock.marketCap}</p>
              </div>
              {stock.peRatio && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">P/E Ratio</p>
                  <p className="text-sm font-medium">{stock.peRatio}</p>
                </div>
              )}
              {stock.dividendYield && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Dividend Yield</p>
                  <p className="text-sm font-medium">{stock.dividendYield}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {stock.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Simple intraday chart component
function IntradayChart({ data, isPositive, prevClose, currentPrice }: { data: { time: string; price: number }[], isPositive: boolean, prevClose: number, currentPrice: number }) {
  const maxPrice = Math.max(...data.map(d => d.price))
  const minPrice = Math.min(...data.map(d => d.price))
  const range = maxPrice - minPrice || 1

  // Calculate SVG path
  const width = 100
  const height = 100
  const points = data.map((point, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((point.price - minPrice) / range) * height
    return `${x},${y}`
  })

  const pathD = `M ${points.join(' L ')}`
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`

  // Calculate prev close line position
  const prevCloseY = height - ((prevClose - minPrice) / range) * height

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full"
      preserveAspectRatio="none"
    >
      {/* Area fill */}
      <path
        d={areaD}
        fill={isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'}
      />
      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke={isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'}
        strokeWidth="0.5"
      />
      {/* Previous close line */}
      <line
        x1="0"
        y1={prevCloseY}
        x2={width}
        y2={prevCloseY}
        stroke="currentColor"
        strokeWidth="0.3"
        strokeDasharray="2,2"
        opacity="0.3"
      />
      {/* Time labels */}
      <text x="2" y={height - 2} fontSize="3" fill="currentColor" opacity="0.5">
        6 AM
      </text>
      <text x={width / 2 - 5} y={height - 2} fontSize="3" fill="currentColor" opacity="0.5">
        12 PM
      </text>
      <text x={width - 12} y={height - 2} fontSize="3" fill="currentColor" opacity="0.5">
        3 PM
      </text>
      {/* Prev close label */}
      <text x={width - 35} y={prevCloseY - 2} fontSize="3" fill="currentColor" opacity="0.5">
        Prev close: ${prevClose.toFixed(2)}
      </text>
    </svg>
  )
}

// Generate mock chart data
function generateMockChartData(startPrice: number, endPrice: number, points: number) {
  const data = []
  const times = ['6 AM', '9 AM', '12 PM', '3 PM']

  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1)
    const volatility = Math.sin(i * 0.5) * 2 + Math.random() * 1.5
    const price = startPrice + (endPrice - startPrice) * progress + volatility
    const timeIndex = Math.floor(progress * (times.length - 1))

    data.push({
      time: times[timeIndex] || '3 PM',
      price: Math.max(0, price)
    })
  }

  return data
}
