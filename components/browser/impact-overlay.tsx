'use client'

import { motion, AnimatePresence } from 'motion/react'
import { X, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ImpactData {
  entity: string
  categories: {
    label: string
    rating: number
    description: string
    comparisonValue: number
    comparisonLabel: string
  }[]
}

interface ImpactOverlayProps {
  isOpen: boolean
  onClose: () => void
  selectedText: string
  element?: HTMLElement
}

export function ImpactOverlay({ isOpen, onClose, selectedText, element }: ImpactOverlayProps) {
  const [impactData, setImpactData] = useState<ImpactData | null>(null)
  const [activeCategory, setActiveCategory] = useState(0)
  const [loading, setLoading] = useState(true)

  // Analyze the selected text/element
  useEffect(() => {
    if (!isOpen || !selectedText) return

    const performAnalysis = async () => {
      setLoading(true)

      // Simulate analysis - in real implementation, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Generate mock impact analysis
      const categories = [
        {
          label: 'CREDIBILITY',
          rating: Math.floor(Math.random() * 30) + 60,
          description: 'Analysis of source credibility and trustworthiness based on content patterns and metadata.',
          comparisonValue: Math.floor(Math.random() * 20) + 70,
          comparisonLabel: 'Industry average'
        },
        {
          label: 'ACCURACY',
          rating: Math.floor(Math.random() * 30) + 55,
          description: 'Evaluation of factual accuracy through cross-referencing and verification checks.',
          comparisonValue: Math.floor(Math.random() * 20) + 65,
          comparisonLabel: 'Verified sources'
        },
        {
          label: 'BIAS',
          rating: Math.floor(Math.random() * 30) + 50,
          description: 'Detection of potential bias through language analysis and sentiment evaluation.',
          comparisonValue: Math.floor(Math.random() * 20) + 60,
          comparisonLabel: 'Neutral baseline'
        },
        {
          label: 'SAFETY',
          rating: Math.floor(Math.random() * 30) + 70,
          description: 'Assessment of content safety including potential misinformation or harmful patterns.',
          comparisonValue: Math.floor(Math.random() * 20) + 75,
          comparisonLabel: 'Safe content threshold'
        }
      ]

      setImpactData({
        entity: selectedText.slice(0, 50) + (selectedText.length > 50 ? '...' : ''),
        categories
      })

      setLoading(false)
    }

    performAnalysis()
  }, [isOpen, selectedText])

  const currentCategory = impactData?.categories[activeCategory]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Frosted Glass Backdrop */}
          <motion.div
            initial={{ backdropFilter: 'blur(0px)' }}
            animate={{ backdropFilter: 'blur(20px)' }}
            exit={{ backdropFilter: 'blur(0px)' }}
            className="absolute inset-0 bg-black/40"
          />

          {/* Impact Analysis Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Header */}
              <div className="relative p-6 border-b border-gray-200/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">Impact Analysis</h2>
                      <p className="text-sm text-gray-600 mt-1">AI-powered content evaluation</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
                    <div className="w-5 h-5 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-700 font-medium">Analyzing content...</span>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  {/* Selected Text Display */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200/50">
                    <p className="text-xs text-gray-500 mb-1 font-medium">ANALYZING</p>
                    <p className="text-gray-800 text-sm italic line-clamp-2">"{impactData?.entity}"</p>
                  </div>

                  {/* Category Tabs */}
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {impactData?.categories.map((category, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveCategory(index)}
                        className={cn(
                          'px-4 py-3 rounded-2xl font-medium text-sm transition-all',
                          activeCategory === index
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>

                  {/* Category Content */}
                  {currentCategory && (
                    <motion.div
                      key={activeCategory}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Description */}
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {currentCategory.description}
                      </p>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Rating Card */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-6 border border-gray-200/50">
                          <div className="relative z-10">
                            <div className="flex items-baseline gap-1 mb-2">
                              <span className="text-4xl font-bold text-gray-900">
                                {currentCategory.rating}
                              </span>
                              <span className="text-2xl font-semibold text-gray-500">%</span>
                            </div>
                            <p className="text-sm text-gray-600 font-medium">Impact Rating</p>
                          </div>
                          {/* Decorative gradient */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl" />
                        </div>

                        {/* Comparison Card */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-6 border border-gray-200/50">
                          <div className="relative z-10">
                            <div className="flex items-baseline gap-1 mb-2">
                              <span className="text-4xl font-bold text-gray-900">
                                {currentCategory.comparisonValue}
                              </span>
                              <span className="text-2xl font-semibold text-gray-500">%</span>
                            </div>
                            <p className="text-sm text-gray-600 font-medium">
                              {currentCategory.comparisonLabel}
                            </p>
                          </div>
                          {/* Decorative gradient */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl" />
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600 font-medium">
                          <span>Performance Score</span>
                          <span>{currentCategory.rating}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${currentCategory.rating}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={cn(
                              'h-full rounded-full',
                              currentCategory.rating >= 75 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                              currentCategory.rating >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                              'bg-gradient-to-r from-red-400 to-red-500'
                            )}
                          />
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
    </AnimatePresence>
  )
}
