'use client'

interface Company {
  id: string
  name: string
  symbol: string
  price: string
  change: number
  logo?: string
}

export function TrendingCompanies() {
  // Mock data - in production, fetch from API
  const companies: Company[] = [
    {
      id: 'f',
      name: 'Ford Motor Company',
      symbol: 'F',
      price: '$2.83',
      change: -14.93
    },
    {
      id: 'wbs',
      name: 'Webster Holdings Corporate...',
      symbol: 'WBS',
      price: '$71.59',
      change: -11.68
    },
    {
      id: 'nvda',
      name: 'NVIDIA Corporation',
      symbol: 'NVDA',
      price: '$178.88',
      change: -0.97
    },
    {
      id: 'intc',
      name: 'Intuit Inc.',
      symbol: 'INTC',
      price: '$685.81',
      change: -4.03
    },
    {
      id: 'rost',
      name: 'Ross Stores, Inc.',
      symbol: 'ROST',
      price: '$174.00',
      change: +8.41
    }
  ]

  return (
    <div className="neu-card p-5 rounded-xl mb-4">
      <h3 className="text-sm font-semibold mb-4">Trending Companies</h3>

      <div className="space-y-3">
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex items-center gap-3 hover:bg-muted/30 p-2 rounded-lg transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg neu-inset bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">
                {company.symbol.slice(0, 2)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{company.name}</div>
              <div className="text-xs text-muted-foreground">{company.symbol}</div>
            </div>

            <div className="text-right">
              <div className="text-xs font-medium">{company.price}</div>
              <div className={`text-xs font-semibold ${
                company.change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {company.change >= 0 ? '+' : ''}{company.change}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
