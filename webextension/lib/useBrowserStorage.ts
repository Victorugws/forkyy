/**
 * React hook for browser storage
 * Provides reactive storage state management
 */

import { useState, useEffect, useCallback } from 'react'
import { storage } from './browser-api'

export function useBrowserStorage<T = any>(key: string, defaultValue?: T) {
  const [value, setValue] = useState<T | undefined>(defaultValue)
  const [loading, setLoading] = useState(true)

  // Load initial value
  useEffect(() => {
    async function loadValue() {
      try {
        const data = await storage.get<Record<string, T>>(key)
        setValue((data as any)?.[key] ?? defaultValue)
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
      changes: { [key: string]: any },
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
  }, [key, defaultValue])

  // Save value
  const setStorageValue = useCallback(
    async (newValue: T | undefined) => {
      try {
        await storage.set({ [key]: newValue })
        setValue(newValue)
      } catch (error) {
        console.error(`Failed to save storage key "${key}":`, error)
        throw error
      }
    },
    [key]
  )

  return [value, setStorageValue, loading] as const
}

