'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { useEffect, useMemo } from 'react'
import { LoadingSkeleton } from '../shared/LoadingSkeleton'
import { NewsCard } from './NewsCard'
import { Loader2 } from 'lucide-react'
import { useUserPreferences } from '@/hooks/useUserPreferences'
import { rankArticles } from '@/lib/algorithms/rankNews'

interface Article {
  id: string
  title: string
  summary: string
  image: string
  source: string
  url: string
  views: string
  sources: number
  publishedHours: number
  publishedAt: string
  category?: string
}

interface InfiniteNewsFeedProps {
  interests: string[]
}

export function InfiniteNewsFeed({ interests }: InfiniteNewsFeedProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  })

  const { readHistory, recentCategories, markAsRead, trackCategory } = useUserPreferences()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['news', 'infinite', interests.join(',')],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `/api/news/infinite?page=${pageParam}&interests=${interests.join(',')}`
      )

      if (!res.ok) {
        throw new Error('Failed to fetch news')
      }

      return res.json()
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
    staleTime: 60 * 1000, // 1 minute
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  // Apply ranking algorithm to articles
  const rankedArticles = useMemo(() => {
    const allArticles = data?.pages.flatMap(page => page.articles) || []

    if (allArticles.length === 0) return []

    // Rank articles based on user preferences
    return rankArticles(allArticles, {
      interests,
      readHistory,
      recentCategories
    })
  }, [data, interests, readHistory, recentCategories])

  // Handle article click - mark as read and track category
  const handleArticleClick = (article: Article) => {
    markAsRead(article.id)
    if (article.category) {
      trackCategory(article.category)
    }
  }

  if (isLoading) {
    return <LoadingSkeleton count={6} type="news" />
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-destructive font-medium mb-2">Failed to load news</p>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
      </div>
    )
  }

  if (rankedArticles.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No articles found. Try adjusting your interests.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {rankedArticles.map((article: Article) => (
        <NewsCard
          key={article.id}
          article={article}
          onClick={() => handleArticleClick(article)}
        />
      ))}

      {/* Intersection observer trigger */}
      <div ref={ref} className="h-20 flex items-center justify-center">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            <span className="text-sm">Loading more articles...</span>
          </div>
        )}

        {!hasNextPage && rankedArticles.length > 0 && (
          <p className="text-sm text-muted-foreground">
            You've reached the end of the feed
          </p>
        )}
      </div>
    </div>
  )
}
