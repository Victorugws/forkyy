'use client'

import { useState, useEffect } from 'react'
import { SearchTabs } from './SearchTabs'
import { LoadingSkeleton } from '../shared/LoadingSkeleton'
import { Eye, FileText, ExternalLink } from 'lucide-react'

type TabType = 'all' | 'images' | 'videos' | 'news'

interface SearchResultsProps {
  query: string
  initialTab?: TabType
}

export function SearchResults({ query, initialTab = 'all' }: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)
  const [loading, setLoading] = useState(true)
  const [newsResults, setNewsResults] = useState<any[]>([])
  const [imageResults, setImageResults] = useState<any[]>([])
  const [videoResults, setVideoResults] = useState<any[]>([])

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        // Fetch different types of results in parallel
        const [newsRes, imagesRes, videosRes] = await Promise.all([
          fetch(`/api/news/infinite?page=1&interests=${query}`),
          fetch(`/api/images?query=${encodeURIComponent(query)}`),
          fetch(`/api/videos?query=${encodeURIComponent(query)}`)
        ])

        const [newsData, imagesData, videosData] = await Promise.all([
          newsRes.json(),
          imagesRes.json(),
          videosRes.json()
        ])

        if (newsData.success || newsData.fallback) {
          setNewsResults(newsData.articles || [])
        }
        if (imagesData.success || imagesData.fallback) {
          setImageResults(imagesData.data || [])
        }
        if (videosData.success || videosData.fallback) {
          setVideoResults(videosData.data || [])
        }
      } catch (error) {
        console.error('Error fetching search results:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} query={query} />
        <div className="container max-w-7xl mx-auto px-6 py-8">
          <LoadingSkeleton count={5} type="news" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} query={query} />

      <div className="container max-w-7xl mx-auto px-6 py-8">
        {/* All Tab - Show everything */}
        {activeTab === 'all' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-foreground">Search Results for "{query}"</h2>

            {/* News Section */}
            {newsResults.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">News</h3>
                <div className="space-y-3">
                  {newsResults.slice(0, 3).map((article: any, index: number) => (
                    <NewsResultCard key={index} article={article} />
                  ))}
                </div>
              </div>
            )}

            {/* Images Section */}
            {imageResults.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Images</h3>
                <div className="grid grid-cols-4 gap-4">
                  {imageResults.slice(0, 4).map((image: any, index: number) => (
                    <ImageResultCard key={index} image={image} />
                  ))}
                </div>
              </div>
            )}

            {/* Videos Section */}
            {videoResults.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Videos</h3>
                <div className="grid grid-cols-3 gap-4">
                  {videoResults.slice(0, 3).map((video: any, index: number) => (
                    <VideoResultCard key={index} video={video} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Images Tab - Only images */}
        {activeTab === 'images' && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Image Results for "{query}"</h2>
            <div className="grid grid-cols-4 gap-4">
              {imageResults.map((image: any, index: number) => (
                <ImageResultCard key={index} image={image} />
              ))}
            </div>
            {imageResults.length === 0 && (
              <p className="text-muted-foreground text-center py-12">No images found for this search.</p>
            )}
          </div>
        )}

        {/* Videos Tab - Only videos */}
        {activeTab === 'videos' && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Video Results for "{query}"</h2>
            <div className="grid grid-cols-3 gap-6">
              {videoResults.map((video: any, index: number) => (
                <VideoResultCard key={index} video={video} />
              ))}
            </div>
            {videoResults.length === 0 && (
              <p className="text-muted-foreground text-center py-12">No videos found for this search.</p>
            )}
          </div>
        )}

        {/* News Tab - Only news */}
        {activeTab === 'news' && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">News Results for "{query}"</h2>
            <div className="space-y-4">
              {newsResults.map((article: any, index: number) => (
                <NewsResultCard key={index} article={article} />
              ))}
            </div>
            {newsResults.length === 0 && (
              <p className="text-muted-foreground text-center py-12">No news articles found for this search.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// News Result Card Component
function NewsResultCard({ article }: { article: any }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="flex gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-all">
        {article.image && (
          <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
            <ExternalLink className="size-4 text-muted-foreground flex-shrink-0" />
          </div>

          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {article.summary}
          </p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="px-2 py-0.5 rounded-full bg-muted">
              {article.source}
            </span>
            {article.publishedHours && (
              <span>{article.publishedHours}h ago</span>
            )}
          </div>
        </div>
      </div>
    </a>
  )
}

// Image Result Card Component
function ImageResultCard({ image }: { image: any }) {
  return (
    <a
      href={image.url || image.thumbnail}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all">
        <div className="aspect-square bg-muted">
          <img
            src={image.thumbnail || image.url}
            alt={image.title || 'Image'}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        {image.title && (
          <div className="p-2">
            <p className="text-xs text-muted-foreground line-clamp-1">{image.title}</p>
          </div>
        )}
      </div>
    </a>
  )
}

// Video Result Card Component
function VideoResultCard({ video }: { video: any }) {
  return (
    <a
      href={video.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all">
        <div className="relative aspect-video bg-muted">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {video.duration && (
            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-xs rounded">
              {video.duration}
            </span>
          )}
        </div>
        <div className="p-3">
          <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
            {video.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{video.channel}</span>
            {video.views && (
              <>
                <span>•</span>
                <span>{video.views} views</span>
              </>
            )}
          </div>
        </div>
      </div>
    </a>
  )
}
