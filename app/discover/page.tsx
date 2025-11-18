'use client'

import { useState, useEffect } from 'react'
import { HeaderNavbar } from '@/components/header-navbar'
import { CategorySection } from '@/components/discover/CategorySection'

const NEWS_CATEGORIES = [
  {
    id: 'technology',
    title: 'Technology',
    emoji: '💻',
  },
  {
    id: 'politics',
    title: 'Politics',
    emoji: '🏛️',
  },
  {
    id: 'business',
    title: 'Business',
    emoji: '💼',
  },
  {
    id: 'science',
    title: 'Science',
    emoji: '🔬',
  },
  {
    id: 'health',
    title: 'Health',
    emoji: '⚕️',
  },
  {
    id: 'sports',
    title: 'Sports',
    emoji: '⚽',
  },
  {
    id: 'entertainment',
    title: 'Entertainment',
    emoji: '🎬',
  },
  {
    id: 'world',
    title: 'World News',
    emoji: '🌍',
  }
]

export default function DiscoverPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderNavbar user={null} />
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <span className="text-2xl">🧭</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground">Discover</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            AI-curated news insights across every topic that matters. Each category presents
            intelligent commentary analyzing current trends, followed by the latest stories shaping our world.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-6 py-10 flex-1">
        {/* Category Sections */}
        <div className="space-y-16">
          {NEWS_CATEGORIES.map((category, index) => (
            <CategorySection
              key={category.id}
              category={category}
              isFirst={index === 0}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
