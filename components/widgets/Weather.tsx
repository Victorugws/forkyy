'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react'

interface WeatherProps {
  location?: string
}

interface WeatherData {
  temp: number
  condition: string
  humidity: number
  windSpeed: number
}

export function Weather({ location = 'New York' }: WeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulated weather data - in production, you'd fetch from a weather API
    // like OpenWeatherMap, WeatherAPI, etc.
    const fetchWeather = async () => {
      setLoading(true)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock data
      setWeather({
        temp: 72,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 8,
      })
      setLoading(false)
    }

    fetchWeather()
  }, [location])

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes('rain')) return <CloudRain className="h-12 w-12" />
    if (lowerCondition.includes('cloud')) return <Cloud className="h-12 w-12" />
    return <Sun className="h-12 w-12" />
  }

  return (
    <Card className="p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <Cloud className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Weather</h3>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
        </div>
      ) : weather ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {weather.temp}°F
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {location}
              </div>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {getWeatherIcon(weather.condition)}
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {weather.condition}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4" />
              <span className="text-sm">{weather.windSpeed} mph</span>
            </div>
            <div className="text-sm">
              Humidity: {weather.humidity}%
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600 dark:text-gray-400">
          Unable to load weather data
        </div>
      )}
    </Card>
  )
}
