'use client'

import type { TabInfo } from '../types/electron'

interface BrowserTabProps {
  tab: TabInfo
  isActive: boolean
  onSwitch: () => void
  onClose: () => void
}

export function BrowserTab({ tab, isActive, onSwitch, onClose }: BrowserTabProps) {
  return (
    <div
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-t cursor-pointer
        max-w-[200px] min-w-[120px] transition-colors
        ${isActive
          ? 'bg-white shadow-sm'
          : 'bg-gray-100 hover:bg-gray-200'
        }
      `}
      onClick={onSwitch}
    >
      {/* Favicon or loading indicator */}
      {tab.isLoading ? (
        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      ) : tab.favicon ? (
        <img
          src={tab.favicon}
          alt=""
          className="w-4 h-4 flex-shrink-0"
          onError={(e) => {
            // Hide broken favicon
            e.currentTarget.style.display = 'none'
          }}
        />
      ) : (
        <div className="w-4 h-4 flex-shrink-0 text-gray-400">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      )}

      {/* Title */}
      <span className="flex-1 text-sm truncate text-gray-700">
        {tab.title || 'New Tab'}
      </span>

      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded px-1 transition-colors flex-shrink-0"
        title="Close tab"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M11.25 1.808L10.192 0.75L6 4.942L1.808 0.75L0.75 1.808L4.942 6L0.75 10.192L1.808 11.25L6 7.058L10.192 11.25L11.25 10.192L7.058 6L11.25 1.808Z"/>
        </svg>
      </button>
    </div>
  )
}
