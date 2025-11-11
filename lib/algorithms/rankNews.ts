/**
 * News Ranking Algorithm
 *
 * Scores articles based on multiple factors:
 * - Recency: Recent articles score higher
 * - Relevance: Match with user interests
 * - Diversity: Avoid repetitive categories
 * - Read history: Avoid showing recently read articles
 */

export interface Article {
  id: string
  title: string
  summary?: string
  url: string
  source?: string
  category?: string
  publishedAt?: Date | string
  publishedHours?: number
}

export interface RankingOptions {
  interests?: string[]
  readHistory?: string[] // Article IDs
  recentCategories?: string[] // Categories of recently shown articles
}

/**
 * Rank articles based on user preferences and behavior
 */
export function rankArticles(
  articles: Article[],
  options: RankingOptions = {}
): Article[] {
  const { interests = [], readHistory = [], recentCategories = [] } = options

  return articles
    .map(article => ({
      article,
      score: calculateScore(article, interests, readHistory, recentCategories)
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ article }) => article)
}

/**
 * Calculate relevance score for a single article
 */
function calculateScore(
  article: Article,
  interests: string[],
  readHistory: string[],
  recentCategories: string[]
): number {
  // 1. Recency Score (0-40 points)
  const recencyScore = calculateRecencyScore(article)

  // 2. Relevance Score (0-40 points)
  const relevanceScore = calculateRelevanceScore(article, interests)

  // 3. Diversity Score (0-20 points)
  const diversityScore = calculateDiversityScore(article, recentCategories)

  // 4. Read History Penalty (-50 points if already read)
  const readPenalty = readHistory.includes(article.id) ? -50 : 0

  const totalScore = recencyScore + relevanceScore + diversityScore + readPenalty

  return totalScore
}

/**
 * Score based on article age (newer = higher score)
 */
function calculateRecencyScore(article: Article): number {
  let hoursSince: number

  if (article.publishedHours !== undefined) {
    hoursSince = article.publishedHours
  } else if (article.publishedAt) {
    const publishedDate = typeof article.publishedAt === 'string'
      ? new Date(article.publishedAt)
      : article.publishedAt
    hoursSince = (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60)
  } else {
    // No date info, assume moderately recent
    return 20
  }

  // Scoring: < 1h = 40pts, < 6h = 30pts, < 24h = 20pts, < 48h = 10pts, else 5pts
  if (hoursSince < 1) return 40
  if (hoursSince < 6) return 30
  if (hoursSince < 24) return 20
  if (hoursSince < 48) return 10
  return 5
}

/**
 * Score based on match with user interests
 */
function calculateRelevanceScore(article: Article, interests: string[]): number {
  if (interests.length === 0) {
    // No interests set, give neutral score
    return 20
  }

  const text = `${article.title} ${article.summary || ''} ${article.category || ''}`.toLowerCase()

  // Count how many interests match
  const matches = interests.filter(interest =>
    text.includes(interest.toLowerCase())
  ).length

  if (matches === 0) return 0

  // Scale based on match percentage (max 40 points)
  const matchPercentage = Math.min(matches / interests.length, 1)
  return Math.round(matchPercentage * 40)
}

/**
 * Score based on category diversity (avoid showing same category repeatedly)
 */
function calculateDiversityScore(article: Article, recentCategories: string[]): number {
  if (!article.category || recentCategories.length === 0) {
    // No category info or no history, give neutral score
    return 10
  }

  // Count how many times this category appeared recently
  const categoryCount = recentCategories.filter(cat =>
    cat.toLowerCase() === article.category!.toLowerCase()
  ).length

  // Penalize repetitive categories
  if (categoryCount === 0) return 20 // Fresh category
  if (categoryCount === 1) return 15
  if (categoryCount === 2) return 10
  if (categoryCount === 3) return 5
  return 0 // Category shown too many times
}

/**
 * Track recently shown categories (for diversity scoring)
 */
export function updateRecentCategories(
  recentCategories: string[],
  newCategory: string,
  maxSize: number = 10
): string[] {
  const updated = [newCategory, ...recentCategories]
  return updated.slice(0, maxSize)
}

/**
 * Mark article as read
 */
export function markAsRead(
  readHistory: string[],
  articleId: string,
  maxSize: number = 100
): string[] {
  if (readHistory.includes(articleId)) {
    return readHistory
  }
  const updated = [articleId, ...readHistory]
  return updated.slice(0, maxSize)
}

/**
 * Get personalized feed based on user behavior
 */
export function getPersonalizedFeed(
  articles: Article[],
  options: RankingOptions = {}
): Article[] {
  // Rank articles
  const ranked = rankArticles(articles, options)

  // Return top articles (limit to prevent overwhelming the user)
  return ranked.slice(0, 50)
}
