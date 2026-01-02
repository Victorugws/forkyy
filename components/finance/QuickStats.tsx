'use client'

import { BarChart3, DollarSign, TrendingUp, Activity } from 'lucide-react'

interface QuickStatsProps {
  compact?: boolean
}

const mockStats = {
  vix: { value: '18.5', change: '-2.3%', positive: true },
  dxy: { value: '104.2', change: '+0.5%', positive: false },
  gold: { value: '$2,045', change: '+1.2%', positive: true },
  oil: { value: '$78.5', change: '-0.8%', positive: false }
}

export function QuickStats({ compact = false }: QuickStatsProps) {
  if (compact) {
    return (
      <div className="rounded-2xl bg-white/30 backdrop-blur-md border border-[#e6ebf3] p-4">
        <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Quick Stats</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-background/50">
            <div className="text-xs text-muted-foreground mb-0.5">VIX</div>
            <div className="text-xs font-semibold text-foreground">{mockStats.vix.value}</div>
            <div className={`text-xs ${mockStats.vix.positive ? 'text-green-500' : 'text-red-500'}`}>
              {mockStats.vix.change}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-background/50">
            <div className="text-xs text-muted-foreground mb-0.5">DXY</div>
            <div className="text-xs font-semibold text-foreground">{mockStats.dxy.value}</div>
            <div className={`text-xs ${mockStats.dxy.positive ? 'text-green-500' : 'text-red-500'}`}>
              {mockStats.dxy.change}
            </div>
                </div>
          <div className="p-2 rounded-lg bg-background/50">
            <div className="text-xs text-muted-foreground mb-0.5">Gold</div>
            <div className="text-xs font-semibold text-foreground">{mockStats.gold.value}</div>
            <div className={`text-xs ${mockStats.gold.positive ? 'text-green-500' : 'text-red-500'}`}>
              {mockStats.gold.change}
                  </div>
          </div>
          <div className="p-2 rounded-lg bg-background/50">
            <div className="text-xs text-muted-foreground mb-0.5">Oil</div>
            <div className="text-xs font-semibold text-foreground">{mockStats.oil.value}</div>
            <div className={`text-xs ${mockStats.oil.positive ? 'text-green-500' : 'text-red-500'}`}>
              {mockStats.oil.change}
                </div>
              </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white/30 backdrop-blur-md border border-[#e6ebf3] p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-foreground" />
          <h3 className="text-lg font-bold text-foreground">Quick Stats</h3>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-background/50">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">VIX</div>
          </div>
          <div className="text-lg font-semibold text-foreground">{mockStats.vix.value}</div>
          <div className={`text-sm ${mockStats.vix.positive ? 'text-green-500' : 'text-red-500'}`}>
            {mockStats.vix.change}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-background/50">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">DXY</div>
          </div>
          <div className="text-lg font-semibold text-foreground">{mockStats.dxy.value}</div>
          <div className={`text-sm ${mockStats.dxy.positive ? 'text-green-500' : 'text-red-500'}`}>
            {mockStats.dxy.change}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-background/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">Gold</div>
          </div>
          <div className="text-lg font-semibold text-foreground">{mockStats.gold.value}</div>
          <div className={`text-sm ${mockStats.gold.positive ? 'text-green-500' : 'text-red-500'}`}>
            {mockStats.gold.change}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-background/50">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">Oil</div>
          </div>
          <div className="text-lg font-semibold text-foreground">{mockStats.oil.value}</div>
          <div className={`text-sm ${mockStats.oil.positive ? 'text-green-500' : 'text-red-500'}`}>
            {mockStats.oil.change}
              </div>
            </div>
      </div>
    </div>
  )
}
