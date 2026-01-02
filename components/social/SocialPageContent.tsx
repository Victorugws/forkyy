'use client'

import { useState, useEffect } from 'react'
import { Twitter, Linkedin, Instagram, Facebook, TrendingUp, RefreshCw, Clock, Eye, Heart, MessageCircle, Share2 } from 'lucide-react'
import { OmotiveCard, OmotiveCardGrid } from '@/components/shared/OmotiveCard'

interface PlatformScreenshot {
  platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook'
  url: string
  lastUpdated: Date
}

interface CampaignInsight {
  id: string
  timestamp: Date
  platform: string
  title: string
  description: string
  metrics: {
    impressions?: number
    engagement?: number
    reach?: number
    clicks?: number
  }
  trend: 'up' | 'down' | 'neutral'
  newsUpdate?: string
}

const generateMockInsight = (): CampaignInsight => {
  const platforms = ['Twitter', 'LinkedIn', 'Instagram', 'Facebook']
  const platform = platforms[Math.floor(Math.random() * platforms.length)]
  const trends: CampaignInsight['trend'][] = ['up', 'down', 'neutral']
  
  const templates = [
    {
      title: 'Engagement spike detected',
      description: `${platform} campaign showing 34% increase in engagement rates over last 24 hours`,
      metrics: { impressions: 125000, engagement: 12400, reach: 89000 },
    },
    {
      title: 'Viral content identified',
      description: `Post from ${platform} gaining traction, shares increased 150% in past hour`,
      metrics: { impressions: 450000, engagement: 67000, clicks: 12300 },
    },
    {
      title: 'Optimal posting time analyzed',
      description: `Data shows peak engagement on ${platform} occurs between 2-4 PM EST`,
      metrics: { impressions: 234000, engagement: 18900, reach: 156000 },
    },
    {
      title: 'Audience sentiment shift',
      description: `Positive sentiment increased 12% on ${platform} following latest campaign launch`,
      metrics: { impressions: 312000, engagement: 28900, reach: 245000 },
    },
  ]
  
  const template = templates[Math.floor(Math.random() * templates.length)]
  const trend = trends[Math.floor(Math.random() * trends.length)]
  
  return {
    id: `insight-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: new Date(),
    platform,
    title: template.title,
    description: template.description,
    metrics: template.metrics,
    trend,
    newsUpdate: Math.random() > 0.7 ? 'Breaking: Industry news affecting campaign performance' : undefined,
  }
}

export function SocialPageContent() {
  const [insights, setInsights] = useState<CampaignInsight[]>([])
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const platforms: Array<{ name: string, icon: any, color: string }> = [
    { name: 'Twitter', icon: Twitter, color: 'bg-blue-400' },
    { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-600' },
    { name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
    { name: 'Facebook', icon: Facebook, color: 'bg-blue-700' },
  ]

  useEffect(() => {
    const initialInsights: CampaignInsight[] = []
    for (let i = 0; i < 8; i++) {
      const insight = generateMockInsight()
      insight.timestamp = new Date(Date.now() - i * 1800000) // Spread over last hours
      initialInsights.push(insight)
    }
    setInsights(initialInsights)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLastRefresh(new Date())
    const newInsight = generateMockInsight()
    setInsights(prev => [newInsight, ...prev].slice(0, 20))
    setIsRefreshing(false)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  const formatNumber = (num?: number) => {
    if (!num) return 'N/A'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Social Media Analytics</h1>
            <p className="text-muted-foreground">Real-time campaign insights and platform performance</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white/30 backdrop-blur-md border border-[#e6ebf3] rounded-lg hover:bg-white/40 transition-colors text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Last updated: {formatTime(lastRefresh)}</span>
          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Live</span>
        </div>
      </div>

      {/* Platform Screenshots Grid */}
      <OmotiveCardGrid columns={2} gap="md" className="mb-6">
        {platforms.map((platform) => {
          const Icon = platform.icon
          return (
            <OmotiveCard
              key={platform.name}
              title={platform.name}
              icon={
                <div className={`p-2 rounded-lg ${platform.color} text-white`}>
                  <Icon className="w-5 h-5" />
                </div>
              }
              description={`Updated ${formatTime(new Date(Date.now() - Math.random() * 300000))}`}
            >
              {/* Placeholder for screenshot */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
                <div className="text-center">
                  <Icon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">{platform.name} Screenshot</p>
                  <p className="text-xs text-gray-400 mt-1">Placeholder</p>
                </div>
              </div>
            </OmotiveCard>
          )
        })}
      </OmotiveCardGrid>

      {/* Campaign Insights */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Campaign Insights</h2>
        <div className="space-y-4">
          {insights.map((insight) => {
            const PlatformIcon = platforms.find(p => p.name === insight.platform)?.icon || Twitter
            
            return (
              <OmotiveCard
                key={insight.id}
                icon={<PlatformIcon className="w-5 h-5 text-foreground" />}
                headerActions={
                  <>
                    {insight.trend === 'up' && (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    )}
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(insight.timestamp)}
                    </div>
                  </>
                }
                footer={
                  insight.newsUpdate && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900 font-medium">{insight.newsUpdate}</p>
                    </div>
                  )
                }
              >
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{insight.description}</p>
                  
                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {insight.metrics.impressions && (
                      <div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <Eye className="w-3 h-3" />
                          Impressions
                        </div>
                        <div className="font-semibold text-foreground">{formatNumber(insight.metrics.impressions)}</div>
                      </div>
                    )}
                    {insight.metrics.engagement && (
                      <div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <Heart className="w-3 h-3" />
                          Engagement
                        </div>
                        <div className="font-semibold text-foreground">{formatNumber(insight.metrics.engagement)}</div>
                      </div>
                    )}
                    {insight.metrics.reach && (
                      <div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <Share2 className="w-3 h-3" />
                          Reach
                        </div>
                        <div className="font-semibold text-foreground">{formatNumber(insight.metrics.reach)}</div>
                      </div>
                    )}
                    {insight.metrics.clicks && (
                      <div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <MessageCircle className="w-3 h-3" />
                          Clicks
                        </div>
                        <div className="font-semibold text-foreground">{formatNumber(insight.metrics.clicks)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </OmotiveCard>
            )
          })}
        </div>
      </div>
    </div>
  )
}

