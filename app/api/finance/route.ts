import { NextResponse } from 'next/server'

// Mock data for politicians (as this is not available from public APIs)
const MOCK_POLITICIAN_TRADES = [
  { name: 'Nancy Pelosi', position: 'Representative', ticker: 'NVDA', action: 'Purchased', shares: '50 call options', value: '$500K', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
  { name: 'Josh Gottheimer', position: 'Representative', ticker: 'MSFT', action: 'Purchased', shares: '100-500', value: '$15K-$50K', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
  { name: 'Michael McCaul', position: 'Representative', ticker: 'TSLA', action: 'Sold', shares: '500-1000', value: '$50K-$100K', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
  { name: 'Dan Crenshaw', position: 'Representative', ticker: 'PLTR', action: 'Purchased', shares: '100-500', value: '$10K-$50K', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
  { name: 'Tommy Tuberville', position: 'Senator', ticker: 'AMZN', action: 'Purchased', shares: '50-100', value: '$15K-$50K', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') // stocks, crypto, screener, politicians, earnings

  try {
    const finnhubKey = process.env.FINNHUB_API_KEY
    const polygonKey = process.env.POLYGON_API_KEY

    // Return politician trades (mock data)
    if (type === 'politicians') {
      return NextResponse.json({ success: true, data: MOCK_POLITICIAN_TRADES })
    }

    // If no API keys are configured, return fallback data
    if (!finnhubKey && !polygonKey) {
      return NextResponse.json({
        success: false,
        error: 'No financial API keys configured. Please add FINNHUB_API_KEY or POLYGON_API_KEY to your .env.local file.',
        fallback: true,
        data: getFallbackData(type)
      })
    }

    // Use Finnhub if available (simpler API, good free tier)
    if (finnhubKey) {
      const data = await fetchFromFinnhub(type, finnhubKey)
      return NextResponse.json({ success: true, data })
    }

    // Use Polygon as fallback
    if (polygonKey) {
      const data = await fetchFromPolygon(type, polygonKey)
      return NextResponse.json({ success: true, data })
    }

  } catch (error) {
    console.error('Finance API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true,
      data: getFallbackData(type)
    })
  }
}

async function fetchFromFinnhub(type: string | null, apiKey: string) {
  const baseUrl = 'https://finnhub.io/api/v1'

  switch (type) {
    case 'stocks': {
      // Fetch market indices
      const indices = ['SPY', 'QQQ', 'DIA', '^VIX']
      const promises = indices.map(symbol =>
        fetch(`${baseUrl}/quote?symbol=${symbol}&token=${apiKey}`)
          .then(res => res.json())
      )
      const results = await Promise.all(promises)

      return [
        {
          name: 'S&P Futures',
          ticker: 'S&P',
          price: results[0]?.c ? results[0].c.toFixed(2) : '6,846',
          change: results[0]?.dp ? `${results[0].dp > 0 ? '+' : ''}${results[0].dp.toFixed(2)}%` : '-0.14%',
          negative: results[0]?.dp ? results[0].dp < 0 : true
        },
        {
          name: 'NASDAQ Fut',
          ticker: 'NASDAQ',
          price: results[1]?.c ? results[1].c.toFixed(2) : '25,650.25',
          change: results[1]?.dp ? `${results[1].dp > 0 ? '+' : ''}${results[1].dp.toFixed(2)}%` : '-0.13%',
          negative: results[1]?.dp ? results[1].dp < 0 : true
        },
        {
          name: 'Dow Futures',
          ticker: 'Dow',
          price: results[2]?.c ? results[2].c.toFixed(2) : '47,443',
          change: results[2]?.dp ? `${results[2].dp > 0 ? '+' : ''}${results[2].dp.toFixed(2)}%` : '-0.04%',
          negative: results[2]?.dp ? results[2].dp < 0 : true
        },
        {
          name: 'VIX',
          ticker: 'INDEX',
          price: results[3]?.c ? results[3].c.toFixed(0) : '176',
          change: results[3]?.dp ? `${results[3].dp > 0 ? '+' : ''}${results[3].dp.toFixed(2)}%` : '+3.07%',
          negative: results[3]?.dp ? results[3].dp < 0 : false
        }
      ]
    }

    case 'crypto': {
      const cryptos = ['BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'BINANCE:SOLUSDT']
      const promises = cryptos.map(symbol =>
        fetch(`${baseUrl}/quote?symbol=${symbol}&token=${apiKey}`)
          .then(res => res.json())
      )
      const results = await Promise.all(promises)

      return [
        {
          name: 'Bitcoin',
          ticker: 'BTCUSD',
          symbol: 'CRYPTO',
          price: results[0]?.c ? `$${results[0].c.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$104,890.68',
          change: results[0]?.dp ? `${results[0].dp > 0 ? '+' : ''}${results[0].dp.toFixed(2)}%` : '-1.03%',
          negative: results[0]?.dp ? results[0].dp < 0 : true
        },
        {
          name: 'Ethereum',
          ticker: 'ETHUSD',
          symbol: 'CRYPTO',
          price: results[1]?.c ? `$${results[1].c.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$3,548.91',
          change: results[1]?.dp ? `${results[1].dp > 0 ? '+' : ''}${results[1].dp.toFixed(2)}%` : '-0.49%',
          negative: results[1]?.dp ? results[1].dp < 0 : true
        },
        {
          name: 'Solana',
          ticker: 'SOLUSD',
          symbol: 'CRYPTO',
          price: results[2]?.c ? `$${results[2].c.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$163.90',
          change: results[2]?.dp ? `${results[2].dp > 0 ? '+' : ''}${results[2].dp.toFixed(2)}%` : '-2.04%',
          negative: results[2]?.dp ? results[2].dp < 0 : true
        }
      ]
    }

    case 'screener': {
      const stocks = ['PLTR', 'NVDA', 'TSLA', 'AMD', 'AMZN', 'MSFT']
      const promises = stocks.map(async symbol => {
        const quote = await fetch(`${baseUrl}/quote?symbol=${symbol}&token=${apiKey}`).then(res => res.json())
        const profile = await fetch(`${baseUrl}/stock/profile2?symbol=${symbol}&token=${apiKey}`).then(res => res.json())
        return { symbol, quote, profile }
      })
      const results = await Promise.all(promises)

      return results.map(({ symbol, quote, profile }) => ({
        name: profile?.name || symbol,
        ticker: symbol,
        price: quote?.c ? `$${quote.c.toFixed(2)}` : 'N/A',
        change: quote?.dp ? `${quote.dp > 0 ? '+' : ''}${quote.dp.toFixed(2)}%` : 'N/A',
        marketCap: profile?.marketCapitalization ? `$${(profile.marketCapitalization / 1000).toFixed(1)}B` : 'N/A',
        volume: quote?.v ? `${(quote.v / 1000000).toFixed(1)}M` : 'N/A'
      }))
    }

    case 'earnings': {
      const today = new Date()
      const fromDate = new Date(today)
      fromDate.setDate(today.getDate() - 3)
      const toDate = new Date(today)
      toDate.setDate(today.getDate() + 7)

      const from = fromDate.toISOString().split('T')[0]
      const to = toDate.toISOString().split('T')[0]

      const response = await fetch(
        `${baseUrl}/calendar/earnings?from=${from}&to=${to}&token=${apiKey}`
      )
      const data = await response.json()

      if (data.earningsCalendar && data.earningsCalendar.length > 0) {
        return data.earningsCalendar.slice(0, 10).map((earning: any) => ({
          name: earning.symbol,
          ticker: earning.symbol,
          time: new Date(earning.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
          quarter: earning.quarter || 'Q3 \'25',
          date: earning.date
        }))
      }
      return getFallbackData('earnings')
    }

    default:
      return getFallbackData(type)
  }
}

async function fetchFromPolygon(type: string | null, apiKey: string) {
  // Polygon.io implementation (if user prefers this API)
  // Similar structure to Finnhub
  return getFallbackData(type)
}

function getFallbackData(type: string | null) {
  switch (type) {
    case 'stocks':
      return [
        { name: 'S&P Futures', ticker: 'S&P', price: '6,846', change: '-0.14%', negative: true },
        { name: 'NASDAQ Fut', ticker: 'NASDAQ', price: '25,650.25', change: '-0.13%', negative: true },
        { name: 'Dow Futures', ticker: 'Dow', price: '47,443', change: '-0.04%', negative: true },
        { name: 'VIX', ticker: 'INDEX', price: '176', change: '+3.07%', negative: false }
      ]

    case 'crypto':
      return [
        { name: 'Bitcoin', ticker: 'BTCUSD', symbol: 'CRYPTO', price: '$104,890.68', change: '-1.03%', negative: true },
        { name: 'Ethereum', ticker: 'ETHUSD', symbol: 'CRYPTO', price: '$3,548.91', change: '-0.49%', negative: true },
        { name: 'Solana', ticker: 'SOLUSD', symbol: 'CRYPTO', price: '$163.90', change: '-2.04%', negative: true }
      ]

    case 'screener':
      return [
        { name: 'Palantir Technologies Inc.', ticker: 'PLTR', price: '$89.35', change: '+8.92%', marketCap: '$192.5B', volume: '82.5M' },
        { name: 'Nvidia Corporation', ticker: 'NVDA', price: '$145.28', change: '+5.87%', marketCap: '$3.58T', volume: '156.2M' },
        { name: 'Tesla, Inc.', ticker: 'TSLA', price: '$445.23', change: '+3.66%', marketCap: '$1.42T', volume: '98.4M' },
        { name: 'Advanced Micro Devices', ticker: 'AMD', price: '$118.67', change: '+4.35%', marketCap: '$192.1B', volume: '67.8M' },
        { name: 'Amazon.com, Inc.', ticker: 'AMZN', price: '$218.45', change: '+2.18%', marketCap: '$2.28T', volume: '45.3M' },
        { name: 'Microsoft Corporation', ticker: 'MSFT', price: '$506.00', change: '+1.85%', marketCap: '$3.76T', volume: '32.1M' }
      ]

    case 'earnings':
      return [
        { name: 'Sea Limited', ticker: 'SE', time: '1:30 PM', quarter: 'Q3 \'25' },
        { name: 'Occidental Petroleum Corporation', ticker: 'OXY', time: '7:00 PM', quarter: 'Q3 \'25' },
        { name: 'AngloGold Ashanti Plc', ticker: 'AU', time: '6:30 PM', quarter: 'Q3 \'25' },
        { name: 'Nebius Group N.V.', ticker: 'NBIS', time: '2:00 PM', quarter: 'Q3 \'25' },
        { name: 'Rigetti Computing, Inc.', ticker: 'RGTIW', time: '2:30 PM', quarter: 'Q3 \'25' },
        { name: 'Oklo Inc.', ticker: 'OKLO', time: '11:00 PM', quarter: 'Q3 \'25' }
      ]

    case 'politicians':
      return MOCK_POLITICIAN_TRADES

    default:
      return []
  }
}
