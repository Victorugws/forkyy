import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  LineChart,
  BarChart3,
  Newspaper,
  Search
} from 'lucide-react'
import Link from 'next/link'

const marketIndices = [
  { name: 'S&P 500', value: '4,783.45', change: '+1.2%', isUp: true },
  { name: 'Dow Jones', value: '37,545.33', change: '+0.8%', isUp: true },
  { name: 'NASDAQ', value: '15,074.57', change: '+1.5%', isUp: true },
  { name: 'Bitcoin', value: '$43,256', change: '-2.1%', isUp: false }
]

const trendingStocks = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    price: '$875.28',
    change: '+3.4%',
    isUp: true
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc',
    price: '$248.42',
    change: '+2.1%',
    isUp: true
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc',
    price: '$185.92',
    change: '-0.5%',
    isUp: false
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp',
    price: '$378.91',
    change: '+1.8%',
    isUp: true
  }
]

const financeTopics = [
  {
    title: 'Market Analysis',
    description: 'In-depth analysis of stock market trends and movements',
    query: 'stock+market+analysis+today'
  },
  {
    title: 'Cryptocurrency',
    description: 'Latest news and insights on digital currencies',
    query: 'cryptocurrency+news+trends'
  },
  {
    title: 'Economic Indicators',
    description: 'Key economic data and what it means for investors',
    query: 'economic+indicators+2024'
  },
  {
    title: 'Investment Strategies',
    description: 'Expert advice on portfolio management and investing',
    query: 'investment+strategies+2024'
  },
  {
    title: 'IPOs & Startups',
    description: 'Upcoming IPOs and startup funding news',
    query: 'upcoming+ipos+2024'
  },
  {
    title: 'Real Estate',
    description: 'Property market trends and investment opportunities',
    query: 'real+estate+market+trends'
  }
]

const newsItems = [
  {
    title: 'Fed signals potential rate cuts in 2024',
    source: 'Bloomberg',
    time: '2 hours ago'
  },
  {
    title: 'Tech stocks rally on AI enthusiasm',
    source: 'Reuters',
    time: '4 hours ago'
  },
  {
    title: 'Bitcoin ETF approval drives crypto surge',
    source: 'CNBC',
    time: '6 hours ago'
  },
  {
    title: 'Emerging markets show strong growth signals',
    source: 'Financial Times',
    time: '8 hours ago'
  }
]

export default function FinancePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-br from-background via-background to-green-500/5">
        <div className="container max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-green-500/10 p-3">
              <TrendingUp className="size-6 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Finance</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            Stay informed with real-time market data, analysis, and financial
            insights
          </p>
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search stocks, crypto, commodities..."
              className="w-full rounded-2xl border border-input bg-background px-12 py-4 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-6 py-10 flex-1">
        {/* Market Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Market Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketIndices.map((index, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-5 hover:border-primary/50 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    {index.name}
                  </span>
                  {index.isUp ? (
                    <TrendingUp className="size-4 text-green-500" />
                  ) : (
                    <TrendingDown className="size-4 text-red-500" />
                  )}
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {index.value}
                </div>
                <div
                  className={`text-sm font-medium ${index.isUp ? 'text-green-500' : 'text-red-500'}`}
                >
                  {index.change}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Stocks */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <LineChart className="size-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Trending Stocks
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingStocks.map((stock, i) => (
              <Link
                key={i}
                href={`/search?q=${stock.symbol}+stock+price`}
                className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {stock.symbol}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stock.name}
                    </div>
                  </div>
                  {stock.isUp ? (
                    <TrendingUp className="size-4 text-green-500" />
                  ) : (
                    <TrendingDown className="size-4 text-red-500" />
                  )}
                </div>
                <div className="text-xl font-bold text-foreground mb-1">
                  {stock.price}
                </div>
                <div
                  className={`text-sm font-medium ${stock.isUp ? 'text-green-500' : 'text-red-500'}`}
                >
                  {stock.change}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Finance Topics */}
          <section className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="size-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Explore Topics
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {financeTopics.map((topic, i) => (
                <Link
                  key={i}
                  href={`/search?q=${topic.query}`}
                  className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all"
                >
                  <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors mb-2">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {topic.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Latest News */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Newspaper className="size-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Latest News
              </h2>
            </div>
            <div className="space-y-4">
              {newsItems.map((item, i) => (
                <Link
                  key={i}
                  href={`/search?q=${encodeURIComponent(item.title)}`}
                  className="group block rounded-2xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-lg transition-all"
                >
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{item.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
