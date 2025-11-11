'use client'

import { useEffect, useRef, useState } from 'react'

interface MarketProgressionChartProps {
  title: string
  data?: Array<{ time: string; value: number }>
  height?: number
  timeframe?: '1D' | '1W' | '1M' | '1Y'
  onTimeframeChange?: (timeframe: '1D' | '1W' | '1M' | '1Y') => void
}

export function MarketProgressionChart({
  title,
  data,
  height = 300,
  timeframe = '1D',
  onTimeframeChange
}: MarketProgressionChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; value: number; time: string } | null>(null)

  // Generate sample data if none provided
  const chartData = data || generateSampleData(timeframe)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || chartData.length < 2) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = height * 2
    ctx.scale(2, 2)

    const width = rect.width
    const padding = { top: 20, right: 20, bottom: 40, left: 50 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Calculate min and max
    const values = chartData.map(d => d.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1

    // Determine if positive trend
    const firstValue = values[0]
    const lastValue = values[values.length - 1]
    const isPositive = lastValue >= firstValue

    // Draw grid lines
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.stroke()

      // Y-axis labels
      const value = max - (range / 5) * i
      ctx.fillStyle = 'rgb(148, 163, 184)'
      ctx.font = '11px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(value.toFixed(2), padding.left - 10, y + 4)
    }

    // Calculate points
    const stepX = chartWidth / (chartData.length - 1)
    const points = chartData.map((item, index) => ({
      x: padding.left + index * stepX,
      y: padding.top + chartHeight - ((item.value - min) / range) * chartHeight,
      value: item.value,
      time: item.time
    }))

    // Draw area gradient
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight)
    if (isPositive) {
      gradient.addColorStop(0, 'rgba(34, 197, 94, 0.2)')
      gradient.addColorStop(1, 'rgba(34, 197, 94, 0)')
    } else {
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)')
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0)')
    }

    ctx.beginPath()
    ctx.moveTo(points[0].x, padding.top + chartHeight)
    points.forEach(point => {
      ctx.lineTo(point.x, point.y)
    })
    ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw line
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    points.forEach(point => {
      ctx.lineTo(point.x, point.y)
    })
    ctx.strokeStyle = isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw X-axis labels (show subset)
    const labelCount = 6
    const labelStep = Math.floor(chartData.length / labelCount)
    ctx.fillStyle = 'rgb(148, 163, 184)'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'
    for (let i = 0; i < chartData.length; i += labelStep) {
      const point = points[i]
      ctx.fillText(chartData[i].time, point.x, padding.top + chartHeight + 20)
    }
  }, [chartData, height])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const padding = { left: 50, right: 20 }
    const chartWidth = rect.width - padding.left - padding.right

    if (x < padding.left || x > rect.width - padding.right) {
      setHoveredPoint(null)
      return
    }

    const index = Math.round(((x - padding.left) / chartWidth) * (chartData.length - 1))
    if (index >= 0 && index < chartData.length) {
      const values = chartData.map(d => d.value)
      const min = Math.min(...values)
      const max = Math.max(...values)
      const range = max - min || 1
      const chartHeight = height - 60
      const y = 20 + chartHeight - ((chartData[index].value - min) / range) * chartHeight

      setHoveredPoint({
        x,
        y,
        value: chartData[index].value,
        time: chartData[index].time
      })
    }
  }

  const handleMouseLeave = () => {
    setHoveredPoint(null)
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange?.(tf)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                timeframe === tf
                  ? 'bg-background text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="relative rounded-xl border border-border bg-card p-4">
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair"
          style={{ height: `${height}px` }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {hoveredPoint && (
          <div
            className="absolute bg-background border border-border rounded-lg px-3 py-2 shadow-lg pointer-events-none"
            style={{
              left: `${hoveredPoint.x}px`,
              top: `${hoveredPoint.y - 50}px`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="text-xs font-semibold text-foreground">{hoveredPoint.value.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">{hoveredPoint.time}</div>
          </div>
        )}
      </div>
    </div>
  )
}

function generateSampleData(timeframe: '1D' | '1W' | '1M' | '1Y'): Array<{ time: string; value: number }> {
  const now = new Date()
  let points = 50
  let baseValue = 100
  let volatility = 2

  switch (timeframe) {
    case '1D':
      points = 24
      break
    case '1W':
      points = 7 * 4 // 4 points per day
      break
    case '1M':
      points = 30
      break
    case '1Y':
      points = 52 // weeks
      volatility = 5
      break
  }

  const data: Array<{ time: string; value: number }> = []
  let currentValue = baseValue

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.45) * volatility
    currentValue += change

    let timeLabel = ''
    const date = new Date(now)

    switch (timeframe) {
      case '1D':
        date.setHours(now.getHours() - (points - i - 1))
        timeLabel = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
        break
      case '1W':
        date.setHours(now.getHours() - (points - i - 1) * 6)
        timeLabel = date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric' })
        break
      case '1M':
        date.setDate(now.getDate() - (points - i - 1))
        timeLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        break
      case '1Y':
        date.setDate(now.getDate() - (points - i - 1) * 7)
        timeLabel = date.toLocaleDateString('en-US', { month: 'short' })
        break
    }

    data.push({
      time: timeLabel,
      value: currentValue
    })
  }

  return data
}
