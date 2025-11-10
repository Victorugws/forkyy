import { PerplexityCard, TrendingCard } from '@/components/perplexity-card'
import {
  TrendingUp,
  Newspaper,
  Lightbulb,
  Rocket,
  Brain,
  Globe,
  Zap,
  Star
} from 'lucide-react'

const trendingTopics = [
  {
    title: 'Latest developments in AI and machine learning',
    description:
      'Explore the newest breakthroughs in artificial intelligence and their real-world applications',
    views: '2.5M views',
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop',
    href: '/search?q=latest+ai+developments'
  },
  {
    title: 'Climate change solutions and innovations',
    description:
      'Discover innovative technologies and policies addressing climate change',
    views: '1.8M views',
    image:
      'https://images.unsplash.com/photo-1569163139394-de4798aa62b0?w=500&h=300&fit=crop',
    href: '/search?q=climate+change+solutions'
  },
  {
    title: 'Space exploration breakthroughs',
    description:
      'Recent missions and discoveries in our quest to explore the cosmos',
    views: '1.2M views',
    image:
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=500&h=300&fit=crop',
    href: '/search?q=space+exploration+2024'
  },
  {
    title: 'Quantum computing advances',
    description:
      'How quantum computers are revolutionizing computation and cryptography',
    views: '980K views',
    image:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&h=300&fit=crop',
    href: '/search?q=quantum+computing+advances'
  }
]

const categoryCards = [
  {
    title: 'Technology',
    description:
      'Latest tech trends, gadgets, and innovations shaping our digital future',
    icon: Zap,
    category: 'Popular',
    href: '/search?q=technology+trends'
  },
  {
    title: 'Science',
    description:
      'Groundbreaking research and discoveries across all scientific fields',
    icon: Brain,
    category: 'Popular',
    href: '/search?q=science+discoveries'
  },
  {
    title: 'Business',
    description:
      'Market analysis, startup stories, and entrepreneurship insights',
    icon: TrendingUp,
    category: 'Popular',
    href: '/search?q=business+news'
  },
  {
    title: 'World News',
    description:
      'Breaking news and in-depth analysis of global events and affairs',
    icon: Globe,
    category: 'News',
    href: '/search?q=world+news'
  },
  {
    title: 'Innovation',
    description:
      'Revolutionary ideas and products transforming industries',
    icon: Lightbulb,
    category: 'Featured',
    href: '/search?q=innovation+2024'
  },
  {
    title: 'Startups',
    description:
      'Emerging companies and the next generation of tech unicorns',
    icon: Rocket,
    category: 'Featured',
    href: '/search?q=startup+ecosystem'
  }
]

export default function DiscoverPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Star className="size-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Discover</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore trending topics, breaking news, and fascinating insights
            curated just for you
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-6 py-10 flex-1">
        {/* Trending Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="size-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Trending Now
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingTopics.map((topic, index) => (
              <TrendingCard key={index} {...topic} />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Newspaper className="size-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Explore by Category
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCards.map((card, index) => (
              <PerplexityCard key={index} {...card} />
            ))}
          </div>
        </section>

        {/* Daily Topics */}
        <section className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="size-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Today's Topics
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/search?q=artificial+general+intelligence"
              className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                The Path to Artificial General Intelligence
              </h3>
              <p className="text-sm text-muted-foreground">
                Understanding the current state and future possibilities of AGI
                development
              </p>
            </Link>
            <Link
              href="/search?q=renewable+energy+revolution"
              className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                The Renewable Energy Revolution
              </h3>
              <p className="text-sm text-muted-foreground">
                How solar, wind, and battery technologies are transforming the
                energy landscape
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

function Link({
  href,
  children,
  className
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}
