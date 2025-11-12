'use client'

import { useState } from 'react'
import Image from 'next/image'

interface CryptoLogoProps {
  symbol: string
  name: string
  size?: number
  className?: string
}

// Map common crypto symbols to their CoinGecko IDs
const CRYPTO_ID_MAP: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'USDT': 'tether',
  'BNB': 'binancecoin',
  'SOL': 'solana',
  'XRP': 'ripple',
  'USDC': 'usd-coin',
  'ADA': 'cardano',
  'DOGE': 'dogecoin',
  'TRX': 'tron',
  'AVAX': 'avalanche-2',
  'DOT': 'polkadot',
  'MATIC': 'matic-network',
  'LTC': 'litecoin',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'ATOM': 'cosmos',
  'XLM': 'stellar',
  'BCH': 'bitcoin-cash',
  'NEAR': 'near',
  'APT': 'aptos',
  'ARB': 'arbitrum',
  'OP': 'optimism',
  'SUI': 'sui'
}

// Generate consistent color from symbol
function getColorFromSymbol(symbol: string): string {
  const colors = [
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#F59E0B', // amber
    '#10B981', // emerald
    '#6366F1', // indigo
    '#14B8A6', // teal
    '#F97316', // orange
  ]

  let hash = 0
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

export function CryptoLogo({ symbol, name, size = 40, className = '' }: CryptoLogoProps) {
  const [imageError, setImageError] = useState(false)

  // Get CoinGecko ID for the crypto
  const cryptoId = CRYPTO_ID_MAP[symbol.toUpperCase()] || symbol.toLowerCase()

  // CoinGecko logo API URL
  const logoUrl = `https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png`

  if (imageError) {
    // Fallback to colored circle with symbol
    const bgColor = getColorFromSymbol(symbol)
    const initials = symbol.slice(0, 2).toUpperCase()

    return (
      <div
        className={`rounded-full flex items-center justify-center text-white font-bold ${className}`}
        style={{
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          backgroundColor: bgColor,
          fontSize: `${size * 0.4}px`
        }}
      >
        {initials}
      </div>
    )
  }

  return (
    <div
      className={`rounded-full overflow-hidden bg-muted flex items-center justify-center ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <Image
        src={logoUrl}
        alt={`${name} logo`}
        width={size}
        height={size}
        className="object-contain"
        onError={() => setImageError(true)}
        unoptimized // CoinCap doesn't support Next.js image optimization
      />
    </div>
  )
}
