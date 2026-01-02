'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Target, ArrowRight, Link as LinkIcon, Zap, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { OmotiveCard } from '@/components/shared/OmotiveCard'

interface CompetitiveAdvantage {
  id: string
  timestamp: Date
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  status: 'identified' | 'analyzing' | 'actioned' | 'monitoring'
  relatedDepartments: string[]
  actions: Array<{
    department: string
    action: string
    status: 'pending' | 'in_progress' | 'completed'
  }>
  metrics?: {
    advantageScore?: number
    competitorGap?: number
  }
}

const generateMockAdvantage = (): CompetitiveAdvantage => {
  const departments = ['Operations', 'Finance', 'Social', 'Legality']
  const impacts: CompetitiveAdvantage['impact'][] = ['high', 'medium', 'low']
  const statuses: CompetitiveAdvantage['status'][] = ['identified', 'analyzing', 'actioned', 'monitoring']
  
  const templates = [
    {
      title: 'Market timing advantage detected',
      description: 'Competitor delayed product launch creates 3-month window for market capture',
      impact: 'high' as const,
      relatedDepartments: ['Operations', 'Social'],
      actions: [
        { department: 'Operations', action: 'Accelerate product roadmap', status: 'in_progress' as const },
        { department: 'Social', action: 'Launch pre-announcement campaign', status: 'pending' as const },
      ],
      metrics: { advantageScore: 87, competitorGap: 23 },
    },
    {
      title: 'Pricing optimization opportunity',
      description: 'Analysis shows 15% price flexibility without affecting market position',
      impact: 'high' as const,
      relatedDepartments: ['Finance', 'Operations'],
      actions: [
        { department: 'Finance', action: 'Review pricing strategy', status: 'completed' as const },
        { department: 'Operations', action: 'Implement dynamic pricing', status: 'in_progress' as const },
      ],
      metrics: { advantageScore: 72, competitorGap: 15 },
    },
    {
      title: 'Regulatory compliance edge',
      description: 'New regulations favor our existing infrastructure over competitors',
      impact: 'medium' as const,
      relatedDepartments: ['Legality', 'Operations'],
      actions: [
        { department: 'Legality', action: 'Document compliance advantage', status: 'completed' as const },
        { department: 'Operations', action: 'Highlight in marketing materials', status: 'pending' as const },
      ],
    },
    {
      title: 'Social media engagement spike',
      description: 'Recent campaign outperforming competitors by 45% engagement rate',
      impact: 'medium' as const,
      relatedDepartments: ['Social', 'Finance'],
      actions: [
        { department: 'Social', action: 'Scale successful campaign format', status: 'in_progress' as const },
        { department: 'Finance', action: 'Reallocate budget to high-performing channels', status: 'pending' as const },
      ],
      metrics: { advantageScore: 65, competitorGap: 45 },
    },
  ]
  
  const template = templates[Math.floor(Math.random() * templates.length)]
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  
  return {
    id: `advantage-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: new Date(),
    ...template,
    status,
  }
}

const departmentLinks: Record<string, string> = {
  'Operations': '/operations',
  'Finance': '/finance',
  'Social': '/social',
  'Legality': '/legality',
}

export function HostilityPageContent() {
  const [advantages, setAdvantages] = useState<CompetitiveAdvantage[]>([])
  const [isStreaming, setIsStreaming] = useState(true)

  useEffect(() => {
    const initialAdvantages: CompetitiveAdvantage[] = []
    for (let i = 0; i < 6; i++) {
      const advantage = generateMockAdvantage()
      advantage.timestamp = new Date(Date.now() - i * 3600000) // Spread over last hours
      initialAdvantages.push(advantage)
    }
    setAdvantages(initialAdvantages)
  }, [])

  useEffect(() => {
    if (!isStreaming) return

    const interval = setInterval(() => {
      setAdvantages(prev => {
        const newAdvantage = generateMockAdvantage()
        return [newAdvantage, ...prev].slice(0, 15)
      })
    }, 8000 + Math.random() * 7000) // 8-15 seconds

    return () => clearInterval(interval)
  }, [isStreaming])

  const getImpactColor = (impact: CompetitiveAdvantage['impact']) => {
    switch (impact) {
      case 'high':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200'
    }
  }

  const getStatusIcon = (status: CompetitiveAdvantage['status']) => {
    switch (status) {
      case 'identified':
        return <Target className="w-4 h-4" />
      case 'analyzing':
        return <AlertCircle className="w-4 h-4" />
      case 'actioned':
        return <CheckCircle className="w-4 h-4" />
      case 'monitoring':
        return <Zap className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: CompetitiveAdvantage['status']) => {
    switch (status) {
      case 'identified':
        return 'text-blue-600 bg-blue-100'
      case 'analyzing':
        return 'text-yellow-600 bg-yellow-100'
      case 'actioned':
        return 'text-green-600 bg-green-100'
      case 'monitoring':
        return 'text-purple-600 bg-purple-100'
    }
  }

  const getActionStatusColor = (status: CompetitiveAdvantage['actions'][0]['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'in_progress':
        return 'text-blue-600 bg-blue-100'
      case 'pending':
        return 'text-gray-600 bg-gray-100'
    }
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Competitive Edge</h1>
            <p className="text-muted-foreground">AI-identified advantages and cross-department action coordination</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isStreaming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium">{isStreaming ? 'Active' : 'Paused'}</span>
            </div>
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className="px-4 py-2 bg-white/30 backdrop-blur-md border border-[#e6ebf3] rounded-lg hover:bg-white/40 transition-colors text-sm font-medium"
            >
              {isStreaming ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>
      </div>

      {/* Advantages Grid */}
      <div className="space-y-6">
        {advantages.map((advantage) => (
          <OmotiveCard
            key={advantage.id}
            variant="highlighted"
            icon={getStatusIcon(advantage.status)}
            headerActions={
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-1 text-xs font-medium rounded border ${getImpactColor(advantage.impact)}`}>
                  {advantage.impact} impact
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(advantage.status)}`}>
                  {advantage.status}
                </span>
                <div className="text-xs text-muted-foreground">
                  {formatTime(advantage.timestamp)}
                </div>
              </div>
            }
          >
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{advantage.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{advantage.description}</p>

              {/* Metrics */}
              {advantage.metrics && (
                <div className="flex items-center gap-6 mb-4 pb-4 border-b border-[#e6ebf3]">
                  {advantage.metrics.advantageScore && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Advantage Score</div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-2xl font-bold text-foreground">{advantage.metrics.advantageScore}</span>
                      </div>
                    </div>
                  )}
                  {advantage.metrics.competitorGap && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Competitor Gap</div>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <span className="text-2xl font-bold text-foreground">-{advantage.metrics.competitorGap}%</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cross-Department Workflow */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Department Coordination</h4>
                <div className="space-y-3">
                  {advantage.actions.map((action, index) => {
                    const departmentLink = departmentLinks[action.department]
                    
                    return (
                      <div key={index} className="flex items-center gap-3">
                        {departmentLink ? (
                          <Link
                            href={departmentLink}
                            className="flex items-center gap-2 px-3 py-2 bg-white/50 backdrop-blur-sm border border-[#e6ebf3] rounded-lg hover:bg-white/70 transition-colors flex-1"
                          >
                            <LinkIcon className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-foreground">{action.department}</span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                          </Link>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-2 bg-white/50 backdrop-blur-sm border border-[#e6ebf3] rounded-lg flex-1">
                            <span className="font-medium text-foreground">{action.department}</span>
                          </div>
                        )}
                        <div className="flex-1 px-3 py-2 bg-background/50 rounded-lg">
                          <span className="text-sm text-foreground">{action.action}</span>
                        </div>
                        <span className={`px-3 py-2 text-xs font-medium rounded ${getActionStatusColor(action.status)}`}>
                          {action.status.replace('_', ' ')}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </OmotiveCard>
        ))}
      </div>
    </div>
  )
}

