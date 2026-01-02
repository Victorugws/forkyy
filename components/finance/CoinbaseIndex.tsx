'use client'

import { useState } from 'react'
import { TrendingUp } from 'lucide-react'
import DecryptedText from '@/components/DecryptedText'

type Timeframe = '$' | '%' | '1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | '5Y' | 'MAX'

export function CoinbaseIndex() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1D')
  const [change, setChange] = useState('+$0.75')
  const [changePercent, setChangePercent] = useState('+0.21%')

  const timeframes: Timeframe[] = ['$', '%', '1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'MAX']

  // Generate mock chart data
  const generateChartData = () => {
    const points = 50
    const baseValue = 352
    const data = []

    for (let i = 0; i < points; i++) {
      const progress = i / points
      const volatility = Math.sin(i * 0.3) * 1.5 + Math.cos(i * 0.15) * 1
      const value = baseValue + volatility + progress * 2
      data.push({
        time: `${6 + Math.floor(progress * 12)}:00 ${progress < 0.5 ? 'AM' : 'PM'}`,
        value
      })
    }

    return data
  }

  const chartData = generateChartData()

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">
            <DecryptedText text="Coinbase 50 Index" animateOn="view" speed={30} />
          </h2>
          <a
            href="#"
            className="text-xs text-primary hover:underline"
          >
            Learn more about the Coinbase 50 Index
          </a>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Change</div>
            <div className="flex items-center gap-1 text-sm font-medium text-green-500">
              <TrendingUp className="size-3" />
              {change}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">%</div>
            <div className="text-sm font-medium text-green-500">
              {changePercent}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/30 backdrop-blur-md border border-[#e6ebf3] p-6 rounded-xl">
        {/* Timeframe buttons */}
        <div className="flex items-center gap-1 mb-6 flex-wrap">
          {timeframes.map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                selectedTimeframe === tf
                  ? 'bg-white/20 backdrop-blur-sm border border-[#e6ebf3] text-primary'
                  : 'bg-white/20 backdrop-blur-sm border border-[#e6ebf3] hover:bg-white/30 hover:bg-white/20 backdrop-blur-sm border border-[#e6ebf3]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="relative h-64 w-full">
          <CoinbaseChart data={chartData} />
        </div>

        {/* Time labels */}
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>6:00 AM</span>
          <span>9:00 AM</span>
          <span>12:00 PM</span>
          <span>3:00 PM</span>
          <span>6:00 PM</span>
        </div>
      </div>
    </div>
  )
}

function CoinbaseChart({ data }: { data: { time: string; value: number }[] }) {
  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1

  const width = 100
  const height = 100

  // Calculate SVG path
  const points = data.map((point, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((point.value - minValue) / range) * height
    return `${x},${y}`
  })

  const pathD = `M ${points.join(' L ')}`

  // Calculate grid lines
  const gridLines = [0.25, 0.5, 0.75]
  const valueLabels = [
    minValue + range * 0.25,
    minValue + range * 0.5,
    minValue + range * 0.75
  ]

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full"
      preserveAspectRatio="none"
    >
      {/* Grid lines */}
      {gridLines.map((ratio, i) => {
        const y = height - ratio * height
        return (
          <g key={i}>
            <line
              x1="0"
              y1={y}
              x2={width}
              y2={y}
              stroke="currentColor"
              strokeWidth="0.1"
              opacity="0.1"
            />
            <text
              x={width - 1}
              y={y - 1}
              fontSize="2.5"
              fill="currentColor"
              opacity="0.4"
              textAnchor="end"
            >
              {valueLabels[i].toFixed(0)}
            </text>
          </g>
        )
      })}

      {/* Line chart */}
      <path
        d={pathD}
        fill="none"
        stroke="rgb(59, 130, 246)"
        strokeWidth="0.5"
      />

      {/* Data points */}
      {points.slice(0, 1).map((point, i) => {
        const [x, y] = point.split(',').map(Number)
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="0.8"
            fill="rgb(59, 130, 246)"
          />
        )
      })}
    </svg>
  )
}
