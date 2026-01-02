'use client'

import { TrendingUp } from 'lucide-react'

interface FixedIncomeItem {
  name: string
  price: string
  change: string
  isPositive: boolean
}

const mockFixedIncome: FixedIncomeItem[] = [
  { name: 'T.I.P.S.', price: '$111.02', change: '0.23%', isPositive: true },
  { name: 'U.S. Treasuries', price: '$23.21', change: '0.17%', isPositive: true },
  { name: 'Municipals', price: '$107.16', change: '0.04%', isPositive: true },
  { name: 'Convertibles', price: '$86.73', change: '0.29%', isPositive: true },
  { name: 'High Yield', price: '$80.37', change: '0.34%', isPositive: true },
  { name: 'High Grade', price: '$110.92', change: '0.35%', isPositive: true },
]

export function FixedIncome() {
  return (
    <div className="rounded-2xl bg-white/30 backdrop-blur-md border border-[#e6ebf3] p-4 mb-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Fixed Income</h3>
      <div className="space-y-2">
        {mockFixedIncome.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <span className="text-xs text-foreground">{item.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-foreground">{item.price}</span>
              <div className={`flex items-center gap-0.5 text-xs ${
                item.isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                <TrendingUp className="size-3" />
                <span>{item.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

