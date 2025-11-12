'use client'

import { useState, useEffect } from 'react'
import { Sparkles, ChevronRight } from 'lucide-react'
import { CategorySection } from '@/components/discover/CategorySection'

const NEWS_CATEGORIES = [
  {
    id: 'technology',
    title: 'Technology',
    emoji: '💻',
    description: 'Latest innovations, AI breakthroughs, and tech industry news'
  },
  {
    id: 'politics',
    title: 'Politics',
    emoji: '🏛️',
    description: 'Government, policy, and political developments worldwide'
  },
  {
    id: 'business',
    title: 'Business',
    emoji: '💼',
    description: 'Markets, startups, and economic trends'
  },
  {
    id: 'science',
    title: 'Science',
    emoji: '🔬',
    description: 'Research, discoveries, and scientific breakthroughs'
  },
  {
    id: 'health',
    title: 'Health',
    emoji: '⚕️',
    description: 'Medical news, wellness, and healthcare innovations'
  },
  {
    id: 'sports',
    title: 'Sports',
    emoji: '⚽',
    description: 'Games, tournaments, and athletic achievements'
  },
  {
    id: 'entertainment',
    title: 'Entertainment',
    emoji: '🎬',
    description: 'Movies, music, and pop culture'
  },
  {
    id: 'world',
    title: 'World News',
    emoji: '🌍',
    description: 'International events and global affairs'
  }
]

export default function DiscoverPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate initial load
    setLoading(false)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border/40 bg-gradient-to-b from-background to-background/95">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
              <Sparkles className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-5xl font-serif font-light text-foreground mb-2">
                Discover
              </h1>
              <p className="text-muted-foreground text-lg">
                AI-curated news insights across every topic that matters
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Sections */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-16">
        {NEWS_CATEGORIES.map((category, index) => (
          <CategorySection
            key={category.id}
            category={category}
            isFirst={index === 0}
          />
        ))}
      </div>

      {/* Bottom Spacer */}
      <div className="h-16" />
    </div>
  )
}
