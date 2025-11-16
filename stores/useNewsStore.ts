import { create } from 'zustand'

interface Article {
  id: string
  title: string
  summary: string
  image: string
  source: string
  url: string
  views: string
  sources: number
  publishedHours: number
  publishedAt: Date
  category?: string
}

interface NewsStore {
  articles: Article[]
  page: number
  hasMore: boolean
  loading: boolean
  interests: string[]

  setArticles: (articles: Article[]) => void
  appendArticles: (articles: Article[]) => void
  setPage: (page: number) => void
  setHasMore: (hasMore: boolean) => void
  setLoading: (loading: boolean) => void
  setInterests: (interests: string[]) => void
  reset: () => void
}

export const useNewsStore = create<NewsStore>((set) => ({
  articles: [],
  page: 1,
  hasMore: true,
  loading: false,
  interests: [],

  setArticles: (articles) => set({ articles }),
  appendArticles: (articles) => set((state) => ({
    articles: [...state.articles, ...articles]
  })),
  setPage: (page) => set({ page }),
  setHasMore: (hasMore) => set({ hasMore }),
  setLoading: (loading) => set({ loading }),
  setInterests: (interests) => {
    set({ interests })
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('userInterests', JSON.stringify(interests))
    }
  },
  reset: () => set({ articles: [], page: 1, hasMore: true, loading: false })
}))
