'use client'

import { Compass, TrendingUp, Sparkles, Zap } from 'lucide-react'

/**
 * Neumorphic Discover Page Component
 */

export function NeumorphicDiscoverPage() {
  const categories = [
    { icon: TrendingUp, title: 'Trending', description: 'Popular topics and discussions' },
    { icon: Sparkles, title: 'Featured', description: 'Curated content highlights' },
    { icon: Zap, title: 'Latest', description: 'Fresh content updates' },
    { icon: Compass, title: 'Explore', description: 'Discover new topics' }
  ]

  return (
    <div className="w-full min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="neu-card rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="neu-raised rounded-full p-3">
              <Compass className="size-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Discover</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Explore trending topics, featured content, and discover new interests
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((category, i) => (
            <div key={i} className="neu-card rounded-2xl p-6 hover:shadow-neu-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="neu-inset rounded-full p-3">
                  <category.icon className="size-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
