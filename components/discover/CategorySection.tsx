'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { NewsCard } from './NewsCard'

interface Category {
  id: string
  title: string
  emoji: string
  description: string
}

interface CategorySectionProps {
  category: Category
  isFirst: boolean
}

interface NewsArticle {
  id: string
  title: string
  summary: string
  image: string
  source: string
  publishedAt: string
  url: string
  category: string
}

export function CategorySection({ category, isFirst }: CategorySectionProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [aiCommentary, setAiCommentary] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Fetch news articles for this category
  useEffect(() => {
    const fetchCategoryNews = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/news?category=${category.id}&limit=10`)
        const data = await res.json()

        if (data.success || data.fallback) {
          setArticles(data.data || [])
        }

        // Generate AI commentary based on category
        setAiCommentary(generateAICommentary(category))
      } catch (error) {
        console.error(`Error fetching ${category.id} news:`, error)
        // Use fallback commentary
        setAiCommentary(generateAICommentary(category))
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryNews()
  }, [category])

  // Check scroll position
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)
      return () => {
        container.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [articles])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="relative">
      {/* Category Header & AI Commentary */}
      <div className="mb-8">
        {/* Category Title */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{category.emoji}</span>
          <div className="flex-1">
            <h2 className="text-3xl font-serif font-light text-foreground mb-1">
              {category.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {category.description}
            </p>
          </div>
        </div>

        {/* AI Commentary Box */}
        <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6 relative overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

          <div className="relative">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Sparkles className="size-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground/90 mb-1">
                  AI Insights
                </h3>
                <p className="text-xs text-muted-foreground">
                  Generated analysis of current {category.title.toLowerCase()} trends
                </p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-2">
                <div className="h-4 bg-muted/50 rounded w-full animate-pulse" />
                <div className="h-4 bg-muted/50 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-muted/50 rounded w-4/6 animate-pulse" />
              </div>
            ) : (
              <p className="text-foreground/80 leading-relaxed">
                {aiCommentary}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Horizontal Scrolling News Cards */}
      <div className="relative group">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/95 border border-border shadow-lg hover:bg-accent transition-all opacity-0 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/95 border border-border shadow-lg hover:bg-accent transition-all opacity-0 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {loading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-80 h-96 rounded-xl border border-border bg-card/50 animate-pulse"
              />
            ))
          ) : articles.length > 0 ? (
            articles.map((article) => (
              <NewsCard key={article.id} article={article} variant="vertical" />
            ))
          ) : (
            <div className="flex-shrink-0 w-full h-64 rounded-xl border border-border/60 bg-card/30 flex items-center justify-center">
              <p className="text-muted-foreground">No articles available for this category</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Generate AI commentary based on category
function generateAICommentary(category: Category): string {
  const commentaries: Record<string, string[]> = {
    technology: [
      "The tech landscape is rapidly evolving with AI taking center stage. Major breakthroughs in large language models and generative AI are reshaping how we work and create. Meanwhile, regulatory frameworks are struggling to keep pace with innovation, leading to intense debates about AI safety and ethics. The semiconductor industry continues to be a focal point, with global supply chains becoming increasingly strategic.",
      "Quantum computing is making significant strides, with recent announcements suggesting we're closer to practical applications. The open-source AI movement is gaining momentum, challenging proprietary models. Cybersecurity remains critical as attack surfaces expand with IoT proliferation."
    ],
    politics: [
      "Global political dynamics are shifting as nations grapple with economic uncertainty and climate policy. Election cycles across major democracies are highlighting deep divisions on key issues like immigration, healthcare, and taxation. Geopolitical tensions continue to influence trade policies and international cooperation. Digital governance and data sovereignty are emerging as critical policy frontiers.",
      "Coalition-building is becoming more complex as traditional party lines blur. Populist movements continue to challenge establishment politics in several regions. International institutions are being tested by competing national interests."
    ],
    business: [
      "Markets are navigating a complex environment of interest rate adjustments and inflation concerns. The startup ecosystem is experiencing a recalibration after years of abundant venture capital, with profitability becoming paramount. ESG initiatives are moving from optional to essential as investors demand accountability. Supply chain resilience remains a top priority for global corporations.",
      "The gig economy continues to transform traditional employment models. E-commerce platforms are innovating with AI-powered personalization. Corporate sustainability reporting is becoming standardized across industries."
    ],
    science: [
      "Scientific research is accelerating thanks to AI-assisted discovery and analysis. Climate science is providing increasingly precise models of environmental change, informing policy decisions worldwide. Medical breakthroughs in personalized medicine and gene therapy are moving from laboratory to clinic. Space exploration is entering a new era with commercial partnerships complementing government programs.",
      "Materials science is unlocking new possibilities for energy storage and carbon capture. Neuroscience advances are deepening our understanding of consciousness and cognition. Interdisciplinary collaboration is becoming the norm as complex challenges require diverse expertise."
    ],
    health: [
      "Healthcare systems worldwide are embracing digital transformation, from telemedicine to AI diagnostics. Mental health awareness has reached unprecedented levels, driving demand for accessible services. Pharmaceutical innovation continues with new treatments for rare diseases and cancer. Public health infrastructure is being reimagined in light of recent pandemic experiences.",
      "Preventive care and wellness are gaining priority over reactive treatment. Wearable health tech is generating valuable longitudinal data. Health equity remains a critical challenge across demographics and geographies."
    ],
    sports: [
      "Major leagues are leveraging data analytics and AI to enhance performance and fan engagement. Athlete mental health and wellbeing are receiving overdue attention and support. Women's sports are experiencing unprecedented growth in viewership and investment. Sports technology, from VAR to performance tracking, continues to evolve, sometimes controversially.",
      "Esports is solidifying its position as a legitimate competitive domain. Sustainability in sports events is becoming a key consideration. Traditional sports are exploring new formats to attract younger audiences."
    ],
    entertainment: [
      "Streaming platforms are redefining content creation and consumption patterns. AI-generated content is sparking debates about creativity and authenticity. The creator economy is empowering independent artists and influencers like never before. Traditional media companies are adapting to compete with digital-native competitors.",
      "Interactive entertainment and immersive experiences are blurring lines between passive viewing and active participation. Music distribution models continue to evolve. Film festivals are embracing hybrid formats."
    ],
    world: [
      "International cooperation faces tests from competing national priorities and resource constraints. Climate change impacts are manifesting across continents, driving both conflict and collaboration. Migration patterns are reshaping demographics and challenging border policies. Economic interdependence remains high even as some nations pursue greater self-sufficiency.",
      "Regional conflicts continue to have global ramifications. Humanitarian crises demand international attention and resources. Cultural exchange and soft power are taking new forms in the digital age."
    ]
  }

  const categoryCommentaries = commentaries[category.id] || [category.description]
  return categoryCommentaries[Math.floor(Math.random() * categoryCommentaries.length)]
}
