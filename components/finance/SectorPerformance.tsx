'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import DecryptedText from '@/components/DecryptedText'

interface Sector {
  name: string
  change: string
  changePercent: string
  isPositive: boolean
}

const mockSectors: Sector[] = [
  { name: 'Technology', change: '+2.45%', changePercent: '+2.45%', isPositive: true },
  { name: 'Healthcare', change: '+1.23%', changePercent: '+1.23%', isPositive: true },
  { name: 'Financial Services', change: '+0.89%', changePercent: '+0.89%', isPositive: true },
  { name: 'Consumer Cyclical', change: '+0.56%', changePercent: '+0.56%', isPositive: true },
  { name: 'Communication Services', change: '+0.34%', changePercent: '+0.34%', isPositive: true },
  { name: 'Industrials', change: '-0.12%', changePercent: '-0.12%', isPositive: false },
  { name: 'Consumer Defensive', change: '-0.45%', changePercent: '-0.45%', isPositive: false },
  { name: 'Energy', change: '-0.78%', changePercent: '-0.78%', isPositive: false },
  { name: 'Utilities', change: '-1.23%', changePercent: '-1.23%', isPositive: false },
  { name: 'Real Estate', change: '-1.56%', changePercent: '-1.56%', isPositive: false },
]

export function SectorPerformance() {
  return (
    <div className="bg-white/30 backdrop-blur-md border border-[#e6ebf3] p-6 rounded-2xl mb-6">
      <h3 className="text-xl font-bold text-foreground mb-4">
        <DecryptedText text="Sector Performance" animateOn="view" speed={30} />
      </h3>
      
      <div className="space-y-3">
        {mockSectors.map((sector) => (
          <div
            key={sector.name}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-background/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-2 h-2 rounded-full ${
                sector.isPositive ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="font-medium text-foreground">{sector.name}</span>
            </div>
            
            <div className={`flex items-center gap-2 font-semibold ${
              sector.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {sector.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{sector.changePercent}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

