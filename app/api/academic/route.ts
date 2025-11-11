import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || 'artificial intelligence'
  const field = searchParams.get('field') || ''

  try {
    // Semantic Scholar API - No API key required for basic usage
    const searchQuery = field ? `${field} ${query}` : query
    const response = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(searchQuery)}&limit=10&fields=title,authors,year,citationCount,venue,abstract,url`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.data && data.data.length > 0) {
      const papers = data.data.map((paper: any) => ({
        title: paper.title,
        authors: paper.authors && paper.authors.length > 0
          ? paper.authors.slice(0, 3).map((a: any) => a.name).join(', ') + (paper.authors.length > 3 ? ' et al.' : '')
          : 'Unknown authors',
        journal: paper.venue || 'Unknown venue',
        citations: paper.citationCount ? `${paper.citationCount.toLocaleString()}+` : '0',
        year: paper.year || 'N/A',
        href: paper.url || `/search?q=${encodeURIComponent(paper.title)}`,
        abstract: paper.abstract || paper.title
      }))

      return NextResponse.json({ success: true, data: papers })
    }

    return NextResponse.json({
      success: false,
      fallback: true,
      data: getFallbackPapers()
    })

  } catch (error) {
    console.error('Academic API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true,
      data: getFallbackPapers()
    })
  }
}

function getFallbackPapers() {
  return [
    {
      title: 'Attention Is All You Need: Transforming Natural Language Processing',
      authors: 'Vaswani et al.',
      journal: 'NeurIPS 2017',
      citations: '95,000+',
      year: '2017',
      href: '/search?q=attention+is+all+you+need'
    },
    {
      title: 'Deep Residual Learning for Image Recognition',
      authors: 'He et al.',
      journal: 'CVPR 2016',
      citations: '180,000+',
      year: '2016',
      href: '/search?q=resnet+paper'
    },
    {
      title: 'BERT: Pre-training of Deep Bidirectional Transformers',
      authors: 'Devlin et al.',
      journal: 'NAACL 2019',
      citations: '65,000+',
      year: '2019',
      href: '/search?q=bert+paper'
    },
    {
      title: 'Generative Adversarial Networks',
      authors: 'Goodfellow et al.',
      journal: 'NeurIPS 2014',
      citations: '75,000+',
      year: '2014',
      href: '/search?q=gan+paper'
    }
  ]
}
