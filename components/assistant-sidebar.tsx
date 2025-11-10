'use client'

import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BookmarkPlus,
  Share2,
  Quote,
  Link as LinkIcon,
  FileText,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Source {
  title: string
  url: string
  snippet?: string
  favicon?: string
}

interface Citation {
  text: string
  source: string
  url: string
}

interface RelatedQuestion {
  question: string
  href: string
}

interface AssistantSidebarProps {
  sources?: Source[]
  citations?: Citation[]
  relatedQuestions?: RelatedQuestion[]
  summary?: string
}

export function AssistantSidebar({
  sources = [],
  citations = [],
  relatedQuestions = [],
  summary
}: AssistantSidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'sources' | 'citations' | 'related'>(
    'sources'
  )

  return (
    <>
      {/* Toggle Button (when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-3 rounded-l-lg shadow-lg hover:bg-primary/90 transition-all z-40"
        >
          <ChevronLeft className="size-5" />
        </button>
      )}

      {/* Sidebar Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 bottom-0 w-96 bg-background border-l border-border shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Sparkles className="size-5 text-primary" />
            </div>
            <h2 className="font-semibold text-lg">Assistant</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-accent transition-colors">
              <Share2 className="size-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-accent transition-colors">
              <BookmarkPlus className="size-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Summary Section (if provided) */}
        {summary && (
          <div className="p-4 border-b border-border bg-accent/50">
            <div className="flex items-start gap-2 mb-2">
              <FileText className="size-4 text-primary mt-0.5 flex-shrink-0" />
              <h3 className="font-semibold text-sm">Quick Summary</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {summary}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('sources')}
            className={cn(
              'flex-1 px-4 py-3 text-sm font-medium transition-colors relative',
              activeTab === 'sources'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <LinkIcon className="size-4 inline mr-2" />
            Sources
            {sources.length > 0 && (
              <span className="ml-1 text-xs">({sources.length})</span>
            )}
            {activeTab === 'sources' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('citations')}
            className={cn(
              'flex-1 px-4 py-3 text-sm font-medium transition-colors relative',
              activeTab === 'citations'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Quote className="size-4 inline mr-2" />
            Citations
            {citations.length > 0 && (
              <span className="ml-1 text-xs">({citations.length})</span>
            )}
            {activeTab === 'citations' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('related')}
            className={cn(
              'flex-1 px-4 py-3 text-sm font-medium transition-colors relative',
              activeTab === 'related'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Related
            {relatedQuestions.length > 0 && (
              <span className="ml-1 text-xs">({relatedQuestions.length})</span>
            )}
            {activeTab === 'related' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Sources Tab */}
          {activeTab === 'sources' && (
            <div className="space-y-3">
              {sources.length === 0 ? (
                <div className="text-center py-8">
                  <LinkIcon className="size-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No sources available yet
                  </p>
                </div>
              ) : (
                sources.map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      {source.favicon && (
                        <img
                          src={source.favicon}
                          alt=""
                          className="size-5 rounded mt-0.5 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                          {source.title}
                        </h4>
                        {source.snippet && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {source.snippet}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <span className="truncate">{new URL(source.url).hostname}</span>
                          <ExternalLink className="size-3 flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  </a>
                ))
              )}
            </div>
          )}

          {/* Citations Tab */}
          {activeTab === 'citations' && (
            <div className="space-y-3">
              {citations.length === 0 ? (
                <div className="text-center py-8">
                  <Quote className="size-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No citations available yet
                  </p>
                </div>
              ) : (
                citations.map((citation, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <Quote className="size-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground italic">
                        "{citation.text}"
                      </p>
                    </div>
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline mt-2 ml-6"
                    >
                      <span>— {citation.source}</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Related Questions Tab */}
          {activeTab === 'related' && (
            <div className="space-y-2">
              {relatedQuestions.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="size-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No related questions yet
                  </p>
                </div>
              ) : (
                relatedQuestions.map((question, index) => (
                  <a
                    key={index}
                    href={question.href}
                    className="block group rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-md transition-all"
                  >
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {question.question}
                    </p>
                  </a>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Overlay (when open) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        />
      )}
    </>
  )
}
