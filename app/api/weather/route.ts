import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city') || 'London'
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY

    // If no API key, return fallback data
    if (!apiKey) {
      console.warn('OPENWEATHER_API_KEY not configured. Using fallback weather data.')
      return NextResponse.json({
        success: false,
        fallback: true,
        data: getFallbackWeather()
      })
    }

    // Build API URL based on parameters
    let apiUrl: string
    if (lat && lon) {
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    } else {
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    }

    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Process current weather
    const current = data.list[0]
    const currentWeather = {
      temp: Math.round(current.main.temp),
      condition: current.weather[0].main,
      description: current.weather[0].description,
      icon: current.weather[0].icon
    }

    // Process 5-day forecast (get one forecast per day at noon)
    const forecast = []
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const processedDates = new Set()

    for (const item of data.list) {
      const date = new Date(item.dt * 1000)
      const dateString = date.toDateString()

      // Skip if we already have this date
      if (processedDates.has(dateString)) continue

      // Only take midday forecasts (around 12:00)
      const hour = date.getHours()
      if (hour < 11 || hour > 13) continue

      forecast.push({
        day: days[date.getDay()],
        icon: mapWeatherIcon(item.weather[0].main),
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min)
      })

      processedDates.add(dateString)

      // Stop after 5 days
      if (forecast.length >= 5) break
    }

    // If we don't have enough forecasts, fill with processed data
    while (forecast.length < 5) {
      const item = data.list[forecast.length * 8] // Roughly one per day
      if (!item) break

      const date = new Date(item.dt * 1000)
      forecast.push({
        day: days[date.getDay()],
        icon: mapWeatherIcon(item.weather[0].main),
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min)
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        current: currentWeather,
        forecast: forecast.slice(0, 5),
        city: data.city.name,
        country: data.city.country
      }
    })

  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true,
      data: getFallbackWeather()
    })
  }
}

function mapWeatherIcon(condition: string): 'sun' | 'rain' | 'cloud' | 'wind' | 'snow' {
  const lowerCondition = condition.toLowerCase()

  if (lowerCondition.includes('clear') || lowerCondition.includes('sun')) return 'sun'
  if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) return 'rain'
  if (lowerCondition.includes('snow')) return 'snow'
  if (lowerCondition.includes('wind')) return 'wind'
  if (lowerCondition.includes('cloud')) return 'cloud'

  return 'cloud'
}

function getFallbackWeather() {
  return {
    current: {
      temp: 29,
      condition: 'Cloudy',
      description: 'partly cloudy',
      icon: '02d'
    },
    forecast: [
      { day: 'Mon', icon: 'sun', high: 30, low: 20 },
      { day: 'Tue', icon: 'rain', high: 28, low: 19 },
      { day: 'Wed', icon: 'cloud', high: 26, low: 18 },
      { day: 'Thu', icon: 'sun', high: 31, low: 21 },
      { day: 'Fri', icon: 'wind', high: 27, low: 19 }
    ],
    city: 'London',
    country: 'GB'
  }
}
