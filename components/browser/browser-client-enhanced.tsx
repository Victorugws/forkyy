'use client'

import { Model } from '@/lib/types/models'
import { useState, useEffect, useRef, useCallback } from 'react'
import { BrowserTab, Bookmark, BrowserHistory, Download, TabGroup } from '@/lib/types/browser'
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
import { CookiesPanel } from './cookies-panel'
import { CustomDock } from '@/components/CustomDock'
import TargetCursor from '@/components/reactbits/animations/TargetCursor'
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
  // Mounted state to prevent hydration issues
  const [mounted, setMounted] = useState(false)

  // Tabs
  const [tabs, setTabs] = useState<BrowserTab[]>([])
  const [activeTabId, setActiveTabId] = useState<string>('')

  // Panels
  const [showHistoryPanel, setShowHistoryPanel] = useState(false)
  const [showDownloadsPanel, setShowDownloadsPanel] = useState(false)
  const [showCookiesPanel, setShowCookiesPanel] = useState(false)
  const [showDevTools, setShowDevTools] = useState(false)
  const [showFindInPage, setShowFindInPage] = useState(false)
  const [showBookmarksBar, setShowBookmarksBar] = useState(true)
  const [showAIAssistant, setShowAIAssistant] = useState(false)

  // Data
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [history, setHistory] = useState<BrowserHistory[]>([])
  const [downloads, setDownloads] = useState<Download[]>([])
  const [tabGroups, setTabGroups] = useState<TabGroup[]>([])

  // Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

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

  // Load tab groups on mount
  useEffect(() => {
    const savedGroups = localStorage.getItem('browser-tab-groups')
    if (savedGroups) {
      try {
        setTabGroups(JSON.parse(savedGroups))
      } catch (e) {
        console.error('Failed to load tab groups:', e)
      }
    }
  }, [])

  // Save tabs when they change
  useEffect(() => {
    if (tabs.length > 0) {
      saveTabs(tabs)
      saveActiveTab(activeTabId)
    }
  }, [tabs, activeTabId])

  // Save tab groups when they change
  useEffect(() => {
    if (tabGroups.length > 0) {
      localStorage.setItem('browser-tab-groups', JSON.stringify(tabGroups))
    } else {
      localStorage.removeItem('browser-tab-groups')
    }
  }, [tabGroups])

  // Get active tab (defined early for use in effects)
  const activeTab = tabs.find(t => t.id === activeTabId)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey

      // Don't trigger shortcuts when typing in input fields
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      // Cmd/Ctrl + T: New tab
      if (cmdOrCtrl && e.key === 't') {
        e.preventDefault()
        createNewTab()
        return
      }

      // Cmd/Ctrl + W: Close current tab
      if (cmdOrCtrl && e.key === 'w') {
        e.preventDefault()
        if (activeTab) {
          closeTab(activeTab.id)
        }
        return
      }

      // Cmd/Ctrl + R: Refresh
      if (cmdOrCtrl && e.key === 'r') {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('browser:refresh'))
        return
      }

      // Cmd/Ctrl + Shift + R: Hard refresh
      if (cmdOrCtrl && e.shiftKey && e.key === 'R') {
        e.preventDefault()
        if (activeTab && activeTab.url) {
          updateTab(activeTab.id, { url: activeTab.url + '?refresh=' + Date.now() })
        }
        return
      }

      // Cmd/Ctrl + L: Focus address bar
      if (cmdOrCtrl && e.key === 'l') {
        e.preventDefault()
        const addressBar = document.querySelector('input[type="text"]') as HTMLInputElement
        addressBar?.focus()
        addressBar?.select()
        return
      }

      // Cmd/Ctrl + K: Focus search/AI assistant
      if (cmdOrCtrl && e.key === 'k') {
        e.preventDefault()
        setShowAIAssistant(true)
        return
      }

      // Cmd/Ctrl + 1-9: Switch to tab by number
      if (cmdOrCtrl && e.key >= '1' && e.key <= '9') {
        e.preventDefault()
        const tabIndex = parseInt(e.key) - 1
        const pinnedTabs = tabs.filter(t => t.isPinned)
        const normalTabs = tabs.filter(t => !t.isPinned)
        const tabList = [...pinnedTabs, ...normalTabs]
        if (tabList[tabIndex]) {
          setActiveTabId(tabList[tabIndex].id)
        }
        return
      }

      // Cmd/Ctrl + Shift + T: Reopen closed tab (if we had closed tabs tracking)
      if (cmdOrCtrl && e.shiftKey && e.key === 'T') {
        e.preventDefault()
        // TODO: Implement closed tabs history
        return
      }

      // Cmd/Ctrl + F: Find in page
      if (cmdOrCtrl && e.key === 'f') {
        e.preventDefault()
        setShowFindInPage(true)
        return
      }

      // Cmd/Ctrl + Plus: Zoom in
      if (cmdOrCtrl && (e.key === '+' || e.key === '=')) {
        e.preventDefault()
        if (activeTab) {
          const newZoom = Math.min((activeTab.zoomLevel || 1) + 0.1, 3)
          updateTab(activeTab.id, { zoomLevel: newZoom })
        }
        return
      }

      // Cmd/Ctrl + Minus: Zoom out
      if (cmdOrCtrl && e.key === '-') {
        e.preventDefault()
        if (activeTab) {
          const newZoom = Math.max((activeTab.zoomLevel || 1) - 0.1, 0.5)
          updateTab(activeTab.id, { zoomLevel: newZoom })
        }
        return
      }

      // Cmd/Ctrl + 0: Reset zoom
      if (cmdOrCtrl && e.key === '0') {
        e.preventDefault()
        if (activeTab) {
          updateTab(activeTab.id, { zoomLevel: 1 })
        }
        return
      }

      // Escape: Close panels
      if (e.key === 'Escape') {
        if (showFindInPage) {
          setShowFindInPage(false)
        }
        if (showHistoryPanel) {
          setShowHistoryPanel(false)
        }
        if (showDownloadsPanel) {
          setShowDownloadsPanel(false)
        }
        if (showCookiesPanel) {
          setShowCookiesPanel(false)
        }
        if (showDevTools) {
          setShowDevTools(false)
        }
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [tabs, activeTabId, activeTab, showFindInPage, showHistoryPanel, showDownloadsPanel, showCookiesPanel, showDevTools, showAIAssistant])

  const createNewTab = (url = '/') => {
    // Always start with "New Tab" title - it will be updated when a URL is entered
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

  const updateTab = useCallback((tabId: string, updates: Partial<BrowserTab>) => {
    setTabs(prev => {
      const tab = prev.find(t => t.id === tabId)
      if (!tab) return prev
      
      // Check if any values actually changed to prevent unnecessary updates
      const hasChanges = Object.keys(updates).some(key => {
        const typedKey = key as keyof BrowserTab
        return tab[typedKey] !== updates[typedKey]
      })
      
      if (!hasChanges) return prev
      
      return prev.map(t =>
        t.id === tabId ? { ...t, ...updates } : t
      )
    })
  }, [])

  // Memoize favicon change handler to prevent infinite loops
  const handleFaviconChange = useCallback((favicon: string) => {
    if (activeTab?.id && activeTab.favicon !== favicon) {
      updateTab(activeTab.id, { favicon })
    }
  }, [activeTab?.id, activeTab?.favicon, updateTab])

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
      // Try to print the active tab's content
      if (activeTab && !activeTab.url?.startsWith('/')) {
        // For external pages, we need to print the iframe/webview
        const iframe = document.querySelector('iframe, webview') as HTMLIFrameElement
        if (iframe?.contentWindow) {
          iframe.contentWindow.print()
        } else {
          window.print()
        }
      } else {
        window.print()
      }
    }
  }

  const handleSaveAsPDF = async () => {
    if (!activeTab?.url) return

    try {
      // For Electron, use the native print to PDF
      if (typeof window !== 'undefined' && (window as any).electron?.printToPDF) {
        const pdfPath = await (window as any).electron.printToPDF(activeTab.url)
        if (pdfPath) {
          // Show success message
          console.log('PDF saved to:', pdfPath)
        }
      } else {
        // For web, use browser's print to PDF
        window.print()
      }
    } catch (error) {
      console.error('Failed to save as PDF:', error)
    }
  }

  const handleFind = (query: string, forward: boolean) => {
    // This would interact with the iframe content
    console.log('Find:', query, forward)
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* Header */}
      {/* TabBar - Hide in extension (Firefox has its own tabs) */}
      {mounted && typeof window !== 'undefined' && window.electron?.isElectron && (
        <div className="flex-shrink-0">
          {/* Tab Bar */}
          <TabBar
            tabs={tabs}
            activeTabId={activeTabId}
            groups={tabGroups}
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
            onTabReorder={(fromIndex, toIndex) => {
              const pinnedTabs = tabs.filter(t => t.isPinned)
              const normalTabs = tabs.filter(t => !t.isPinned && !t.groupId)
              const reorderedTabs = [...normalTabs]
              const [movedTab] = reorderedTabs.splice(fromIndex, 1)
              reorderedTabs.splice(toIndex, 0, movedTab)
              setTabs([...pinnedTabs, ...tabs.filter(t => t.groupId), ...reorderedTabs])
            }}
            onTabGroup={(tabId, groupId) => {
              updateTab(tabId, { groupId: groupId || undefined })
            }}
            onGroupToggle={(groupId) => {
              setTabGroups(prev =>
                prev.map(g =>
                  g.id === groupId ? { ...g, collapsed: !g.collapsed } : g
                )
              )
            }}
            onGroupDelete={(groupId) => {
              // Ungroup all tabs in this group
              tabs.forEach(tab => {
                if (tab.groupId === groupId) {
                  updateTab(tab.id, { groupId: undefined })
                }
              })
              setTabGroups(prev => prev.filter(g => g.id !== groupId))
            }}
            onGroupRename={(groupId, newName) => {
              setTabGroups(prev =>
                prev.map(g => (g.id === groupId ? { ...g, name: newName } : g))
              )
            }}
            onCreateGroup={(tabIds) => {
              const groupName = prompt('Group name:', 'New Group') || 'New Group'
              const groupColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
              const randomColor = groupColors[Math.floor(Math.random() * groupColors.length)]
              
              const newGroup: TabGroup = {
                id: generateId(),
                name: groupName,
                color: randomColor,
                collapsed: false,
                createdAt: Date.now(),
              }
              
              setTabGroups(prev => [...prev, newGroup])
              
              // Add tabs to the new group
              tabIds.forEach(tabId => {
                updateTab(tabId, { groupId: newGroup.id })
              })
            }}
          />
        </div>
      )}

      {/* Browser Bar + Toolbar */}
      <div className="flex items-center border-b flex-shrink-0">
        {/* BrowserBar - Hide in extension (Firefox has its own navigation) */}
        {mounted && typeof window !== 'undefined' && window.electron?.isElectron && (
          <div className="flex-1">
            <BrowserBar
              currentUrl={
                // Only show external URLs in address bar, hide internal routes
                activeTab?.url?.startsWith('/') ? '' : activeTab?.url || ''
              }
              onUrlChange={(url) => handleNavigate(url)}
              canGoBack={activeTab?.canGoBack || false}
              canGoForward={activeTab?.canGoForward || false}
              isLoading={activeTab?.isLoading || false}
              pageTitle={activeTab?.title || ''}
            />
          </div>
        )}
        {/* BrowserToolbar - Hide in extension (Firefox has its own controls) */}
        {mounted && typeof window !== 'undefined' && window.electron?.isElectron && (
          <BrowserToolbar
            isBookmarked={isBookmarked}
            onToggleBookmark={toggleBookmark}
            onZoomIn={() => handleZoom('in')}
            onZoomOut={() => handleZoom('out')}
            onZoomReset={() => handleZoom('reset')}
            onPrint={handlePrint}
            onSaveAsPDF={handleSaveAsPDF}
            onFind={() => setShowFindInPage(true)}
            onOpenDownloads={() => setShowDownloadsPanel(true)}
            onOpenHistory={() => setShowHistoryPanel(true)}
            onOpenCookies={() => setShowCookiesPanel(true)}
            onOpenBookmarks={() => setShowBookmarksBar(!showBookmarksBar)}
            onOpenDevTools={() => setShowDevTools(!showDevTools)}
            onOpenSettings={() => setShowAIAssistant(!showAIAssistant)}
            isSecure={activeTab?.url?.startsWith('https://') || false}
            zoom={activeTab?.zoomLevel || 1}
          />
        )}
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
        {/* Side Panel (History/Downloads/Cookies) */}
        {(showHistoryPanel || showDownloadsPanel || showCookiesPanel) && (
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
            {showCookiesPanel && (
              <CookiesPanel
                cookies={[]} // TODO: Get cookies from browser storage
                onDelete={(name, domain) => {
                  // TODO: Implement cookie deletion
                  console.log('Delete cookie:', name, domain)
                }}
                onDeleteAll={() => {
                  // TODO: Implement clear all cookies
                  console.log('Clear all cookies')
                }}
                onClose={() => setShowCookiesPanel(false)}
              />
            )}
          </div>
        )}

        {/* Browser + AI Chat */}
        <div className="flex-1 flex min-h-0">
          {/* Main Browser Content */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-hidden">
              {activeTab && (
                <BrowserView
                  key={activeTab.id}
                  url={activeTab.url}
                  models={models}
                  onNavigate={(url) => updateTab(activeTab.id, { url })}
                  onLoadingChange={(isLoading) =>
                    updateTab(activeTab.id, { isLoading })
                  }
                  onTitleChange={(title) => {
                    if (activeTab) {
                      // Only update title if:
                      // 1. Title is different AND current title is "New Tab" (user navigated)
                      // 2. OR title is different and not "New Tab" (page loaded with real title)
                      // This prevents "ORB AI - AI Solutions" from overriding "New Tab" on initial home page load
                      const shouldUpdate = 
                        (activeTab.title === 'New Tab' && title !== 'New Tab') ||
                        (activeTab.title !== 'New Tab' && activeTab.title !== title)
                      
                      if (shouldUpdate) {
                        updateTab(activeTab.id, { title })
                      }
                    }
                  }}
                  onFaviconChange={handleFaviconChange}
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

          {/* AI Assistant Sidebar - Only show on external URLs */}
          {showAIAssistant && activeTab && !activeTab.url?.startsWith('/') && (
            <div className="w-[380px] border-l bg-background">
              <BrowserChat
                id={id}
                models={models}
                currentUrl={activeTab.url}
                pageTitle={activeTab.title}
                pageContent={activeTab.pageContent}
              />
            </div>
          )}
        </div>
      </div>
      {/* Custom Dock - Always visible at bottom */}
      {/* <CustomDock /> */}
      {/* TargetCursor - Render in extension (Electron uses overlay window) */}
      {mounted && typeof window !== 'undefined' && !window.electron?.isElectron && (
        <TargetCursor 
          spinDuration={2}
          hideDefaultCursor={true}
          parallaxOn={true}
        />
      )}
    </div>
  )
}
