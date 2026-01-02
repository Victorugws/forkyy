'use client'

import { TrendingUp } from 'lucide-react'

interface Sector {
  name: string
  value: string
  change: string
  isPositive: boolean
}

const mockSectors: Sector[] = [
  { name: 'Technology', value: '$273.20', change: '0.39%', isPositive: true },
  { name: 'Energy', value: '$89.42', change: '0.64%', isPositive: true },
  { name: 'Discretionary', value: '$225.50', change: '1.96%', isPositive: true },
  { name: 'Staples', value: '$77.90', change: '1.09%', isPositive: true },
  { name: 'Communications', value: '$111.90', change: '1.76%', isPositive: true },
  { name: 'Industrials', value: '$149.63', change: '1.22%', isPositive: true },
  { name: 'Financials', value: '$51.67', change: '1.10%', isPositive: true },
  { name: 'Utilities', value: '$88.15', change: '0.15%', isPositive: true },
  { name: 'Materials', value: '$86.35', change: '2.24%', isPositive: true },
  { name: 'Real Estate', value: '$40.90', change: '1.31%', isPositive: true },
  { name: 'Healthcare', value: '$154.61', change: '2.11%', isPositive: true },
]

export function EquitySectors() {
  return (
    <div className="rounded-2xl bg-white/30 backdrop-blur-md border border-[#e6ebf3] p-4 mb-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Equity Sectors</h3>
      <div className="space-y-2">
        {mockSectors.map((sector) => (
          <div
            key={sector.name}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <span className="text-xs text-foreground">{sector.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-foreground">{sector.value}</span>
              <div className={`flex items-center gap-0.5 text-xs ${
                sector.isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                <TrendingUp className="size-3" />
                <span>{sector.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

