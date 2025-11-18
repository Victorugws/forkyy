'use client'

import { BrowserTab } from '@/lib/types/browser'
import { Button } from '@/components/ui/button'
import { X, Plus, Pin, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TabBarProps {
  tabs: BrowserTab[]
  activeTabId: string
  onTabSelect: (tabId: string) => void
  onTabClose: (tabId: string) => void
  onNewTab: () => void
  onTabPin: (tabId: string) => void
  onTabMute: (tabId: string) => void
}

export function TabBar({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onNewTab,
  onTabPin,
  onTabMute,
}: TabBarProps) {
  const pinnedTabs = tabs.filter(t => t.isPinned)
  const normalTabs = tabs.filter(t => !t.isPinned)

  const renderTab = (tab: BrowserTab) => {
    const isActive = tab.id === activeTabId

    return (
      <div
        key={tab.id}
        onClick={() => onTabSelect(tab.id)}
        className={cn(
          'group flex items-center gap-2 px-3 py-2 border-r cursor-pointer transition-colors min-w-0',
          isActive
            ? 'bg-background border-b-2 border-b-primary'
            : 'bg-muted hover:bg-muted/80',
          tab.isPinned && 'max-w-[40px]'
        )}
      >
        {/* Favicon or Loading Indicator */}
        {tab.isLoading ? (
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
        ) : tab.favicon ? (
          <img src={tab.favicon} alt="" className="w-4 h-4 flex-shrink-0" />
        ) : (
          <div className="w-4 h-4 bg-muted-foreground/20 rounded flex-shrink-0" />
        )}

        {/* Title (hidden for pinned tabs) */}
        {!tab.isPinned && (
          <span className="text-sm truncate flex-1 min-w-0">
            {tab.title || 'New Tab'}
          </span>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Pin */}
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={(e) => {
              e.stopPropagation()
              onTabPin(tab.id)
            }}
          >
            <Pin className={cn('h-3 w-3', tab.isPinned && 'fill-current')} />
          </Button>

          {/* Mute */}
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={(e) => {
              e.stopPropagation()
              onTabMute(tab.id)
            }}
          >
            {tab.isMuted ? (
              <VolumeX className="h-3 w-3" />
            ) : (
              <Volume2 className="h-3 w-3" />
            )}
          </Button>

          {/* Close */}
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 hover:bg-destructive/20"
            onClick={(e) => {
              e.stopPropagation()
              onTabClose(tab.id)
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center border-b bg-muted/30 overflow-x-auto">
      {/* Pinned Tabs */}
      {pinnedTabs.map(renderTab)}

      {/* Normal Tabs */}
      <div className="flex flex-1 overflow-x-auto">
        {normalTabs.map(renderTab)}
      </div>

      {/* New Tab Button */}
      <Button
        variant="ghost"
        size="icon"
        className="flex-shrink-0 mx-1"
        onClick={onNewTab}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
