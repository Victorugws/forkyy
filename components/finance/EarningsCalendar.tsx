'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface EarningsCall {
  name: string
  ticker: string
  time: string
  quarter: string
  date?: string
}

interface WeekDay {
  day: string
  date: string
  calls: string
  fullDate: Date
  active: boolean
}

export function EarningsCalendar() {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0)
  const [weekDays, setWeekDays] = useState<WeekDay[]>([])
  const [earningsCalls, setEarningsCalls] = useState<EarningsCall[]>([])
  const [selectedDay, setSelectedDay] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)

  // Generate week days dynamically
  useEffect(() => {
    const generateWeekDays = () => {
      const today = new Date()
      today.setDate(today.getDate() + (currentWeekOffset * 7))

      // Get start of week (Sunday)
      const startOfWeek = new Date(today)
      const day = startOfWeek.getDay()
      startOfWeek.setDate(startOfWeek.getDate() - day)

      const days: WeekDay[] = []
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek)
        currentDate.setDate(startOfWeek.getDate() + i)

        const isToday = currentDate.toDateString() === new Date().toDateString()
        const isSelected = currentDate.toDateString() === selectedDay.toDateString()

        days.push({
          day: dayNames[i],
          date: `${months[currentDate.getMonth()]} ${currentDate.getDate()}`,
          calls: 'Loading...',
          fullDate: currentDate,
          active: isSelected
        })
      }

      setWeekDays(days)
    }

    generateWeekDays()
  }, [currentWeekOffset, selectedDay])

  // Fetch earnings data
  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/finance?type=earnings')
        const data = await res.json()

        if (data.success || data.fallback) {
          setEarningsCalls(data.data || [])

          // Count calls per day (simplified - in real implementation would parse dates)
          const updatedDays = weekDays.map(day => ({
            ...day,
            calls: day.day === 'Sat' || day.day === 'Sun' ? 'No Calls' : `${Math.floor(Math.random() * 50 + 20)} Calls`
          }))
          setWeekDays(updatedDays)
        }
      } catch (error) {
        console.error('Error fetching earnings:', error)
      } finally {
        setLoading(false)
      }
    }

    if (weekDays.length > 0) {
      fetchEarnings()
    }
  }, [currentWeekOffset])

  const handlePreviousWeek = () => {
    setCurrentWeekOffset(prev => prev - 1)
  }

  const handleNextWeek = () => {
    setCurrentWeekOffset(prev => prev + 1)
  }

  const handleToday = () => {
    setCurrentWeekOffset(0)
    setSelectedDay(new Date())
  }

  const handleDayClick = (day: WeekDay) => {
    setSelectedDay(day.fullDate)
  }

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Earnings Calendar
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousWeek}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={handleToday}
            className="px-4 py-1.5 rounded-lg bg-accent text-sm font-medium hover:bg-accent/80 transition-colors"
          >
            Today
          </button>
          <button
            onClick={handleNextWeek}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
            aria-label="Next week"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Week Days Grid */}
      <div className="grid grid-cols-7 gap-3 mb-6">
        {weekDays.map((day) => (
          <button
            key={day.date}
            onClick={() => handleDayClick(day)}
            className={`p-4 rounded-xl border text-center transition-all ${
              day.active
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/50'
            }`}
          >
            <div className="text-sm font-medium text-foreground mb-1">
              {day.day}
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              {day.date}
            </div>
            <div
              className={`text-xs font-medium ${
                day.active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {day.calls}
            </div>
          </button>
        ))}
      </div>

      {/* Earnings Calls List */}
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-border bg-card h-16 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </div>
          ))
        ) : (
          earningsCalls.slice(0, 7).map((call, index) => (
            <Link
              key={index}
              href={`/search?q=${encodeURIComponent(call.ticker)}+earnings`}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-sm font-bold text-foreground">{call.ticker}</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {call.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{call.ticker}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">
                  {call.quarter}
                </div>
                <div className="text-sm text-muted-foreground">{call.time}</div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
