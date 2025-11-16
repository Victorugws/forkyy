'use client'

interface LoadingSkeletonProps {
  count?: number
  type?: 'news' | 'finance' | 'video' | 'paper'
}

export function LoadingSkeleton({ count = 3, type = 'news' }: LoadingSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          {type === 'news' && <NewsCardSkeleton />}
          {type === 'finance' && <FinanceCardSkeleton />}
          {type === 'video' && <VideoCardSkeleton />}
          {type === 'paper' && <PaperCardSkeleton />}
        </div>
      ))}
    </div>
  )
}

function NewsCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 animate-pulse">
      <div className="flex gap-4">
        {/* Image skeleton */}
        <div className="w-48 h-32 bg-muted rounded-lg flex-shrink-0" />

        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />

          <div className="flex items-center gap-4 pt-2">
            <div className="h-3 bg-muted rounded w-20" />
            <div className="h-3 bg-muted rounded w-24" />
            <div className="h-3 bg-muted rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}

function FinanceCardSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-border bg-card animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-32" />
          <div className="h-6 bg-muted rounded w-24" />
        </div>
        <div className="h-5 bg-muted rounded w-16" />
      </div>
    </div>
  )
}

function VideoCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-card animate-pulse">
      <div className="w-full h-48 bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-3/4" />
        <div className="flex items-center gap-2">
          <div className="h-3 bg-muted rounded w-16" />
          <div className="h-3 bg-muted rounded w-20" />
        </div>
      </div>
    </div>
  )
}

function PaperCardSkeleton() {
  return (
    <div className="p-5 rounded-xl border border-border bg-card animate-pulse">
      <div className="space-y-3">
        <div className="h-5 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="flex items-center gap-4 pt-2">
          <div className="h-3 bg-muted rounded w-24" />
          <div className="h-3 bg-muted rounded w-20" />
          <div className="h-3 bg-muted rounded w-16" />
        </div>
      </div>
    </div>
  )
}
