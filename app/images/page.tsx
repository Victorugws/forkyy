'use client'

import { Image as ImageIcon, Search, Filter, Grid3x3, Grid2x2, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

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

const allImages = [
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
  },
  {
    url: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931',
    title: 'Ocean Waves',
    source: 'Unsplash',
    size: '1920x1080',
    category: 'Nature'
  },
  {
    url: 'https://images.unsplash.com/photo-1682687220208-22d7a2543e88',
    title: 'Forest Path',
    source: 'Unsplash',
    size: '1920x1280',
    category: 'Nature'
  },
  {
    url: 'https://images.unsplash.com/photo-1682687220923-c58b9a4592ae',
    title: 'Desert Dunes',
    source: 'Unsplash',
    size: '2048x1365',
    category: 'Nature'
  },
  {
    url: 'https://images.unsplash.com/photo-1682687221038-3d6312e0e4db',
    title: 'Northern Lights',
    source: 'Unsplash',
    size: '1920x1080',
    category: 'Nature'
  },
  {
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    title: 'Tech Setup',
    source: 'Unsplash',
    size: '1920x1080',
    category: 'Technology'
  },
  {
    url: 'https://images.unsplash.com/photo-1574169208507-84376144848b',
    title: 'Portrait',
    source: 'Unsplash',
    size: '1920x1080',
    category: 'People'
  },
  {
    url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee',
    title: 'Cat',
    source: 'Unsplash',
    size: '1920x1080',
    category: 'Animals'
  },
  {
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    title: 'Fresh Salad',
    source: 'Unsplash',
    size: '1920x1080',
    category: 'Food'
  }
]

export default function ImagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [gridSize, setGridSize] = useState<'large' | 'small'>('large')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredImages, setFilteredImages] = useState(allImages)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    let filtered = allImages

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(img => img.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(img =>
        img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredImages(filtered)
  }, [selectedCategory, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery + ' images')}`)
    }
  }

  const handleImageClick = (image: typeof allImages[0]) => {
    // Open image in new tab
    window.open(image.url, '_blank')
  }

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
          <form onSubmit={handleSearch} className="flex gap-3 items-center">
            <div className="relative flex-1 max-w-3xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e as any)}
                className="w-full rounded-2xl border border-input bg-background px-12 py-4 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`rounded-2xl border transition-colors ${showFilters ? 'border-primary bg-primary/10' : 'border-input bg-background hover:bg-accent'} p-4`}
            >
              <Filter className="size-5" />
            </button>
            <div className="flex gap-2 rounded-2xl border border-input bg-background p-1">
              <button
                type="button"
                onClick={() => setGridSize('large')}
                className={`p-2 rounded-xl transition-colors ${gridSize === 'large' ? 'bg-accent' : 'hover:bg-accent'}`}
                title="Large grid"
              >
                <Grid2x2 className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setGridSize('small')}
                className={`p-2 rounded-xl transition-colors ${gridSize === 'small' ? 'bg-accent' : 'hover:bg-accent'}`}
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
        {/* Categories */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            {sampleCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card hover:border-primary/50 hover:bg-accent'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Results Count */}
        {(selectedCategory !== 'All' || searchQuery) && (
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredImages.length} {filteredImages.length === 1 ? 'result' : 'results'}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchQuery && ` for "${searchQuery}"`}
          </div>
        )}

        {/* Image Grid */}
        <section>
          {filteredImages.length > 0 ? (
            <>
              <div
                className={`grid gap-4 ${
                  gridSize === 'large'
                    ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
                }`}
              >
                {filteredImages.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => handleImageClick(image)}
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
                <button
                  onClick={() => alert('Loading more images... (Would load from API in production)')}
                  className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Load More Images
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <ImageIcon className="size-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No images found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                }}
                className="mt-4 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
