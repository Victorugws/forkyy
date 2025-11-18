'use client'

import { Model } from '@/lib/types/models'
import { useState, useEffect } from 'react'
import { BrowserTab, Bookmark, BrowserHistory, Download } from '@/lib/types/browser'
import { TabBar } from './tab-bar'
import { BrowserBar } from './browser-bar'
import { BookmarksBar } from './bookmarks-bar'
import { BrowserView } from './browser-view'
import { BrowserChat } from './browser-chat'
import { BrowserToolbar } from './browser-toolbar'
import { HistoryPanel } from './history-panel'
import { DownloadsPanel } from './downloads-panel'
import { DevToolsPanel } from './dev-tools-panel'
import { FindInPage } from './find-in-page'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import {
  saveTabs,
  loadTabs,
  saveActiveTab,
  loadActiveTab,
  saveBookmarks,
  loadBookmarks,
  loadHistory,
  addToHistory,
  clearHistory as clearBrowserHistory,
  loadSettings,
  saveSettings
} from '@/lib/browser/storage'
import { generateId } from 'ai'

interface BrowserClientEnhancedProps {
  id: string
  models?: Model[]
  initialUrl?: string
}

export function BrowserClientEnhanced({ id, models, initialUrl = '/' }: BrowserClientEnhancedProps) {
  // Tabs
  const [tabs, setTabs] = useState<BrowserTab[]>([])
  const [activeTabId, setActiveTabId] = useState<string>('')

  // Panels
  const [showHistoryPanel, setShowHistoryPanel] = useState(false)
  const [showDownloadsPanel, setShowDownloadsPanel] = useState(false)
  const [showDevTools, setShowDevTools] = useState(false)
  const [showFindInPage, setShowFindInPage] = useState(false)
  const [showBookmarksBar, setShowBookmarksBar] = useState(true)

  // Data
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [history, setHistory] = useState<BrowserHistory[]>([])
  const [downloads, setDownloads] = useState<Download[]>([])

  // Load saved data
  useEffect(() => {
    const savedTabs = loadTabs()
    const savedActiveTab = loadActiveTab()
    const savedBookmarks = loadBookmarks()
    const savedHistory = loadHistory()
    const settings = loadSettings()

    if (savedTabs.length > 0) {
      setTabs(savedTabs)
      setActiveTabId(savedActiveTab || savedTabs[0].id)
    } else {
      // Create initial tab with specified URL
      createNewTab(initialUrl)
    }

    setBookmarks(savedBookmarks)
    setHistory(savedHistory)
    setShowBookmarksBar(settings.showBookmarksBar)
  }, [])

  // Save tabs when they change
  useEffect(() => {
    if (tabs.length > 0) {
      saveTabs(tabs)
      saveActiveTab(activeTabId)
    }
  }, [tabs, activeTabId])

  const activeTab = tabs.find(t => t.id === activeTabId)

  const createNewTab = (url = '') => {
    const newTab: BrowserTab = {
      id: generateId(),
      url,
      title: 'New Tab',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      history: [],
      historyIndex: -1,
      pageContent: '',
      zoomLevel: 1,
      isPinned: false,
      isMuted: false,
    }
    setTabs(prev => [...prev, newTab])
    setActiveTabId(newTab.id)
  }

  const closeTab = (tabId: string) => {
    const tabIndex = tabs.findIndex(t => t.id === tabId)
    const newTabs = tabs.filter(t => t.id !== tabId)

    if (newTabs.length === 0) {
      createNewTab()
      return
    }

    setTabs(newTabs)

    if (activeTabId === tabId) {
      const newActiveIndex = Math.min(tabIndex, newTabs.length - 1)
      setActiveTabId(newTabs[newActiveIndex].id)
    }
  }

  const updateTab = (tabId: string, updates: Partial<BrowserTab>) => {
    setTabs(prev =>
      prev.map(tab =>
        tab.id === tabId ? { ...tab, ...updates } : tab
      )
    )
  }

  const handleNavigate = (url: string, newTab = false) => {
    if (newTab) {
      createNewTab(url)
    } else if (activeTab) {
      updateTab(activeTab.id, { url })

      // Add to history
      if (url) {
        addToHistory({
          url,
          title: activeTab.title || url,
          visitedAt: Date.now(),
          favicon: activeTab.favicon,
        })
        setHistory(loadHistory())
      }
    }
  }

  const toggleBookmark = () => {
    if (!activeTab?.url) return

    const existingIndex = bookmarks.findIndex(b => b.url === activeTab.url)

    if (existingIndex >= 0) {
      const newBookmarks = bookmarks.filter((_, i) => i !== existingIndex)
      setBookmarks(newBookmarks)
      saveBookmarks(newBookmarks)
    } else {
      const newBookmark: Bookmark = {
        id: generateId(),
        url: activeTab.url,
        title: activeTab.title || activeTab.url,
        favicon: activeTab.favicon,
        createdAt: Date.now(),
      }
      const newBookmarks = [...bookmarks, newBookmark]
      setBookmarks(newBookmarks)
      saveBookmarks(newBookmarks)
    }
  }

  const isBookmarked = activeTab
    ? bookmarks.some(b => b.url === activeTab.url)
    : false

  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    if (!activeTab) return

    let newZoom = activeTab.zoomLevel
    if (direction === 'in') newZoom = Math.min(newZoom + 0.1, 3)
    else if (direction === 'out') newZoom = Math.max(newZoom - 0.1, 0.5)
    else newZoom = 1

    updateTab(activeTab.id, { zoomLevel: newZoom })
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const handleFind = (query: string, forward: boolean) => {
    // This would interact with the iframe content
    console.log('Find:', query, forward)
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Tab Bar */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabSelect={setActiveTabId}
        onTabClose={closeTab}
        onNewTab={() => createNewTab()}
        onTabPin={(tabId) => {
          const tab = tabs.find(t => t.id === tabId)
          if (tab) updateTab(tabId, { isPinned: !tab.isPinned })
        }}
        onTabMute={(tabId) => {
          const tab = tabs.find(t => t.id === tabId)
          if (tab) updateTab(tabId, { isMuted: !tab.isMuted })
        }}
      />

      {/* Browser Bar + Toolbar */}
      <div className="flex items-center border-b">
        <div className="flex-1">
          <BrowserBar
            currentUrl={activeTab?.url || ''}
            onUrlChange={(url) => handleNavigate(url)}
            canGoBack={activeTab?.canGoBack || false}
            canGoForward={activeTab?.canGoForward || false}
            isLoading={activeTab?.isLoading || false}
            pageTitle={activeTab?.title || ''}
          />
        </div>
        <BrowserToolbar
          isBookmarked={isBookmarked}
          onToggleBookmark={toggleBookmark}
          onZoomIn={() => handleZoom('in')}
          onZoomOut={() => handleZoom('out')}
          onZoomReset={() => handleZoom('reset')}
          onPrint={handlePrint}
          onFind={() => setShowFindInPage(true)}
          onOpenDownloads={() => setShowDownloadsPanel(true)}
          onOpenHistory={() => setShowHistoryPanel(true)}
          onOpenBookmarks={() => setShowBookmarksBar(!showBookmarksBar)}
          onOpenDevTools={() => setShowDevTools(!showDevTools)}
          onOpenSettings={() => {}}
          isSecure={activeTab?.url?.startsWith('https://') || false}
          zoom={activeTab?.zoomLevel || 1}
        />
      </div>

      {/* Bookmarks Bar */}
      {showBookmarksBar && (
        <BookmarksBar
          bookmarks={bookmarks}
          onNavigate={handleNavigate}
          onEdit={(bookmark) => {}}
          onDelete={(id) => {
            const newBookmarks = bookmarks.filter(b => b.id !== id)
            setBookmarks(newBookmarks)
            saveBookmarks(newBookmarks)
          }}
          onManage={() => {}}
        />
      )}

      {/* Find in Page */}
      {showFindInPage && (
        <FindInPage
          onClose={() => setShowFindInPage(false)}
          onFind={handleFind}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex">
        {/* Side Panel (History/Downloads) */}
        {(showHistoryPanel || showDownloadsPanel) && (
          <div className="w-80 border-r">
            {showHistoryPanel && (
              <HistoryPanel
                history={history}
                onNavigate={handleNavigate}
                onClear={() => {
                  clearBrowserHistory()
                  setHistory([])
                }}
                onClose={() => setShowHistoryPanel(false)}
              />
            )}
            {showDownloadsPanel && (
              <DownloadsPanel
                downloads={downloads}
                onOpen={(id) => {}}
                onCancel={(id) => {}}
                onRemove={(id) => {
                  setDownloads(prev => prev.filter(d => d.id !== id))
                }}
                onClose={() => setShowDownloadsPanel(false)}
              />
            )}
          </div>
        )}

        {/* Browser + AI Chat */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Web Content Panel */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="h-full flex flex-col">
              <div className="flex-1">
                {activeTab && (
                  <BrowserView
                    key={activeTab.id}
                    url={activeTab.url}
                    onNavigate={(url) => updateTab(activeTab.id, { url })}
                    onLoadingChange={(isLoading) =>
                      updateTab(activeTab.id, { isLoading })
                    }
                    onTitleChange={(title) =>
                      updateTab(activeTab.id, { title })
                    }
                    onContentChange={(content) =>
                      updateTab(activeTab.id, { pageContent: content })
                    }
                    onCanGoBackChange={(canGoBack) =>
                      updateTab(activeTab.id, { canGoBack })
                    }
                    onCanGoForwardChange={(canGoForward) =>
                      updateTab(activeTab.id, { canGoForward })
                    }
                  />
                )}
              </div>

              {/* Dev Tools */}
              {showDevTools && activeTab && (
                <div className="h-64 border-t">
                  <DevToolsPanel
                    onClose={() => setShowDevTools(false)}
                    pageUrl={activeTab.url}
                  />
                </div>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* AI Chat Panel */}
          <ResizablePanel defaultSize={40} minSize={25}>
            {activeTab && (
              <BrowserChat
                id={id}
                models={models}
                currentUrl={activeTab.url}
                pageTitle={activeTab.title}
                pageContent={activeTab.pageContent}
              />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
