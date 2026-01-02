import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const revalidate = false

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Fetch the page content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AIBrowser/1.0)',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch page: ${response.statusText}` },
        { status: response.status }
      )
    }

    const html = await response.text()

    // Extract title - try multiple methods
    let title = ''
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim()
      // Decode HTML entities in title
      title = title
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
    }
    
    // If no title found, try to extract from og:title or other meta tags
    if (!title) {
      const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)
      if (ogTitleMatch && ogTitleMatch[1]) {
        title = ogTitleMatch[1].trim()
      }
    }
    
    // Fallback to domain name if still no title
    if (!title) {
      try {
        const urlObj = new URL(url)
        title = urlObj.hostname.replace('www.', '')
      } catch {
        title = 'Untitled'
      }
    }

    // Extract favicon
    let favicon: string | null = null
    const faviconMatch = html.match(/<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*href=["']([^"']+)["']/i)
    if (faviconMatch && faviconMatch[1]) {
      try {
        const faviconUrl = new URL(faviconMatch[1], url)
        favicon = faviconUrl.href
      } catch {
        // If URL parsing fails, try simple concatenation
        if (faviconMatch[1].startsWith('http')) {
          favicon = faviconMatch[1]
        } else {
          const baseUrl = url.split('/').slice(0, 3).join('/')
          favicon = `${baseUrl}${faviconMatch[1].startsWith('/') ? '' : '/'}${faviconMatch[1]}`
        }
      }
    } else {
      // Fallback to /favicon.ico
      try {
        const urlObj = new URL(url)
        favicon = `${urlObj.origin}/favicon.ico`
      } catch {
        // If URL parsing fails, try simple concatenation
        if (url.startsWith('http')) {
          const baseUrl = url.split('/').slice(0, 3).join('/')
          favicon = `${baseUrl}/favicon.ico`
        }
      }
    }

    // Extract text content (simple approach - remove scripts, styles, and tags)
    let content = html
      // Remove script tags and their content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove style tags and their content
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      // Remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remove all other HTML tags
      .replace(/<[^>]+>/g, ' ')
      // Decode common HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim()

    // Limit content size
    const maxLength = 15000
    if (content.length > maxLength) {
      content = content.slice(0, maxLength) + '...'
    }

    return NextResponse.json({
      title,
      content,
      favicon,
      url
    })
  } catch (error: any) {
    console.error('Error fetching page:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch page' },
      { status: 500 }
    )
  }
}
