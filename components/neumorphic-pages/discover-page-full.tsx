'use client'

import { useState } from 'react'
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

export function NeumorphicDiscoverPageFull() {
  return (
    <div className="w-full min-h-screen bg-background">
      <HeaderNavbar user={null} />
      <div className="flex flex-col min-h-screen bg-background px-6 py-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold mb-4">Discover</h1>
            <p className="text-lg text-muted-foreground">
              Explore trending topics and breaking news across categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {NEWS_CATEGORIES.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
