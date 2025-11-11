'use client'

import { useEffect, useRef } from 'react'

interface MiniChartProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  positive?: boolean
}

export function MiniChart({ data, width = 80, height = 30, color, positive }: MiniChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length < 2) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Calculate min and max
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    // Calculate points
    const stepX = width / (data.length - 1)
    const points = data.map((value, index) => ({
      x: index * stepX,
      y: height - ((value - min) / range) * height
    }))

    // Determine color
    const strokeColor = color || (positive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)')
    const fillColor = color || (positive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)')

    // Draw area
    ctx.beginPath()
    ctx.moveTo(points[0].x, height)
    points.forEach(point => {
      ctx.lineTo(point.x, point.y)
    })
    ctx.lineTo(points[points.length - 1].x, height)
    ctx.closePath()
    ctx.fillStyle = fillColor
    ctx.fill()

    // Draw line
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    points.forEach(point => {
      ctx.lineTo(point.x, point.y)
    })
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = 1.5
    ctx.stroke()
  }, [data, width, height, color, positive])

  return <canvas ref={canvasRef} className="inline-block" />
}
