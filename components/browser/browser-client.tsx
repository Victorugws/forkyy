'use client'

import { Model } from '@/lib/types/models'
import { useState, useEffect } from 'react'
import { BrowserBar } from './browser-bar'
import { BrowserView } from './browser-view'
import { BrowserChat } from './browser-chat'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

interface BrowserClientProps {
  id: string
  models?: Model[]
}

export function BrowserClient({ id, models }: BrowserClientProps) {
  const [currentUrl, setCurrentUrl] = useState('')
  const [pageTitle, setPageTitle] = useState('')
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [pageContent, setPageContent] = useState<string>('')

  return (
    <div className="flex flex-col h-full w-full">
      {/* Browser Bar */}
      <BrowserBar
        currentUrl={currentUrl}
        onUrlChange={setCurrentUrl}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        isLoading={isLoading}
        pageTitle={pageTitle}
      />

      {/* Resizable Split View: Browser + AI Chat */}
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 min-h-0"
      >
        {/* Web Content Panel */}
        <ResizablePanel defaultSize={60} minSize={30}>
          <BrowserView
            url={currentUrl}
            onNavigate={setCurrentUrl}
            onLoadingChange={setIsLoading}
            onTitleChange={setPageTitle}
            onContentChange={setPageContent}
            onCanGoBackChange={setCanGoBack}
            onCanGoForwardChange={setCanGoForward}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* AI Chat Panel */}
        <ResizablePanel defaultSize={40} minSize={25}>
          <BrowserChat
            id={id}
            models={models}
            currentUrl={currentUrl}
            pageTitle={pageTitle}
            pageContent={pageContent}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
