/**
 * React hook for managing browser tabs
 * Provides reactive tab state management
 */

import { useState, useEffect, useCallback } from 'react'
import { tabs as browserTabs, Tab } from './browser-api'

export function useBrowserTabs() {
  const [firefoxTabs, setFirefoxTabs] = useState<Tab[]>([])
  const [activeTab, setActiveTab] = useState<Tab | null>(null)
  const [loading, setLoading] = useState(true)

  // Load initial tabs
  useEffect(() => {
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
      changeInfo: any,
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

    const handleTabActivated = (activeInfo: any) => {
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
  }, [activeTab?.id, firefoxTabs])

  // Actions
  const createTab = useCallback(async (url: string, active = true) => {
    const tab = await browserTabs.create({ url, active })
    return tab
  }, [])

  const closeTab = useCallback(async (tabId: number) => {
    await browserTabs.close(tabId)
  }, [])

  const switchTab = useCallback(async (tabId: number) => {
    await browserTabs.switch(tabId)
  }, [])

  const updateTab = useCallback(async (tabId: number, options: {
    url?: string
    active?: boolean
    pinned?: boolean
  }) => {
    const tab = await browserTabs.update(tabId, options)
    return tab
  }, [])

  const reloadTab = useCallback(async (tabId: number) => {
    await browserTabs.reload(tabId)
  }, [])

  const goBack = useCallback(async (tabId: number) => {
    await browserTabs.goBack(tabId)
  }, [])

  const goForward = useCallback(async (tabId: number) => {
    await browserTabs.goForward(tabId)
  }, [])

  return {
    tabs: firefoxTabs,
    activeTab,
    loading,
    createTab,
    closeTab,
    switchTab,
    updateTab,
    reloadTab,
    goBack,
    goForward,
  }
}

