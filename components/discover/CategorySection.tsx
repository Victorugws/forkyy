'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { NewsCard } from './NewsCard'

interface Category {
  id: string
  title: string
  emoji: string
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
      {/* Category Title */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-12">
          <span className="text-5xl">{category.emoji}</span>
          <h2 className="text-5xl font-serif font-light italic text-white tracking-tight">
            {category.title}
          </h2>
        </div>

        {/* AI Commentary - Exact template style */}
        <div className="mb-16">
          {loading ? (
            <div className="space-y-4">
              <div className="h-5 bg-white/5 rounded w-full animate-pulse" />
              <div className="h-5 bg-white/5 rounded w-11/12 animate-pulse" />
              <div className="h-5 bg-white/5 rounded w-10/12 animate-pulse" />
              <div className="h-5 bg-white/5 rounded w-full animate-pulse" />
              <div className="h-5 bg-white/5 rounded w-9/12 animate-pulse" />
            </div>
          ) : (
            <p className="text-[17px] text-white/80 leading-[1.8] tracking-wide">
              {aiCommentary}
            </p>
          )}
        </div>
      </div>

      {/* Horizontal Scrolling News Cards */}
      <div className="relative group -mx-8">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5 text-white" />
          </button>
        )}

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5 text-white" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto px-8 pb-6 scrollbar-hide scroll-smooth"
        >
          {loading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[380px] h-[520px] rounded-2xl bg-white/5 animate-pulse"
              />
            ))
          ) : articles.length > 0 ? (
            articles.map((article) => (
              <NewsCard key={article.id} article={article} variant="vertical" />
            ))
          ) : (
            <div className="flex-shrink-0 w-full h-64 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
              <p className="text-white/40">No articles available for this category</p>
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
      "The Tech Landscape Is Rapidly Evolving With AI Taking Center Stage. Major Breakthroughs In Large Language Models And Generative AI Are Reshaping How We Work And Create. Meanwhile, Regulatory Frameworks Are Struggling To Keep Pace With Innovation, Leading To Intense Debates About AI Safety And Ethics. The Semiconductor Industry Continues To Be A Focal Point, With Global Supply Chains Becoming Increasingly Strategic. Quantum Computing Is Making Significant Strides, With Recent Announcements Suggesting We're Closer To Practical Applications Than Ever Before.",
      "Innovation Continues At An Unprecedented Pace As Technology Giants Push The Boundaries Of What's Possible. The Open-Source AI Movement Is Gaining Momentum, Challenging Proprietary Models And Democratizing Access To Powerful Tools. Cybersecurity Remains Critical As Attack Surfaces Expand With IoT Proliferation. Cloud Computing Is Evolving Beyond Simple Infrastructure, Offering Increasingly Sophisticated AI And Machine Learning Capabilities That Are Transforming Industries From Healthcare To Finance."
    ],
    politics: [
      "Global Political Dynamics Are Shifting As Nations Grapple With Economic Uncertainty And Climate Policy. Election Cycles Across Major Democracies Are Highlighting Deep Divisions On Key Issues Like Immigration, Healthcare, And Taxation. Geopolitical Tensions Continue To Influence Trade Policies And International Cooperation. Digital Governance And Data Sovereignty Are Emerging As Critical Policy Frontiers. Coalition-Building Is Becoming More Complex As Traditional Party Lines Blur, While Populist Movements Continue To Challenge Establishment Politics In Several Regions.",
      "The Political Landscape Is Witnessing Unprecedented Transformation As Traditional Power Structures Face New Challenges. International Institutions Are Being Tested By Competing National Interests, While Grassroots Movements Leverage Social Media To Mobilize Support For Change. The Intersection Of Technology And Politics Creates Both Opportunities And Risks, From Enhanced Civic Engagement To Concerns About Misinformation And Election Integrity. Climate Policy Has Become A Central Political Battleground, With Different Visions For Balancing Economic Growth And Environmental Sustainability."
    ],
    business: [
      "Markets Are Navigating A Complex Environment Of Interest Rate Adjustments And Inflation Concerns. The Startup Ecosystem Is Experiencing A Recalibration After Years Of Abundant Venture Capital, With Profitability Becoming Paramount Over Growth At All Costs. ESG Initiatives Are Moving From Optional To Essential As Investors Demand Accountability And Transparency. Supply Chain Resilience Remains A Top Priority For Global Corporations Following Recent Disruptions. The Gig Economy Continues To Transform Traditional Employment Models, While E-Commerce Platforms Innovate With AI-Powered Personalization.",
      "Business Innovation Is Being Driven By Digital Transformation And Changing Consumer Expectations. Traditional Industries Are Being Disrupted By Agile Startups That Leverage Technology To Create Superior Customer Experiences. Corporate Sustainability Reporting Is Becoming Standardized Across Industries As Stakeholders Demand Greater Transparency. Remote Work Has Fundamentally Altered Office Real Estate Dynamics And Urban Planning. The Creator Economy Is Flourishing, With Independent Entrepreneurs Building Substantial Businesses Around Content And Community."
    ],
    science: [
      "Scientific Research Is Accelerating Thanks To AI-Assisted Discovery And Analysis. Climate Science Is Providing Increasingly Precise Models Of Environmental Change, Informing Policy Decisions Worldwide. Medical Breakthroughs In Personalized Medicine And Gene Therapy Are Moving From Laboratory To Clinic, Offering Hope For Previously Untreatable Conditions. Space Exploration Is Entering A New Era With Commercial Partnerships Complementing Government Programs. Materials Science Is Unlocking New Possibilities For Energy Storage And Carbon Capture, Critical Technologies For Addressing Climate Change.",
      "The Frontiers Of Science Are Expanding Rapidly As Interdisciplinary Collaboration Becomes The Norm For Tackling Complex Challenges. Neuroscience Advances Are Deepening Our Understanding Of Consciousness And Cognition, With Potential Applications Ranging From Mental Health Treatment To Human-Computer Interfaces. Synthetic Biology Is Opening New Avenues For Sustainable Manufacturing And Agriculture. Ocean Science Reveals The Critical Role Of Marine Ecosystems In Global Climate Regulation, While Also Highlighting The Urgent Need For Conservation Efforts."
    ],
    health: [
      "Healthcare Systems Worldwide Are Embracing Digital Transformation, From Telemedicine To AI Diagnostics That Can Detect Diseases Earlier And More Accurately Than Traditional Methods. Mental Health Awareness Has Reached Unprecedented Levels, Driving Demand For Accessible Services And Reducing Long-Standing Stigma. Pharmaceutical Innovation Continues With New Treatments For Rare Diseases And Cancer, While Public Health Infrastructure Is Being Reimagined In Light Of Recent Pandemic Experiences. Preventive Care And Wellness Are Gaining Priority Over Reactive Treatment As The Focus Shifts Toward Long-Term Health Outcomes.",
      "Medical Innovation Is Transforming Patient Care Through Personalized Treatment Approaches Based On Individual Genetic Profiles. Wearable Health Technology Is Generating Valuable Longitudinal Data That Helps Both Individuals And Researchers Better Understand Health Patterns. Health Equity Remains A Critical Challenge Across Demographics And Geographies, With Disparities In Access To Care Becoming More Apparent. Regenerative Medicine And Stem Cell Therapies Are Progressing From Experimental To Mainstream Treatments For Various Conditions."
    ],
    sports: [
      "Major Leagues Are Leveraging Data Analytics And AI To Enhance Both Athlete Performance And Fan Engagement Through Immersive Experiences. Athlete Mental Health And Wellbeing Are Receiving Overdue Attention And Support, Changing The Culture Of Professional Sports. Women's Sports Are Experiencing Unprecedented Growth In Viewership And Investment, Breaking Attendance Records And Securing Major Broadcasting Deals. Sports Technology, From VAR To Performance Tracking, Continues To Evolve, Sometimes Controversially, As Traditionalists Debate The Balance Between Technology And The Human Element Of Competition.",
      "The Sports Industry Is Undergoing Transformation As Esports Solidifies Its Position As A Legitimate Competitive Domain With Growing Prize Pools And Viewership. Sustainability In Sports Events Is Becoming A Key Consideration As Organizations Recognize Their Environmental Impact. Traditional Sports Are Exploring New Formats And Rule Changes To Attract Younger Audiences While Maintaining Appeal To Longtime Fans. Athletes Are Increasingly Using Their Platforms For Social Advocacy, Changing The Relationship Between Sports, Business, And Politics."
    ],
    entertainment: [
      "Streaming Platforms Are Redefining Content Creation And Consumption Patterns, With Binge-Watching Culture And Algorithm-Driven Recommendations Changing How Stories Are Told. AI-Generated Content Is Sparking Debates About Creativity And Authenticity, Raising Questions About The Future Role Of Human Artists. The Creator Economy Is Empowering Independent Artists And Influencers Like Never Before, Democratizing Fame And Success. Traditional Media Companies Are Adapting To Compete With Digital-Native Competitors, Investing Heavily In Original Content And Direct-To-Consumer Platforms.",
      "Entertainment Is Becoming Increasingly Interactive As The Lines Between Passive Viewing And Active Participation Blur Through Gaming, Virtual Reality, And Choose-Your-Own-Adventure Narratives. Music Distribution Models Continue To Evolve, With Streaming Services Dominating But Questions Remaining About Fair Artist Compensation. Film Festivals Are Embracing Hybrid Formats That Combine Physical Events With Virtual Access, Expanding Reach While Maintaining Exclusive Appeal. Social Media Has Transformed Celebrity Culture, Creating New Pathways To Stardom Outside Traditional Gatekeepers."
    ],
    world: [
      "International Cooperation Faces Tests From Competing National Priorities And Resource Constraints In An Era Of Renewed Great Power Competition. Climate Change Impacts Are Manifesting Across Continents, Driving Both Conflict Over Resources And Collaboration On Mitigation Efforts. Migration Patterns Are Reshaping Demographics And Challenging Border Policies As People Seek Better Economic Opportunities And Flee Conflict Zones. Economic Interdependence Remains High Even As Some Nations Pursue Greater Self-Sufficiency, Creating Tensions Between Globalization And Nationalism.",
      "Regional Conflicts Continue To Have Global Ramifications As Interconnected Economies And Diplomatic Networks Spread Impact Far Beyond Immediate Conflict Zones. Humanitarian Crises Demand International Attention And Resources, Testing The Capacity And Will Of Global Institutions. Cultural Exchange And Soft Power Are Taking New Forms In The Digital Age, With Social Media Enabling Direct Person-To-Person Connections Across Borders. Developing Nations Are Asserting Greater Influence In International Forums, Challenging Traditional Power Structures And Demanding More Equitable Global Systems."
    ]
  }

  const categoryCommentaries = commentaries[category.id] || ["Stay Informed About The Latest Developments In " + category.title + ". Our AI Analyzes Thousands Of Sources To Bring You The Most Significant Stories And Emerging Trends That Matter Most."]
  return categoryCommentaries[Math.floor(Math.random() * categoryCommentaries.length)]
}
