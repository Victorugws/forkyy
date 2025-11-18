'use client'

import { HeaderNavbar } from '@/components/header-navbar'
import { VideoBackground } from '@/components/VideoBackground'
import { useState, useEffect } from 'react'
import { MorphingCanvas } from '@/components/MorphingCanvas'
import { TabbedResultsPanel, TabbedResultsPanelContent, ResultCard, type TabType } from '@/components/TabbedResultsPanel'
import { GoogleStyleResults } from '@/components/GoogleStyleResults'
import { Chat } from '@/components/chat'
import { FeaturedTemplates } from '@/components/FeaturedTemplates'
import { ContactForm } from '@/components/ContactForm'
import { CalBooking } from '@/components/CalBooking'
import { StripeButton } from '@/components/StripeButton'
import { generateId } from 'ai'

/**
 * Main Chat Interface with Neumorphic Styling
 * Uses morphing experience:
 * Eye → Blank Canvas → Search Fades In → Tabbed Results with Chat and All (Google-style) tabs
 */

export function NeumorphicHomePage() {
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
        <VideoBackground />
        <div className="relative z-10">
          <HeaderNavbar user={null} />
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
      </div>
    )
  }

  return (
    <div className="w-full bg-background min-h-screen">
      <VideoBackground />
      <div className="relative z-10">
        <HeaderNavbar user={null} />
        <MorphingCanvas
          onSearchSubmit={handleSearch}
          autoProgress={true}
        />
        <FeaturedTemplates />

        {/* Process Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <div className="neu-card rounded-full px-6 py-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-medium uppercase tracking-wider">PROCESS</span>
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 section-header">
            Simple & Scalable
          </h2>
          <p className="section-description mx-auto mb-16 text-lg text-muted-foreground">
            A transparent process of collaboration and feedback
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Workflow Assessment",
                description: "We begin by examining your existing workflows to identify where AI can deliver the greatest impact.",
                number: "01"
              },
              {
                icon: "✏️",
                title: "Deploy with Confidence",
                description: "Our team develops custom AI systems built around your goals, ensuring safe and reliable deployment.",
                number: "02"
              },
              {
                icon: "🎯",
                title: "Ongoing Support & Optimization",
                description: "After deployment, we provide support and refine your AI systems to keep them performing at their best.",
                number: "03"
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="neu-card rounded-3xl p-8 h-full bg-gradient-to-br from-background via-background to-muted/10 hover:shadow-neu-lg transition-all duration-300">
                  <div className="icon-card w-16 h-16 flex items-center justify-center text-2xl mb-6">
                    <span>{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">{item.description}</p>
                  <div className="absolute bottom-8 right-8 text-6xl font-bold text-muted/5">{item.number}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section with exact styling from d538d5e */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <div className="neu-card rounded-full px-6 py-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium uppercase tracking-wider">PROJECTS</span>
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 section-header">
            Proven Impact & Results
          </h2>
          <p className="section-description mx-auto mb-16 text-lg text-muted-foreground">
            Explore Projects that reflect our AI expertise & real world impact
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "MedioCare — AI Triage Assistant for Healthcare",
                description: "We built a custom AI triage assistant that evaluates symptoms and routes patients to the appropriate care level.",
                stats: [
                  { label: "Reduced average wait", value: "23%" },
                  { label: "Rise in patient satisfaction", value: "17%" }
                ]
              },
              {
                title: "RetailBoost — Predictive Inventory System",
                description: "Developed an AI system that predicts inventory needs and optimizes stock levels across multiple locations.",
                stats: [
                  { label: "Reduction in overstock", value: "31%" },
                  { label: "Improvement in fulfillment", value: "24%" }
                ]
              },
              {
                title: "FinanceAI — Automated Risk Analysis",
                description: "Created an AI-powered risk analysis platform that evaluates financial portfolios in real-time.",
                stats: [
                  { label: "Faster risk assessment", value: "45%" },
                  { label: "Accuracy improvement", value: "28%" }
                ]
              }
            ].map((project, i) => (
              <div key={i} className="neu-card rounded-3xl p-8 bg-gradient-to-br from-background via-background to-muted/10 hover:shadow-neu-lg transition-all duration-300 group">
                <div className="relative overflow-hidden rounded-2xl mb-6 h-48 neu-inset bg-gradient-to-br from-muted/20 to-muted/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                  <div className="absolute bottom-4 left-4 text-sm font-semibold text-muted-foreground">
                    0{i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed mb-6">{project.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  {project.stats.map((stat, j) => (
                    <div key={j} className="neu-inset rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 px-6 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
            <p className="text-muted-foreground text-lg">
              Ready to transform your business with AI? Let&apos;s talk.
            </p>
          </div>
          <ContactForm />
          <div className="mt-12">
            <CalBooking />
          </div>
        </section>
      </div>
    </div>
  )
}
