'use client'

import React, { useState, useEffect } from 'react'
import { ImpactAnalysis, analyzeImpactFromSearchResults, Rating } from '@/lib/utils/impact-analysis'
import { SearchResults } from '@/lib/types'
import { Card } from '@/components/ui/card'

interface ImpactAnalysisDisplayProps {
  query: string
  searchResults?: SearchResults
  onAnalysisComplete?: (analysis: ImpactAnalysis) => void
}

export function ImpactAnalysisDisplay({
  query,
  searchResults,
  onAnalysisComplete
}: ImpactAnalysisDisplayProps) {
  const [analysis, setAnalysis] = useState<ImpactAnalysis | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [animatedRating, setAnimatedRating] = useState(0)
  const [animatedComparison, setAnimatedComparison] = useState(0)

  useEffect(() => {
    if (searchResults) {
      const performAnalysis = async () => {
        try {
          setIsLoading(true)
          const result = await analyzeImpactFromSearchResults(query, searchResults)
          setAnalysis(result)
          onAnalysisComplete?.(result)
        } catch (error) {
          console.error('Error performing impact analysis:', error)
        } finally {
          setIsLoading(false)
        }
      }
      performAnalysis()
    }
  }, [query, searchResults, onAnalysisComplete])

  const tabs = [
    { label: 'SOCIAL', key: 'social' },
    { label: 'FINANCIAL', key: 'financial' },
    { label: 'HUMANITARIAN', key: 'humanitarian' },
    { label: 'PHILANTHROPIC', key: 'philanthropic' }
  ]

  const currentRating: Rating = analysis?.ratings?.[activeTab] || {
    category: '',
    rating: 40,
    description: 'We built a custom AI triage assistant that evaluates symptoms and routes patients to the appropriate care level.',
    comparisonMetric: {
      label: 'Rise in patient satisfaction',
      value: 30
    }
  }

  // Get entity image from search results
  const entityImage = searchResults?.images && searchResults.images.length > 0
    ? typeof searchResults.images[0] === 'string'
      ? searchResults.images[0]
      : searchResults.images[0].url
    : null

  // Counter animation effect
  useEffect(() => {
    if (!analysis) return

    const targetRating = currentRating.rating
    const targetComparison = currentRating.comparisonMetric.value

    const duration = 1500
    const steps = 50
    const ratingStep = targetRating / steps
    const comparisonStep = targetComparison / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      setAnimatedRating(Math.floor(ratingStep * currentStep))
      setAnimatedComparison(Math.floor(comparisonStep * currentStep))

      if (currentStep >= steps) {
        setAnimatedRating(targetRating)
        setAnimatedComparison(targetComparison)
        clearInterval(timer)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [currentRating, activeTab, analysis])

  if (isLoading) {
    return null
  }

  if (!analysis) {
    return null
  }

  return (
    <div className="w-full">
      {/* Categories at top - stretched buttons */}
      <div className="mb-8">
        <div className="grid grid-cols-4 gap-4">
          {tabs.map((tab, index) => (
            <button
              key={tab.key}
              className={`cursor-pointer transition-all duration-300 py-3 rounded-2xl text-sm font-medium ${
                activeTab === index
                  ? 'bg-white shadow-lg text-gray-900'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content - horizontal layout matching Orbai template */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.2fr] gap-12 items-center">
        {/* Left: Larger Image */}
        <div className="relative">
          {entityImage ? (
            <img
              src={entityImage}
              alt={analysis.entity}
              className="w-full h-[450px] object-cover rounded-3xl"
            />
          ) : (
            <div className="w-full h-[450px] rounded-3xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-9xl font-bold text-gray-400">
                {analysis.entity?.[0] || '?'}
              </span>
            </div>
          )}
        </div>

        {/* Right: Content and Metrics */}
        <div className="relative pt-2">
          {/* Project Number */}
          <div className="text-sm font-medium text-gray-700 mb-6">
            0{activeTab + 1}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-medium text-gray-900 mb-6 leading-tight">
            {analysis.entity} — {tabs[activeTab].label.charAt(0) + tabs[activeTab].label.slice(1).toLowerCase()} Impact
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            {currentRating.description}
          </p>

          {/* Metrics - Side by Side aligned to match template */}
          <div className="grid grid-cols-2 gap-5">
            {/* Left Metric */}
            <Card className="flex-col justify-center items-center p-6 text-center light-strip">
              <div className="text-3xl font-medium text-gray-900 mb-1 leading-none">
                {animatedRating}%
              </div>
              <div className="text-sm text-gray-600">
                Reduced average wait
              </div>
            </Card>

            {/* Right Metric */}
            <Card className="flex-col justify-center items-center p-6 text-center light-strip">
              <div className="text-3xl font-medium text-gray-900 mb-1 leading-none">
                {animatedComparison}%
              </div>
              <div className="text-sm text-gray-600">
                {currentRating.comparisonMetric.label}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}