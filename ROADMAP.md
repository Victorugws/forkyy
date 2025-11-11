# Production Roadmap: Perplexity Clone

## 🎯 Vision
Transform the current Morphic fork into a production-ready Perplexity clone with embedded browser, infinite news feeds, real-time data, and full interactivity.

---

## Phase 1: Core Infrastructure & Architecture (Week 1-2)

### 1.1 Component Architecture Refactor
**Priority: HIGH** | **Complexity: Medium**

Break down monolithic pages into reusable components:

```
components/
├── finance/
│   ├── MarketIndices.tsx
│   ├── CryptoCards.tsx
│   ├── StockScreener.tsx
│   ├── PoliticianTrades.tsx
│   ├── EarningsCalendar.tsx
│   └── Watchlist.tsx
├── discover/
│   ├── FeaturedArticle.tsx
│   ├── NewsCard.tsx
│   ├── NewsFeed.tsx (infinite scroll)
│   ├── InterestSelector.tsx
│   └── NewsAlgorithm.tsx
├── academic/
│   ├── PaperCard.tsx
│   ├── PaperSearch.tsx
│   ├── FieldSelector.tsx
│   └── CitationGraph.tsx
├── videos/
│   ├── VideoCard.tsx
│   ├── VideoGrid.tsx
│   ├── VideoPlayer.tsx (embedded)
│   └── CategoryFilter.tsx
├── shared/
│   ├── ImageWithFallback.tsx
│   ├── LoadingSkeletons.tsx
│   ├── InfiniteScroll.tsx
│   ├── SourceBadge.tsx
│   └── EmbeddedBrowser.tsx
└── search/
    ├── SearchBar.tsx
    ├── SearchResults.tsx
    └── SearchFilters.tsx
```

**Tasks:**
- [ ] Extract Finance page components
- [ ] Extract Discover page components
- [ ] Extract Academic page components
- [ ] Extract Videos page components
- [ ] Create shared utility components
- [ ] Implement TypeScript interfaces for all data types

**References:**
- Vercel AI Chatbot: https://github.com/vercel/ai-chatbot
- Taxonomy (shadcn): https://github.com/shadcn-ui/taxonomy

---

### 1.2 State Management
**Priority: HIGH** | **Complexity: Medium**

Implement global state management for cross-component data:

**Options:**
- **Zustand** (Recommended - lightweight, simple)
- **Jotai** (Atomic state management)
- **Redux Toolkit** (If scaling to large team)

```typescript
// stores/useFinanceStore.ts
export const useFinanceStore = create((set) => ({
  marketIndices: [],
  cryptoData: [],
  screenerStocks: [],
  politicianTrades: [],
  loading: false,
  fetchFinanceData: async () => { /* ... */ }
}))

// stores/useNewsStore.ts
export const useNewsStore = create((set) => ({
  articles: [],
  page: 1,
  hasMore: true,
  loading: false,
  fetchNews: async (page) => { /* ... */ },
  appendNews: (newArticles) => { /* ... */ }
}))
```

**Tasks:**
- [ ] Install Zustand/Jotai
- [ ] Create finance store
- [ ] Create news store
- [ ] Create user preferences store
- [ ] Migrate useState to global stores
- [ ] Add persistence layer (localStorage/IndexedDB)

---

### 1.3 API Layer Improvements
**Priority: HIGH** | **Complexity: Low**

Centralize API calls with better error handling and caching:

```typescript
// lib/api/finance.ts
export const financeAPI = {
  getStocks: async (country?: string) => { /* ... */ },
  getCrypto: async () => { /* ... */ },
  getScreener: async (filters: ScreenerFilters) => { /* ... */ },
  getPoliticians: async () => { /* ... */ }
}

// lib/api/news.ts
export const newsAPI = {
  getFeatured: async () => { /* ... */ },
  getByTopic: async (topic: string, page: number) => { /* ... */ },
  getInfinite: async (page: number, interests: string[]) => { /* ... */ }
}
```

**Tasks:**
- [ ] Create centralized API client
- [ ] Add request/response interceptors
- [ ] Implement retry logic with exponential backoff
- [ ] Add rate limiting protection
- [ ] Implement response caching (React Query/SWR)
- [ ] Add API error boundary components

**Libraries:**
- **TanStack Query (React Query)** - Server state management, caching, auto-refetch
- **SWR** - Alternative, lighter weight

---

## Phase 2: Embedded Browser Implementation (Week 3-4)

### 2.1 Browser Embedding Strategy
**Priority: CRITICAL** | **Complexity: HIGH**

**Option A: IFrame (Simple, limited control)**
```typescript
// components/shared/EmbeddedBrowser.tsx
export function EmbeddedBrowser({ url, sandbox = true }) {
  return (
    <iframe
      src={url}
      sandbox={sandbox ? "allow-scripts allow-same-origin" : undefined}
      className="w-full h-full border-0"
    />
  )
}
```

**Option B: Webview/Electron (Full control, desktop app)**
- Best for desktop application
- Can intercept requests, inject scripts
- Requires Electron wrapper

**Option C: Browser Extension + Web App**
- Chrome extension communicates with web app
- Can capture full browser state
- Best user experience

**Option D: Headless Browser (Server-side)**
- Puppeteer/Playwright on backend
- Capture screenshots, content
- Stream to frontend

**Recommended: Hybrid Approach**
1. IFrame for simple embeds (YouTube, maps, etc.)
2. Server-side Puppeteer for complex pages
3. Chrome Extension for power users

**Tasks:**
- [ ] Create EmbeddedBrowser component
- [ ] Implement IFrame sandbox security
- [ ] Set up Puppeteer API endpoint
- [ ] Create browser screenshot API
- [ ] Build Chrome extension (optional)
- [ ] Add browser toolbar (back, forward, refresh, URL bar)
- [ ] Implement page history
- [ ] Add screenshot capture
- [ ] Create "Open in Browser" feature

**API Endpoint:**
```typescript
// app/api/browser/route.ts
export async function POST(request: Request) {
  const { url } = await request.json()

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)

  const screenshot = await page.screenshot()
  const content = await page.content()

  await browser.close()

  return NextResponse.json({ screenshot, content })
}
```

**References:**
- Puppeteer: https://github.com/puppeteer/puppeteer
- Playwright: https://github.com/microsoft/playwright
- Browser Extension Template: https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite

---

### 2.2 Clickable Links & Interactive Elements
**Priority: HIGH** | **Complexity: Medium**

Make all elements clickable and functional:

**Finance Page:**
- [ ] Stock tickers → Open embedded chart/company page
- [ ] Crypto → Open trading view
- [ ] Politician trades → Open trade details modal
- [ ] Watchlist stocks → Open real-time quote

**Discover Page:**
- [ ] News articles → Open in embedded browser
- [ ] Source badges → Filter by source
- [ ] Topics → Load topic-specific feed

**Academic Page:**
- [ ] Paper titles → Open PDF in viewer
- [ ] Author names → Show author profile
- [ ] Citations → Show citation graph

**Videos Page:**
- [ ] Video thumbnails → Play in embedded player
- [ ] Channel names → Show channel page

**Implementation:**
```typescript
// components/discover/NewsCard.tsx
export function NewsCard({ article }) {
  const [showBrowser, setShowBrowser] = useState(false)

  return (
    <div>
      <Link href={`/article?url=${article.url}`}>
        <h3>{article.title}</h3>
      </Link>
      <button onClick={() => setShowBrowser(true)}>
        Read in Browser
      </button>

      {showBrowser && (
        <Modal>
          <EmbeddedBrowser url={article.url} />
        </Modal>
      )}
    </div>
  )
}
```

**Tasks:**
- [ ] Add onClick handlers to all interactive elements
- [ ] Create modal/drawer for embedded content
- [ ] Implement deep linking (article ID, stock symbol, etc.)
- [ ] Add keyboard shortcuts (Esc to close, ⌘K for search)
- [ ] Create hover tooltips with previews
- [ ] Add right-click context menu

---

## Phase 3: Image & Media Handling (Week 5)

### 3.1 Source Image Fetching
**Priority: HIGH** | **Complexity: Medium**

**Problem:** Images aren't being fetched from article sources.

**Solution:** Multi-layered image fetching strategy:

```typescript
// lib/imageUtils.ts
export async function fetchArticleImage(url: string): Promise<string> {
  // Layer 1: Try Open Graph image
  const ogImage = await getOGImage(url)
  if (ogImage) return ogImage

  // Layer 2: Try Twitter card image
  const twitterImage = await getTwitterImage(url)
  if (twitterImage) return twitterImage

  // Layer 3: Scrape first large image
  const scrapedImage = await scrapeFirstImage(url)
  if (scrapedImage) return scrapedImage

  // Layer 4: Use Unsplash based on article topic
  const unsplashImage = await getUnsplashImage(extractKeywords(url))
  if (unsplashImage) return unsplashImage

  // Layer 5: Use placeholder
  return getPlaceholderImage()
}
```

**API Endpoint:**
```typescript
// app/api/images/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  // Use microlink.io, urlbox.io, or custom scraper
  const response = await fetch(`https://api.microlink.io?url=${url}`)
  const data = await response.json()

  return NextResponse.json({
    image: data.data.image?.url,
    logo: data.data.logo?.url,
    title: data.data.title,
    description: data.data.description
  })
}
```

**Tasks:**
- [ ] Create image fetching utility
- [ ] Implement OG image extraction
- [ ] Add image proxy API endpoint
- [ ] Implement lazy loading with Intersection Observer
- [ ] Add image optimization (Next.js Image component)
- [ ] Create image cache layer
- [ ] Add fallback image system
- [ ] Implement blurhash placeholders

**Services:**
- **Microlink.io** - Screenshot and metadata API
- **URLBox.io** - Screenshot API
- **Cloudinary** - Image CDN and optimization
- **Unsplash API** - Fallback images

**References:**
- Next.js Image: https://nextjs.org/docs/pages/building-your-application/optimizing/images
- Microlink: https://microlink.io

---

### 3.2 Video Player Integration
**Priority: MEDIUM** | **Complexity: Medium**

**Tasks:**
- [ ] Integrate video player (Video.js, Plyr, or react-player)
- [ ] Support YouTube, Vimeo, direct video URLs
- [ ] Add picture-in-picture mode
- [ ] Implement playback speed control
- [ ] Add quality selector
- [ ] Create playlist functionality
- [ ] Add keyboard shortcuts (Space, K, J, L)

```typescript
// components/videos/VideoPlayer.tsx
import ReactPlayer from 'react-player'

export function VideoPlayer({ url }) {
  return (
    <ReactPlayer
      url={url}
      controls
      pip
      config={{
        youtube: { playerVars: { modestbranding: 1 } }
      }}
    />
  )
}
```

---

## Phase 4: Infinite News Feed & Algorithm (Week 6-7)

### 4.1 Infinite Scroll Implementation
**Priority: CRITICAL** | **Complexity: Medium**

**Implementation:**
```typescript
// components/discover/InfiniteNewsFeed.tsx
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

export function InfiniteNewsFeed() {
  const { ref, inView } = useInView()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['news'],
    queryFn: ({ pageParam = 1 }) => fetchNews(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage])

  return (
    <div>
      {data?.pages.map((page) => (
        page.articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))
      ))}
      <div ref={ref}>{isFetchingNextPage && <Spinner />}</div>
    </div>
  )
}
```

**Tasks:**
- [ ] Install @tanstack/react-query and react-intersection-observer
- [ ] Create infinite query hook
- [ ] Implement pagination in API endpoint
- [ ] Add virtual scrolling for performance (react-virtual)
- [ ] Implement pull-to-refresh
- [ ] Add "Back to top" button
- [ ] Save scroll position on navigation

---

### 4.2 News Feed Algorithm
**Priority: HIGH** | **Complexity: HIGH**

**Algorithm Goals:**
1. Personalization based on user interests
2. Recency (prioritize recent news)
3. Diversity (mix of sources and topics)
4. Engagement signals (clicks, time spent)

**Implementation:**
```typescript
// lib/algorithms/newsRanking.ts
interface RankingFactors {
  recency: number        // 0-1 (how recent)
  relevance: number      // 0-1 (match to interests)
  sourceQuality: number  // 0-1 (source reputation)
  diversity: number      // 0-1 (topic diversity)
  engagement: number     // 0-1 (predicted engagement)
}

export function rankArticles(
  articles: Article[],
  userInterests: string[],
  history: Article[]
): Article[] {
  const scored = articles.map(article => ({
    article,
    score: calculateScore(article, userInterests, history)
  }))

  return scored
    .sort((a, b) => b.score - a.score)
    .map(s => s.article)
}

function calculateScore(
  article: Article,
  interests: string[],
  history: Article[]
): number {
  const factors: RankingFactors = {
    recency: calculateRecency(article.publishedAt),
    relevance: calculateRelevance(article, interests),
    sourceQuality: getSourceQuality(article.source),
    diversity: calculateDiversity(article, history),
    engagement: predictEngagement(article)
  }

  // Weighted scoring
  return (
    factors.recency * 0.25 +
    factors.relevance * 0.30 +
    factors.sourceQuality * 0.15 +
    factors.diversity * 0.15 +
    factors.engagement * 0.15
  )
}

function calculateRecency(publishedAt: Date): number {
  const hoursSince = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60)

  if (hoursSince < 1) return 1.0      // Last hour: full score
  if (hoursSince < 6) return 0.9      // Last 6 hours
  if (hoursSince < 24) return 0.7     // Last day
  if (hoursSince < 72) return 0.4     // Last 3 days
  return 0.1                          // Older
}

function calculateRelevance(
  article: Article,
  interests: string[]
): number {
  const articleText = `${article.title} ${article.summary}`.toLowerCase()

  let matches = 0
  interests.forEach(interest => {
    if (articleText.includes(interest.toLowerCase())) {
      matches++
    }
  })

  return Math.min(matches / interests.length, 1.0)
}

function calculateDiversity(
  article: Article,
  recentHistory: Article[]
): number {
  const recentTopics = recentHistory.map(a => a.category)
  const recentSources = recentHistory.map(a => a.source)

  // Penalize if same topic/source shown recently
  const topicPenalty = recentTopics.includes(article.category) ? 0.5 : 1.0
  const sourcePenalty = recentSources.includes(article.source) ? 0.5 : 1.0

  return (topicPenalty + sourcePenalty) / 2
}
```

**Tasks:**
- [ ] Build ranking algorithm
- [ ] Create user interest tracking
- [ ] Implement click tracking
- [ ] Add read time tracking
- [ ] Build A/B testing framework
- [ ] Create analytics dashboard
- [ ] Implement collaborative filtering
- [ ] Add "Not interested" feedback

---

### 4.3 Real-time News Updates
**Priority: MEDIUM** | **Complexity: HIGH**

**Use WebSocket or Server-Sent Events for live updates:**

```typescript
// app/api/news/stream/route.ts
export async function GET(request: Request) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      // Fetch news every 30 seconds
      const interval = setInterval(async () => {
        const news = await fetchLatestNews()
        const data = encoder.encode(`data: ${JSON.stringify(news)}\n\n`)
        controller.enqueue(data)
      }, 30000)

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}
```

**Client:**
```typescript
// hooks/useRealtimeNews.ts
export function useRealtimeNews() {
  useEffect(() => {
    const eventSource = new EventSource('/api/news/stream')

    eventSource.onmessage = (event) => {
      const newArticles = JSON.parse(event.data)
      // Update state with new articles
    }

    return () => eventSource.close()
  }, [])
}
```

**Tasks:**
- [ ] Implement SSE endpoint
- [ ] Create real-time news hook
- [ ] Add "New articles available" banner
- [ ] Implement smooth insertion animation
- [ ] Add auto-scroll on new content (optional)

---

## Phase 5: UI/UX Polish (Week 8)

### 5.1 Animations & Transitions
**Priority: MEDIUM** | **Complexity: LOW**

**Use Framer Motion:**
```typescript
import { motion } from 'framer-motion'

export function NewsCard({ article }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Card content */}
    </motion.div>
  )
}
```

**Tasks:**
- [ ] Add page transitions
- [ ] Animate card entries
- [ ] Add hover effects
- [ ] Create loading animations
- [ ] Add micro-interactions
- [ ] Implement gesture controls (swipe)

---

### 5.2 Dark Mode Refinement
**Priority: LOW** | **Complexity: LOW**

**Tasks:**
- [ ] Test all components in dark mode
- [ ] Fix contrast issues
- [ ] Add smooth theme transition
- [ ] Persist theme preference
- [ ] Add system theme detection

---

### 5.3 Responsive Design
**Priority: HIGH** | **Complexity: MEDIUM**

**Tasks:**
- [ ] Mobile optimization (320px - 768px)
- [ ] Tablet optimization (768px - 1024px)
- [ ] Desktop optimization (1024px+)
- [ ] Touch gestures for mobile
- [ ] Mobile navigation menu
- [ ] Responsive embedded browser
- [ ] Test on real devices

---

## Phase 6: Performance Optimization (Week 9)

### 6.1 Code Splitting & Lazy Loading
**Priority: HIGH** | **Complexity: MEDIUM**

```typescript
// Lazy load heavy components
const EmbeddedBrowser = lazy(() => import('@/components/shared/EmbeddedBrowser'))
const VideoPlayer = lazy(() => import('@/components/videos/VideoPlayer'))
const ChartComponent = lazy(() => import('@/components/finance/ChartComponent'))
```

**Tasks:**
- [ ] Implement dynamic imports
- [ ] Code split by route
- [ ] Lazy load images
- [ ] Defer non-critical scripts
- [ ] Bundle analysis (webpack-bundle-analyzer)
- [ ] Remove unused dependencies

---

### 6.2 Caching Strategy
**Priority: HIGH** | **Complexity: MEDIUM**

**Multi-layer caching:**
1. **Browser Cache** - Static assets (images, fonts)
2. **Memory Cache** - React Query cache
3. **Service Worker** - Offline support
4. **CDN Cache** - API responses

**Tasks:**
- [ ] Configure Next.js caching headers
- [ ] Implement service worker
- [ ] Set up CDN (Vercel Edge, CloudFlare)
- [ ] Add stale-while-revalidate
- [ ] Implement cache invalidation
- [ ] Add offline mode

---

### 6.3 Database & Backend
**Priority: MEDIUM** | **Complexity: HIGH**

**Add persistent storage:**

```
Database Schema:
├── users
│   ├── id, email, preferences
│   └── interests (JSON)
├── articles
│   ├── id, title, url, image
│   └── published_at, source
├── user_interactions
│   ├── user_id, article_id
│   └── action (click, read, save)
└── watchlists
    ├── user_id, asset_id
    └── type (stock, crypto)
```

**Tech Stack Options:**
- **Supabase** (PostgreSQL + Auth + Realtime)
- **PlanetScale** (MySQL)
- **MongoDB Atlas**
- **Prisma** (ORM)

**Tasks:**
- [ ] Set up database
- [ ] Create Prisma schema
- [ ] Build API endpoints with database
- [ ] Add user authentication
- [ ] Implement user preferences
- [ ] Store article interactions
- [ ] Create saved articles feature
- [ ] Build reading history

---

## Phase 7: Production Readiness (Week 10-11)

### 7.1 Authentication & Authorization
**Priority: HIGH** | **Complexity: MEDIUM**

**Use Clerk, Auth0, or NextAuth.js:**

```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  )
}
```

**Tasks:**
- [ ] Add authentication provider
- [ ] Create login/signup pages
- [ ] Implement protected routes
- [ ] Add user profile page
- [ ] Sync preferences to database
- [ ] Implement social login
- [ ] Add email verification

---

### 7.2 Error Handling & Monitoring
**Priority: HIGH** | **Complexity: LOW**

**Add Sentry for error tracking:**

```typescript
// sentry.config.ts
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

**Tasks:**
- [ ] Set up Sentry
- [ ] Add error boundaries
- [ ] Implement global error handler
- [ ] Add user feedback widget
- [ ] Set up performance monitoring
- [ ] Create error logging
- [ ] Add analytics (PostHog, Mixpanel)

---

### 7.3 Testing
**Priority: HIGH** | **Complexity: HIGH**

**Testing Strategy:**
1. **Unit Tests** - Components, utilities (Jest, Vitest)
2. **Integration Tests** - API routes, flows (Playwright)
3. **E2E Tests** - Full user journeys (Playwright, Cypress)

```typescript
// __tests__/components/NewsCard.test.tsx
import { render, screen } from '@testing-library/react'
import { NewsCard } from '@/components/discover/NewsCard'

describe('NewsCard', () => {
  it('renders article title', () => {
    const article = { title: 'Test Article', /* ... */ }
    render(<NewsCard article={article} />)
    expect(screen.getByText('Test Article')).toBeInTheDocument()
  })
})
```

**Tasks:**
- [ ] Set up testing framework
- [ ] Write component tests
- [ ] Write API tests
- [ ] Write E2E tests
- [ ] Add CI/CD pipeline (GitHub Actions)
- [ ] Set up test coverage reporting
- [ ] Implement visual regression testing

---

### 7.4 SEO & Metadata
**Priority: MEDIUM** | **Complexity: LOW**

**Tasks:**
- [ ] Add meta tags to all pages
- [ ] Create sitemap.xml
- [ ] Add robots.txt
- [ ] Implement Open Graph tags
- [ ] Add Twitter Card tags
- [ ] Create JSON-LD structured data
- [ ] Optimize Core Web Vitals
- [ ] Add canonical URLs

---

### 7.5 Security
**Priority: CRITICAL** | **Complexity: MEDIUM**

**Tasks:**
- [ ] Add rate limiting (Upstash Rate Limit)
- [ ] Implement CORS properly
- [ ] Sanitize user inputs
- [ ] Add CSP headers
- [ ] Implement API key rotation
- [ ] Add request signing
- [ ] Security audit
- [ ] Penetration testing

---

### 7.6 Documentation
**Priority: MEDIUM** | **Complexity: LOW**

**Tasks:**
- [ ] Write README with setup instructions
- [ ] Document API endpoints
- [ ] Create component documentation (Storybook)
- [ ] Write contributing guidelines
- [ ] Add inline code comments
- [ ] Create architecture diagrams
- [ ] Write deployment guide

---

## Phase 8: Deployment & DevOps (Week 12)

### 8.1 Deployment
**Priority: CRITICAL** | **Complexity: MEDIUM**

**Recommended: Vercel (zero-config for Next.js)**

**Tasks:**
- [ ] Set up Vercel project
- [ ] Configure environment variables
- [ ] Set up custom domain
- [ ] Configure SSL/TLS
- [ ] Set up preview deployments
- [ ] Add deployment webhooks
- [ ] Configure CDN settings

**Alternative Platforms:**
- AWS Amplify
- Netlify
- Railway
- Fly.io

---

### 8.2 CI/CD Pipeline
**Priority: HIGH** | **Complexity: MEDIUM**

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: vercel/action@v2
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

**Tasks:**
- [ ] Set up GitHub Actions
- [ ] Add automated tests to pipeline
- [ ] Configure automatic deployments
- [ ] Add deployment notifications
- [ ] Implement blue-green deployments
- [ ] Set up rollback mechanism

---

### 8.3 Monitoring & Analytics
**Priority: HIGH** | **Complexity: LOW**

**Tools:**
- **Vercel Analytics** - Performance monitoring
- **Google Analytics / PostHog** - User analytics
- **Sentry** - Error tracking
- **LogRocket** - Session replay

**Tasks:**
- [ ] Set up analytics
- [ ] Create custom events
- [ ] Build dashboards
- [ ] Set up alerts
- [ ] Monitor API usage
- [ ] Track conversion funnels

---

## Phase 9: Advanced Features (Week 13+)

### 9.1 AI Features
**Priority: MEDIUM** | **Complexity: HIGH**

**Features:**
- [ ] AI-powered article summaries
- [ ] Smart search with semantic understanding
- [ ] Personalized recommendations
- [ ] Topic extraction and tagging
- [ ] Sentiment analysis
- [ ] Auto-generate related questions

```typescript
// AI-powered summary using OpenAI
async function summarizeArticle(url: string) {
  const content = await fetchArticleContent(url)

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'Summarize this article in 2-3 sentences.' },
      { role: 'user', content }
    ]
  })

  return response.choices[0].message.content
}
```

---

### 9.2 Social Features
**Priority: LOW** | **Complexity: HIGH**

**Features:**
- [ ] User profiles
- [ ] Follow system
- [ ] Comments on articles
- [ ] Share to social media
- [ ] Collaborative collections
- [ ] Reading groups

---

### 9.3 Premium Features
**Priority: LOW** | **Complexity: HIGH**

**Monetization Options:**
- [ ] Subscription tiers (Stripe)
- [ ] Ad-free experience
- [ ] Advanced analytics
- [ ] Priority API access
- [ ] Custom alerts
- [ ] Export features

---

## 📊 Success Metrics

### Performance
- [ ] **Lighthouse Score**: 90+ on all metrics
- [ ] **First Contentful Paint**: < 1.5s
- [ ] **Time to Interactive**: < 3.5s
- [ ] **API Response Time**: < 200ms (p95)

### User Experience
- [ ] **Mobile Responsive**: 100%
- [ ] **Accessibility Score**: WCAG AA compliant
- [ ] **Browser Support**: Chrome, Firefox, Safari, Edge

### Reliability
- [ ] **Uptime**: 99.9%
- [ ] **Error Rate**: < 0.1%
- [ ] **Test Coverage**: > 80%

---

## 🛠️ Tech Stack Summary

### Core
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand / Jotai
- **Data Fetching**: TanStack Query (React Query)

### APIs & Services
- **Finance**: Finnhub / Polygon.io
- **News**: Tavily
- **Academic**: Semantic Scholar
- **Videos**: SERPER (Google Videos)
- **Images**: Microlink / URLBox / Unsplash

### Infrastructure
- **Deployment**: Vercel
- **Database**: Supabase / PlanetScale
- **Auth**: Clerk / NextAuth.js
- **Monitoring**: Sentry + Vercel Analytics
- **Analytics**: PostHog / Mixpanel

### Browser Embedding
- **IFrames**: Native
- **Screenshots**: Puppeteer / Playwright
- **Extension**: Chrome Extension API

---

## 📦 Quick Start (Next Steps)

1. **Phase 1 - Week 1**: Start refactoring into components
2. **Install critical dependencies**:
```bash
npm install @tanstack/react-query zustand framer-motion
npm install react-intersection-observer react-player
npm install @clerk/nextjs @sentry/nextjs
npm install -D @testing-library/react vitest
```

3. **Set up project structure**:
```bash
mkdir -p components/{finance,discover,academic,videos,shared}
mkdir -p lib/{api,algorithms,utils}
mkdir -p stores
mkdir -p hooks
```

4. **Start with highest priority tasks**:
   - Component refactor
   - Infinite scroll implementation
   - News algorithm
   - Image fetching

---

## 🎯 Priority Matrix

| Feature | Priority | Complexity | Impact | Start |
|---------|----------|------------|--------|-------|
| Component Architecture | 🔴 HIGH | Medium | High | Week 1 |
| Infinite News Feed | 🔴 HIGH | Medium | High | Week 1 |
| Image Fetching | 🔴 HIGH | Medium | High | Week 2 |
| News Algorithm | 🔴 HIGH | High | High | Week 2 |
| Embedded Browser | 🔴 HIGH | High | High | Week 3 |
| Clickable Elements | 🔴 HIGH | Medium | High | Week 3 |
| State Management | 🔴 HIGH | Medium | Medium | Week 1 |
| Authentication | 🟡 MEDIUM | Medium | Medium | Week 7 |
| Real-time Updates | 🟡 MEDIUM | High | Medium | Week 6 |
| AI Features | 🟡 MEDIUM | High | Low | Week 13+ |
| Social Features | 🟢 LOW | High | Low | Future |

---

**Legend:**
- 🔴 **HIGH**: Must have for production
- 🟡 **MEDIUM**: Important but not critical
- 🟢 **LOW**: Nice to have

---

## 📝 Notes

- Each phase can be worked on in parallel by different team members
- Prioritize user-facing features over internal tooling
- Regular user testing after each phase
- Keep mobile-first approach throughout
- Document decisions in ADR (Architecture Decision Records)

---

**Next Action**: Start Phase 1 - Component refactoring. Would you like me to begin implementing any specific phase?
