'use client'

import { Clock, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import DecryptedText from '@/components/DecryptedText'

interface Development {
  id: string
  icon?: string
  timestamp: string
  title: string
  description: string
  sentiment?: 'positive' | 'negative' | 'neutral'
}

interface RecentDevelopmentsProps {
  topic?: string
  limit?: number
}

export function RecentDevelopments({ topic = 'US markets', limit = 3 }: RecentDevelopmentsProps) {
  // Mock data - in production, this would come from an API
  const developments: Development[] = [
    {
      id: '1',
      timestamp: '7 hours ago',
      title: 'Williams Hints Fed May Lower Rates Soon',
      description: 'John Williams, president of the New York Fed, indicated on Friday a potential federal funds rate cut in December. Traders boosted the probability to 75%, up from 40% the day before, driving a late rally in equities.',
      sentiment: 'positive'
    },
    {
      id: '2',
      timestamp: '17 hours ago',
      title: 'S&P 500, Nasdaq Suffer Deep November Losses',
      description: 'The S&P 500 declined nearly 2% this week and is down 3.5% for November. The Nasdaq has dropped over 6% this month, marking its steepest three-week fall since April.',
      sentiment: 'negative'
    },
    {
      id: '3',
      timestamp: '20 hours ago',
      title: 'Consumer Sentiment Dips But Beat Projections',
      description: 'Final University of Michigan data shows U.S. consumer sentiment fell to 51 in November, above initial estimates of 50.3, as concerns about prices and job security persist.',
      sentiment: 'neutral'
    }
  ]

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="size-5 text-green-500" />
      case 'negative':
        return <TrendingDown className="size-5 text-red-500" />
      default:
        return <AlertCircle className="size-5 text-blue-500" />
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          <DecryptedText text="Recent Developments" animateOn="view" speed={30} />
        </h2>
        <p className="text-xs text-muted-foreground">Updated 1 minute ago</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {developments.slice(0, limit).map((dev) => (
          <div
            key={dev.id}
            className="bg-white/30 backdrop-blur-md border border-[#e6ebf3] p-5 rounded-xl transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-[#e6ebf3] bg-background/50 flex-shrink-0">
                {getSentimentIcon(dev.sentiment)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="size-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{dev.timestamp}</span>
                </div>
              </div>
            </div>

            <h3 className="text-sm font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {dev.title}
            </h3>

            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {dev.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
