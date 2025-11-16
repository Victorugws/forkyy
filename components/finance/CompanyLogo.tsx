'use client'

import { Building2 } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

interface CompanyLogoProps {
  ticker: string
  companyName: string
  size?: number
  className?: string
}

export function CompanyLogo({ ticker, companyName, size = 40, className = '' }: CompanyLogoProps) {
  const [imageError, setImageError] = useState(false)

  // Try multiple logo sources
  const logoSources = [
    // Clearbit logo API (free, no API key needed)
    `https://logo.clearbit.com/${getCompanyDomain(ticker, companyName)}`,
    // Fallback to a generic placeholder
    null
  ]

  const currentSource = imageError ? null : logoSources[0]

  if (!currentSource || imageError) {
    // Fallback to icon with colored background
    const bgColor = getColorFromTicker(ticker)
    return (
      <div
        className={`flex items-center justify-center rounded-lg ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: bgColor,
          minWidth: size,
          minHeight: size
        }}
      >
        <span className="text-white font-bold text-sm">
          {ticker.slice(0, 2).toUpperCase()}
        </span>
      </div>
    )
  }

  return (
    <div
      className={`relative flex items-center justify-center rounded-lg overflow-hidden bg-white ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <Image
        src={currentSource}
        alt={`${companyName} logo`}
        width={size}
        height={size}
        className="object-contain p-1"
        onError={() => setImageError(true)}
      />
    </div>
  )
}

// Helper function to derive company domain from ticker/name
function getCompanyDomain(ticker: string, companyName: string): string {
  // Common ticker to domain mappings
  const domainMap: Record<string, string> = {
    'AAPL': 'apple.com',
    'GOOGL': 'google.com',
    'GOOG': 'google.com',
    'MSFT': 'microsoft.com',
    'AMZN': 'amazon.com',
    'TSLA': 'tesla.com',
    'META': 'meta.com',
    'FB': 'meta.com',
    'NVDA': 'nvidia.com',
    'JPM': 'jpmorganchase.com',
    'V': 'visa.com',
    'MA': 'mastercard.com',
    'WMT': 'walmart.com',
    'DIS': 'disney.com',
    'NFLX': 'netflix.com',
    'PYPL': 'paypal.com',
    'INTC': 'intel.com',
    'AMD': 'amd.com',
    'CSCO': 'cisco.com',
    'PFE': 'pfizer.com',
    'KO': 'coca-cola.com',
    'PEP': 'pepsico.com',
    'NKE': 'nike.com',
    'ADBE': 'adobe.com',
    'CRM': 'salesforce.com',
    'ORCL': 'oracle.com',
    'IBM': 'ibm.com',
    'QCOM': 'qualcomm.com',
    'T': 'att.com',
    'VZ': 'verizon.com',
    'BA': 'boeing.com',
    'GE': 'ge.com',
    'F': 'ford.com',
    'GM': 'gm.com',
    'SPOT': 'spotify.com',
    'UBER': 'uber.com',
    'LYFT': 'lyft.com',
    'SNAP': 'snap.com',
    'TWTR': 'twitter.com',
    'SQ': 'squareup.com',
    'SHOP': 'shopify.com',
    'ZM': 'zoom.us',
    'ABNB': 'airbnb.com',
    'COIN': 'coinbase.com',
    'RBLX': 'roblox.com',
  }

  if (domainMap[ticker.toUpperCase()]) {
    return domainMap[ticker.toUpperCase()]
  }

  // Try to derive from company name
  const cleanName = companyName
    .toLowerCase()
    .replace(/\s+(inc|corp|corporation|company|co|ltd|llc|plc)\.?$/i, '')
    .replace(/[^a-z0-9]/g, '')
    .trim()

  return `${cleanName}.com`
}

// Generate a consistent color based on ticker
function getColorFromTicker(ticker: string): string {
  const colors = [
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#F59E0B', // amber
    '#10B981', // emerald
    '#06B6D4', // cyan
    '#6366F1', // indigo
    '#EF4444', // red
    '#14B8A6', // teal
    '#F97316', // orange
  ]

  const hash = ticker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}
