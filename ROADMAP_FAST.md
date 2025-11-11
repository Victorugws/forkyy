# 🚀 Fast-Track Production Roadmap: 6-Week Launch

**Goal**: Production-ready Perplexity clone in 6 weeks

---

## ⚡ Sprint 1: Foundation (Week 1)

### Days 1-2: Dependencies & Setup
```bash
# Install everything at once
npm install @tanstack/react-query zustand framer-motion
npm install react-intersection-observer react-player
npm install puppeteer microlink-sdk
npm install @clerk/nextjs @prisma/client
npm install -D vitest @testing-library/react
```

**Project Structure**:
```bash
mkdir -p components/{finance,discover,academic,videos,shared}
mkdir -p lib/{api,utils,algorithms}
mkdir -p stores hooks
```

**Tasks**:
- [x] Install all dependencies
- [ ] Set up folder structure
- [ ] Configure TypeScript paths
- [ ] Set up Prisma (optional for MVP)

---

### Days 3-5: State Management + API Layer

**Create Zustand stores** (2 hours):
```typescript
// stores/useNewsStore.ts
import { create } from 'zustand'

export const useNewsStore = create((set, get) => ({
  articles: [],
  page: 1,
  hasMore: true,
  loading: false,

  fetchNews: async (page = 1) => {
    set({ loading: true })
    const res = await fetch(`/api/news?page=${page}`)
    const data = await res.json()

    set(state => ({
      articles: page === 1 ? data.articles : [...state.articles, ...data.articles],
      page,
      hasMore: data.hasMore,
      loading: false
    }))
  }
}))
```

**Upgrade API routes** (4 hours):
- [ ] Add pagination to `/api/news/route.ts`
- [ ] Add caching headers
- [ ] Implement rate limiting
- [ ] Add error handling

**Install TanStack Query** (1 hour):
```typescript
// app/providers.tsx
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

---

### Days 6-7: Component Extraction

**Priority: Extract only critical components** (8 hours total):

1. **Shared Components** (2 hours):
   - `ImageWithFallback.tsx` - Auto-fetch images with fallback
   - `LoadingSkeleton.tsx` - Reusable loading states
   - `InfiniteScroll.tsx` - Wrapper component

2. **Discover Components** (3 hours):
   - `NewsCard.tsx` - Single article card
   - `InfiniteNewsFeed.tsx` - Main feed with infinite scroll

3. **Finance Components** (3 hours):
   - `MarketIndices.tsx`
   - `CryptoCards.tsx`
   - `StockScreener.tsx`

**Skip for MVP**: Academic, Videos (use existing pages)

---

## ⚡ Sprint 2: Infinite Feed + Images (Week 2)

### Days 8-10: Infinite Scroll Implementation

**InfiniteNewsFeed.tsx** (4 hours):
```typescript
'use client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { NewsCard } from './NewsCard'

export function InfiniteNewsFeed({ interests }: { interests: string[] }) {
  const { ref, inView } = useInView()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['news', interests],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/news/infinite?page=${pageParam}&interests=${interests.join(',')}`)
      return res.json()
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) return <LoadingSkeleton count={6} />

  return (
    <div className="space-y-4">
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.articles.map((article: any) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </React.Fragment>
      ))}

      <div ref={ref} className="h-20 flex items-center justify-center">
        {isFetchingNextPage && <Spinner />}
      </div>
    </div>
  )
}
```

**API Route** (2 hours):
```typescript
// app/api/news/infinite/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const interests = searchParams.get('interests')?.split(',') || []

  const tavilyKey = process.env.TAVILY_API_KEY!
  const ARTICLES_PER_PAGE = 10

  // Fetch from Tavily with pagination offset
  const query = interests.length > 0
    ? interests.join(' OR ') + ' news'
    : 'breaking news'

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: tavilyKey,
      query,
      search_depth: 'basic',
      include_images: true,
      max_results: ARTICLES_PER_PAGE,
      // Tavily doesn't support pagination directly, so we'll use different queries
      // or implement our own caching layer
    })
  })

  const data = await response.json()

  return NextResponse.json({
    articles: data.results,
    nextPage: page < 5 ? page + 1 : null, // Limit to 5 pages for MVP
    hasMore: page < 5
  })
}
```

**Tasks**:
- [ ] Build InfiniteNewsFeed component
- [ ] Update /api/news/infinite route
- [ ] Add loading states
- [ ] Test with different scroll speeds
- [ ] Add pull-to-refresh (mobile)

---

### Days 11-14: Source Image Fetching

**ImageWithFallback Component** (3 hours):
```typescript
// components/shared/ImageWithFallback.tsx
'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export function ImageWithFallback({
  url,
  alt,
  className
}: {
  url?: string
  alt: string
  className?: string
}) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImage = async () => {
      if (!url) {
        setImgSrc(getPlaceholder(alt))
        setLoading(false)
        return
      }

      try {
        // Try to fetch metadata from our API
        const res = await fetch(`/api/images/metadata?url=${encodeURIComponent(url)}`)
        const data = await res.json()

        setImgSrc(data.image || getPlaceholder(alt))
      } catch (error) {
        setImgSrc(getPlaceholder(alt))
      } finally {
        setLoading(false)
      }
    }

    fetchImage()
  }, [url, alt])

  if (loading) {
    return <div className={`${className} bg-muted animate-pulse`} />
  }

  return (
    <Image
      src={imgSrc || getPlaceholder(alt)}
      alt={alt}
      fill
      className={className}
      onError={() => setImgSrc(getPlaceholder(alt))}
    />
  )
}

function getPlaceholder(text: string) {
  // Generate Unsplash placeholder based on keywords
  const keywords = text.split(' ').slice(0, 2).join(',')
  return `https://source.unsplash.com/800x600/?${keywords}`
}
```

**Image Metadata API** (2 hours):
```typescript
// app/api/images/metadata/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 })
  }

  try {
    // Use Microlink API (free tier: 50 req/day)
    const microlinkKey = process.env.MICROLINK_API_KEY

    const response = await fetch(
      `https://api.microlink.io?url=${encodeURIComponent(url)}${microlinkKey ? `&apiKey=${microlinkKey}` : ''}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )

    const data = await response.json()

    return NextResponse.json({
      image: data.data?.image?.url,
      logo: data.data?.logo?.url,
      title: data.data?.title,
      description: data.data?.description,
      publisher: data.data?.publisher
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 })
  }
}
```

**Alternative: Use Unsplash API** (1 hour):
```typescript
// Fallback to Unsplash for topic-based images
async function getUnsplashImage(topic: string) {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${topic}&per_page=1&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
  )
  const data = await response.json()
  return data.results[0]?.urls?.regular
}
```

**Tasks**:
- [ ] Create ImageWithFallback component
- [ ] Build /api/images/metadata endpoint
- [ ] Set up Microlink account (or use Unsplash)
- [ ] Replace all static images with ImageWithFallback
- [ ] Add blurhash placeholders (optional)
- [ ] Test with slow connections

---

## ⚡ Sprint 3: Clickability + Browser Embed (Week 3)

### Days 15-17: Make Everything Clickable

**Quick Wins** (1 day):
```typescript
// components/discover/NewsCard.tsx - Add click handlers
export function NewsCard({ article }) {
  const [showBrowser, setShowBrowser] = useState(false)

  return (
    <>
      <div className="group cursor-pointer" onClick={() => setShowBrowser(true)}>
        <ImageWithFallback url={article.url} alt={article.title} />
        <h3 className="group-hover:text-primary">{article.title}</h3>

        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); window.open(article.url) }}
            className="text-xs"
          >
            Open in new tab →
          </button>
        </div>
      </div>

      {showBrowser && (
        <BrowserModal url={article.url} onClose={() => setShowBrowser(false)} />
      )}
    </>
  )
}
```

**Finance Clickability** (4 hours):
- Stock tickers → Modal with TradingView widget
- Crypto → Modal with price chart
- Politicians → Modal with trade history

**Tasks**:
- [ ] Add click handlers to all cards
- [ ] Create modal components
- [ ] Add keyboard shortcuts (Esc to close)
- [ ] Test accessibility

---

### Days 18-21: Embedded Browser

**Option 1: IFrame Modal (Fast - 4 hours)**:
```typescript
// components/shared/BrowserModal.tsx
export function BrowserModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-background w-full h-full max-w-7xl max-h-[90vh] rounded-xl overflow-hidden flex flex-col">
        {/* Browser Toolbar */}
        <div className="flex items-center gap-2 p-3 border-b bg-muted">
          <button onClick={onClose}>✕</button>
          <input
            value={url}
            readOnly
            className="flex-1 px-3 py-1 rounded bg-background"
          />
          <button onClick={() => window.open(url)}>
            Open in Browser →
          </button>
        </div>

        {/* IFrame */}
        <iframe
          src={url}
          className="flex-1 w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  )
}
```

**Option 2: Screenshot + Link (Safer - 6 hours)**:
```typescript
// app/api/screenshot/route.ts
import puppeteer from 'puppeteer'

export async function POST(request: Request) {
  const { url } = await request.json()

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto(url, { waitUntil: 'networkidle2' })

  const screenshot = await page.screenshot({
    encoding: 'base64',
    fullPage: false
  })

  await browser.close()

  return NextResponse.json({ screenshot: `data:image/png;base64,${screenshot}` })
}
```

**Recommendation for MVP**: Use **IFrame** for speed, add Puppeteer screenshots later.

**Tasks**:
- [ ] Build BrowserModal component
- [ ] Add IFrame security (CSP headers)
- [ ] Test with various websites
- [ ] Add error handling for blocked sites
- [ ] (Optional) Set up Puppeteer for screenshots

---

## ⚡ Sprint 4: News Algorithm + Real-time (Week 4)

### Days 22-24: Ranking Algorithm

**Simple but effective** (6 hours):
```typescript
// lib/algorithms/rankNews.ts
interface Article {
  id: string
  title: string
  content: string
  publishedAt: Date
  source: string
  category: string
}

export function rankArticles(
  articles: Article[],
  userInterests: string[],
  readHistory: Article[]
): Article[] {
  return articles
    .map(article => ({
      article,
      score: calculateScore(article, userInterests, readHistory)
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ article }) => article)
}

function calculateScore(
  article: Article,
  interests: string[],
  history: Article[]
): number {
  // 1. Recency Score (0-40 points)
  const hoursSince = (Date.now() - article.publishedAt.getTime()) / (1000 * 60 * 60)
  const recencyScore = hoursSince < 1 ? 40 : hoursSince < 6 ? 30 : hoursSince < 24 ? 20 : 10

  // 2. Relevance Score (0-40 points)
  const text = `${article.title} ${article.content}`.toLowerCase()
  const matches = interests.filter(interest => text.includes(interest.toLowerCase())).length
  const relevanceScore = Math.min((matches / interests.length) * 40, 40)

  // 3. Diversity Score (0-20 points)
  const recentCategories = history.slice(0, 5).map(a => a.category)
  const diversityScore = recentCategories.includes(article.category) ? 10 : 20

  return recencyScore + relevanceScore + diversityScore
}
```

**Integrate with API**:
```typescript
// app/api/news/infinite/route.ts
import { rankArticles } from '@/lib/algorithms/rankNews'

export async function GET(request: Request) {
  const interests = getInterests(request) // From cookies or query params
  const history = getHistory(request)    // From localStorage or DB

  const articles = await fetchFromTavily()
  const ranked = rankArticles(articles, interests, history)

  return NextResponse.json({ articles: ranked })
}
```

**Tasks**:
- [ ] Build ranking algorithm
- [ ] Add interest tracking
- [ ] Save read history to localStorage
- [ ] Test with different interest combinations
- [ ] Add "Not interested" button

---

### Days 25-28: Performance Optimization

**Quick wins** (1 day each):

**Day 25: Code Splitting**:
```typescript
import dynamic from 'next/dynamic'

const BrowserModal = dynamic(() => import('@/components/shared/BrowserModal'), {
  ssr: false,
  loading: () => <LoadingSpinner />
})

const VideoPlayer = dynamic(() => import('@/components/videos/VideoPlayer'), {
  ssr: false
})
```

**Day 26: Image Optimization**:
- Replace all `<img>` with Next.js `<Image>`
- Add `loading="lazy"` to all images
- Implement blurhash placeholders

**Day 27: API Caching**:
```typescript
// Add caching headers to all API routes
export async function GET(request: Request) {
  const data = await fetchData()

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  })
}
```

**Day 28: Bundle Analysis**:
```bash
npm install -D @next/bundle-analyzer
# Analyze and remove unused dependencies
```

**Tasks**:
- [ ] Add dynamic imports for heavy components
- [ ] Optimize all images
- [ ] Add API caching headers
- [ ] Run bundle analyzer
- [ ] Achieve Lighthouse score 90+

---

## ⚡ Sprint 5: Testing + Polish (Week 5)

### Days 29-31: Testing

**Set up Vitest** (2 hours):
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
})
```

**Write critical tests** (1 day):
```typescript
// __tests__/components/NewsCard.test.tsx
import { render, screen } from '@testing-library/react'
import { NewsCard } from '@/components/discover/NewsCard'

describe('NewsCard', () => {
  it('renders article correctly', () => {
    const article = {
      title: 'Test Article',
      image: 'https://example.com/image.jpg'
    }
    render(<NewsCard article={article} />)
    expect(screen.getByText('Test Article')).toBeInTheDocument()
  })
})
```

**E2E with Playwright** (1 day):
```typescript
// e2e/discover.spec.ts
import { test, expect } from '@playwright/test'

test('infinite scroll loads more articles', async ({ page }) => {
  await page.goto('/discover')

  const initialCount = await page.locator('.news-card').count()
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(2000)

  const newCount = await page.locator('.news-card').count()
  expect(newCount).toBeGreaterThan(initialCount)
})
```

**Tasks**:
- [ ] Set up testing framework
- [ ] Write 10-15 component tests
- [ ] Write 5 E2E tests
- [ ] Set up CI to run tests

---

### Days 32-35: UI Polish

**Animations** (1 day):
```typescript
import { motion } from 'framer-motion'

export function NewsCard({ article }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Card content */}
    </motion.div>
  )
}
```

**Responsive Design** (2 days):
- Test on mobile (iPhone, Android)
- Fix tablet layouts
- Add touch gestures

**Accessibility** (1 day):
- Add ARIA labels
- Test with screen reader
- Keyboard navigation
- Focus states

**Tasks**:
- [ ] Add animations to all components
- [ ] Test responsive design
- [ ] Fix accessibility issues
- [ ] Run Lighthouse audit

---

## ⚡ Sprint 6: Deployment (Week 6)

### Days 36-38: Production Setup

**Day 36: Authentication**:
```bash
npm install @clerk/nextjs
```

```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

**Day 37: Database** (Optional for MVP):
```bash
npx prisma init
```

```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  interests String[]
  watchlist String[]
}

model Article {
  id          String   @id @default(cuid())
  title       String
  url         String
  publishedAt DateTime
}
```

**Day 38: Monitoring**:
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

**Tasks**:
- [ ] Set up Clerk authentication
- [ ] (Optional) Set up Prisma + Supabase
- [ ] Configure Sentry
- [ ] Add Vercel Analytics

---

### Days 39-42: Deploy to Production

**Day 39-40: Vercel Deployment**:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Environment Variables**:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
TAVILY_API_KEY=
FINNHUB_API_KEY=
SERPER_API_KEY=
UNSPLASH_ACCESS_KEY=
SENTRY_DSN=
```

**Day 41: Domain + SSL**:
- Add custom domain
- Configure DNS
- Enable SSL

**Day 42: Final Testing**:
- Test all features in production
- Run Lighthouse audit
- Check error tracking
- Monitor analytics

**Tasks**:
- [ ] Deploy to Vercel
- [ ] Configure environment variables
- [ ] Set up custom domain
- [ ] Test in production
- [ ] Monitor for errors

---

## 📊 6-Week Timeline Summary

| Week | Focus | Deliverable | Hours |
|------|-------|-------------|-------|
| **1** | Foundation | Component architecture + State management | 30h |
| **2** | Core Features | Infinite scroll + Image fetching | 35h |
| **3** | Interactivity | Clickable elements + Embedded browser | 35h |
| **4** | Algorithm | News ranking + Performance optimization | 30h |
| **5** | Quality | Testing + UI polish | 30h |
| **6** | Launch | Auth + Deploy + Monitoring | 25h |
| **Total** | | **Production-ready app** | **185h** |

---

## 🎯 MVP Feature Checklist

### Must Have (Week 1-4)
- [x] Real-time data APIs
- [ ] Infinite news feed
- [ ] Source image fetching
- [ ] News ranking algorithm
- [ ] Clickable links/cards
- [ ] Embedded browser (IFrame)
- [ ] Mobile responsive
- [ ] Loading states

### Should Have (Week 5-6)
- [ ] Authentication
- [ ] User preferences
- [ ] Testing (basic)
- [ ] Error monitoring
- [ ] Performance optimization
- [ ] Animations

### Nice to Have (Post-MVP)
- [ ] Database persistence
- [ ] Real-time updates (SSE)
- [ ] Advanced algorithm
- [ ] Social features
- [ ] AI summaries
- [ ] Chrome extension

---

## ⚡ Speed Tips

1. **Use Libraries**: Don't build from scratch
   - react-player for videos
   - framer-motion for animations
   - @clerk for auth
   - microlink for images

2. **Parallel Work**:
   - Build frontend while APIs are being built
   - Test on mobile while coding desktop
   - Write docs while deploying

3. **Skip for MVP**:
   - Database (use localStorage)
   - Real-time updates (use polling)
   - AI features (add later)
   - Social features (add later)

4. **AI Assistance**:
   - Use Claude/GPT to generate boilerplate
   - Copy from similar projects
   - Use shadcn/ui components

5. **Focus on Core**:
   - Infinite news feed is #1 priority
   - Everything else supports that

---

## 📦 Quick Start Commands

```bash
# Day 1 - Install everything
npm install @tanstack/react-query zustand framer-motion react-intersection-observer react-player microlink-sdk @clerk/nextjs

# Create folders
mkdir -p components/{finance,discover,academic,videos,shared} lib/{api,utils,algorithms} stores hooks

# Start development
npm run dev
```

---

## 🚨 Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tavily API limits | High | Cache aggressively, use fallback data |
| IFrame blocked by CSP | Medium | Use screenshot API as fallback |
| Performance issues | Medium | Code split, lazy load, optimize images |
| Scope creep | High | Stick to MVP checklist, defer nice-to-haves |

---

**Next Steps**: Start Week 1 immediately. Need help with any specific implementation?
