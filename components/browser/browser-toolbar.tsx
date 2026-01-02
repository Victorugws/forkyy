'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Star,
  Download,
  Settings,
  Shield,
  Zap,
  Lock,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Printer,
  Search,
  Code,
  Clock,
  BookMarked,
  Cookie
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { EyeTrackingControl } from '@/components/EyeTrackingControl'

interface BrowserToolbarProps {
  isBookmarked: boolean
  onToggleBookmark: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
  onPrint: () => void
  onSaveAsPDF?: () => void
  onFind: () => void
  onOpenDownloads: () => void
  onOpenHistory: () => void
  onOpenCookies?: () => void
  onOpenBookmarks: () => void
  onOpenDevTools: () => void
  onOpenSettings: () => void
  isSecure: boolean
  zoom: number
}

export function BrowserToolbar({
  isBookmarked,
  onToggleBookmark,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onPrint,
  onSaveAsPDF,
  onFind,
  onOpenDownloads,
  onOpenHistory,
  onOpenCookies,
  onOpenBookmarks,
  onOpenDevTools,
  onOpenSettings,
  isSecure,
  zoom,
}: BrowserToolbarProps) {
  const [showEyeTracking, setShowEyeTracking] = useState(false)

  useEffect(() => {
    // Only check for eyeTracking on the client after mount
    if (typeof window !== 'undefined' && (window as any).eyeTracking) {
      setShowEyeTracking(true)
    }
  }, [])

  return (
    <div className="flex items-center gap-1 px-2 border-l">
      {/* Bookmark */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onToggleBookmark}
        title="Bookmark this page"
      >
        <Star className={cn('h-4 w-4', isBookmarked && 'fill-yellow-400 text-yellow-400')} />
      </Button>

      {/* Security Indicator */}
      <div className="flex items-center gap-1 px-2 text-xs text-muted-foreground">
        {isSecure ? (
          <Lock className="h-3 w-3 text-green-600" />
        ) : (
          <Shield className="h-3 w-3 text-yellow-600" />
        )}
      </div>

      {/* Zoom Controls */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
            {Math.round(zoom * 100)}%
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onZoomIn}>
            <ZoomIn className="w-4 h-4 mr-2" />
            Zoom In
            <span className="ml-auto text-xs text-muted-foreground">Ctrl++</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onZoomOut}>
            <ZoomOut className="w-4 h-4 mr-2" />
            Zoom Out
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+-</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onZoomReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Zoom
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+0</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Eye Tracking Control */}
      {showEyeTracking && (
        <EyeTrackingControl />
      )}

      {/* More Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={onFind}>
            <Search className="w-4 h-4 mr-2" />
            Find in Page
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+F</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onPrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+P</span>
          </DropdownMenuItem>
          {onSaveAsPDF && (
            <DropdownMenuItem onClick={onSaveAsPDF}>
              <Download className="w-4 h-4 mr-2" />
              Save as PDF
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onOpenBookmarks}>
            <BookMarked className="w-4 h-4 mr-2" />
            Bookmarks
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onOpenHistory}>
            <Clock className="w-4 h-4 mr-2" />
            History
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onOpenDownloads}>
            <Download className="w-4 h-4 mr-2" />
            Downloads
          </DropdownMenuItem>
          {onOpenCookies && (
            <DropdownMenuItem onClick={onOpenCookies}>
              <Cookie className="w-4 h-4 mr-2" />
              Cookies & Site Data
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onOpenDevTools}>
            <Code className="w-4 h-4 mr-2" />
            Developer Tools
            <span className="ml-auto text-xs text-muted-foreground">F12</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onOpenSettings}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
