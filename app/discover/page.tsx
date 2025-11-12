'use client'

import { useState, useEffect } from 'react'
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
    <div className="min-h-screen bg-[#0A0A0A] grain-overlay">
      {/* Hero Section */}
      <div className="border-b border-white/5">
        <div className="max-w-5xl mx-auto px-8 py-24">
          <h1 className="text-6xl font-serif font-light italic text-white mb-6 tracking-tight">
            Discover
          </h1>
          <p className="text-[17px] text-white/60 leading-relaxed max-w-3xl">
            AI-curated news insights across every topic that matters. Each category presents
            intelligent commentary analyzing current trends, followed by the latest stories shaping our world.
          </p>
        </div>
      </div>

      {/* Category Sections */}
      <div className="max-w-5xl mx-auto px-8 py-16 space-y-32">
        {NEWS_CATEGORIES.map((category, index) => (
          <CategorySection
            key={category.id}
            category={category}
            isFirst={index === 0}
          />
        ))}
      </div>

      {/* Bottom Spacer */}
      <div className="h-24" />
    </div>
  )
}
