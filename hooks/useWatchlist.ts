'use client'

import { useState, useEffect, useCallback } from 'react'

const WATCHLIST_STORAGE_KEY = 'stockWatchlist'

export interface WatchlistItem {
  ticker: string
  addedAt: number
  name?: string
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setWatchlist(Array.isArray(parsed) ? parsed : [])
      }
    } catch (error) {
      console.error('Error loading watchlist:', error)
      setWatchlist([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Save to localStorage whenever watchlist changes
  const saveToStorage = useCallback((newWatchlist: string[]) => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(newWatchlist))
    } catch (error) {
      console.error('Error saving watchlist:', error)
    }
  }, [])

  // Add ticker to watchlist
  const addToWatchlist = useCallback((ticker: string) => {
    console.log('Adding to watchlist:', ticker)
    setWatchlist(prev => {
      // Avoid duplicates
      if (prev.includes(ticker)) {
        console.log('Ticker already in watchlist:', ticker)
        return prev
      }
      const newWatchlist = [...prev, ticker]
      console.log('New watchlist:', newWatchlist)
      saveToStorage(newWatchlist)
      return newWatchlist
    })
  }, [saveToStorage])

  // Remove ticker from watchlist
  const removeFromWatchlist = useCallback((ticker: string) => {
    console.log('Removing from watchlist:', ticker)
    setWatchlist(prev => {
      const newWatchlist = prev.filter(t => t !== ticker)
      console.log('New watchlist after removal:', newWatchlist)
      saveToStorage(newWatchlist)
      return newWatchlist
    })
  }, [saveToStorage])

  // Check if ticker is in watchlist
  const isInWatchlist = useCallback((ticker: string) => {
    return watchlist.includes(ticker)
  }, [watchlist])

  // Toggle ticker in watchlist
  const toggleWatchlist = useCallback((ticker: string) => {
    if (isInWatchlist(ticker)) {
      removeFromWatchlist(ticker)
    } else {
      addToWatchlist(ticker)
    }
  }, [isInWatchlist, addToWatchlist, removeFromWatchlist])

  // Clear entire watchlist
  const clearWatchlist = useCallback(() => {
    setWatchlist([])
    saveToStorage([])
  }, [saveToStorage])

  return {
    watchlist,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    clearWatchlist,
    count: watchlist.length
  }
}
