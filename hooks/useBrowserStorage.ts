/**
 * React hook for browser storage
 * Provides reactive storage state management
 * 
 * Note: Only works in Firefox WebExtension context
 */

import { useState, useEffect, useCallback } from 'react'
import { storage, isExtensionContext } from '@/lib/browser-api'

export function useBrowserStorage<T = any>(key: string, defaultValue?: T) {
  const [value, setValue] = useState<T | undefined>(defaultValue)
  const [loading, setLoading] = useState(true)
  const [isAvailable, setIsAvailable] = useState(false)

  // Check if extension context is available
  useEffect(() => {
    setIsAvailable(isExtensionContext())
  }, [])

  // Load initial value
  useEffect(() => {
    if (!isAvailable) {
      setLoading(false)
      return
    }

    async function loadValue() {
      try {
        const data = await storage.get<{ [key: string]: T }>(key)
        setValue(data?.[key] ?? defaultValue)
      } catch (error) {
        console.error(`Failed to load storage key "${key}":`, error)
        setValue(defaultValue)
      } finally {
        setLoading(false)
      }
    }

    loadValue()

    // Listen for storage changes
    const handleStorageChange = (
      changes: { [key: string]: any }, // browser.storage.StorageChange
      areaName: string
    ) => {
      if (areaName === 'local' && changes[key]) {
        setValue(changes[key].newValue ?? defaultValue)
      }
    }

    storage.onChanged.addListener(handleStorageChange)

    return () => {
      storage.onChanged.removeListener(handleStorageChange)
    }
  }, [key, defaultValue, isAvailable])

  // Save value
  const setStorageValue = useCallback(
    async (newValue: T | undefined) => {
      if (!isAvailable) {
        throw new Error('Browser extension API not available')
      }
      try {
        await storage.set({ [key]: newValue })
        setValue(newValue)
      } catch (error) {
        console.error(`Failed to save storage key "${key}":`, error)
        throw error
      }
    },
    [key, isAvailable]
  )

  return [value, setStorageValue, loading, isAvailable] as const
}

