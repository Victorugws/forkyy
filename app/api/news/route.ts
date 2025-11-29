import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') // 'featured', 'top', 'topic', 'trending', 'top-articles'
  const topic = searchParams.get('topic') || 'breaking news'

  try {
    const tavilyKey = process.env.TAVILY_API_KEY

    if (!tavilyKey) {
      return NextResponse.json({
        success: false,
        error: 'TAVILY_API_KEY not configured. Please add it to your .env.local file.',
        fallback: true,
        data: getFallbackNews(type)
      })
    }

    // Handle trending topics request
    if (type === 'trending') {
      const trending = await fetchTrendingTopics(tavilyKey)
      return NextResponse.json({ success: true, data: trending })
    }

    // Handle top articles request
    if (type === 'top-articles') {
      const articles = await fetchTopArticles(tavilyKey)
      return NextResponse.json({ success: true, data: articles })
    }

    const query = type === 'featured' ? 'breaking news today' : topic

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: tavilyKey,
        query,
        search_depth: 'basic',
        include_images: true,
        include_answer: false,
        max_results: type === 'featured' ? 4 : 10
      })
    })

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      const news = data.results.map((item: any, index: number) => ({
        title: item.title,
        summary: item.content || item.title,
        image: data.images && data.images[index] ? data.images[index] : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=500&fit=crop',
        source: new URL(item.url).hostname.replace('www.', ''),
        url: item.url,
        views: `${Math.floor(Math.random() * 900 + 100)}K`,
        sources: Math.floor(Math.random() * 80 + 20),
        publishedHours: Math.floor(Math.random() * 24 + 1)
      }))

      return NextResponse.json({ success: true, data: news })
    }

    return NextResponse.json({
      success: false,
      fallback: true,
      data: getFallbackNews(type)
    })

  } catch (error) {
    console.error('News API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true,
      data: getFallbackNews(type)
    })
  }
}

async function fetchTrendingTopics(apiKey: string) {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: apiKey,
      query: 'trending news topics today',
      search_depth: 'basic',
      include_images: false,
      include_answer: false,
      max_results: 10
    })
  })

  const data = await response.json()

  if (data.results && data.results.length > 0) {
    return data.results.map((item: any, index: number) => {
      const category = extractCategory(item.title, item.content)
      return {
        id: `${index + 1}`,
        name: item.title.split(' ').slice(0, 6).join(' '),
        count: `${Math.floor(Math.random() * 100 + 30)}K`,
        trend: index < 3 ? 'hot' : index < 7 ? 'rising' : 'stable',
        category: category,
        url: item.url
      }
    })
  }

  return getFallbackNews('trending')
}

async function fetchTopArticles(apiKey: string) {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: apiKey,
      query: 'breaking news today',
      search_depth: 'basic',
      include_images: false,
      include_answer: false,
      max_results: 5
    })
  })

  const data = await response.json()

  if (data.results && data.results.length > 0) {
    return data.results.map((item: any, index: number) => ({
      id: `${index + 1}`,
      title: item.title,
      source: new URL(item.url).hostname.replace('www.', '').split('.')[0].toUpperCase(),
      views: `${(Math.random() * 2 + 0.5).toFixed(1)}M`,
      timeAgo: getTimeAgo(item.published_date),
      category: extractCategory(item.title, item.content),
      url: item.url
    }))
  }

  return getFallbackNews('top-articles')
}

function extractCategory(title: string, content?: string): string {
  const text = `${title} ${content || ''}`.toLowerCase()

  if (text.includes('politic') || text.includes('government') || text.includes('election')) return 'Politics'
  if (text.includes('tech') || text.includes('ai') || text.includes('software')) return 'Technology'
  if (text.includes('crypto') || text.includes('bitcoin') || text.includes('stock') || text.includes('market')) return 'Finance'
  if (text.includes('space') || text.includes('nasa') || text.includes('rocket')) return 'Science'
  if (text.includes('climate') || text.includes('environment')) return 'Environment'
  if (text.includes('sport') || text.includes('game')) return 'Sports'
  if (text.includes('health') || text.includes('medical')) return 'Health'

  return 'General'
}

function getTimeAgo(dateString?: string): string {
  if (!dateString) return '1h ago'

  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) return `${Math.floor(diffMs / (1000 * 60))}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  } catch {
    return '1h ago'
  }
}

function getFallbackNews(type: string | null) {
  const featured = {
    title: 'Trump says US close to trade deal with India',
    summary: 'The president says tariff will lower the current 50% tariff rate, citing India\'s reduced Russian oil purchases after imposing tariffs earlier this year.',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=500&fit=crop',
    source: 'reuters',
    url: 'https://www.reuters.com/world/us/',
    views: '1M',
    sources: 92,
    publishedHours: 7
  }

  const topNews = [
    {
      title: 'Private credit market tops $3T as regulators warn of risks',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      source: 'reuters',
      url: 'https://www.reuters.com/world/us/',
      views: '75K',
      sources: 45,
      publishedHours: 12
    },
    {
      title: 'Ukraine raids Zelensky ally in $300M energy kickback scheme',
      image: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=400&h=300&fit=crop',
      source: 'ap',
      url: 'https://apnews.com/world',
      views: '58K',
      sources: 34,
      publishedHours: 8
    },
    {
      title: 'China curbs fentanyl chemical exports after Trump deal',
      image: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b0?w=400&h=300&fit=crop',
      source: 'wsj',
      url: 'https://www.wsj.com/world',
      views: '94K',
      sources: 68,
      publishedHours: 5
    }
  ]

  const trendingTopics = [
    { id: '1', name: 'G20 Summit 2025', count: '125K', trend: 'hot', category: 'Politics' },
    { id: '2', name: 'Quantum Computing', count: '98K', trend: 'rising', category: 'Technology' },
    { id: '3', name: 'Bitcoin Crash', count: '87K', trend: 'hot', category: 'Finance' },
    { id: '4', name: 'Space Exploration', count: '76K', trend: 'rising', category: 'Science' },
    { id: '5', name: 'AI Regulation', count: '65K', trend: 'stable', category: 'Tech Policy' },
    { id: '6', name: 'Climate Action', count: '54K', trend: 'rising', category: 'Environment' },
    { id: '7', name: 'Electric Vehicles', count: '48K', trend: 'stable', category: 'Automotive' },
    { id: '8', name: 'Meta Privacy Case', count: '43K', trend: 'hot', category: 'Tech' },
    { id: '9', name: 'Moon Base Plans', count: '38K', trend: 'rising', category: 'Space' },
    { id: '10', name: 'Renewable Energy', count: '32K', trend: 'stable', category: 'Energy' }
  ]

  const topArticles = [
    { id: '1', title: 'South Africa hosts first G20 summit on African soil', source: 'BBC News', views: '2.3M', timeAgo: '2h ago', category: 'Politics' },
    { id: '2', title: 'NASA astronaut Williams to launch to space station', source: 'Space.com', views: '1.8M', timeAgo: '4h ago', category: 'Science' },
    { id: '3', title: 'Bitcoin plunges to seven-month low amid selling wave', source: 'Reuters', views: '1.5M', timeAgo: '1h ago', category: 'Finance' },
    { id: '4', title: 'AI boom drives smartphone and laptop prices up', source: 'TechCrunch', views: '1.2M', timeAgo: '3h ago', category: 'Technology' },
    { id: '5', title: 'Spain court orders Meta to pay $352M for privacy violations', source: 'The Verge', views: '980K', timeAgo: '5h ago', category: 'Tech' }
  ]

  if (type === 'featured') {
    return featured
  }

  if (type === 'trending') {
    return trendingTopics
  }

  if (type === 'top-articles') {
    return topArticles
  }

  return topNews
}
