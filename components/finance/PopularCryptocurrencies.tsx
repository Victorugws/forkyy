'use client'

import Link from 'next/link'
import { CryptoLogo } from './CryptoLogo'

interface Crypto {
  name: string
  symbol: string
  price: string
  change: string
  isPositive: boolean
}

const mockCryptos: Crypto[] = [
  { name: 'Bitcoin', symbol: 'BTCUSD', price: '$84,520.74', change: '-0.65%', isPositive: false },
  { name: 'Ethereum', symbol: 'ETHUSD', price: '$2,748.46', change: '-0.58%', isPositive: false },
  { name: 'Solana', symbol: 'SOLUSD', price: '$127.41', change: '-0.87%', isPositive: false },
  { name: 'XRP', symbol: 'XRPUSD', price: '$1.93', change: '-1.01%', isPositive: false },
]

export function PopularCryptocurrencies() {
  return (
    <div className="rounded-2xl bg-white/30 backdrop-blur-md border border-[#e6ebf3] p-4 mb-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Popular Cryptocurrencies</h3>
      <div className="space-y-2">
        {mockCryptos.map((crypto) => (
          <Link
            key={crypto.symbol}
            href={`/search?q=${encodeURIComponent(crypto.name)}+cryptocurrency`}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors group"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <CryptoLogo symbol={crypto.symbol} name={crypto.name} size={24} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">
                  {crypto.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">{crypto.symbol}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-foreground">{crypto.price}</div>
              <div className={`text-xs ${crypto.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {crypto.change}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

