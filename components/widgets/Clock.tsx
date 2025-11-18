'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Clock as ClockIcon } from 'lucide-react'

interface ClockProps {
  format?: '12' | '24'
}

export function Clock({ format = '12' }: ClockProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()

    if (format === '24') {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Card className="p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <ClockIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Clock</h3>
      </div>
      <div className="text-center space-y-2">
        <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 font-mono">
          {formatTime(time)}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(time)}
        </div>
      </div>
    </Card>
  )
}
