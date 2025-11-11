import { create } from 'zustand'

interface FinanceStore {
  marketIndices: any[]
  cryptoData: any[]
  screenerStocks: any[]
  politicianTrades: any[]
  watchlist: string[]
  loading: boolean

  setMarketIndices: (data: any[]) => void
  setCryptoData: (data: any[]) => void
  setScreenerStocks: (data: any[]) => void
  setPoliticianTrades: (data: any[]) => void
  setLoading: (loading: boolean) => void

  addToWatchlist: (ticker: string) => void
  removeFromWatchlist: (ticker: string) => void
  isInWatchlist: (ticker: string) => boolean
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  marketIndices: [],
  cryptoData: [],
  screenerStocks: [],
  politicianTrades: [],
  watchlist: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('stockWatchlist') || '[]')
    : [],
  loading: false,

  setMarketIndices: (data) => set({ marketIndices: data }),
  setCryptoData: (data) => set({ cryptoData: data }),
  setScreenerStocks: (data) => set({ screenerStocks: data }),
  setPoliticianTrades: (data) => set({ politicianTrades: data }),
  setLoading: (loading) => set({ loading }),

  addToWatchlist: (ticker) => {
    const watchlist = [...get().watchlist, ticker]
    set({ watchlist })
    if (typeof window !== 'undefined') {
      localStorage.setItem('stockWatchlist', JSON.stringify(watchlist))
    }
  },

  removeFromWatchlist: (ticker) => {
    const watchlist = get().watchlist.filter(t => t !== ticker)
    set({ watchlist })
    if (typeof window !== 'undefined') {
      localStorage.setItem('stockWatchlist', JSON.stringify(watchlist))
    }
  },

  isInWatchlist: (ticker) => get().watchlist.includes(ticker)
}))
