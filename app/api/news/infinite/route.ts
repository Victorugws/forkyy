import { NextResponse } from 'next/server'

const ARTICLES_PER_PAGE = 10
const MAX_PAGES = 10 // Limit total pages for MVP

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const interests = searchParams.get('interests')?.split(',').filter(Boolean) || []

  try {
    const tavilyKey = process.env.TAVILY_API_KEY

    if (!tavilyKey) {
      return NextResponse.json({
        success: false,
        error: 'TAVILY_API_KEY not configured',
        articles: [],
        nextPage: null,
        hasMore: false
      })
    }

    // Build search query based on interests and page
    const baseTopics = interests.length > 0
      ? interests.join(' OR ')
      : 'breaking news technology science business'

    // For pagination, we vary the query slightly to get different results
    const queries = [
      `${baseTopics} latest`,
      `${baseTopics} today`,
      `${baseTopics} recent`,
      `${baseTopics} trending`,
      `${baseTopics} top stories`,
      `${baseTopics} breaking`,
      `${baseTopics} updates`,
      `${baseTopics} news`,
      `${baseTopics} headlines`,
      `${baseTopics} current`
    ]

    const query = queries[(page - 1) % queries.length] || queries[0]

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
        max_results: ARTICLES_PER_PAGE,
        // Add time filter for freshness
        days: page === 1 ? 1 : 7
      })
    })

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      const articles = data.results.map((item: any, index: number) => {
        const publishedHours = Math.floor(Math.random() * 24) + 1
        const publishedAt = new Date(Date.now() - publishedHours * 60 * 60 * 1000)

        return {
          id: `${item.url}-${page}-${index}`,
          title: item.title,
          summary: item.content || item.title,
          image: (data.images && data.images[index]) || item.image_url || `https://source.unsplash.com/800x600/?news`,
          source: new URL(item.url).hostname.replace('www.', ''),
          url: item.url,
          views: `${Math.floor(Math.random() * 900 + 100)}K`,
          sources: Math.floor(Math.random() * 80 + 20),
          publishedHours,
          publishedAt: publishedAt.toISOString(),
          category: interests[0] || 'General'
        }
      })

      return NextResponse.json({
        success: true,
        articles,
        nextPage: page < MAX_PAGES ? page + 1 : null,
        hasMore: page < MAX_PAGES
      })
    }

    return NextResponse.json({
      success: false,
      articles: [],
      nextPage: null,
      hasMore: false
    })

  } catch (error) {
    console.error('Infinite news API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      articles: [],
      nextPage: null,
      hasMore: false
    }, { status: 500 })
  }
}
