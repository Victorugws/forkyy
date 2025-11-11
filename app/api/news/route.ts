import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') // 'featured', 'top', 'topic'
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

function getFallbackNews(type: string | null) {
  const featured = {
    title: 'Trump says US close to trade deal with India',
    summary: 'The president says tariff will lower the current 50% tariff rate, citing India\'s reduced Russian oil purchases after imposing tariffs earlier this year.',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=500&fit=crop',
    source: 'reuters',
    views: '1M',
    sources: 92,
    publishedHours: 7
  }

  const topNews = [
    {
      title: 'Private credit market tops $3T as regulators warn of risks',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      source: 'reuters',
      views: '75K',
      sources: 45,
      publishedHours: 12
    },
    {
      title: 'Ukraine raids Zelensky ally in $300M energy kickback scheme',
      image: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=400&h=300&fit=crop',
      source: 'ap',
      views: '58K',
      sources: 34,
      publishedHours: 8
    },
    {
      title: 'China curbs fentanyl chemical exports after Trump deal',
      image: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b0?w=400&h=300&fit=crop',
      source: 'wsj',
      views: '94K',
      sources: 68,
      publishedHours: 5
    }
  ]

  if (type === 'featured') {
    return featured
  }

  return topNews
}
