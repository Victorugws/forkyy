'use client'

import { Calendar, Clock, TrendingUp, TrendingDown } from 'lucide-react'

interface EconomicEvent {
  time: string
  country: string
  event: string
  actual: string | null
  forecast: string
  previous: string
  impact: 'high' | 'medium' | 'low'
  isPositive: boolean | null
}

const mockEvents: EconomicEvent[] = [
  {
    time: '08:30',
    country: 'US',
    event: 'Non-Farm Payrolls',
    actual: '187K',
    forecast: '180K',
    previous: '165K',
    impact: 'high',
    isPositive: true,
  },
  {
    time: '10:00',
    country: 'US',
    event: 'ISM Manufacturing PMI',
    actual: '52.3',
    forecast: '51.5',
    previous: '50.2',
    impact: 'medium',
    isPositive: true,
  },
  {
    time: '14:00',
    country: 'EU',
    event: 'ECB Interest Rate Decision',
    actual: null,
    forecast: '4.25%',
    previous: '4.00%',
    impact: 'high',
    isPositive: null,
  },
  {
    time: '15:30',
    country: 'US',
    event: 'Crude Oil Inventories',
    actual: null,
    forecast: '-2.5M',
    previous: '-3.1M',
    impact: 'low',
    isPositive: null,
  },
]

function getImpactColor(impact: string) {
  switch (impact) {
    case 'high':
      return 'bg-red-500/20 text-red-600 border-red-500/30'
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30'
    case 'low':
      return 'bg-blue-500/20 text-blue-600 border-blue-500/30'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function EconomicCalendar() {
  return (
    <div className="neu-card p-6 rounded-2xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-foreground" />
          <h3 className="text-xl font-bold text-foreground">Economic Calendar</h3>
        </div>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          View Full Calendar
        </button>
      </div>

      <div className="space-y-3">
        {mockEvents.map((event, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-border hover:bg-background/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded border bg-background">
                      {event.country}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${getImpactColor(event.impact)}`}>
                      {event.impact.toUpperCase()}
                    </span>
                  </div>
                  <div className="font-semibold text-foreground">{event.event}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                {event.actual ? (
                  <>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Actual</div>
                      <div className={`font-semibold flex items-center gap-1 ${
                        event.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {event.isPositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {event.actual}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Forecast</div>
                      <div className="font-medium text-foreground">{event.forecast}</div>
                    </div>
                  </>
                ) : (
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Forecast</div>
                    <div className="font-medium text-foreground">{event.forecast}</div>
                  </div>
                )}
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Previous</div>
                  <div className="font-medium text-foreground">{event.previous}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

