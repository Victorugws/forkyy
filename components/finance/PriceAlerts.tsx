'use client'

import { Bell, BellOff, X, TrendingUp, TrendingDown, Plus } from 'lucide-react'
import { useState } from 'react'
import { CompanyLogo } from './CompanyLogo'

interface Alert {
  id: string
  symbol: string
  name: string
  currentPrice: string
  alertType: 'above' | 'below'
  targetPrice: string
  isActive: boolean
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: '$185.50',
    alertType: 'above',
    targetPrice: '$190.00',
    isActive: true,
  },
  {
    id: '2',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    currentPrice: '$248.50',
    alertType: 'below',
    targetPrice: '$240.00',
    isActive: true,
  },
  {
    id: '3',
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    currentPrice: '$485.20',
    alertType: 'above',
    targetPrice: '$500.00',
    isActive: false,
  },
]

interface PriceAlertsProps {
  compact?: boolean
}

export function PriceAlerts({ compact = false }: PriceAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ))
  }

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id))
  }

  if (compact) {
    // Compact version for sidebar
    return (
      <div className="neu-card p-4 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-foreground" />
            <h3 className="text-base font-semibold text-foreground">Price Alerts</h3>
          </div>
          <button className="p-1.5 rounded-lg neu-button hover:neu-inset transition-all">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <BellOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No alerts set</p>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-background/50 transition-colors"
              >
                <CompanyLogo ticker={alert.symbol} companyName={alert.name} size={28} />
                
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground truncate">{alert.symbol}</div>
                  <div className="text-xs text-muted-foreground truncate">{alert.currentPrice}</div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {alert.alertType === 'above' ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <div className="text-xs font-semibold text-foreground">{alert.targetPrice}</div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`p-1 rounded transition-colors ${
                      alert.isActive
                        ? 'text-primary hover:bg-primary/10'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {alert.isActive ? (
                      <Bell className="w-3 h-3" />
                    ) : (
                      <BellOff className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Full version for main content
  return (
    <div className="neu-card p-6 rounded-2xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-foreground" />
          <h3 className="text-xl font-bold text-foreground">Price Alerts</h3>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors">
          + New Alert
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <BellOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No price alerts set</p>
          <button className="mt-4 text-sm text-primary hover:text-primary/80">
            Create your first alert
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-background/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <CompanyLogo ticker={alert.symbol} companyName={alert.name} size={40} />
                
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{alert.name}</div>
                  <div className="text-sm text-muted-foreground">{alert.symbol}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Current</div>
                  <div className="font-semibold text-foreground">{alert.currentPrice}</div>
                </div>

                <div className="flex items-center gap-2">
                  {alert.alertType === 'above' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {alert.alertType === 'above' ? 'Alert Above' : 'Alert Below'}
                    </div>
                    <div className="font-semibold text-foreground">{alert.targetPrice}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAlert(alert.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    alert.isActive
                      ? 'text-primary hover:bg-primary/10'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {alert.isActive ? (
                    <Bell className="w-4 h-4" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

