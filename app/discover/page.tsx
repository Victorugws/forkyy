'use client'

import { CustomDock } from '@/components/CustomDock'
import { BlogFeed } from '@/components/discover/BlogFeed'
import { InterestSelector } from '@/components/discover/InterestSelector'
import { WeatherWidget } from '@/components/discover/WeatherWidget'
import { MarketOutlook } from '@/components/discover/MarketOutlook'
import { TrendingCompanies } from '@/components/discover/TrendingCompanies'
import { TopArticles } from '@/components/discover/TopArticles'
import { TrendingTopics } from '@/components/discover/TrendingTopics'
import GradualBlur from '@/components/reactbits/animations/GradualBlur'

export default function DiscoverPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <CustomDock />

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-6 py-16 flex-1">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0 sticky top-6 self-start max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
            <InterestSelector />
            <WeatherWidget />
            <MarketOutlook />
          </div>

          {/* Center Content - Blog Feed */}
          <div className="flex-1">
            <BlogFeed />
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0 sticky top-6 self-start max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
            <TrendingCompanies />
            <TopArticles />
            <TrendingTopics />
          </div>
        </div>
      </div>

      {/* Gradual Blur at bottom */}
      <GradualBlur
        position="bottom"
        height="12rem"
        strength={3}
        divCount={8}
        curve="bezier"
        exponential={true}
        opacity={1}
        target="page"
      />
    </div>
  )
}
