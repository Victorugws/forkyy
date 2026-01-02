'use client'

import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3 } from 'lucide-react'
import { ExpandableComponent } from './ExpandableComponent'

interface MarketStat {
  label: string
  value: string
  change: string
  isPositive: boolean
  icon: React.ReactNode
}

const mockStats: MarketStat[] = [
  {
    label: 'S&P 500',
    value: '4,567.89',
    change: '+1.23%',
    isPositive: true,
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: 'Dow Jones',
    value: '34,567.12',
    change: '+0.89%',
    isPositive: true,
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    label: 'NASDAQ',
    value: '14,234.56',
    change: '+1.45%',
    isPositive: true,
    icon: <Activity className="w-5 h-5" />,
  },
  {
    label: 'VIX',
    value: '18.45',
    change: '-2.34%',
    isPositive: false,
    icon: <DollarSign className="w-5 h-5" />,
  },
]

interface MarketOverviewProps {
  onExpand?: (query: string) => void
}

export function MarketOverview({ onExpand }: MarketOverviewProps) {
  const componentData = {
    stats: mockStats,
    timestamp: new Date().toISOString()
  }

  return (
    <ExpandableComponent
      id="market-overview"
      title="Market Overview"
      type="market-overview"
      data={componentData}
      className="mb-6"
      onExpand={onExpand}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {mockStats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white/30 backdrop-blur-md border border-[#e6ebf3] p-6 rounded-2xl hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-background/50 text-foreground">
              {stat.icon}
            </div>
            <div className={`text-sm font-semibold flex items-center gap-1 ${
              stat.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {stat.change}
            </div>
          </div>
          <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
          <div className="text-2xl font-bold text-foreground">{stat.value}</div>
        </div>
      ))}
    </div>
    </ExpandableComponent>
  )
}

