import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || 'technology'

  try {
    const tavilyKey = process.env.TAVILY_API_KEY

    if (!tavilyKey) {
      return NextResponse.json({
        success: false,
        error: 'TAVILY_API_KEY not configured',
        fallback: true,
        data: getFallbackImages(query)
      })
    }

    // Use Tavily to search for images
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: tavilyKey,
        query: `${query} images`,
        search_depth: 'basic',
        include_images: true,
        include_answer: false,
        max_results: 20
      })
    })

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.images && data.images.length > 0) {
      const images = data.images.map((url: string, index: number) => ({
        url,
        thumbnail: url,
        title: `${query} ${index + 1}`,
        source: new URL(url).hostname.replace('www.', '')
      }))

      return NextResponse.json({ success: true, data: images })
    }

    return NextResponse.json({
      success: false,
      fallback: true,
      data: getFallbackImages(query)
    })

  } catch (error) {
    console.error('Images API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true,
      data: getFallbackImages(query)
    })
  }
}

function getFallbackImages(query: string) {
  // Return Unsplash images as fallback
  return Array.from({ length: 12 }, (_, i) => ({
    url: `https://source.unsplash.com/800x600/?${query},${i}`,
    thumbnail: `https://source.unsplash.com/400x300/?${query},${i}`,
    title: `${query} ${i + 1}`,
    source: 'unsplash.com'
  }))
}
