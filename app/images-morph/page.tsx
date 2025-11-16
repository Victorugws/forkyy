'use client'

import { Image as ImageIcon, Search, Filter, Grid3x3, Grid2x2, X } from 'lucide-react'
import { useState } from 'react'
import { PageMorphWrapper, usePageMorph } from '@/components/PageMorphWrapper'

const sampleCategories = [
  'All',
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
    size: '1920x1080',
    category: 'Nature'
  },
  {
    url: 'https://images.unsplash.com/photo-1682687221038-404cb8830901',
    title: 'Modern Architecture',
    source: 'Unsplash',
    size: '1920x1280',
    category: 'Architecture'
  },
  {
    url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538',
    title: 'Abstract Art',
    source: 'Unsplash',
    size: '1080x1920',
    category: 'Art'
  },
  {
    url: 'https://images.unsplash.com/photo-1682687220067-dced9a881b56',
    title: 'City Skyline',
    source: 'Unsplash',
    size: '2560x1440',
    category: 'Architecture'
  }
]

export default function ImagesMorphPage() {
  const { shouldSkipMorph } = usePageMorph()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [gridSize, setGridSize] = useState<'large' | 'small'>('large')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  return (
    <PageMorphWrapper
      skipMorph={shouldSkipMorph}
      eyeDuration={2500}
      showBinaryLoading={true}
    >
      <div className="flex flex-col min-h-screen bg-background">
        {/* Header Section with Neumorphic Styling */}
        <div className="neu-card border-b border-border/20">
          <div className="container max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="neu-raised rounded-full p-3">
                <ImageIcon className="size-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Images</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mb-6">
              Discover and explore images from across the web with AI-powered visual search
            </p>

            {/* Search Bar with Neumorphic Design */}
            <form onSubmit={handleSearch} className="flex gap-3 items-center">
              <div className="relative flex-1 max-w-3xl">
                <div className="neu-inset rounded-2xl p-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search for images..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent px-12 py-4 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 neu-button rounded-full p-2 hover:scale-110 transition-transform"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`neu-button rounded-2xl p-4 transition-all ${showFilters ? 'shadow-neu-lg' : ''}`}
              >
                <Filter className="size-5" />
              </button>

              <div className="neu-inset rounded-2xl p-1 flex gap-1">
                <button
                  type="button"
                  onClick={() => setGridSize('large')}
                  className={`p-2 rounded-xl transition-all ${gridSize === 'large' ? 'neu-raised' : 'hover:bg-background/40'}`}
                  title="Large grid"
                >
                  <Grid2x2 className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setGridSize('small')}
                  className={`p-2 rounded-xl transition-all ${gridSize === 'small' ? 'neu-raised' : 'hover:bg-background/40'}`}
                  title="Small grid"
                >
                  <Grid3x3 className="size-5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Main Content */}
        <div className="container max-w-7xl mx-auto px-6 py-10 flex-1">
          {/* Categories with Neumorphic Buttons */}
          <section className="mb-8">
            <div className="flex flex-wrap gap-2">
              {sampleCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'neu-raised text-foreground shadow-neu'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </section>

          {/* Image Grid with Neumorphic Cards */}
          <section>
            <div
              className={`grid gap-6 ${
                gridSize === 'large'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              }`}
            >
              {sampleImages.map((image, index) => (
                <div
                  key={index}
                  className="neu-card rounded-2xl p-2 hover:shadow-neu-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                >
                  <div className="neu-inset rounded-xl overflow-hidden mb-3">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="px-2 pb-2">
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {image.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{image.source}</span>
                      <span className="neu-inset px-2 py-0.5 rounded-md">{image.size}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageMorphWrapper>
  )
}
