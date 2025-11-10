'use client'

import { Image as ImageIcon, Search, Filter, Grid3x3, Grid2x2 } from 'lucide-react'
import { useState } from 'react'

const sampleCategories = [
  'Nature',
  'Technology',
  'People',
  'Animals',
  'Food',
  'Travel',
  'Architecture',
  'Art'
]

const sampleImages = [
  {
    url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
    title: 'Mountain Landscape',
    source: 'Unsplash',
    size: '1920x1080'
  },
  {
    url: 'https://images.unsplash.com/photo-1682687221038-404cb8830901',
    title: 'Modern Architecture',
    source: 'Unsplash',
    size: '1920x1280'
  },
  {
    url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538',
    title: 'Abstract Art',
    source: 'Unsplash',
    size: '1080x1920'
  },
  {
    url: 'https://images.unsplash.com/photo-1682687220067-dced9a881b56',
    title: 'City Skyline',
    source: 'Unsplash',
    size: '2560x1440'
  },
  {
    url: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931',
    title: 'Ocean Waves',
    source: 'Unsplash',
    size: '1920x1080'
  },
  {
    url: 'https://images.unsplash.com/photo-1682687220208-22d7a2543e88',
    title: 'Forest Path',
    source: 'Unsplash',
    size: '1920x1280'
  },
  {
    url: 'https://images.unsplash.com/photo-1682687220923-c58b9a4592ae',
    title: 'Desert Dunes',
    source: 'Unsplash',
    size: '2048x1365'
  },
  {
    url: 'https://images.unsplash.com/photo-1682687221038-3d6312e0e4db',
    title: 'Northern Lights',
    source: 'Unsplash',
    size: '1920x1080'
  }
]

export default function ImagesPage() {
  const [gridSize, setGridSize] = useState<'large' | 'small'>('large')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-br from-background via-background to-purple-500/5">
        <div className="container max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-purple-500/10 p-3">
              <ImageIcon className="size-6 text-purple-500" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Images</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            Discover and explore images from across the web with AI-powered
            visual search
          </p>
          <div className="flex gap-3 items-center">
            <div className="relative flex-1 max-w-3xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-input bg-background px-12 py-4 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <button className="rounded-2xl border border-input bg-background p-4 hover:bg-accent transition-colors">
              <Filter className="size-5" />
            </button>
            <div className="flex gap-2 rounded-2xl border border-input bg-background p-1">
              <button
                onClick={() => setGridSize('large')}
                className={`p-2 rounded-xl transition-colors ${gridSize === 'large' ? 'bg-accent' : 'hover:bg-accent'}`}
              >
                <Grid2x2 className="size-5" />
              </button>
              <button
                onClick={() => setGridSize('small')}
                className={`p-2 rounded-xl transition-colors ${gridSize === 'small' ? 'bg-accent' : 'hover:bg-accent'}`}
              >
                <Grid3x3 className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-6 py-10 flex-1">
        {/* Categories */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            {sampleCategories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full border border-border bg-card text-sm font-medium hover:border-primary/50 hover:bg-accent transition-all"
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Image Grid */}
        <section>
          <div
            className={`grid gap-4 ${
              gridSize === 'large'
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
            }`}
          >
            {sampleImages.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-muted cursor-pointer"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-white text-sm font-medium mb-1">
                      {image.title}
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span>{image.source}</span>
                      <span>{image.size}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center mt-12">
            <button className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              Load More Images
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
