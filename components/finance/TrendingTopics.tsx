'use client'

import { Hash, TrendingUp } from 'lucide-react'
import { useState } from 'react'

interface TrendingTopicsProps {
  compact?: boolean
}

const mockTopics = [
  { tag: 'AI', count: 1240, change: '+12%' },
  { tag: 'Earnings', count: 890, change: '+8%' },
  { tag: 'Fed', count: 756, change: '+5%' },
  { tag: 'Crypto', count: 623, change: '-3%' },
  { tag: 'Tech', count: 512, change: '+15%' }
]

export function TrendingTopics({ compact = false }: TrendingTopicsProps) {
  const [topics] = useState(mockTopics)

  if (compact) {
    return (
      <div className="rounded-2xl bg-white/30 backdrop-blur-md border border-[#e6ebf3] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Trending</h3>
          </div>
        </div>
        <div className="space-y-1.5">
          {topics.map((topic, index) => (
            <div
              key={topic.tag}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
                <Hash className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">
                  {topic.tag}
                </span>
              </div>
              <div className="text-right flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{topic.count}</span>
                <span className={`text-xs ${topic.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {topic.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white/30 backdrop-blur-md border border-[#e6ebf3] p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-foreground" />
          <h3 className="text-lg font-bold text-foreground">Trending Topics</h3>
        </div>
      </div>
      <div className="space-y-3">
        {topics.map((topic, index) => (
          <div
            key={topic.tag}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
              <Hash className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                {topic.tag}
              </span>
            </div>
            <div className="text-right flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{topic.count}</span>
              <span className={`text-sm ${topic.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {topic.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
