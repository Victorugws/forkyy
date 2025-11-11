'use client'

import { useState, useEffect } from 'react'
import { markAsRead as markAsReadUtil, updateRecentCategories as updateCategoriesUtil } from '@/lib/algorithms/rankNews'

const INTERESTS_KEY = 'userInterests'
const READ_HISTORY_KEY = 'readHistory'
const RECENT_CATEGORIES_KEY = 'recentCategories'

export function useUserPreferences() {
  const [interests, setInterests] = useState<string[]>([])
  const [readHistory, setReadHistory] = useState<string[]>([])
  const [recentCategories, setRecentCategories] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedInterests = localStorage.getItem(INTERESTS_KEY)
    const savedReadHistory = localStorage.getItem(READ_HISTORY_KEY)
    const savedCategories = localStorage.getItem(RECENT_CATEGORIES_KEY)

    if (savedInterests) {
      try {
        setInterests(JSON.parse(savedInterests))
      } catch (e) {
        console.error('Failed to parse interests:', e)
      }
    }

    if (savedReadHistory) {
      try {
        setReadHistory(JSON.parse(savedReadHistory))
      } catch (e) {
        console.error('Failed to parse read history:', e)
      }
    }

    if (savedCategories) {
      try {
        setRecentCategories(JSON.parse(savedCategories))
      } catch (e) {
        console.error('Failed to parse recent categories:', e)
      }
    }

    setIsLoaded(true)
  }, [])

  // Update interests
  const updateInterests = (newInterests: string[]) => {
    setInterests(newInterests)
    localStorage.setItem(INTERESTS_KEY, JSON.stringify(newInterests))
  }

  // Add interest
  const addInterest = (interest: string) => {
    if (!interests.includes(interest)) {
      const updated = [...interests, interest]
      updateInterests(updated)
    }
  }

  // Remove interest
  const removeInterest = (interest: string) => {
    const updated = interests.filter(i => i !== interest)
    updateInterests(updated)
  }

  // Mark article as read
  const markAsRead = (articleId: string) => {
    const updated = markAsReadUtil(readHistory, articleId)
    setReadHistory(updated)
    localStorage.setItem(READ_HISTORY_KEY, JSON.stringify(updated))
  }

  // Update recent categories
  const trackCategory = (category: string) => {
    const updated = updateCategoriesUtil(recentCategories, category)
    setRecentCategories(updated)
    localStorage.setItem(RECENT_CATEGORIES_KEY, JSON.stringify(updated))
  }

  // Clear read history
  const clearReadHistory = () => {
    setReadHistory([])
    localStorage.removeItem(READ_HISTORY_KEY)
  }

  // Clear recent categories
  const clearRecentCategories = () => {
    setRecentCategories([])
    localStorage.removeItem(RECENT_CATEGORIES_KEY)
  }

  return {
    interests,
    readHistory,
    recentCategories,
    isLoaded,
    updateInterests,
    addInterest,
    removeInterest,
    markAsRead,
    trackCategory,
    clearReadHistory,
    clearRecentCategories
  }
}
