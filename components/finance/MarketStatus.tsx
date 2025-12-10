'use client'

import { Clock, TrendingUp, TrendingDown } from 'lucide-react'
import { useState, useEffect } from 'react'

interface MarketStatusProps {
  compact?: boolean
}

export function MarketStatus({ compact = false }: MarketStatusProps) {
  const [marketStatus, setMarketStatus] = useState<'open' | 'closed' | 'pre-market' | 'after-hours'>('open')
  const [timeUntil, setTimeUntil] = useState<string>('')

  useEffect(() => {
    const updateMarketStatus = () => {
      const now = new Date()
      const day = now.getDay() // 0 = Sunday, 6 = Saturday
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const currentTime = hours * 60 + minutes

      // Market hours: 9:30 AM - 4:00 PM ET (14:30 - 21:00 UTC, simplified)
      const marketOpen = 9 * 60 + 30 // 9:30 AM
      const marketClose = 16 * 60 // 4:00 PM
      const preMarketEnd = 9 * 60 + 30 // 9:30 AM
      const afterHoursStart = 16 * 60 // 4:00 PM

      // Check if weekend
      if (day === 0 || day === 6) {
        setMarketStatus('closed')
        const nextMonday = new Date(now)
        nextMonday.setDate(now.getDate() + ((1 + 7 - day) % 7))
        nextMonday.setHours(9, 30, 0, 0)
        const diff = nextMonday.getTime() - now.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeUntil(`${hours}h ${mins}m`)
        return
      }

      if (currentTime < marketOpen) {
        setMarketStatus('pre-market')
        const diff = marketOpen - currentTime
        const hours = Math.floor(diff / 60)
        const mins = diff % 60
        setTimeUntil(`${hours}h ${mins}m`)
      } else if (currentTime >= marketOpen && currentTime < marketClose) {
        setMarketStatus('open')
        const diff = marketClose - currentTime
        const hours = Math.floor(diff / 60)
        const mins = diff % 60
        setTimeUntil(`${hours}h ${mins}m`)
      } else if (currentTime >= marketClose && currentTime < 20 * 60) {
        setMarketStatus('after-hours')
        setTimeUntil('Closes 8:00 PM')
      } else {
        setMarketStatus('closed')
        const nextDay = new Date(now)
        nextDay.setDate(now.getDate() + 1)
        nextDay.setHours(9, 30, 0, 0)
        const diff = nextDay.getTime() - now.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeUntil(`${hours}h ${mins}m`)
      }
    }

    updateMarketStatus()
    const interval = setInterval(updateMarketStatus, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (marketStatus) {
      case 'open':
        return 'text-green-500'
      case 'closed':
        return 'text-muted-foreground'
      case 'pre-market':
      case 'after-hours':
        return 'text-amber-500'
      default:
        return 'text-muted-foreground'
    }
  }

  const getStatusLabel = () => {
    switch (marketStatus) {
      case 'open':
        return 'Market Open'
      case 'closed':
        return 'Market Closed'
      case 'pre-market':
        return 'Pre-Market'
      case 'after-hours':
        return 'After Hours'
      default:
        return 'Unknown'
    }
  }

  if (compact) {
    return (
      <div className="rounded-2xl neu-card p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Market Status</h3>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${getStatusColor()}`}>
              {getStatusLabel()}
            </span>
            <span className="text-xs text-muted-foreground">{timeUntil}</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                marketStatus === 'open' ? 'bg-green-500' : marketStatus === 'closed' ? 'bg-muted' : 'bg-amber-500'
              }`}
              style={{
                width: marketStatus === 'open' ? '100%' : marketStatus === 'closed' ? '0%' : '50%'
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl neu-card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-foreground" />
          <h3 className="text-lg font-bold text-foreground">Market Status</h3>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className={`text-base font-semibold ${getStatusColor()}`}>
            {getStatusLabel()}
          </span>
          <span className="text-sm text-muted-foreground">{timeUntil}</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              marketStatus === 'open' ? 'bg-green-500' : marketStatus === 'closed' ? 'bg-muted' : 'bg-amber-500'
            }`}
            style={{
              width: marketStatus === 'open' ? '100%' : marketStatus === 'closed' ? '0%' : '50%'
            }}
          />
        </div>
      </div>
    </div>
  )
}
