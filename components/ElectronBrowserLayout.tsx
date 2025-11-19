'use client'

import { useState, useEffect, useCallback } from 'react'
import { BrowserTab } from './BrowserTab'
import { AddressBar } from './AddressBar'
import type { TabInfo } from '../types/electron'

interface ElectronBrowserLayoutProps {
  children?: React.ReactNode
}

export function ElectronBrowserLayout({ children }: ElectronBrowserLayoutProps) {
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

      // Notify Electron about header height (80px for compact UI)
      window.electron.browser.updateHeight(80)

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

  // If not in Electron, show web version without browser chrome
  if (!isElectron) {
    return <>{children}</>
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50">
      {/* Browser Chrome - Fixed at top */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
        {/* Tab Bar */}
        <div className="flex items-center gap-1 px-2 pt-2 bg-gray-100">
          <div className="flex items-center gap-1 overflow-x-auto flex-1 scrollbar-hide">
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
            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
            title="New Tab"
          >
            +
          </button>
        </div>

        {/* Address Bar */}
        <div className="bg-white">
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
        </div>
      </div>

      {/* BrowserView Content Area - Managed by Electron */}
      {/* The actual web pages render here via BrowserView */}
      <div className="flex-1 relative">
        {/* This space is where Electron positions the BrowserView */}
      </div>

      {/* Optional: Show Next.js children as overlay/sidebar if needed */}
      {children && (
        <div className="absolute top-20 right-4 max-w-sm pointer-events-none">
          <div className="pointer-events-auto">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
