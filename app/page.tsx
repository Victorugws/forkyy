'use client'

import { useState, useEffect } from 'react'
import { MorphingCanvas } from '@/components/MorphingCanvas'
import { TabbedResultsPanel, TabbedResultsPanelContent, ResultCard, type TabType } from '@/components/TabbedResultsPanel'
import { GoogleStyleResults } from '@/components/GoogleStyleResults'
import { Chat } from '@/components/chat'
import { FeaturedTemplates } from '@/components/FeaturedTemplates'
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
    <div className="w-full bg-background">
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

      {/* Projects Section */}
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

      {/* Customers Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <div className="neu-card rounded-full px-6 py-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-medium uppercase tracking-wider">CUSTOMERS</span>
          </div>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 section-header">
          What Our Clients Say
        </h2>
        <p className="section-description mx-auto mb-16 text-lg text-muted-foreground">
          Join customers who trust AI to transform their business.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[
            {
              text: "Their AI-driven approach helped us reach the right audience and grow faster with smarter insights—streamlining our strategy, improving engagement, and delivering results we couldn't achieve before.",
              rating: 4,
              name: "Brendan",
              title: "Marketing Director at StratIQ",
              avatar: "👨"
            },
            {
              text: "Their team helped us identify key opportunities for AI, then built tools that boosted both our speed and accuracy. We're already seeing results.",
              rating: 4,
              name: "Lena M",
              title: "Manager at NovaTech",
              avatar: "👩"
            },
            {
              text: "From ideation to final delivery, they were incredibly proactive and sharp. Our new AI-powered assistant reduced manual work and improved user satisfaction",
              rating: 4,
              name: "Eli R",
              title: "COO at GridFrame",
              avatar: "👨"
            }
          ].map((testimonial, i) => (
            <div key={i} className="neu-card rounded-3xl p-8 bg-gradient-to-br from-background via-background to-muted/10 hover:shadow-neu-lg transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className={j < testimonial.rating ? "text-yellow-500" : "text-muted"}>★</span>
                ))}
              </div>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">{testimonial.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full neu-card flex items-center justify-center text-2xl bg-gradient-to-br from-background to-muted/20">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { value: "100+", label: "Projects Completed" },
            { value: "95%", label: "Client Satisfaction" },
            { value: "10+", label: "Years of Experience" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <div className="neu-card rounded-full px-6 py-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium uppercase tracking-wider">PRICING</span>
          </div>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 section-header">
          Simple Price For All
        </h2>
        <p className="section-description mx-auto mb-8 text-lg text-muted-foreground">
          Flexible pricing plans that fit your budget & scale with needs.
        </p>

        <div className="flex justify-center gap-2 mb-12">
          <button className="neu-card rounded-full px-6 py-2 text-sm font-medium">Monthly</button>
          <button className="neu-inset rounded-full px-6 py-2 text-sm font-medium text-muted-foreground">Yearly</button>
          <div className="neu-card rounded-full px-4 py-2 text-sm font-medium text-green-600">30% off</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Starter",
              price: "$800",
              description: "Ideal for businesses ready to explore AI and intelligent automation",
              features: [
                "Basic AI Tools",
                "Limited Automation Features",
                "Real-Time Reporting",
                "Basic Chatbot Integration"
              ],
              popular: false
            },
            {
              name: "Pro",
              price: "$1700",
              description: "Built for companies that want to gain an edge with AI-powered automation",
              features: [
                "Advanced AI Tools",
                "Customizable Workflows",
                "AI-Powered Analytics",
                "Premium Chatbot Features",
                "Cross-Platform Integrations"
              ],
              popular: true
            },
            {
              name: "Enterprise",
              price: "$4700",
              description: "For businesses aiming to harness AI and automation to lead their industry",
              features: [
                "Fully Customized AI Solutions",
                "Unlimited Integrations",
                "Advanced Reporting & Insights",
                "Scalable AI Solutions",
                "Team Collaboration Features",
                "Priority Feature Access"
              ],
              popular: false
            }
          ].map((plan, i) => (
            <div key={i} className={`neu-card rounded-3xl p-8 bg-gradient-to-br from-background via-background to-muted/10 hover:shadow-neu-lg transition-all duration-300 ${plan.popular ? 'ring-2 ring-foreground/20' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                {plan.popular && (
                  <div className="neu-card rounded-full px-3 py-1 text-xs font-medium">Popular</div>
                )}
              </div>
              <div className="text-5xl font-bold mb-2">{plan.price}<span className="text-lg text-muted-foreground">/month</span></div>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">{plan.description}</p>
              <button className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 mb-8 ${plan.popular ? 'bg-foreground text-background hover:shadow-lg' : 'neu-card hover:shadow-neu-lg'}`}>
                Get Started →
              </button>
              <div className="space-y-3">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          We donate 2% of your membership to pediatric wellbeing
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <div className="neu-card rounded-full px-6 py-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm font-medium uppercase tracking-wider">COMPARISON</span>
          </div>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 section-header">
          Precision vs Basic
        </h2>
        <p className="section-description mx-auto mb-16 text-lg text-muted-foreground">
          See how our AI outperforms competitors with speed.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="neu-card rounded-3xl p-10 bg-gradient-to-br from-background via-background to-muted/10">
            <h3 className="text-3xl font-bold text-center mb-12">ORB AI</h3>
            <div className="space-y-4">
              {[
                "Automated workflows",
                "Personalized AI-driven strategies",
                "Data-backed, real-time insights",
                "Scalable AI systems",
                "Trained chatbots",
                "Rapid, AI-generated content",
                "Real time data analysis"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-base text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 rounded-2xl font-semibold bg-foreground text-background hover:shadow-lg transition-all duration-300">
              Get Started →
            </button>
          </div>

          <div className="neu-inset rounded-3xl p-10 bg-gradient-to-br from-muted/5 to-muted/20">
            <h3 className="text-3xl font-bold text-center mb-12 text-muted-foreground">Others</h3>
            <div className="space-y-4">
              {[
                "Manual workflows",
                "Generic, one-size-fits-all solutions",
                "decision-making based on guesswork",
                "Lacks scalability",
                "Standard chatbots",
                "Time-consuming content creation"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-red-600/50 text-xl">✓</span>
                  <span className="text-base text-muted-foreground/60">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <div className="neu-card rounded-full px-6 py-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-sm font-medium uppercase tracking-wider">TEAM</span>
          </div>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 section-header">
          Team Behind Success
        </h2>
        <p className="section-description mx-auto mb-16 text-lg text-muted-foreground">
          Meet the experts behind our AI—driven to deliver smart solutions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Gwen chase",
              role: "Marketing",
              avatar: "👩‍🦰",
              socials: ["𝕏", "in", "✉"]
            },
            {
              name: "James Bond",
              role: "Designer",
              avatar: "👨",
              socials: ["𝕏", "in", "✉"]
            },
            {
              name: "Emily Gwen",
              role: "Support Team",
              avatar: "👩",
              socials: ["𝕏", "in", "✉"]
            }
          ].map((member, i) => (
            <div key={i} className="neu-card rounded-3xl p-8 bg-gradient-to-br from-background via-background to-muted/10 hover:shadow-neu-lg transition-all duration-300 group">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
              <div className="flex justify-center gap-3 mb-6">
                {member.socials.map((social, j) => (
                  <button key={j} className="neu-card w-10 h-10 rounded-xl flex items-center justify-center text-sm hover:shadow-neu-lg transition-all">
                    {social}
                  </button>
                ))}
              </div>
              <div className="neu-inset rounded-2xl aspect-square bg-gradient-to-br from-muted/20 to-muted/5 flex items-center justify-center text-8xl overflow-hidden">
                <div className="relative group-hover:scale-110 transition-transform duration-300">
                  {member.avatar}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <div className="neu-card rounded-full px-6 py-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium uppercase tracking-wider">CONTACT</span>
          </div>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 section-header">
          Reach Us At Anytime
        </h2>
        <p className="section-description mx-auto mb-16 text-lg text-muted-foreground">
          Have questions or need any help? We're here to help you with that
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="neu-card rounded-3xl p-8 bg-gradient-to-br from-background via-background to-muted/10">
              <div className="icon-card w-16 h-16 flex items-center justify-center text-2xl mb-4">
                ✉️
              </div>
              <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                Feel free to email me if you have any questions or need more details!
              </p>
              <a href="mailto:orbai@support.com" className="text-foreground font-semibold underline">
                orbai@support.com
              </a>
            </div>

            <div className="neu-card rounded-3xl p-8 bg-gradient-to-br from-background via-background to-muted/10">
              <div className="icon-card w-16 h-16 flex items-center justify-center text-2xl mb-4">
                📞
              </div>
              <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                Feel free to book a call if that's more convenient and easier for you
              </p>
              <button className="text-foreground font-semibold underline">
                Book a call
              </button>
            </div>
          </div>

          <div className="neu-card rounded-3xl p-8 bg-gradient-to-br from-background via-background to-muted/10">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Ikta Sollork"
                  className="w-full neu-inset rounded-2xl px-6 py-4 bg-background/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="orbai@support.com"
                  className="w-full neu-inset rounded-2xl px-6 py-4 bg-background/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject Of Interest</label>
                <input
                  type="text"
                  placeholder="Regarding Project"
                  className="w-full neu-inset rounded-2xl px-6 py-4 bg-background/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">How may we assist you?</label>
                <textarea
                  placeholder="Give us more info.."
                  rows={4}
                  className="w-full neu-inset rounded-2xl px-6 py-4 bg-background/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-2xl font-semibold bg-foreground text-background hover:shadow-lg transition-all duration-300"
              >
                Send Your Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <div className="neu-card rounded-full px-6 py-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium uppercase tracking-wider">FAQS</span>
          </div>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 section-header">
          Questions? Answers!
        </h2>
        <p className="section-description mx-auto mb-16 text-lg text-muted-foreground">
          Find Some quick answers to the most common questions.
        </p>

        <div className="space-y-4">
          {[
            {
              question: "What services do you offer?",
              answer: "We specialize in AI solutions, including machine learning models, automation, chatbots, predictive analytics, and consulting tailored to your business needs"
            },
            {
              question: "How long does it take to develop an AI solution?",
              answer: "Development time varies based on complexity and scope. Simple projects may take 2-4 weeks, while more complex solutions can take 2-3 months or more."
            },
            {
              question: "Do I need technical expertise to work with you?",
              answer: "Not at all! We handle all the technical aspects and guide you through the process, ensuring you understand each step without needing any technical background."
            },
            {
              question: "Is my data safe when working with your agency?",
              answer: "Absolutely. We follow industry-standard security practices and compliance requirements to ensure your data is protected at all times."
            },
            {
              question: "Can AI really help my business grow?",
              answer: "Yes! AI can automate repetitive tasks, provide valuable insights from data, improve customer experience, and help you make better business decisions."
            }
          ].map((faq, i) => (
            <div key={i} className="neu-card rounded-2xl p-6 bg-gradient-to-br from-background via-background to-muted/10 hover:shadow-neu-lg transition-all duration-300">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-lg font-semibold">{faq.question}</span>
                  <span className="transition-transform group-open:rotate-180">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-muted-foreground text-base leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Feel free to mail us for any enquiries : <a href="mailto:orbai@support.com" className="underline">orbai@support.com</a>
        </div>
      </section>
    </div>
  )
}
