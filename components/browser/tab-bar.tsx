'use client'

import { BrowserTab, TabGroup } from '@/lib/types/browser'
import { Button } from '@/components/ui/button'
import { X, Plus, Pin, Volume2, VolumeX, ChevronLeft, ChevronRight, ChevronDown, ChevronRight as ChevronRightIcon, Folder, MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TabBarProps {
  tabs: BrowserTab[]
  activeTabId: string
  groups?: TabGroup[]
  onTabSelect: (tabId: string) => void
  onTabClose: (tabId: string) => void
  onNewTab: () => void
  onTabPin: (tabId: string) => void
  onTabMute: (tabId: string) => void
  onTabReorder?: (fromIndex: number, toIndex: number) => void
  onTabGroup?: (tabId: string, groupId: string | null) => void
  onGroupToggle?: (groupId: string) => void
  onGroupDelete?: (groupId: string) => void
  onGroupRename?: (groupId: string, newName: string) => void
  onCreateGroup?: (tabIds: string[]) => void
}

export function TabBar({
  tabs,
  activeTabId,
  groups = [],
  onTabSelect,
  onTabClose,
  onNewTab,
  onTabPin,
  onTabMute,
  onTabReorder,
  onTabGroup,
  onGroupToggle,
  onGroupDelete,
  onGroupRename,
  onCreateGroup,
}: TabBarProps) {
  const pinnedTabs = tabs.filter(t => t.isPinned)
  const normalTabs = tabs.filter(t => !t.isPinned)

  // Organize tabs by groups
  const groupedTabs = groups.map(group => ({
    group,
    tabs: normalTabs.filter(t => t.groupId === group.id)
  }))
  const ungroupedTabs = normalTabs.filter(t => !t.groupId)
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })
  const [draggedTabId, setDraggedTabId] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const prevScrollStateRef = useRef({ canScrollLeft: false, canScrollRight: false })

  // Check scroll position
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        const newCanScrollLeft = scrollLeft > 0
        const newCanScrollRight = scrollLeft < scrollWidth - clientWidth - 10
        
        // Only update state if values actually changed
        if (prevScrollStateRef.current.canScrollLeft !== newCanScrollLeft) {
          prevScrollStateRef.current.canScrollLeft = newCanScrollLeft
          setCanScrollLeft(newCanScrollLeft)
        }
        if (prevScrollStateRef.current.canScrollRight !== newCanScrollRight) {
          prevScrollStateRef.current.canScrollRight = newCanScrollRight
          setCanScrollRight(newCanScrollRight)
        }
      }
    }
    
    // Throttle scroll checks to prevent excessive updates
    let rafId: number | null = null
    let lastCheck = 0
    const throttleMs = 50 // Check at most every 50ms
    
    const throttledCheckScroll = () => {
      const now = Date.now()
      if (now - lastCheck >= throttleMs) {
        lastCheck = now
        checkScroll()
      } else {
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
        }
        rafId = requestAnimationFrame(() => {
          const now = Date.now()
          if (now - lastCheck >= throttleMs) {
            lastCheck = now
            checkScroll()
          }
        })
      }
    }
    
    // Initial check
    checkScroll()
    
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', throttledCheckScroll, { passive: true })
    }
    window.addEventListener('resize', throttledCheckScroll, { passive: true })
    
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      if (container) {
        container.removeEventListener('scroll', throttledCheckScroll)
      }
      window.removeEventListener('resize', throttledCheckScroll)
    }
  }, [tabs])

  const scrollTabs = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleDragStart = (e: React.DragEvent, tabId: string) => {
    setDraggedTabId(tabId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', tabId)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number, groupId?: string) => {
    e.preventDefault()
    if (draggedTabId) {
      if (groupId && onTabGroup) {
        // Dropping into a group
        onTabGroup(draggedTabId, groupId)
      } else if (onTabReorder) {
        // Reordering within ungrouped tabs
        const draggedIndex = normalTabs.findIndex(t => t.id === draggedTabId)
        if (draggedIndex !== -1 && draggedIndex !== dropIndex) {
          onTabReorder(draggedIndex, dropIndex)
        }
      }
    }
    setDraggedTabId(null)
    setDragOverIndex(null)
  }

  const handleGroupDrop = (e: React.DragEvent, groupId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (draggedTabId && onTabGroup) {
      onTabGroup(draggedTabId, groupId)
    }
    setDraggedTabId(null)
  }

  const handleMouseEnter = (e: React.MouseEvent, tab: BrowserTab) => {
    setHoveredTabId(tab.id)
    const rect = e.currentTarget.getBoundingClientRect()
    setHoverPosition({ x: rect.left, y: rect.bottom + 8 })
  }

  const [contextMenuTab, setContextMenuTab] = useState<string | null>(null)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })

  const renderTab = (tab: BrowserTab, index: number, isPinned = false) => {
    const isActive = tab.id === activeTabId
    const isDragged = draggedTabId === tab.id
    const isDragOver = dragOverIndex === index

    return (
      <div
        key={tab.id}
        draggable={!isPinned && !!onTabReorder}
        onDragStart={(e) => !isPinned && handleDragStart(e, tab.id)}
        onDragOver={(e) => !isPinned && handleDragOver(e, index)}
        onDrop={(e) => !isPinned && handleDrop(e, index, tab.groupId)}
        onDragEnd={() => {
          setDraggedTabId(null)
          setDragOverIndex(null)
        }}
        onClick={() => onTabSelect(tab.id)}
        onContextMenu={(e) => {
          e.preventDefault()
          setContextMenuTab(tab.id)
          setContextMenuPosition({ x: e.clientX, y: e.clientY })
        }}
        onMouseEnter={(e) => handleMouseEnter(e, tab)}
        onMouseLeave={() => setHoveredTabId(null)}
        className={cn(
          'group flex items-center gap-2 px-3 py-2 border-r cursor-pointer transition-all min-w-0 relative',
          isActive
            ? 'bg-background border-b-2 border-b-primary'
            : 'bg-muted hover:bg-muted/80',
          tab.isPinned && 'max-w-[40px]',
          isDragged && 'opacity-50',
          isDragOver && 'border-l-2 border-l-primary',
          tab.groupId && 'border-l-2'
        )}
        style={{
          borderLeftColor: tab.groupId
            ? groups.find(g => g.id === tab.groupId)?.color
            : undefined,
        }}
      >
        {/* Favicon or Loading Indicator */}
        {tab.isLoading ? (
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
        ) : tab.favicon ? (
          <img 
            src={tab.favicon} 
            alt="" 
            className="w-4 h-4 flex-shrink-0 rounded"
            onError={(e) => {
              // Fallback to default icon if favicon fails to load
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent) {
                const fallback = document.createElement('div')
                fallback.className = 'w-4 h-4 bg-muted-foreground/20 rounded flex-shrink-0'
                parent.insertBefore(fallback, target)
              }
            }}
          />
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
    <>
      <div className="flex items-center border-b bg-muted/30 min-h-[40px] flex-shrink-0 relative z-10">
      {/* Pinned Tabs */}
        <div className="flex items-center flex-shrink-0">
          {pinnedTabs.map((tab, index) => renderTab(tab, index, true))}
        </div>

        {/* Scroll Buttons */}
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-6 flex-shrink-0"
            onClick={() => scrollTabs('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Normal Tabs - Scrollable with Groups */}
        <div
          ref={scrollContainerRef}
          className="flex flex-1 overflow-x-auto min-w-0 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Render Groups */}
          {groupedTabs.map(({ group, tabs: groupTabs }) => {
            if (groupTabs.length === 0) return null
            
            return (
              <div
                key={group.id}
                className="flex items-center border-r"
                onDragOver={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onDrop={(e) => handleGroupDrop(e, group.id)}
              >
                {/* Group Header */}
                <div
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-muted/50 transition-colors',
                    'border-r border-dashed'
                  )}
                  style={{
                    borderColor: group.color || '#999',
                  }}
                  onClick={() => onGroupToggle?.(group.id)}
                >
                  {group.collapsed ? (
                    <ChevronRightIcon className="h-3 w-3" style={{ color: group.color }} />
                  ) : (
                    <ChevronDown className="h-3 w-3" style={{ color: group.color }} />
                  )}
                  <Folder className="h-3 w-3" style={{ color: group.color }} />
                  <span
                    className="text-xs font-medium truncate max-w-[100px]"
                    style={{ color: group.color }}
                  >
                    {group.name}
                  </span>
                  <span className="text-xs text-muted-foreground">({groupTabs.length})</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-4 w-4 ml-1">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={() => {
                          const newName = prompt('Rename group:', group.name)
                          if (newName && onGroupRename) {
                            onGroupRename(group.id, newName)
                          }
                        }}
                      >
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          if (onCreateGroup && groupTabs.length > 0) {
                            // Create new group from these tabs
                            onCreateGroup(groupTabs.map(t => t.id))
                          }
                        }}
                      >
                        Create New Group
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          // Ungroup all tabs
                          groupTabs.forEach(tab => onTabGroup?.(tab.id, null))
                        }}
                      >
                        Ungroup All
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onGroupDelete?.(group.id)}
                      >
                        Delete Group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
      </div>

                {/* Group Tabs */}
                {!group.collapsed && (
                  <div className="flex items-center">
                    {groupTabs.map((tab, index) => {
                      const tabIndex = normalTabs.findIndex(t => t.id === tab.id)
                      return renderTab(tab, tabIndex, false)
                    })}
                  </div>
                )}
              </div>
            )
          })}

          {/* Ungrouped Tabs */}
          {ungroupedTabs.map((tab, index) => {
            const tabIndex = normalTabs.findIndex(t => t.id === tab.id)
            return renderTab(tab, tabIndex, false)
          })}

          {/* New Tab Button - positioned right after the last tab */}
      <Button
        variant="ghost"
        size="icon"
        className="flex-shrink-0 mx-1"
        onClick={onNewTab}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>

        {/* Scroll Buttons */}
        {canScrollRight && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-6 flex-shrink-0"
            onClick={() => scrollTabs('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Tab Preview Tooltip */}
      {hoveredTabId && (
        <div
          className="fixed z-50 bg-popover border rounded-lg shadow-lg p-3 max-w-xs pointer-events-none"
          style={{
            left: `${hoverPosition.x}px`,
            top: `${hoverPosition.y}px`,
            transform: 'translateX(-50%)'
          }}
        >
          {(() => {
            const tab = tabs.find(t => t.id === hoveredTabId)
            if (!tab) return null
            return (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {tab.favicon && (
                    <img src={tab.favicon} alt="" className="w-4 h-4" />
                  )}
                  <span className="font-medium text-sm">{tab.title || 'New Tab'}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{tab.url}</p>
                {tab.pageContent && (
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {tab.pageContent.slice(0, 150)}...
                  </p>
                )}
              </div>
            )
          })()}
        </div>
      )}

      {/* Context Menu for Tabs */}
      <DropdownMenu open={!!contextMenuTab} onOpenChange={(open) => !open && setContextMenuTab(null)}>
        <DropdownMenuContent
          style={{
            position: 'fixed',
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`,
          }}
        >
          <DropdownMenuItem
            onClick={() => {
              if (onCreateGroup && contextMenuTab) {
                onCreateGroup([contextMenuTab])
              }
              setContextMenuTab(null)
            }}
          >
            <Folder className="w-4 h-4 mr-2" />
            Create New Group
          </DropdownMenuItem>
          {groups.length > 0 && (
            <>
              <DropdownMenuSeparator />
              {groups.map(group => (
                <DropdownMenuItem
                  key={group.id}
                  onClick={() => {
                    if (onTabGroup && contextMenuTab) {
                      const tab = tabs.find(t => t.id === contextMenuTab)
                      onTabGroup(contextMenuTab, tab?.groupId === group.id ? null : group.id)
                    }
                    setContextMenuTab(null)
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full mr-2 inline-block"
                    style={{ backgroundColor: group.color }}
                  />
                  {group.name}
                  {tabs.find(t => t.id === contextMenuTab)?.groupId === group.id && ' ✓'}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  if (onTabGroup && contextMenuTab) {
                    onTabGroup(contextMenuTab, null)
                  }
                  setContextMenuTab(null)
                }}
              >
                Remove from Group
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  )
}
