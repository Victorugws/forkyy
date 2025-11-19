'use client'

import { useState, useEffect, FormEvent } from 'react'

interface AddressBarProps {
  url: string
  isLoading: boolean
  canGoBack: boolean
  canGoForward: boolean
  onNavigate: (url: string) => void
  onBack: () => void
  onForward: () => void
  onReload: () => void
  onStop: () => void
}

export function AddressBar({
  url,
  isLoading,
  canGoBack,
  canGoForward,
  onNavigate,
  onBack,
  onForward,
  onReload,
  onStop
}: AddressBarProps) {
  const [inputValue, setInputValue] = useState(url)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isFocused) {
      setInputValue(url)
    }
  }, [url, isFocused])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onNavigate(inputValue)
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white/50">
      {/* Back button */}
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Go back"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Forward button */}
      <button
        onClick={onForward}
        disabled={!canGoForward}
        className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Go forward"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Reload/Stop button */}
      <button
        onClick={isLoading ? onStop : onReload}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors"
        title={isLoading ? 'Stop loading' : 'Reload'}
      >
        {isLoading ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 4H12V12H4V4Z"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.65 2.35C12.2 0.9 10.21 0 8 0C3.58 0 0.01 3.58 0.01 8C0.01 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z"/>
          </svg>
        )}
      </button>

      {/* Address bar */}
      <form onSubmit={handleSubmit} className="flex-1">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-4 py-1.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 text-sm"
          placeholder="Search or enter address"
        />
      </form>
    </div>
  )
}
