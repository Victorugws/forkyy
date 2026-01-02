'use client'

import { motion, AnimatePresence } from 'motion/react'
import { X, Sparkles, Search, Image as ImageIcon, BookOpen, TrendingUp, ExternalLink, Lightbulb, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface SignificantElement {
  element: HTMLElement
  content: string
  type: string
  significance?: number
  position: { x: number; y: number; width: number; height: number }
}

interface SearchResult {
  title: string
  snippet: string
  url: string
  source: string
}

interface ImageResult {
  url: string
  thumbnail: string
  title: string
  source: string
}

interface KnowledgePanel {
  title: string
  description: string
  image?: string
  facts: { label: string; value: string }[]
}

interface AnalysisData {
  searchResults: SearchResult[]
  imageResults: ImageResult[]
  knowledgePanel?: KnowledgePanel
  relatedTopics: string[]
  summary: string
}

interface HyperAnalysisOverlayProps {
  isOpen: boolean
  onClose: () => void
  element: SignificantElement | null
}

type AnalysisTab = 'overview' | 'search' | 'images' | 'knowledge'

export function HyperAnalysisOverlay({ isOpen, onClose, element }: HyperAnalysisOverlayProps) {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [activeTab, setActiveTab] = useState<AnalysisTab>('overview')
  const [loading, setLoading] = useState(true)

  // Analyze the selected element
  useEffect(() => {
    if (!isOpen || !element) return

    const performAnalysis = async () => {
      setLoading(true)
      setActiveTab('overview')

      // Simulate analysis - in real implementation, this would call backend APIs
      await new Promise(resolve => setTimeout(resolve, 1200))

      // Generate mock analysis based on element type and content
      const mockAnalysis: AnalysisData = generateMockAnalysis(element)

      setAnalysisData(mockAnalysis)
      setLoading(false)
    }

    performAnalysis()
  }, [isOpen, element])

  // Generate mock analysis data
  const generateMockAnalysis = (elem: SignificantElement): AnalysisData => {
    const searchQuery = elem.content.slice(0, 100)

    // Mock search results
    const searchResults: SearchResult[] = [
      {
        title: `Understanding ${elem.type}: ${searchQuery.slice(0, 40)}...`,
        snippet: `Comprehensive information about ${searchQuery.slice(0, 60)}. Learn more about this ${elem.type} and related concepts.`,
        url: `https://example.com/search?q=${encodeURIComponent(searchQuery)}`,
        source: 'Wikipedia'
      },
      {
        title: `${searchQuery.slice(0, 50)} - Complete Guide`,
        snippet: `Everything you need to know about ${searchQuery.slice(0, 50)}. Detailed analysis and insights.`,
        url: `https://example.com/guide/${elem.type}`,
        source: 'Encyclopedia'
      },
      {
        title: `Latest Information on ${elem.type}`,
        snippet: `Recent developments and updates related to ${searchQuery.slice(0, 40)}.`,
        url: `https://example.com/latest/${elem.type}`,
        source: 'News Source'
      }
    ]

    // Mock image results
    const imageResults: ImageResult[] = Array.from({ length: 6 }, (_, i) => ({
      url: `https://picsum.photos/seed/${elem.content.slice(0, 10)}-${i}/400/300`,
      thumbnail: `https://picsum.photos/seed/${elem.content.slice(0, 10)}-${i}/200/150`,
      title: `${elem.type} image ${i + 1}`,
      source: `Source ${i + 1}`
    }))

    // Mock knowledge panel
    const knowledgePanel: KnowledgePanel = {
      title: searchQuery.slice(0, 60),
      description: `${elem.content.slice(0, 200)}${elem.content.length > 200 ? '...' : ''}`,
      image: `https://picsum.photos/seed/${elem.content.slice(0, 10)}/300/200`,
      facts: [
        { label: 'Type', value: elem.type.charAt(0).toUpperCase() + elem.type.slice(1) },
        { label: 'Relevance', value: `${elem.significance ?? 85}%` },
        { label: 'Content Length', value: `${elem.content.length} characters` },
        { label: 'Category', value: getCategoryFromType(elem.type) }
      ]
    }

    // Mock related topics
    const relatedTopics = [
      `Related ${elem.type} content`,
      `Similar topics`,
      `More about ${searchQuery.split(' ')[0]}`,
      `${elem.type} examples`,
      `Learn more`
    ]

    // Generate summary
    const summary = `This ${elem.type} contains information about "${searchQuery.slice(0, 80)}${searchQuery.length > 80 ? '...' : ''}". It has a significance score of ${elem.significance}% and provides valuable context within the page.`

    return {
      searchResults,
      imageResults,
      knowledgePanel,
      relatedTopics,
      summary
    }
  }

  const getCategoryFromType = (type: string): string => {
    const categories: Record<string, string> = {
      heading: 'Editorial Content',
      image: 'Visual Media',
      video: 'Video Content',
      link: 'Navigation',
      button: 'Interactive Element',
      paragraph: 'Text Content',
      text: 'Information',
      product: 'E-commerce'
    }
    return categories[type] || 'General'
  }

  const getTabIcon = (tab: AnalysisTab) => {
    switch (tab) {
      case 'overview': return Sparkles
      case 'search': return Search
      case 'images': return ImageIcon
      case 'knowledge': return BookOpen
    }
  }

  return (
    <AnimatePresence>
      {isOpen && element && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ backdropFilter: 'blur(0px)' }}
            animate={{ backdropFilter: 'blur(24px)' }}
            exit={{ backdropFilter: 'blur(0px)' }}
            className="absolute inset-0 bg-black/50"
          />

          {/* Main Analysis Panel */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="relative w-full max-w-5xl max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white/98 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Header */}
              <div className="relative p-6 border-b border-gray-200/50 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                      <Globe className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Hyper Analysis</h2>
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          {element.type}
                        </span>
                        AI-powered contextual search and analysis
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-200/50 rounded-xl transition-colors"
                  >
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mt-6">
                  {(['overview', 'search', 'images', 'knowledge'] as const).map((tab) => {
                    const Icon = getTabIcon(tab)
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all',
                          activeTab === tab
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                            : 'bg-white/70 text-gray-700 hover:bg-white/90'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="capitalize">{tab}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="p-16 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="inline-block"
                  >
                    <Sparkles className="h-12 w-12 text-purple-500" />
                  </motion.div>
                  <p className="text-gray-700 font-medium mt-4">Analyzing content...</p>
                  <p className="text-gray-500 text-sm mt-2">Searching across the web for relevant information</p>
                </div>
              ) : (
                <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)] custom-scrollbar">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && analysisData && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Summary Card */}
                      <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Quick Summary</h3>
                            <p className="text-gray-700 text-sm leading-relaxed">{analysisData.summary}</p>
                          </div>
                        </div>
                      </div>

                      {/* Knowledge Panel */}
                      {analysisData.knowledgePanel && (
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-purple-600" />
                              Knowledge Panel
                            </h3>
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                              {analysisData.knowledgePanel.image && (
                                <img
                                  src={analysisData.knowledgePanel.image}
                                  alt={analysisData.knowledgePanel.title}
                                  className="w-full h-40 object-cover rounded-xl mb-4"
                                />
                              )}
                              <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">
                                {analysisData.knowledgePanel.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                {analysisData.knowledgePanel.description}
                              </p>
                              <div className="space-y-2">
                                {analysisData.knowledgePanel.facts.map((fact, i) => (
                                  <div key={i} className="flex justify-between text-sm">
                                    <span className="text-gray-500">{fact.label}</span>
                                    <span className="font-medium text-gray-900">{fact.value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                              <TrendingUp className="h-5 w-5 text-purple-600" />
                              Related Topics
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {analysisData.relatedTopics.map((topic, i) => (
                                <button
                                  key={i}
                                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-purple-300 transition-colors"
                                >
                                  {topic}
                                </button>
                              ))}
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100 mt-4">
                              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Quick Actions</h4>
                              <div className="space-y-2">
                                <button className="w-full px-4 py-2 bg-white rounded-xl text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-2">
                                  <Search className="h-4 w-4" />
                                  Search on Google
                                </button>
                                <button className="w-full px-4 py-2 bg-white rounded-xl text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-2">
                                  <ImageIcon className="h-4 w-4" />
                                  Find Similar Images
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Search Results Tab */}
                  {activeTab === 'search' && analysisData && (
                    <motion.div
                      key="search"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                        <Search className="h-5 w-5 text-purple-600" />
                        Web Search Results
                      </h3>
                      {analysisData.searchResults.map((result, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="group p-4 bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-gray-500">{result.source}</span>
                                <ExternalLink className="h-3 w-3 text-gray-400" />
                              </div>
                              <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
                                {result.title}
                              </h4>
                              <p className="text-sm text-gray-600 line-clamp-2">{result.snippet}</p>
                              <p className="text-xs text-gray-400 mt-2 truncate">{result.url}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Image Results Tab */}
                  {activeTab === 'images' && analysisData && (
                    <motion.div
                      key="images"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                        <ImageIcon className="h-5 w-5 text-purple-600" />
                        Related Images
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {analysisData.imageResults.map((image, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                          >
                            <img
                              src={image.thumbnail}
                              alt={image.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="absolute bottom-0 left-0 right-0 p-3">
                                <p className="text-white text-xs font-medium truncate">{image.title}</p>
                                <p className="text-white/70 text-xs truncate">{image.source}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Knowledge Tab */}
                  {activeTab === 'knowledge' && analysisData?.knowledgePanel && (
                    <motion.div
                      key="knowledge"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {analysisData.knowledgePanel.title}
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {analysisData.knowledgePanel.description}
                          </p>

                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                            <h4 className="font-semibold text-gray-900 mb-4">Key Information</h4>
                            <div className="space-y-3">
                              {analysisData.knowledgePanel.facts.map((fact, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-purple-100 last:border-0">
                                  <span className="text-gray-600 font-medium">{fact.label}</span>
                                  <span className="font-semibold text-gray-900">{fact.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {analysisData.knowledgePanel.image && (
                            <img
                              src={analysisData.knowledgePanel.image}
                              alt={analysisData.knowledgePanel.title}
                              className="w-full rounded-2xl shadow-lg"
                            />
                          )}
                          <div className="bg-white rounded-2xl p-4 border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Explore More</h4>
                            <div className="space-y-2">
                              {analysisData.relatedTopics.slice(0, 5).map((topic, i) => (
                                <button
                                  key={i}
                                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
                                >
                                  {topic}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.5);
        }
      `}</style>
    </AnimatePresence>
  )
}
