'use client'

import { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import Link from 'next/link'
import { CompanyLogo } from './CompanyLogo'
import DecryptedText from '@/components/DecryptedText'

interface EarningsCall {
  name: string
  ticker: string
  time: string
  quarter: string
  date: Date
}

interface WeekDay {
  day: string
  date: string
  calls: number
  fullDate: Date
  active: boolean
}

// Mock earnings data
const generateMockEarnings = (date: Date): EarningsCall[] => {
  const dayOfWeek = date.getDay()
  if (dayOfWeek === 0 || dayOfWeek === 6) return [] // No earnings on weekends

  const companies = [
    { name: 'Apple Inc.', ticker: 'AAPL', quarter: 'Q4 2025' },
    { name: 'Microsoft Corporation', ticker: 'MSFT', quarter: 'Q4 2025' },
    { name: 'Amazon.com Inc.', ticker: 'AMZN', quarter: 'Q4 2025' },
    { name: 'Alphabet Inc.', ticker: 'GOOGL', quarter: 'Q4 2025' },
    { name: 'Meta Platforms', ticker: 'META', quarter: 'Q4 2025' },
    { name: 'Tesla Inc.', ticker: 'TSLA', quarter: 'Q4 2025' },
    { name: 'NVIDIA Corporation', ticker: 'NVDA', quarter: 'Q4 2025' },
  ]

  const times = ['8:00 AM', '9:00 AM', '10:00 AM', '4:00 PM', '5:00 PM']
  
  return companies.slice(0, Math.floor(Math.random() * 5) + 3).map((company, idx) => ({
    ...company,
    time: times[idx % times.length],
    date: new Date(date)
  }))
}

export function EarningsCalendar() {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0)
  const [weekDays, setWeekDays] = useState<WeekDay[]>([])
  const [earningsCalls, setEarningsCalls] = useState<EarningsCall[]>([])
  const [selectedDay, setSelectedDay] = useState<Date>(new Date())
  const [loading, setLoading] = useState(false)

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

        // Generate mock earnings count for weekdays
        const dayOfWeek = currentDate.getDay()
        const calls = (dayOfWeek === 0 || dayOfWeek === 6) ? 0 : Math.floor(Math.random() * 50) + 20

        days.push({
          day: dayNames[i],
          date: `${months[currentDate.getMonth()]} ${currentDate.getDate()}`,
          calls,
          fullDate: currentDate,
          active: isSelected
        })
      }

      setWeekDays(days)
    }

    generateWeekDays()
  }, [currentWeekOffset, selectedDay])

  // Fetch earnings for selected day
  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true)
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const mockEarnings = generateMockEarnings(selectedDay)
        setEarningsCalls(mockEarnings)
      } catch (error) {
        console.error('Error fetching earnings:', error)
        setEarningsCalls([])
      } finally {
        setLoading(false)
      }
    }

      fetchEarnings()
  }, [selectedDay])

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

  const selectedDayCalls = useMemo(() => {
    return earningsCalls.filter(call => 
      call.date.toDateString() === selectedDay.toDateString()
    )
  }, [earningsCalls, selectedDay])

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">
          <DecryptedText text="Earnings Calendar" animateOn="view" speed={30} />
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousWeek}
            className="bg-white/20 backdrop-blur-sm border border-[#e6ebf3] hover:bg-white/30 p-2 rounded-lg hover:bg-white/30 backdrop-blur-md border border-[#e6ebf3] transition-all"
            aria-label="Previous week"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={handleToday}
            className="bg-white/20 backdrop-blur-sm border border-[#e6ebf3] hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 backdrop-blur-md border border-[#e6ebf3] transition-all"
          >
            Today
          </button>
          <button
            onClick={handleNextWeek}
            className="bg-white/20 backdrop-blur-sm border border-[#e6ebf3] hover:bg-white/30 p-2 rounded-lg hover:bg-white/30 backdrop-blur-md border border-[#e6ebf3] transition-all"
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
            key={`${day.date}-${day.day}`}
            onClick={() => handleDayClick(day)}
            className={`p-4 rounded-xl text-center transition-all ${
              day.active
                ? 'bg-white/30 backdrop-blur-md border border-[#e6ebf3] border-2 border-primary'
                : 'bg-white/30 backdrop-blur-md border border-[#e6ebf3] hover:bg-white/40'
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
                day.active ? 'text-primary' : day.calls === 0 ? 'text-muted-foreground' : 'text-foreground'
              }`}
            >
              {day.calls === 0 ? 'No Calls' : `${day.calls} Calls`}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Day Earnings Calls */}
      {selectedDayCalls.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="size-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Earnings Calls for {selectedDay.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
          </div>
      <div className="space-y-2">
            {selectedDayCalls.map((call, index) => (
            <Link
                key={`${call.ticker}-${index}`}
              href={`/search?q=${encodeURIComponent(call.ticker)}+earnings`}
                className="flex items-center justify-between p-4 rounded-xl bg-white/30 backdrop-blur-md border border-[#e6ebf3] hover:bg-white/40 transition-all group"
            >
              <div className="flex items-center gap-4">
                <CompanyLogo ticker={call.ticker} companyName={call.name} size={48} />
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
                  <div className="text-xs text-muted-foreground">{call.time}</div>
              </div>
            </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && selectedDayCalls.length === 0 && (
        <div className="bg-white/30 backdrop-blur-md border border-[#e6ebf3] rounded-xl p-8 text-center">
          <Calendar className="size-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">
            No earnings calls scheduled for {selectedDay.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/30 backdrop-blur-md border border-[#e6ebf3] h-16 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </div>
          ))}
      </div>
      )}
    </div>
  )
}
