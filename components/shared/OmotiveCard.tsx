'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import GlareHover from '@/components/GlareHover'

interface OmotiveCardProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
  icon?: ReactNode
  headerActions?: ReactNode
  footer?: ReactNode
  variant?: 'default' | 'highlighted' | 'minimal'
  onClick?: () => void
}

/**
 * Reusable card component inspired by Omotive design patterns
 * Features glassmorphic styling with consistent borders, shadows, and hover effects
 */
export function OmotiveCard({
  children,
  className,
  title,
  description,
  icon,
  headerActions,
  footer,
  variant = 'default',
  onClick
}: OmotiveCardProps) {
  const baseStyles = 'bg-white/30 backdrop-blur-md border border-[#e6ebf3] rounded-xl'
  
  const variantStyles = {
    default: 'hover:bg-white/40 transition-all duration-300',
    highlighted: 'bg-white/40 backdrop-blur-lg border-[#d1d5db] shadow-lg hover:shadow-xl',
    minimal: 'bg-white/20 backdrop-blur-sm border-[#e6ebf3]/50 hover:bg-white/30'
  }

  const cardContent = (
    <GlareHover
      width="100%"
      height="100%"
      background="transparent"
      borderRadius="12px"
      borderColor="transparent"
      glareColor="#ffffff"
      glareOpacity={0.2}
      glareAngle={-30}
      glareSize={300}
      transitionDuration={800}
      playOnce={false}
      className="w-full h-full"
    >
      <div className={cn(baseStyles, variantStyles[variant], onClick && 'cursor-pointer', className, 'w-full h-full')}>
        {/* Header */}
        {(title || icon || headerActions) && (
          <div className="flex items-start justify-between p-4 pb-3 border-b border-[#e6ebf3]/50">
            <div className="flex items-start gap-3 flex-1">
              {icon && (
                <div className="p-2 rounded-lg bg-background/50 flex-shrink-0">
                  {icon}
                </div>
              )}
              <div className="flex-1 min-w-0">
                {title && (
                  <h3 className="font-semibold text-foreground text-lg mb-1">{title}</h3>
                )}
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            </div>
            {headerActions && (
              <div className="flex items-center gap-2 ml-4">
                {headerActions}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className={cn(
          title || icon || headerActions ? 'p-4 pt-3' : 'p-4',
          footer ? 'pb-3' : ''
        )}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 pt-3 border-t border-[#e6ebf3]/50">
            {footer}
          </div>
        )}
      </div>
    </GlareHover>
  )

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left"
        type="button"
      >
        {cardContent}
      </button>
    )
  }

  return cardContent
}

/**
 * Card Grid Layout - Responsive grid for Omotive-style card layouts
 */
interface OmotiveCardGridProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function OmotiveCardGrid({
  children,
  columns = 3,
  gap = 'md',
  className
}: OmotiveCardGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  const gapSizes = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6'
  }

  return (
    <div className={cn('grid', gridCols[columns], gapSizes[gap], className)}>
      {children}
    </div>
  )
}

/**
 * Metric Display Card - For displaying key metrics with icons
 */
interface MetricCardProps {
  label: string
  value: string | number
  change?: {
    value: string | number
    isPositive: boolean
  }
  icon?: ReactNode
  description?: string
  className?: string
}

export function MetricCard({
  label,
  value,
  change,
  icon,
  description,
  className
}: MetricCardProps) {
  return (
    <OmotiveCard className={className}>
      <div className="flex items-start justify-between mb-3">
        {icon && (
          <div className="p-2 rounded-lg bg-background/50 text-foreground mb-3">
            {icon}
          </div>
        )}
        {change && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            change.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {change.isPositive ? '↑' : '↓'}
            {typeof change.value === 'number' ? `${change.value}%` : change.value}
          </div>
        )}
      </div>
      <div>
        <div className="text-sm text-muted-foreground mb-1">{label}</div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <div className="text-xs text-muted-foreground mt-2">{description}</div>
        )}
      </div>
    </OmotiveCard>
  )
}

/**
 * Activity Feed Item Card - For displaying activity/event items
 */
interface ActivityCardProps {
  title: string
  description?: string
  timestamp: Date | string
  icon?: ReactNode
  status?: 'success' | 'warning' | 'error' | 'info' | 'pending'
  badge?: string
  actions?: ReactNode
  className?: string
}

export function ActivityCard({
  title,
  description,
  timestamp,
  icon,
  status,
  badge,
  actions,
  className
}: ActivityCardProps) {
  const statusColors = {
    success: 'text-green-600 bg-green-100',
    warning: 'text-yellow-600 bg-yellow-100',
    error: 'text-red-600 bg-red-100',
    info: 'text-blue-600 bg-blue-100',
    pending: 'text-gray-600 bg-gray-100'
  }

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return dateObj.toLocaleDateString()
  }

  return (
    <OmotiveCard variant="minimal" className={className}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className={`p-2 rounded-lg bg-background/50 ${status ? statusColors[status] : ''} flex-shrink-0`}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-foreground">{title}</h4>
              {badge && (
                <span className="px-2 py-0.5 text-xs font-medium bg-background/50 rounded text-muted-foreground">
                  {badge}
                </span>
              )}
              {status && (
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusColors[status]}`}>
                  {status}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 ml-2">
              {formatTime(timestamp)}
            </div>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {actions && (
            <div className="mt-3 flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </OmotiveCard>
  )
}

