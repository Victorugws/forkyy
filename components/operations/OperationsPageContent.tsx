'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Activity, Search, Brain, CheckCircle, AlertCircle, Clock, Filter } from 'lucide-react'
import { ActivityCard } from '@/components/shared/OmotiveCard'

interface LogEntry {
  id: string
  timestamp: Date
  type: 'decision' | 'search' | 'analysis' | 'action'
  title: string
  description: string
  details?: string
  status?: 'success' | 'warning' | 'error' | 'pending'
}

const generateMockLog = (): LogEntry => {
  const types: LogEntry['type'][] = ['decision', 'search', 'analysis', 'action']
  const statuses: LogEntry['status'][] = ['success', 'warning', 'error', 'pending']
  
  const type = types[Math.floor(Math.random() * types.length)]
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  
  const templates = {
    decision: [
      { title: 'Analyzed user query patterns', description: 'Identified trend: 34% increase in financial queries during market hours' },
      { title: 'Optimized response strategy', description: 'Switched to contextual mode for complex multi-part questions' },
      { title: 'Updated relevance scoring', description: 'Adjusted weights for recent news sources vs historical data' },
    ],
    search: [
      { title: 'Searched market data', description: 'Query: Latest S&P 500 performance and sector breakdown' },
      { title: 'Retrieved user preferences', description: 'Loaded 12 user-defined watchlist items from database' },
      { title: 'Fetched external API data', description: 'Called financial data provider API for real-time quotes' },
    ],
    analysis: [
      { title: 'Analyzed competitor activity', description: 'Processed 1,247 data points across 5 competitor platforms' },
      { title: 'Generated market insights', description: 'Identified 3 emerging trends in technology sector' },
      { title: 'Evaluated risk factors', description: 'Calculated volatility metrics for portfolio recommendations' },
    ],
    action: [
      { title: 'Updated finance dashboard', description: 'Refreshed 8 data cards with latest market information' },
      { title: 'Triggered compliance review', description: 'Sent notification to legality team for contract review' },
      { title: 'Scheduled social media post', description: 'Queued 3 posts based on analyzed trending topics' },
    ],
  }
  
  const template = templates[type][Math.floor(Math.random() * templates[type].length)]
  
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: new Date(),
    type,
    status,
    title: template.title,
    description: template.description,
  }
}

export function OperationsPageContent() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filter, setFilter] = useState<'all' | LogEntry['type']>('all')
  const [isStreaming, setIsStreaming] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const logsEndRef = useRef<HTMLDivElement>(null)
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Generate initial logs
  useEffect(() => {
    const initialLogs: LogEntry[] = []
    for (let i = 0; i < 20; i++) {
      const log = generateMockLog()
      log.timestamp = new Date(Date.now() - (20 - i) * 30000) // Spread over last 10 minutes
      initialLogs.push(log)
    }
    setLogs(initialLogs)
  }, [])

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  // Stream new logs
  useEffect(() => {
    if (!isStreaming) {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current)
        streamIntervalRef.current = null
      }
      return
    }

    streamIntervalRef.current = setInterval(() => {
      setLogs(prev => {
        const newLog = generateMockLog()
        return [...prev, newLog].slice(-1000) // Keep last 1000 logs for performance
      })
    }, 2000 + Math.random() * 3000) // Random interval between 2-5 seconds

    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current)
      }
    }
  }, [isStreaming])

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.type === filter)

  const getTypeIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'decision':
        return <Brain className="w-4 h-4" />
      case 'search':
        return <Search className="w-4 h-4" />
      case 'analysis':
        return <Activity className="w-4 h-4" />
      case 'action':
        return <CheckCircle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status?: LogEntry['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'error':
        return 'text-red-600'
      case 'pending':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  const filterOptions: Array<{ value: 'all' | LogEntry['type'], label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'decision', label: 'Decisions' },
    { value: 'search', label: 'Searches' },
    { value: 'analysis', label: 'Analyses' },
    { value: 'action', label: 'Actions' },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Operations Log</h1>
            <p className="text-muted-foreground">Real-time AI operations, decisions, and activities</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isStreaming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium">{isStreaming ? 'Live' : 'Paused'}</span>
            </div>
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className="px-4 py-2 bg-white/30 backdrop-blur-md border border-[#e6ebf3] rounded-lg hover:bg-white/40 transition-colors text-sm font-medium"
            >
              {isStreaming ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {filterOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === option.value
                  ? 'bg-[#192534] text-white'
                  : 'bg-white/30 backdrop-blur-md border border-[#e6ebf3] text-foreground hover:bg-white/40'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto space-y-3 pb-4"
        style={{ scrollbarWidth: 'thin' }}
      >
        {filteredLogs.map((log) => {
          const statusMap: Record<string, 'success' | 'warning' | 'error' | 'info' | 'pending'> = {
            'success': 'success',
            'warning': 'warning',
            'error': 'error',
            'pending': 'pending'
          }
          
          return (
            <ActivityCard
              key={log.id}
              title={log.title}
              description={log.description}
              timestamp={log.timestamp}
              icon={getTypeIcon(log.type)}
              status={log.status ? statusMap[log.status] : undefined}
              badge={log.type.toUpperCase()}
            />
          )
        })}
        <div ref={logsEndRef} />
      </div>
    </div>
  )
}

