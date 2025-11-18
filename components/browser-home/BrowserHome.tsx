'use client'

import { useEffect, useState } from 'react'
import { getBrowserHomeData, BrowserHomeData } from '@/lib/storage/browser-home'
import { QuickSearch } from './QuickSearch'
import { SpeedDial } from './SpeedDial'
import { SettingsPanel } from './SettingsPanel'
import { Clock } from '@/components/widgets/Clock'
import { Weather } from '@/components/widgets/Weather'
import { Todo } from '@/components/widgets/Todo'

export function BrowserHome() {
  const [data, setData] = useState<BrowserHomeData | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [])

  const loadData = () => {
    setData(getBrowserHomeData())
  }

  if (!mounted || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    )
  }

  const { shortcuts, todos, settings } = data

  // Dynamic background styling
  const getBackgroundStyle = () => {
    if (settings.backgroundType === 'image') {
      return {
        backgroundImage: `url(${settings.backgroundValue})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    } else if (settings.backgroundType === 'gradient') {
      return {
        background: settings.backgroundValue,
      }
    } else {
      return {
        backgroundColor: settings.backgroundValue,
      }
    }
  }

  return (
    <div
      className="min-h-screen w-full overflow-auto"
      style={getBackgroundStyle()}
    >
      {/* Settings Button */}
      <SettingsPanel settings={settings} onUpdate={loadData} />

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section with Search */}
        <div className="pt-20 pb-12 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold text-white drop-shadow-lg">
              Welcome Back
            </h1>
            <p className="text-xl text-white/90 drop-shadow-md">
              Your AI-Powered Browser Home
            </p>
          </div>
          <QuickSearch />
        </div>

        {/* Speed Dial Section */}
        {settings.showSpeedDial && (
          <section>
            <SpeedDial shortcuts={shortcuts} onUpdate={loadData} />
          </section>
        )}

        {/* Widgets Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settings.showClock && (
            <Clock format={settings.clockFormat} />
          )}
          {settings.showWeather && (
            <Weather location={settings.weatherLocation} />
          )}
          {settings.showTodo && (
            <Todo todos={todos} onUpdate={loadData} />
          )}
        </section>

        {/* Footer */}
        <footer className="text-center py-8 text-white/70 text-sm">
          <p>Powered by Forkyy AI • Your Intelligent Browser Experience</p>
        </footer>
      </div>
    </div>
  )
}
