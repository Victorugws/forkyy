'use client'

import { TrendingUp, TrendingDown, AlertCircle, Info } from 'lucide-react'
import { useEffect, useState } from 'react'

interface MarketInsightsProps {
  type: 'US Markets' | 'Crypto' | 'Earnings' | 'Screener' | 'Politicians'
  data?: any[]
  timeframe?: '1D' | '1W' | '1M' | '1Y'
}

interface Insight {
  sentiment: 'positive' | 'negative' | 'neutral'
  headline: string
  explanation: string
  context: string
  tip?: string
}

export function MarketInsights({ type, data, timeframe = '1D' }: MarketInsightsProps) {
  const [insight, setInsight] = useState<Insight | null>(null)

  useEffect(() => {
    // Generate insights based on market type and data
    const generateInsight = (): Insight => {
      switch (type) {
        case 'US Markets':
          return generateUSMarketInsight(data, timeframe)
        case 'Crypto':
          return generateCryptoInsight(data, timeframe)
        case 'Earnings':
          return generateEarningsInsight(timeframe)
        case 'Screener':
          return generateScreenerInsight(data, timeframe)
        case 'Politicians':
          return generatePoliticianInsight(data, timeframe)
        default:
          return {
            sentiment: 'neutral',
            headline: 'Market Update',
            explanation: 'Analyzing current market conditions...',
            context: 'Data is being processed to provide you with actionable insights.'
          }
      }
    }

    setInsight(generateInsight())
  }, [type, data, timeframe])

  if (!insight) return null

  const Icon = insight.sentiment === 'positive' ? TrendingUp : insight.sentiment === 'negative' ? TrendingDown : Info
  const bgColor = insight.sentiment === 'positive' ? 'bg-green-500/10 border-green-500/20' : insight.sentiment === 'negative' ? 'bg-red-500/10 border-red-500/20' : 'bg-blue-500/10 border-blue-500/20'
  const iconColor = insight.sentiment === 'positive' ? 'text-green-500' : insight.sentiment === 'negative' ? 'text-red-500' : 'text-blue-500'

  return (
    <div className={`mb-8 p-6 rounded-xl border ${bgColor}`}>
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${iconColor}`}>
          <Icon className="size-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            {insight.headline}
            {timeframe && (
              <span className="text-xs font-normal text-muted-foreground px-2 py-1 rounded bg-muted">
                {timeframe}
              </span>
            )}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {insight.explanation}
          </p>
          <p className="text-sm text-foreground mb-3">
            {insight.context}
          </p>
          {insight.tip && (
            <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-background/50 border border-border">
              <AlertCircle className="size-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Pro tip:</span> {insight.tip}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper functions to generate insights

function generateUSMarketInsight(data: any[] | undefined, timeframe: string): Insight {
  // Simulate market analysis
  const isPositive = Math.random() > 0.4
  const percentChange = (Math.random() * 3).toFixed(2)

  if (timeframe === '1D') {
    return {
      sentiment: isPositive ? 'positive' : 'negative',
      headline: isPositive ? 'Markets Rally Today' : 'Markets Pull Back Today',
      explanation: isPositive
        ? `The major stock indices are trending upward today, with the S&P 500 gaining approximately ${percentChange}%. This means the average value of large U.S. companies has increased.`
        : `The major stock indices are declining today, with the S&P 500 down approximately ${percentChange}%. This means the average value of large U.S. companies has decreased.`,
      context: isPositive
        ? 'When markets rally, it often reflects investor confidence in the economy. Investors are buying stocks because they believe companies will perform well in the near future.'
        : 'Market pullbacks are normal and happen regularly. They can be caused by various factors like economic data, global events, or profit-taking after gains.',
      tip: isPositive
        ? 'Strong market days are good, but remember that markets go up and down. Avoid making impulsive decisions based on a single day\'s performance.'
        : 'Down days can feel concerning, but they\'re a normal part of investing. If you\'re investing for the long term (5+ years), daily fluctuations matter less.'
    }
  } else if (timeframe === '1W') {
    return {
      sentiment: isPositive ? 'positive' : 'negative',
      headline: isPositive ? 'Weekly Gains Across Major Indices' : 'Markets Face Weekly Headwinds',
      explanation: isPositive
        ? 'Over the past week, stocks have been climbing steadily. This suggests sustained investor optimism about corporate earnings and economic growth.'
        : 'Over the past week, stocks have faced selling pressure. This could be due to concerns about interest rates, inflation, or geopolitical tensions.',
      context: 'Weekly trends give us a better picture than daily movements. They smooth out the "noise" of day-to-day volatility and show us the actual direction markets are heading.',
      tip: 'Weekly performance is more meaningful than daily swings. Look for consistent patterns over weeks and months rather than reacting to single-day moves.'
    }
  } else if (timeframe === '1M') {
    return {
      sentiment: isPositive ? 'positive' : 'neutral',
      headline: 'Monthly Market Performance Reveals Trends',
      explanation: 'Looking at the past month helps us understand whether the market is in an uptrend, downtrend, or consolidating. Monthly data filters out short-term noise.',
      context: 'Monthly performance is particularly useful for identifying whether we\'re in a bull market (sustained upward trend) or bear market (sustained downward trend). Most successful investors focus on these longer timeframes.',
      tip: 'If you\'re investing for retirement or long-term goals, monthly and yearly performance matters far more than daily or weekly fluctuations.'
    }
  } else {
    return {
      sentiment: isPositive ? 'positive' : 'neutral',
      headline: 'Year-to-Date Market Performance',
      explanation: 'Over the past year, we can see the big picture of market performance. This timeframe accounts for seasonal patterns, economic cycles, and major events.',
      context: 'Historically, the stock market has returned about 10% per year on average (though individual years vary widely). Comparing current performance to this historical average helps put things in perspective.',
      tip: 'Long-term investing (10+ years) has historically been the most reliable way to build wealth. Short-term volatility tends to smooth out over time.'
    }
  }
}

function generateCryptoInsight(data: any[] | undefined, timeframe: string): Insight {
  const isPositive = Math.random() > 0.5
  const volatility = Math.random() > 0.6

  return {
    sentiment: isPositive ? 'positive' : 'negative',
    headline: isPositive ? 'Crypto Markets Show Strength' : 'Crypto Markets Experience Volatility',
    explanation: volatility
      ? 'Cryptocurrency prices are moving significantly today. Crypto markets are known for their high volatility - prices can swing 5-10% or more in a single day, which is much larger than traditional stock movements.'
      : 'Crypto markets are relatively stable today. Major cryptocurrencies like Bitcoin and Ethereum are trading within a narrow range.',
    context: isPositive
      ? 'When crypto prices rise, it often reflects growing adoption, positive regulatory news, or increased institutional investment. However, crypto remains a highly speculative and volatile asset class.'
      : 'Crypto downturns can be triggered by regulatory concerns, security breaches, or profit-taking after rallies. The crypto market is still maturing and experiences larger swings than traditional markets.',
    tip: 'Crypto is extremely volatile and risky. Only invest money you can afford to lose completely, and keep crypto as a small portion of your overall portfolio (most experts suggest 5% or less).'
  }
}

function generateEarningsInsight(timeframe: string): Insight {
  const isEarningsSeason = [1, 4, 7, 10].includes(new Date().getMonth() + 1)

  return {
    sentiment: 'neutral',
    headline: isEarningsSeason ? 'Earnings Season Is Here' : 'Upcoming Earnings Releases',
    explanation: 'Earnings reports show how much profit companies made in the previous quarter (3 months). When companies report earnings that beat expectations, their stock price often goes up. When they miss expectations, the stock often falls.',
    context: isEarningsSeason
      ? 'We\'re currently in earnings season, when most companies report their quarterly results. This happens four times per year. Markets can be more volatile during earnings season as investors react to company news.'
      : 'Companies report earnings quarterly. The calendar shows when major companies will announce their results. These events can move not just individual stocks but entire market sectors.',
    tip: 'Don\'t try to predict earnings results. Even professional analysts with access to company data are often wrong. Instead, focus on companies with consistent long-term growth patterns.'
  }
}

function generateScreenerInsight(data: any[] | undefined, timeframe: string): Insight {
  return {
    sentiment: 'neutral',
    headline: 'Stock Screener Results',
    explanation: 'A stock screener helps you filter thousands of stocks based on specific criteria like price, market cap, sector, or performance. Think of it like a search engine for finding stocks that match what you\'re looking for.',
    context: 'The stocks shown here meet certain criteria for value, growth, or momentum. However, passing a screen doesn\'t mean a stock is guaranteed to perform well - it\'s just a starting point for further research.',
    tip: 'Use screeners to narrow down your options, but always research individual companies before investing. Look at their business model, competitive advantages, management quality, and financial health.'
  }
}

function generatePoliticianInsight(data: any[] | undefined, timeframe: string): Insight {
  const hasRecentActivity = data && data.length > 0

  return {
    sentiment: 'neutral',
    headline: 'Congressional Trading Activity',
    explanation: 'Members of Congress are required to disclose their stock trades within 45 days. Some investors watch these disclosures for insights, though the delayed reporting and politicians\' diverse motivations mean these trades shouldn\'t be blindly copied.',
    context: hasRecentActivity
      ? 'This shows recent stock purchases and sales by members of Congress. While they may have access to non-public information through their work, the STOCK Act prohibits them from trading on insider information.'
      : 'No significant trading activity to report recently. Congressional disclosures are filed periodically and can have reporting delays.',
    tip: 'Following politician trades can provide ideas, but don\'t copy them blindly. Many congressional trades are made by financial advisors, not the politicians themselves. Always do your own research before making investment decisions.'
  }
}
