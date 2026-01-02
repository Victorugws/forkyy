'use client'

import { useState, useEffect, useRef } from 'react'
import { Scale, FileText, AlertTriangle, CheckCircle, Clock, ArrowRight, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import { ActivityCard } from '@/components/shared/OmotiveCard'

interface LegalActivity {
  id: string
  timestamp: Date
  type: 'contract_review' | 'compliance_check' | 'risk_assessment' | 'regulation_update' | 'action_required'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'in_review' | 'approved' | 'flagged'
  relatedContract?: string
  relatedDepartment?: string
}

const generateMockLegalActivity = (): LegalActivity => {
  const types: LegalActivity['type'][] = ['contract_review', 'compliance_check', 'risk_assessment', 'regulation_update', 'action_required']
  const priorities: LegalActivity['priority'][] = ['low', 'medium', 'high', 'critical']
  const statuses: LegalActivity['status'][] = ['pending', 'in_review', 'approved', 'flagged']
  
  const type = types[Math.floor(Math.random() * types.length)]
  const priority = priorities[Math.floor(Math.random() * priorities.length)]
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  
  const templates = {
    contract_review: [
      { title: 'Contract review in progress', description: 'Analyzing terms and conditions for vendor agreement dated March 2024' },
      { title: 'New contract received', description: 'Service agreement from partner organization requires legal review' },
      { title: 'Contract amendment flagged', description: 'Clause 7.3 in subscription contract needs clarification' },
    ],
    compliance_check: [
      { title: 'GDPR compliance verification', description: 'Checking data processing agreements for EU compliance' },
      { title: 'Regulatory audit scheduled', description: 'Preparing documentation for quarterly compliance review' },
      { title: 'Privacy policy update required', description: 'New regulation changes necessitate policy revision' },
    ],
    risk_assessment: [
      { title: 'Risk analysis completed', description: 'Assessed legal exposure in international expansion strategy' },
      { title: 'Liability review ongoing', description: 'Evaluating potential risks in new product launch' },
      { title: 'Insurance coverage verified', description: 'Confirmed adequate coverage for current operations' },
    ],
    regulation_update: [
      { title: 'New regulation published', description: 'Updated labor law requirements effective next quarter' },
      { title: 'Compliance deadline approaching', description: 'Required disclosures due within 30 days' },
      { title: 'Regulatory guidance received', description: 'Clarification on industry-specific requirements' },
    ],
    action_required: [
      { title: 'Immediate action needed', description: 'Contract termination notice requires legal sign-off' },
      { title: 'Escalation to legal team', description: 'Complex dispute requires senior attorney review' },
      { title: 'Urgent compliance issue', description: 'Potential violation identified, needs immediate attention' },
    ],
  }
  
  const template = templates[type][Math.floor(Math.random() * templates[type].length)]
  const departments = ['Operations', 'Finance', 'Social', 'Hostility']
  
  return {
    id: `legal-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: new Date(),
    type,
    priority,
    status,
    title: template.title,
    description: template.description,
    relatedContract: Math.random() > 0.5 ? `Contract #${Math.floor(Math.random() * 10000)}` : undefined,
    relatedDepartment: Math.random() > 0.6 ? departments[Math.floor(Math.random() * departments.length)] : undefined,
  }
}

export function LegalityPageContent() {
  const [activities, setActivities] = useState<LegalActivity[]>([])
  const [isStreaming, setIsStreaming] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const activitiesEndRef = useRef<HTMLDivElement>(null)
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const initialActivities: LegalActivity[] = []
    for (let i = 0; i < 15; i++) {
      const activity = generateMockLegalActivity()
      activity.timestamp = new Date(Date.now() - (15 - i) * 60000) // Spread over last 15 minutes
      initialActivities.push(activity)
    }
    setActivities(initialActivities)
  }, [])

  useEffect(() => {
    activitiesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activities])

  useEffect(() => {
    if (!isStreaming) {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current)
        streamIntervalRef.current = null
      }
      return
    }

    streamIntervalRef.current = setInterval(() => {
      setActivities(prev => {
        const newActivity = generateMockLegalActivity()
        return [...prev, newActivity].slice(-1000)
      })
    }, 3000 + Math.random() * 4000) // 3-7 seconds

    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current)
      }
    }
  }, [isStreaming])

  const getTypeIcon = (type: LegalActivity['type']) => {
    switch (type) {
      case 'contract_review':
        return <FileText className="w-4 h-4" />
      case 'compliance_check':
        return <CheckCircle className="w-4 h-4" />
      case 'risk_assessment':
        return <AlertTriangle className="w-4 h-4" />
      case 'regulation_update':
        return <Scale className="w-4 h-4" />
      case 'action_required':
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: LegalActivity['priority']) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-100'
      case 'high':
        return 'text-orange-600 bg-orange-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-blue-600 bg-blue-100'
    }
  }

  const getStatusColor = (status: LegalActivity['status']) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100'
      case 'in_review':
        return 'text-blue-600 bg-blue-100'
      case 'flagged':
        return 'text-red-600 bg-red-100'
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

  const getDepartmentLink = (department?: string) => {
    const links: Record<string, string> = {
      'Operations': '/operations',
      'Finance': '/finance',
      'Social': '/social',
      'Hostility': '/hostility',
    }
    return department ? links[department] : null
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Legal Team Activity</h1>
            <p className="text-muted-foreground">Continuous legal monitoring, compliance checks, and contract reviews</p>
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

      {/* Activity Feed */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto space-y-4 pb-4"
        style={{ scrollbarWidth: 'thin' }}
      >
        {activities.map((activity) => {
          const departmentLink = getDepartmentLink(activity.relatedDepartment)
          
          const statusMap: Record<string, 'success' | 'warning' | 'error' | 'info' | 'pending'> = {
            'approved': 'success',
            'in_review': 'info',
            'flagged': 'error',
            'pending': 'pending'
          }
          
          const priorityBadge = `${activity.priority} priority`
          
          return (
            <ActivityCard
              key={activity.id}
              title={activity.title}
              description={activity.description}
              timestamp={activity.timestamp}
              icon={getTypeIcon(activity.type)}
              status={statusMap[activity.status]}
              badge={priorityBadge}
              actions={
                <>
                  {activity.relatedContract && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="w-3 h-3" />
                      <span>{activity.relatedContract}</span>
                    </div>
                  )}
                  {activity.relatedDepartment && departmentLink && (
                    <Link
                      href={departmentLink}
                      className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>Related to {activity.relatedDepartment}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </>
              }
            />
          )
        })}
        <div ref={activitiesEndRef} />
      </div>
    </div>
  )
}

