'use client'

import { useState, useEffect } from 'react'
import { MorphingCanvas } from '@/components/MorphingCanvas'
import { TabbedResultsPanel, TabbedResultsPanelContent, ResultCard, type TabType } from '@/components/TabbedResultsPanel'
import { GoogleStyleResults } from '@/components/GoogleStyleResults'
import { Chat } from '@/components/chat'
import { generateId } from 'ai'

/**
 * Main Chat Interface
 * Uses morphing experience:
 * Eye → Blank Canvas → Search Fades In → Tabbed Results with Chat and All (Google-style) tabs
 */

export default function HomePage() {
  const [hasSearched, setHasSearched] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [chatId] = useState(() => generateId())

  // API data state
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [images, setImages] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [financialData, setFinancialData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    // After morphing sequence completes, show results
    // Total: 4500ms (search fades to canvas) + 3000ms (content fades from canvas) = 7500ms
    setTimeout(() => {
      setHasSearched(true)
    }, 7500) // After full morphing sequence
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
  }

  // Fetch data when search query changes and search is complete
  useEffect(() => {
    if (!hasSearched || !searchQuery) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch all data in parallel
        const [searchRes, imagesRes, videosRes, financeRes] = await Promise.all([
          fetch('/api/advanced-search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: searchQuery,
              maxResults: 10,
              searchDepth: 'basic'
            })
          }),
          fetch(`/api/images?query=${encodeURIComponent(searchQuery)}`),
          fetch(`/api/videos?query=${encodeURIComponent(searchQuery)}`),
          fetch(`/api/finance?type=stocks`)
        ])

        const [searchData, imagesData, videosData, financeData] = await Promise.all([
          searchRes.json(),
          imagesRes.json(),
          videosRes.json(),
          financeRes.json()
        ])

        // Update state with fetched data
        if (searchData.results) {
          setSearchResults(searchData.results.map((r: any) => ({
            title: r.title,
            url: r.url,
            description: r.content,
            source: new URL(r.url).hostname.replace('www.', ''),
            timestamp: 'Recently'
          })))
        }

        if (imagesData.success || imagesData.fallback) {
          setImages(imagesData.data)
        }

        if (videosData.success || videosData.fallback) {
          setVideos(videosData.data)
        }

        if (financeData.success || financeData.fallback) {
          setFinancialData(financeData.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [hasSearched, searchQuery])

  if (hasSearched) {
    return (
      <div className="w-full min-h-screen bg-background">
        <TabbedResultsPanel
          searchQuery={searchQuery}
          isLoading={isLoading}
          initialTab={activeTab}
          onTabChange={handleTabChange}
        >
          <TabbedResultsPanelContent>
            {/* Google-style results for "All" tab */}
            {activeTab === 'all' && (
              <GoogleStyleResults
                searchQuery={searchQuery}
                results={searchResults}
                images={images}
                videos={videos}
                aiCommentary={`${searchQuery} encompasses several key aspects. Here's a comprehensive overview based on the latest information: The topic has evolved significantly, with recent developments showing promising directions for future applications and research.`}
              />
            )}

            {/* Chat tab with real AI integration */}
            {activeTab === 'chat' && (
              <div className="h-full">
                <Chat
                  id={chatId}
                  query={searchQuery}
                  savedMessages={[]}
                />
              </div>
            )}

            {/* Images tab content */}
            {activeTab === 'images' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.length > 0 ? (
                  images.map((image, i) => (
                    <a
                      key={i}
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neu-card rounded-2xl p-2 hover:shadow-neu-lg transition-all group"
                    >
                      <div className="neu-inset rounded-xl aspect-square bg-background/50 overflow-hidden">
                        <img
                          src={image.thumbnail || image.url}
                          alt={image.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 truncate">
                        {image.title}
                      </p>
                      <p className="text-xs text-muted-foreground/60 truncate">
                        {image.source}
                      </p>
                    </a>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">Loading images...</p>
                  </div>
                )}
              </div>
            )}

            {/* Videos tab content */}
            {activeTab === 'videos' && (
              <div className="grid gap-4">
                {videos.length > 0 ? (
                  videos.map((video, i) => (
                    <ResultCard key={i}>
                      <a
                        href={video.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex gap-4 hover:opacity-80 transition-opacity group"
                      >
                        <div className="neu-inset rounded-xl w-48 h-28 bg-background/50 overflow-hidden shrink-0 relative">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                          />
                          {video.duration && (
                            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                              {video.duration}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {video.channel}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {video.views && <span>{video.views} views</span>}
                            {video.uploadedAt && (
                              <>
                                <span>•</span>
                                <span>{video.uploadedAt}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </a>
                    </ResultCard>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading videos...</p>
                  </div>
                )}
              </div>
            )}

            {/* Financials tab content */}
            {activeTab === 'financials' && (
              <div className="space-y-4">
                {financialData.length > 0 ? (
                  <>
                    <div className="neu-card rounded-2xl p-6">
                      <h2 className="text-xl font-semibold text-foreground mb-6">Market Indices</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {financialData.map((item, i) => (
                          <div key={i} className="neu-inset rounded-xl p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
                                <p className="text-sm text-muted-foreground">{item.ticker}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-foreground">{item.price}</p>
                                <p className={`text-sm font-semibold ${item.negative ? 'text-red-600' : 'text-green-600'}`}>
                                  {item.change}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <ResultCard>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">Market Overview</h3>
                        <p className="text-sm text-muted-foreground">
                          Current market data showing major indices and their performance.
                          Markets are dynamically updated to reflect real-time changes.
                        </p>
                      </div>
                    </ResultCard>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading financial data...</p>
                  </div>
                )}
              </div>
            )}
          </TabbedResultsPanelContent>
        </TabbedResultsPanel>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <MorphingCanvas
        onSearchSubmit={handleSearch}
        autoProgress={true}
      />
    </div>
  )
}
