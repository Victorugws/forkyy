'use client'

import { Bookmark } from '@/lib/types/browser'
import { Button } from '@/components/ui/button'
import { Star, Folder, MoreVertical, Trash2, Edit } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PromptSuggestionsTicker } from '@/components/PromptSuggestionsTicker'

interface BookmarksBarProps {
  bookmarks: Bookmark[]
  onNavigate: (url: string) => void
  onEdit: (bookmark: Bookmark) => void
  onDelete: (bookmarkId: string) => void
  onManage: () => void
}

export function BookmarksBar({
  bookmarks,
  onNavigate,
  onEdit,
  onDelete,
  onManage,
}: BookmarksBarProps) {
  // Show only bookmarks without folder or in root folder
  const rootBookmarks = bookmarks.filter(b => !b.folder || b.folder === 'root')

  return (
    <div className="flex items-center gap-1 px-2 py-1 border-b bg-muted/20 overflow-x-auto">
      {rootBookmarks.slice(0, 15).map(bookmark => (
        <DropdownMenu key={bookmark.id}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1"
              onClick={() => onNavigate(bookmark.url)}
            >
              {bookmark.favicon ? (
                <img src={bookmark.favicon} alt="" className="w-3 h-3" />
              ) : (
                <Star className="w-3 h-3" />
              )}
              <span className="max-w-[120px] truncate">{bookmark.title}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onNavigate(bookmark.url)}>
              Open
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate(bookmark.url)}>
              Open in New Tab
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(bookmark)}>
              <Edit className="w-3 h-3 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(bookmark.id)}
              className="text-destructive"
            >
              <Trash2 className="w-3 h-3 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}

      {bookmarks.length > 15 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2"
          onClick={onManage}
        >
          <MoreVertical className="w-3 h-3" />
        </Button>
      )}

      <div className="flex-1 mx-2 min-w-0">
        <PromptSuggestionsTicker />
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2"
        onClick={onManage}
      >
        <Folder className="w-3 h-3 mr-1" />
        <span className="text-xs">Manage</span>
      </Button>
    </div>
  )
}
