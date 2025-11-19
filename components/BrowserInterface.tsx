'use client'

import { useState, useEffect, useCallback } from 'react'
import { BrowserTab } from './BrowserTab'
import { AddressBar } from './AddressBar'
import type { TabInfo } from '../types/electron'

export function BrowserInterface() {
  const [tabs, setTabs] = useState<TabInfo[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const [isElectron, setIsElectron] = useState(false)

  useEffect(() => {
    // Check if running in Electron
    if (typeof window !== 'undefined' && window.electron) {
      setIsElectron(true)

      // Create initial tab
      window.electron.browser.createTab('https://google.com').then((tabId: string) => {
        loadTabInfo(tabId)
        setActiveTabId(tabId)
      })

      // Listen for tab updates
      const unsubUpdate = window.electron.browser.onTabUpdated((tabId: string) => {
        loadTabInfo(tabId)
      })

      const unsubSwitch = window.electron.browser.onTabSwitched((tabId: string) => {
        setActiveTabId(tabId)
        loadTabInfo(tabId)
      })

      const unsubClose = window.electron.browser.onTabClosed((tabId: string) => {
        setTabs(prev => prev.filter(tab => tab.id !== tabId))
      })

      // Notify Electron about header height (120px for your UI)
      window.electron.browser.updateHeight(120)

      return () => {
        unsubUpdate()
        unsubSwitch()
        unsubClose()
      }
    }
  }, [])

  const loadTabInfo = useCallback(async (tabId: string) => {
    if (window.electron) {
      const info = await window.electron.browser.getTabInfo(tabId)
      if (info) {
        setTabs(prev => {
          const existing = prev.find(t => t.id === tabId)
          if (existing) {
            return prev.map(t => t.id === tabId ? info : t)
          }
          return [...prev, info]
        })
      }
    }
  }, [])

  const handleNewTab = async () => {
    if (window.electron) {
      const tabId = await window.electron.browser.createTab()
      loadTabInfo(tabId)
    }
  }

  const handleCloseTab = async (tabId: string) => {
    if (window.electron) {
      await window.electron.browser.closeTab(tabId)
    }
  }

  const handleSwitchTab = async (tabId: string) => {
    if (window.electron) {
      await window.electron.browser.switchTab(tabId)
    }
  }

  const handleNavigate = async (url: string) => {
    if (window.electron && activeTabId) {
      await window.electron.browser.navigate(activeTabId, url)
    }
  }

  const handleGoBack = async () => {
    if (window.electron && activeTabId) {
      await window.electron.browser.goBack(activeTabId)
    }
  }

  const handleGoForward = async () => {
    if (window.electron && activeTabId) {
      await window.electron.browser.goForward(activeTabId)
    }
  }

  const handleReload = async () => {
    if (window.electron && activeTabId) {
      await window.electron.browser.reload(activeTabId)
    }
  }

  const handleStop = async () => {
    if (window.electron && activeTabId) {
      await window.electron.browser.stop(activeTabId)
    }
  }

  const activeTab = tabs.find(t => t.id === activeTabId)

  // If not in Electron, show message
  if (!isElectron) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        Browser mode available in Electron app only
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 px-2 pt-2 border-b border-gray-200">
        <div className="flex items-center gap-1 overflow-x-auto flex-1">
          {tabs.map(tab => (
            <BrowserTab
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTabId}
              onSwitch={() => handleSwitchTab(tab.id)}
              onClose={() => handleCloseTab(tab.id)}
            />
          ))}
        </div>
        <button
          onClick={handleNewTab}
          className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
          title="New Tab"
        >
          +
        </button>
      </div>

      {/* Navigation Bar */}
      <AddressBar
        url={activeTab?.url || ''}
        isLoading={activeTab?.isLoading || false}
        canGoBack={activeTab?.canGoBack || false}
        canGoForward={activeTab?.canGoForward || false}
        onNavigate={handleNavigate}
        onBack={handleGoBack}
        onForward={handleGoForward}
        onReload={handleReload}
        onStop={handleStop}
      />

      {/* BrowserView renders here (managed by Electron) */}
      <div className="h-4 text-xs text-center text-gray-400 py-1">
        Browser content appears below
      </div>
    </div>
  )
}
