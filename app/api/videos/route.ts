import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || 'technology news'
  const category = searchParams.get('category') || 'All'

  try {
    const serperKey = process.env.SERPER_API_KEY

    if (!serperKey) {
      return NextResponse.json({
        success: false,
        error: 'SERPER_API_KEY not configured. Please add it to your .env.local file.',
        fallback: true,
        data: getFallbackVideos(category)
      })
    }

    const searchQuery = category !== 'All' ? `${query} ${category}` : query

    const response = await fetch('https://google.serper.dev/videos', {
      method: 'POST',
      headers: {
        'X-API-KEY': serperKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: searchQuery,
        num: 20
      })
    })

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.videos && data.videos.length > 0) {
      const videos = data.videos.map((video: any) => ({
        thumbnail: video.imageUrl || 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
        title: video.title,
        channel: video.channel || 'Unknown Channel',
        views: formatViews(video.views),
        duration: video.duration || '10:00',
        uploadedAt: video.date || 'Recently',
        category: category !== 'All' ? category : 'Technology',
        link: video.link
      }))

      return NextResponse.json({ success: true, data: videos })
    }

    return NextResponse.json({
      success: false,
      fallback: true,
      data: getFallbackVideos(category)
    })

  } catch (error) {
    console.error('Videos API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true,
      data: getFallbackVideos(category)
    })
  }
}

function formatViews(views: number | string): string {
  if (typeof views === 'number') {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(0)}K`
    }
    return views.toString()
  }
  return views || '0'
}

function getFallbackVideos(category: string) {
  const allVideos = [
    {
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
      title: 'The Future of Artificial Intelligence',
      channel: 'Tech Insights',
      views: '2.5M',
      duration: '15:32',
      uploadedAt: '2 days ago',
      category: 'Technology'
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
      title: 'Quantum Computing Explained',
      channel: 'Science Daily',
      views: '1.8M',
      duration: '22:15',
      uploadedAt: '1 week ago',
      category: 'Science'
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2',
      title: 'Mars Mission 2024: Latest Updates',
      channel: 'Space News',
      views: '3.2M',
      duration: '18:45',
      uploadedAt: '3 days ago',
      category: 'News'
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b0',
      title: 'Climate Change Solutions',
      channel: 'Environmental Science',
      views: '1.5M',
      duration: '25:18',
      uploadedAt: '5 days ago',
      category: 'Science'
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
      title: 'Web Development in 2024',
      channel: 'Code Academy',
      views: '980K',
      duration: '32:22',
      uploadedAt: '1 week ago',
      category: 'Technology'
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
      title: 'Understanding the Universe',
      channel: 'Physics Explained',
      views: '2.1M',
      duration: '28:55',
      uploadedAt: '4 days ago',
      category: 'Science'
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
      title: 'Machine Learning Basics',
      channel: 'AI Academy',
      views: '1.2M',
      duration: '19:40',
      uploadedAt: '6 days ago',
      category: 'Education'
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      title: 'Startup Success Stories',
      channel: 'Business Insights',
      views: '750K',
      duration: '21:33',
      uploadedAt: '2 weeks ago',
      category: 'Education'
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1598550487031-0d6eaf5e3f4f',
      title: 'How to Build a Robot',
      channel: 'DIY Tech',
      views: '890K',
      duration: '35:12',
      uploadedAt: '1 week ago',
      category: 'How-to'
    },
    {
      thumbnail: 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a',
      title: 'iPhone 15 Pro Review',
      channel: 'Tech Reviews',
      views: '5.2M',
      duration: '12:45',
      uploadedAt: '3 days ago',
      category: 'Reviews'
    }
  ]

  if (category !== 'All') {
    return allVideos.filter(video => video.category === category)
  }

  return allVideos
}
