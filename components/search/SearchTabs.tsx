'use client'

import { useState } from 'react'
import { FileText, Image, Video, Globe } from 'lucide-react'
import Link from 'next/link'

type TabType = 'all' | 'images' | 'videos' | 'news'

interface SearchTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  query: string
}

export function SearchTabs({ activeTab, onTabChange, query }: SearchTabsProps) {
  const tabs = [
    { id: 'all' as TabType, label: 'All', icon: Globe },
    { id: 'images' as TabType, label: 'Images', icon: Image },
    { id: 'videos' as TabType, label: 'Videos', icon: Video },
    { id: 'news' as TabType, label: 'News', icon: FileText }
  ]

  return (
    <div className="border-b border-border bg-background sticky top-0 z-10">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="flex gap-6 py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
