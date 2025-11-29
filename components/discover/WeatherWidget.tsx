'use client'

import { useState, useEffect } from 'react'
import { Cloud, CloudRain, Sun, Wind, CloudSnow } from 'lucide-react'

interface DayForecast {
  day: string
  icon: 'sun' | 'rain' | 'cloud' | 'wind' | 'snow'
  high: number
  low?: number
}

interface WeatherData {
  current: {
    temp: number
    condition: string
    description: string
  }
  forecast: DayForecast[]
  city: string
  country: string
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWeather()
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchWeather = async () => {
    try {
      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
            const data = await response.json()

            if (data.success || data.fallback) {
              setWeather(data.data)
            }
            setLoading(false)
          },
          async () => {
            // Fallback to default city if geolocation fails
            const response = await fetch('/api/weather?city=London')
            const data = await response.json()

            if (data.success || data.fallback) {
              setWeather(data.data)
            }
            setLoading(false)
          }
        )
      } else {
        // Geolocation not supported, use default city
        const response = await fetch('/api/weather?city=London')
        const data = await response.json()

        if (data.success || data.fallback) {
          setWeather(data.data)
        }
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching weather:', error)
      setLoading(false)
    }
  }

  const getWeatherIcon = (icon: string) => {
    const iconClass = 'size-5'
    switch (icon) {
      case 'sun':
        return <Sun className={iconClass + ' text-yellow-500'} />
      case 'rain':
        return <CloudRain className={iconClass + ' text-blue-500'} />
      case 'cloud':
        return <Cloud className={iconClass + ' text-gray-500'} />
      case 'wind':
        return <Wind className={iconClass + ' text-cyan-500'} />
      case 'snow':
        return <CloudSnow className={iconClass + ' text-blue-300'} />
      default:
        return <Cloud className={iconClass} />
    }
  }

  if (loading || !weather) {
    return (
      <div className="neu-card p-5 rounded-xl mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <div className="h-10 w-20 bg-muted/30 animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted/30 animate-pulse rounded" />
          </div>
          <div className="h-14 w-14 bg-muted/30 animate-pulse rounded-full" />
        </div>
        <div className="flex justify-between pt-4 border-t border-border">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 w-12 bg-muted/30 animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="neu-card p-5 rounded-xl mb-4">
      {/* Current Weather */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-3xl font-bold">{weather.current.temp}°</div>
          <div className="text-xs text-muted-foreground">{weather.current.condition}</div>
        </div>
        <div className="p-3 rounded-full neu-inset bg-background/50">
          {getWeatherIcon(mapWeatherConditionToIcon(weather.current.condition))}
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="flex justify-between pt-4 border-t border-border">
        {weather.forecast.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
            {getWeatherIcon(day.icon)}
            <span className="text-xs font-semibold">{day.high}°</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function mapWeatherConditionToIcon(condition: string): 'sun' | 'rain' | 'cloud' | 'wind' | 'snow' {
  const lowerCondition = condition.toLowerCase()

  if (lowerCondition.includes('clear') || lowerCondition.includes('sun')) return 'sun'
  if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) return 'rain'
  if (lowerCondition.includes('snow')) return 'snow'
  if (lowerCondition.includes('wind')) return 'wind'
  if (lowerCondition.includes('cloud')) return 'cloud'

  return 'cloud'
}
