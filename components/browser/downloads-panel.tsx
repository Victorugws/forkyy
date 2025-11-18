'use client'

import { Download } from '@/lib/types/browser'
import { Button } from '@/components/ui/button'
import { Download as DownloadIcon, X, Trash2, FolderOpen, Pause, Play } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatBytes } from '@/lib/utils'

interface DownloadsPanelProps {
  downloads: Download[]
  onOpen: (downloadId: string) => void
  onCancel: (downloadId: string) => void
  onRemove: (downloadId: string) => void
  onClose: () => void
}

export function DownloadsPanel({
  downloads,
  onOpen,
  onCancel,
  onRemove,
  onClose,
}: DownloadsPanelProps) {
  const activeDownloads = downloads.filter(d =>
    d.status === 'downloading' || d.status === 'pending'
  )
  const completedDownloads = downloads.filter(d => d.status === 'completed')
  const failedDownloads = downloads.filter(d =>
    d.status === 'failed' || d.status === 'cancelled'
  )

  const renderDownload = (download: Download) => (
    <div key={download.id} className="p-3 border rounded-lg space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{download.filename}</p>
          <p className="text-xs text-muted-foreground truncate">{download.url}</p>
        </div>
        <div className="flex items-center gap-1">
          {download.status === 'completed' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onOpen(download.id)}
            >
              <FolderOpen className="h-3 w-3" />
            </Button>
          )}
          {(download.status === 'downloading' || download.status === 'pending') && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onCancel(download.id)}
            >
              <Pause className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onRemove(download.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Progress */}
      {download.status === 'downloading' && (
        <div className="space-y-1">
          <Progress value={download.progress} className="h-1" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(download.progress)}%</span>
            <span>{formatBytes(download.size * download.progress / 100)} / {formatBytes(download.size)}</span>
          </div>
        </div>
      )}

      {/* Status */}
      <div className="flex items-center justify-between text-xs">
        <span className={
          download.status === 'completed' ? 'text-green-600' :
          download.status === 'failed' ? 'text-destructive' :
          download.status === 'cancelled' ? 'text-muted-foreground' :
          'text-blue-600'
        }>
          {download.status === 'completed' && 'Completed'}
          {download.status === 'downloading' && 'Downloading...'}
          {download.status === 'pending' && 'Pending...'}
          {download.status === 'failed' && 'Failed'}
          {download.status === 'cancelled' && 'Cancelled'}
        </span>
        {download.completedAt && (
          <span className="text-muted-foreground">
            {new Date(download.completedAt).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <DownloadIcon className="h-5 w-5" />
          <h2 className="font-semibold">Downloads</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Downloads List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Active Downloads */}
          {activeDownloads.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Active Downloads</h3>
              <div className="space-y-2">
                {activeDownloads.map(renderDownload)}
              </div>
            </div>
          )}

          {/* Completed Downloads */}
          {completedDownloads.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Completed</h3>
              <div className="space-y-2">
                {completedDownloads.map(renderDownload)}
              </div>
            </div>
          )}

          {/* Failed Downloads */}
          {failedDownloads.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Failed</h3>
              <div className="space-y-2">
                {failedDownloads.map(renderDownload)}
              </div>
            </div>
          )}

          {downloads.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <DownloadIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>No downloads yet</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
