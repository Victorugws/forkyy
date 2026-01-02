/**
 * React hook for managing browser tabs
 * Provides reactive tab state management
 * 
 * Note: Only works in Firefox WebExtension context
 */

import { useState, useEffect, useCallback } from 'react'
import { tabs as browserTabs, Tab, isExtensionContext } from '@/lib/browser-api'

export function useBrowserTabs() {
  const [firefoxTabs, setFirefoxTabs] = useState<Tab[]>([])
  const [activeTab, setActiveTab] = useState<Tab | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAvailable, setIsAvailable] = useState(false)

  // Check if extension context is available
  useEffect(() => {
    setIsAvailable(isExtensionContext())
  }, [])

  // Load initial tabs
  useEffect(() => {
    if (!isAvailable) {
      setLoading(false)
      return
    }

    async function loadTabs() {
      try {
        const allTabs = await browserTabs.getAll({})
        setFirefoxTabs(allTabs)
        
        const active = await browserTabs.getActive()
        setActiveTab(active)
      } catch (error) {
        console.error('Failed to load tabs:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTabs()

    // Listen for tab changes
    const handleTabCreated = (tab: Tab) => {
      setFirefoxTabs(prev => [...prev, tab])
    }

    const handleTabUpdated = (
      tabId: number,
      changeInfo: any, // browser.tabs.TabChangeInfo
      tab: Tab
    ) => {
      setFirefoxTabs(prev =>
        prev.map(t => (t.id === tabId ? { ...t, ...tab } : t))
      )
      
      if (activeTab?.id === tabId) {
        setActiveTab({ ...activeTab, ...tab })
      }
    }

    const handleTabRemoved = (tabId: number) => {
      setFirefoxTabs(prev => prev.filter(t => t.id !== tabId))
      
      if (activeTab?.id === tabId) {
        setActiveTab(null)
      }
    }

    const handleTabActivated = (activeInfo: any) => { // browser.tabs.TabActiveInfo
      setFirefoxTabs(prev =>
        prev.map(t => ({ ...t, active: t.id === activeInfo.tabId }))
      )
      
      // Update active tab
      const tab = firefoxTabs.find(t => t.id === activeInfo.tabId)
      if (tab) {
        setActiveTab(tab)
      }
    }

    browserTabs.onCreated.addListener(handleTabCreated)
    browserTabs.onUpdated.addListener(handleTabUpdated)
    browserTabs.onRemoved.addListener(handleTabRemoved)
    browserTabs.onActivated.addListener(handleTabActivated)

    return () => {
      browserTabs.onCreated.removeListener(handleTabCreated)
      browserTabs.onUpdated.removeListener(handleTabUpdated)
      browserTabs.onRemoved.removeListener(handleTabRemoved)
      browserTabs.onActivated.removeListener(handleTabActivated)
    }
  }, [isAvailable, activeTab?.id, firefoxTabs])

  // Actions
  const createTab = useCallback(async (url: string, active = true) => {
    if (!isAvailable) {
      throw new Error('Browser extension API not available')
    }
    const tab = await browserTabs.create({ url, active })
    return tab
  }, [isAvailable])

  const closeTab = useCallback(async (tabId: number) => {
    if (!isAvailable) {
      throw new Error('Browser extension API not available')
    }
    await browserTabs.close(tabId)
  }, [isAvailable])

  const switchTab = useCallback(async (tabId: number) => {
    if (!isAvailable) {
      throw new Error('Browser extension API not available')
    }
    await browserTabs.switch(tabId)
  }, [isAvailable])

  const updateTab = useCallback(async (tabId: number, options: {
    url?: string
    active?: boolean
    pinned?: boolean
  }) => {
    if (!isAvailable) {
      throw new Error('Browser extension API not available')
    }
    const tab = await browserTabs.update(tabId, options)
    return tab
  }, [isAvailable])

  const reloadTab = useCallback(async (tabId: number) => {
    if (!isAvailable) {
      throw new Error('Browser extension API not available')
    }
    await browserTabs.reload(tabId)
  }, [isAvailable])

  const goBack = useCallback(async (tabId: number) => {
    if (!isAvailable) {
      throw new Error('Browser extension API not available')
    }
    await browserTabs.goBack(tabId)
  }, [isAvailable])

  const goForward = useCallback(async (tabId: number) => {
    if (!isAvailable) {
      throw new Error('Browser extension API not available')
    }
    await browserTabs.goForward(tabId)
  }, [isAvailable])

  return {
    tabs: firefoxTabs,
    activeTab,
    loading,
    isAvailable,
    createTab,
    closeTab,
    switchTab,
    updateTab,
    reloadTab,
    goBack,
    goForward,
  }
}

