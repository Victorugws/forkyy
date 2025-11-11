import React, { useState, useEffect } from 'react'

// Types - Inlined from the original types
type SearchResultImage = string | {
  url: string
  description: string
  number_of_results?: number
}

type SearchResultItem = {
  title: string
  url: string
  content: string
}

type SearchResults = {
  images: SearchResultImage[]
  results: SearchResultItem[]
  number_of_results?: number
  query: string
}

interface Rating {
  category: string
  rating: number
  description: string
  comparisonMetric: {
    label: string
    value: number
  }
}

interface ImpactAnalysis {
  entity: string
  entityType: string
  summary: string
  ratings: Rating[]
}

// Utility function for className merging - simplified version
function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ')
}

// Card Component - Inlined
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'box-border flex flex-row justify-start items-center p-5 overflow-hidden content-center flex-nowrap gap-6 rounded-[20px]',
      className
    )}
    style={{
      background: 'rgba(250, 251, 252, 0.82)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(220, 225, 230, 0.4)',
      borderTop: '2px solid rgba(245, 248, 250, 0.9)',
      boxShadow: `
        0px 0.7065919983928324px 0.7065919983928324px -0.6666666666666666px rgba(0, 0, 0, 0.08),
        0px 1.8065619053231785px 1.8065619053231785px -1.3333333333333333px rgba(0, 0, 0, 0.08),
        0px 3.6217592146567767px 3.6217592146567767px -2px rgba(0, 0, 0, 0.07),
        0px 6.8655999097303715px 6.8655999097303715px -2.6666666666666665px rgba(0, 0, 0, 0.07),
        0px 13.646761411524492px 13.646761411524492px -3.3333333333333335px rgba(0, 0, 0, 0.05),
        0px 30px 30px -4px rgba(0, 0, 0, 0.02),
        inset 0px 3px 1px 0px rgba(255, 255, 255, 0.5)
      `
    }}
    {...props}
  />
))
Card.displayName = 'Card'

// Impact Analysis Logic - Inlined
function determineEntityType(query: string, content: string): string {
  const lowerQuery = query.toLowerCase()
  const lowerContent = content.toLowerCase()

  if (
    lowerQuery.includes('company') ||
    lowerQuery.includes('corporation') ||
    lowerQuery.includes('inc') ||
    lowerQuery.includes('ltd') ||
    lowerContent.includes('founded') ||
    lowerContent.includes('headquarters') ||
    lowerContent.includes('ceo') ||
    lowerContent.includes('revenue')
  ) {
    return 'organization'
  }

  if (
    lowerContent.includes('born') ||
    lowerContent.includes('age') ||
    lowerContent.includes('biography') ||
    lowerContent.includes('personal life')
  ) {
    return 'person'
  }

  if (
    lowerQuery.includes('product') ||
    lowerQuery.includes('service') ||
    lowerContent.includes('features') ||
    lowerContent.includes('pricing')
  ) {
    return 'product'
  }

  return 'organization'
}

function getPositiveKeywords(category: string): string[] {
  const keywordMap: Record<string, string[]> = {
    Social: ['community', 'diversity', 'inclusion', 'social responsibility', 'environmental', 'sustainable'],
    Financial: ['profit', 'revenue', 'growth', 'successful', 'profitable', 'strong performance'],
    Humanitarian: ['charity', 'donation', 'humanitarian', 'aid', 'helping', 'relief', 'volunteer'],
    Philanthropic: ['foundation', 'donate', 'philanthropy', 'giving', 'charitable', 'nonprofit'],
    Professional: ['expertise', 'achievement', 'leadership', 'innovation', 'success', 'award'],
    Innovation: ['innovative', 'breakthrough', 'cutting-edge', 'revolutionary', 'advanced', 'pioneering'],
    Quality: ['high-quality', 'excellent', 'premium', 'reliable', 'trusted', 'award-winning'],
    'Market Impact': ['market leader', 'industry standard', 'widespread adoption', 'influential'],
    'User Satisfaction': ['positive reviews', 'satisfied customers', 'high ratings', 'recommended']
  }
  return keywordMap[category] || []
}

function getNegativeKeywords(category: string): string[] {
  const keywordMap: Record<string, string[]> = {
    Social: ['controversy', 'discrimination', 'scandal', 'negative impact'],
    Financial: ['loss', 'debt', 'bankruptcy', 'financial trouble', 'declining'],
    Humanitarian: ['criticized', 'insufficient', 'lack of support'],
    Philanthropic: ['minimal giving', 'criticized for lack'],
    Professional: ['failure', 'controversy', 'poor performance'],
    Innovation: ['outdated', 'behind', 'lacking innovation'],
    Quality: ['poor quality', 'defective', 'unreliable', 'problematic'],
    'Market Impact': ['declining market share', 'losing relevance'],
    'User Satisfaction': ['negative reviews', 'complaints', 'dissatisfied users']
  }
  return keywordMap[category] || []
}

function generateCategoryDescription(
  category: string,
  percentage: number,
  entityType: string
): string {
  const entityLabel = entityType === 'person' ? 'individual' : entityType

  if (percentage >= 80) {
    return `Strong ${category.toLowerCase()} performance with significant positive impact demonstrated by this ${entityLabel}.`
  } else if (percentage >= 60) {
    return `Good ${category.toLowerCase()} standing with notable contributions and positive influence in this area.`
  } else if (percentage >= 40) {
    return `Moderate ${category.toLowerCase()} impact with some positive indicators but room for improvement.`
  } else {
    return `Limited ${category.toLowerCase()} impact based on available information, may require further assessment.`
  }
}

function generateComparisonMetric(category: string): { label: string; value: number } {
  const benchmarks: Record<string, { label: string; value: number }> = {
    Social: { label: 'Industry Avg', value: 68 },
    Financial: { label: 'Market Leader', value: 82 },
    Humanitarian: { label: 'Sector Average', value: 65 },
    Philanthropic: { label: 'Top Tier', value: 75 },
    Professional: { label: 'Peer Average', value: 70 },
    Innovation: { label: 'Industry Standard', value: 72 },
    Quality: { label: 'Market Standard', value: 74 },
    'Market Impact': { label: 'Category Leader', value: 78 },
    'User Satisfaction': { label: 'Industry Avg', value: 69 }
  }

  const benchmark = benchmarks[category] || { label: 'Benchmark', value: 65 }
  const variance = Math.floor(Math.random() * 10) - 5
  benchmark.value = Math.max(45, Math.min(85, benchmark.value + variance))

  return benchmark
}

async function generateRatings(
  query: string,
  content: string,
  entityType: string
): Promise<Rating[]> {
  const lowerContent = content.toLowerCase()

  let categories: string[]
  if (entityType === 'person') {
    categories = ['Professional', 'Social', 'Philanthropic', 'Innovation']
  } else if (entityType === 'product') {
    categories = ['Quality', 'Innovation', 'Market Impact', 'User Satisfaction']
  } else {
    categories = ['Social', 'Financial', 'Humanitarian', 'Philanthropic']
  }

  const ratings: Rating[] = categories.map(category => {
    let percentage = 50
    let description = `${category} impact assessment based on available data.`

    const positiveKeywords = getPositiveKeywords(category)
    const negativeKeywords = getNegativeKeywords(category)

    let positiveScore = 0
    let negativeScore = 0

    positiveKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) {
        positiveScore += 5
      }
    })

    negativeKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) {
        negativeScore += 5
      }
    })

    percentage = Math.min(95, Math.max(15, percentage + positiveScore - negativeScore))
    description = generateCategoryDescription(category, percentage, entityType)
    const comparisonMetric = generateComparisonMetric(category)

    return {
      category,
      rating: percentage,
      description,
      comparisonMetric
    }
  })

  return ratings
}

function generateSummary(
  query: string,
  entityType: string,
  resultCount: number
): string {
  return `Comprehensive impact analysis of ${query} based on ${resultCount} search results. This ${entityType} demonstrates varying levels of impact across different categories, with ratings calculated from publicly available information and content analysis.`
}

async function analyzeImpactFromSearchResults(
  query: string,
  searchResults: SearchResults
): Promise<ImpactAnalysis> {
  const content = searchResults.results
    .slice(0, 5)
    .map(result => `${result.title}: ${result.content}`)
    .join('\n\n')

  const entityType = determineEntityType(query, content)
  const ratings = await generateRatings(query, content, entityType)
  const summary = generateSummary(query, entityType, searchResults.results.length)

  return {
    entity: query,
    entityType,
    summary,
    ratings
  }
}

// Main Component Props
interface ImpactAnalysisDisplayProps {
  query: string
  searchResults?: SearchResults
  onAnalysisComplete?: (analysis: ImpactAnalysis) => void
}

// Main Component
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

  const entityImage = searchResults?.images && searchResults.images.length > 0
    ? typeof searchResults.images[0] === 'string'
      ? searchResults.images[0]
      : searchResults.images[0].url
    : null

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
    <div style={{ width: '100%' }}>
      {/* Categories at top - using Framer structure */}
      <div style={{ marginBottom: '32px', opacity: 1 }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {tabs.map((tab, index) => (
            <div
              key={tab.key}
              onClick={() => setActiveTab(index)}
              style={{
                flex: 1,
                opacity: activeTab === index ? 1 : 0.5,
                willChange: 'transform',
                cursor: 'pointer'
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgb(245, 245, 245)',
                  width: '100%',
                  opacity: 1,
                  borderRadius: '8px',
                  boxShadow: 'rgba(0, 0, 0, 0.08) 0px 0.706592px 0.706592px -0.666667px, rgba(0, 0, 0, 0.08) 0px 1.806562px 1.806562px -1.333333px, rgba(0, 0, 0, 0.07) 0px 3.621759px 3.621759px -2px, rgba(0, 0, 0, 0.07) 0px 6.8656px 6.8656px -2.666667px, rgba(0, 0, 0, 0.05) 0px 13.646761px 13.646761px -3.333333px, rgba(0, 0, 0, 0.02) 0px 30px 30px -4px, rgb(255, 255, 255) 0px 3px 1px 0px inset',
                  willChange: 'auto',
                  padding: '12px',
                  textAlign: 'center' as const
                }}
              >
                <p style={{
                  fontFamily: 'Inter',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase' as const,
                  margin: 0,
                  color: 'rgb(0, 0, 0)'
                }}>
                  {tab.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content - using Framer structure */}
      <div style={{
        display: 'flex',
        gap: '54px',
        alignItems: 'center',
        opacity: 1
      }}>
        {/* Left: Larger Image */}
        <div style={{ willChange: 'transform', opacity: 1, transform: 'none', borderRadius: '16px' }}>
          <div style={{ borderRadius: '23px', transform: 'none', transformOrigin: '50% 50%', opacity: 1 }}>
            <div style={{
              borderRadius: '16px',
              boxShadow: 'rgba(0, 0, 0, 0.08) 0px 0.706592px 0.706592px -0.666667px, rgba(0, 0, 0, 0.08) 0px 1.806562px 1.806562px -1.333333px, rgba(0, 0, 0, 0.07) 0px 3.621759px 3.621759px -2px, rgba(0, 0, 0, 0.07) 0px 6.8656px 6.8656px -2.666667px, rgba(0, 0, 0, 0.05) 0px 13.646761px 13.646761px -3.333333px, rgba(0, 0, 0, 0.02) 0px 30px 30px -4px',
              opacity: 1
            }}>
              <div style={{ position: 'absolute' as const, borderRadius: 'inherit', inset: '0px' }}>
                {entityImage ? (
                  <img
                    src={entityImage}
                    alt={analysis.entity}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '450px',
                      borderRadius: 'inherit',
                      objectPosition: 'left center',
                      objectFit: 'cover' as const
                    }}
                  />
                ) : (
                  <div style={{
                    display: 'block',
                    width: '100%',
                    height: '450px',
                    borderRadius: 'inherit',
                    background: 'linear-gradient(135deg, #e5e5e5 0%, #d4d4d4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{
                      fontSize: '120px',
                      fontWeight: 700,
                      color: '#9ca3af'
                    }}>
                      {analysis.entity?.[0] || '?'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Content and Metrics */}
        <div style={{ opacity: 1, flex: 1 }}>
          {/* Project Number */}
          <div style={{
            color: 'rgb(0, 0, 0)',
            transform: 'none',
            opacity: 1,
            fontFamily: 'Inter',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '24px'
          }}>
            0{activeTab + 1}
          </div>

          {/* Title */}
          <div style={{
            transform: 'none',
            opacity: 1,
            marginBottom: '24px'
          }}>
            <p style={{
              fontFamily: 'Inter',
              fontSize: '24px',
              fontWeight: 500,
              lineHeight: 1.2,
              margin: 0,
              color: 'rgb(0, 0, 0)'
            }}>
              <span style={{ display: 'inline-block', opacity: 1, transform: 'none', willChange: 'transform' }}>
                {analysis.entity}
              </span>{' '}
              <span style={{ display: 'inline-block', opacity: 1, transform: 'none', willChange: 'transform' }}>
                —
              </span>{' '}
              <span style={{ display: 'inline-block', opacity: 1, transform: 'none', willChange: 'transform' }}>
                {tabs[activeTab].label.charAt(0) + tabs[activeTab].label.slice(1).toLowerCase()}
              </span>{' '}
              <span style={{ display: 'inline-block', opacity: 1, transform: 'none', willChange: 'transform' }}>
                Impact
              </span>
            </p>
          </div>

          {/* Description */}
          <div style={{
            opacity: 0.8,
            transform: 'none',
            marginBottom: '32px'
          }}>
            <p style={{
              fontFamily: 'Inter',
              fontSize: '14px',
              lineHeight: 1.5,
              margin: 0,
              color: 'rgb(0, 0, 0)'
            }}>
              {currentRating.description.split(' ').map((word, i) => (
                <span key={i} style={{ display: 'inline-block', opacity: 1, transform: 'none', willChange: 'transform' }}>
                  {word}
                </span>
              )).reduce((prev, curr, i) => [prev, ' ', curr])}
            </p>
          </div>

          {/* Metrics - Side by Side using Framer structure */}
          <div style={{ opacity: 1, display: 'flex', gap: '16px' }}>
            {/* Left Metric */}
            <div style={{
              willChange: 'transform',
              opacity: 1,
              transform: 'none',
              flex: 1
            }}>
              <div style={{
                backgroundColor: 'rgb(245, 245, 245)',
                width: '100%',
                borderRadius: '12px',
                boxShadow: 'rgba(0, 0, 0, 0.08) 0px 0.706592px 0.706592px -0.666667px, rgba(0, 0, 0, 0.08) 0px 1.806562px 1.806562px -1.333333px, rgba(0, 0, 0, 0.07) 0px 3.621759px 3.621759px -2px, rgba(0, 0, 0, 0.07) 0px 6.8656px 6.8656px -2.666667px, rgba(0, 0, 0, 0.05) 0px 13.646761px 13.646761px -3.333333px, rgba(0, 0, 0, 0.02) 0px 30px 30px -4px, rgb(255, 255, 255) 0px 3px 1px 0px inset',
                opacity: 1,
                padding: '24px',
                textAlign: 'center' as const
              }}>
                <div style={{ opacity: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '28px',
                    color: 'rgb(0, 0, 0)',
                    lineHeight: 1,
                    fontWeight: 500
                  }}>
                    {animatedRating}
                  </span>
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '28px',
                    color: 'rgb(0, 0, 0)',
                    lineHeight: 1,
                    fontWeight: 500
                  }}>
                    %
                  </span>
                </div>
                <div style={{
                  opacity: 0.8,
                  transform: 'none',
                  marginTop: '8px'
                }}>
                  <p style={{
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    lineHeight: 1.5,
                    margin: 0,
                    color: 'rgb(0, 0, 0)'
                  }}>
                    Impact Rating
                  </p>
                </div>
              </div>
            </div>

            {/* Right Metric */}
            <div style={{
              willChange: 'transform',
              opacity: 1,
              transform: 'none',
              flex: 1
            }}>
              <div style={{
                backgroundColor: 'rgb(245, 245, 245)',
                width: '100%',
                borderRadius: '12px',
                boxShadow: 'rgba(0, 0, 0, 0.08) 0px 0.706592px 0.706592px -0.666667px, rgba(0, 0, 0, 0.08) 0px 1.806562px 1.806562px -1.333333px, rgba(0, 0, 0, 0.07) 0px 3.621759px 3.621759px -2px, rgba(0, 0, 0, 0.07) 0px 6.8656px 6.8656px -2.666667px, rgba(0, 0, 0, 0.05) 0px 13.646761px 13.646761px -3.333333px, rgba(0, 0, 0, 0.02) 0px 30px 30px -4px, rgb(255, 255, 255) 0px 3px 1px 0px inset',
                opacity: 1,
                padding: '24px',
                textAlign: 'center' as const
              }}>
                <div style={{ opacity: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '28px',
                    color: 'rgb(0, 0, 0)',
                    lineHeight: 1,
                    fontWeight: 500
                  }}>
                    {animatedComparison}
                  </span>
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '28px',
                    color: 'rgb(0, 0, 0)',
                    lineHeight: 1,
                    fontWeight: 500
                  }}>
                    %
                  </span>
                </div>
                <div style={{
                  opacity: 0.8,
                  transform: 'none',
                  marginTop: '8px'
                }}>
                  <p style={{
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    lineHeight: 1.5,
                    margin: 0,
                    color: 'rgb(0, 0, 0)'
                  }}>
                    {currentRating.comparisonMetric.label}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sample data for testing in Framer
const sampleSearchResults: SearchResults = {
  query: "OpenAI",
  images: ["https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500"],
  results: [
    {
      title: "OpenAI - Artificial Intelligence Research Company",
      url: "https://openai.com",
      content: "OpenAI is an AI research and deployment company founded in 2015. The company focuses on developing safe artificial general intelligence that benefits humanity. OpenAI has made significant contributions to the field of artificial intelligence including GPT models, DALL-E, and ChatGPT. The company has received substantial funding and has partnerships with major technology companies. OpenAI emphasizes responsible AI development and has published extensive research on AI safety and alignment."
    },
    {
      title: "OpenAI's Mission and Values",
      url: "https://openai.com/about",
      content: "OpenAI's mission is to ensure that artificial general intelligence benefits all of humanity. The company is committed to conducting research to make AGI safe, and to promoting the broad distribution of benefits. OpenAI has a strong focus on safety research, including work on AI alignment, robustness, and interpretability. The company also engages in policy work and public outreach to promote responsible AI development across the industry."
    }
  ],
  number_of_results: 2
}

// Example usage component for Framer
export default function FramerImpactAnalysisExample() {
  return (
    <div style={{
      backgroundColor: 'rgb(245, 245, 245)',
      maxWidth: '100%',
      width: '100%',
      opacity: 1,
      borderRadius: '20px',
      boxShadow: 'rgba(0, 0, 0, 0.08) 0px 0.706592px 0.706592px -0.666667px, rgba(0, 0, 0, 0.08) 0px 1.806562px 1.806562px -1.333333px, rgba(0, 0, 0, 0.07) 0px 3.621759px 3.621759px -2px, rgba(0, 0, 0, 0.07) 0px 6.8656px 6.8656px -2.666667px, rgba(0, 0, 0, 0.05) 0px 13.646761px 13.646761px -3.333333px, rgba(0, 0, 0, 0.02) 0px 30px 30px -4px, rgb(255, 255, 255) 0px 3px 1px 0px inset',
      padding: '32px'
    }}>
      <ImpactAnalysisDisplay
        query="OpenAI"
        searchResults={sampleSearchResults}
        onAnalysisComplete={(analysis) => console.log('Analysis complete:', analysis)}
      />
    </div>
  )
}