'use client'

import { cn } from '@/lib/utils'
import { ChatRequestOptions, JSONValue, Message } from 'ai'
import { useEffect, useMemo, useState, useRef } from 'react'
import { SearchResults } from '@/lib/types'
import { RenderMessage } from './render-message'
import { ToolSection } from './tool-section'
import { Spinner } from './ui/spinner'
import { ImpactAnalysisDisplay } from './impact-analysis-display'

interface ChatSection {
  id: string
  userMessage: Message
  assistantMessages: Message[]
}

interface ChatMessagesProps {
  sections: ChatSection[]
  data: JSONValue[] | undefined
  onQuerySelect: (query: string) => void
  isLoading: boolean
  chatId?: string
  addToolResult?: (params: { toolCallId: string; result: any }) => void
  scrollContainerRef: React.RefObject<HTMLDivElement>
  onUpdateMessage?: (messageId: string, newContent: string) => Promise<void>
  reload?: (
    messageId: string,
    options?: ChatRequestOptions
  ) => Promise<string | null | undefined>
  searchResults?: SearchResults
}

export function ChatMessages({
  sections,
  data,
  onQuerySelect,
  isLoading,
  chatId,
  addToolResult,
  scrollContainerRef,
  onUpdateMessage,
  reload,
  searchResults
}: ChatMessagesProps) {
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({})
  const [headerMagnifiers, setHeaderMagnifiers] = useState<Array<{
    id: string;
    bounds: DOMRect;
    text: string;
  }>>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const manualToolCallId = 'manual-tool-call'

  useEffect(() => {
    if (sections.length > 0) {
      const lastSection = sections[sections.length - 1]
      if (lastSection.userMessage.role === 'user') {
        setOpenStates({ [manualToolCallId]: true })
      }
    }
  }, [sections])

  useEffect(() => {
    const detectHeaders = () => {
      if (!containerRef.current) return

      const headers = containerRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6')
      console.log('Detected headers:', headers.length, Array.from(headers).map(h => ({ tag: h.tagName, text: h.textContent?.slice(0, 50) })))

      const headerData = Array.from(headers)
        .filter(header => {
          const rect = header.getBoundingClientRect()
          return rect.width > 0 && rect.height > 0
        })
        .map((header, index) => {
          const bounds = header.getBoundingClientRect()
          const containerBounds = containerRef.current!.getBoundingClientRect()

          return {
            id: `header-${index}-${header.tagName}`,
            bounds: {
              x: bounds.left - containerBounds.left,
              y: bounds.top - containerBounds.top,
              width: bounds.width,
              height: bounds.height,
              left: bounds.left - containerBounds.left,
              top: bounds.top - containerBounds.top,
              right: bounds.right - containerBounds.left,
              bottom: bounds.bottom - containerBounds.top
            } as DOMRect,
            text: header.textContent || ''
          }
        })

      console.log('Processed header data:', headerData)
      setHeaderMagnifiers(headerData)
    }

    const timer = setTimeout(detectHeaders, 500)

    const handleUpdate = () => {
      setTimeout(detectHeaders, 100)
    }
    window.addEventListener('scroll', handleUpdate)
    window.addEventListener('resize', handleUpdate)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleUpdate)
      window.removeEventListener('resize', handleUpdate)
    }
  }, [sections, searchResults])

  const lastToolData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return null

    const lastItem = data[data.length - 1] as {
      type: 'tool_call'
      data: {
        toolCallId: string
        state: 'call' | 'result'
        toolName: string
        args: string
      }
    }

    if (lastItem.type !== 'tool_call') return null

    const toolData = lastItem.data
    return {
      state: 'call' as const,
      toolCallId: toolData.toolCallId,
      toolName: toolData.toolName,
      args: toolData.args ? JSON.parse(toolData.args) : undefined
    }
  }, [data])

  const hasAnySections = sections.length > 0

  const allMessages = sections.flatMap(section => [
    section.userMessage,
    ...section.assistantMessages
  ])

  const lastUserIndex =
    allMessages.length -
    1 -
    [...allMessages].reverse().findIndex(msg => msg.role === 'user')

  const showLoading =
    isLoading &&
    sections.length > 0 &&
    sections[sections.length - 1].assistantMessages.length === 0

  const getIsOpen = (id: string) => {
    if (id.includes('call')) {
      return openStates[id] ?? true
    }
    const baseId = id.endsWith('-related') ? id.slice(0, -8) : id
    const index = allMessages.findIndex(msg => msg.id === baseId)
    return openStates[id] ?? index >= lastUserIndex
  }

  const handleOpenChange = (id: string, open: boolean) => {
    setOpenStates(prev => ({
      ...prev,
      [id]: open
    }))
  }

  const messageContainerStyle = {
    background: 'rgba(250, 251, 252, 0.82)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(220, 225, 230, 0.4)',
    borderTop: '2px solid rgba(245, 248, 250, 0.9)',
    boxShadow: `
      0px 0.7065919983928324px 0.7065919983928324px -0.6666666666666666px rgba(0, 0, 0, 0.08),
      0px 1.8065619053231785px 1.8065619053231785px -1.3333333333333333px rgba(0, 0, 0, 0.08),
      0px 3.6217592146567767px 3.6217592146567767px -2px rgba(0, 0, 0, 0.07),
      0px 6.8655999097303715px 6.8655999097303715px -2.6666666666666665px rgba(0, 0, 0, 0.07),
      0px 13.646761411524492px 13.646761411524492px -3.3333333333333335px rgba(0, 0, 0, 0.05),
      0px 30px 30px -4px rgba(0, 0, 0, 0.02),
      inset 0px 3px 1px 0px rgba(255, 255, 255, 0.5)
    `
  }

  const projectCardStyle = {
    background: 'linear-gradient(135deg, #FEFEFE 0%, #F8F8F8 100%)',
    borderRadius: '32px',
    boxShadow: `
      0px 0.7065919983928324px 0.7065919983928324px -0.6666666666666666px rgba(0, 0, 0, 0.08),
      0px 1.8065619053231785px 1.8065619053231785px -1.3333333333333333px rgba(0, 0, 0, 0.08),
      0px 3.6217592146567767px 3.6217592146567767px -2px rgba(0, 0, 0, 0.07),
      0px 6.8655999097303715px 6.8655999097303715px -2.6666666666666665px rgba(0, 0, 0, 0.07),
      0px 13.646761411524492px 13.646761411524492px -3.3333333333333335px rgba(0, 0, 0, 0.05),
      0px 30px 30px -4px rgba(0, 0, 0, 0.02)
    `,
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }

  return (
    <div
      id="scroll-container"
      ref={scrollContainerRef}
      role="list"
      aria-roledescription="chat messages"
      className={cn(
        'relative size-full pt-14',
        sections.length > 0 ? 'flex-1 overflow-y-auto' : ''
      )}
      style={{ zIndex: 10 }}
    >
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        <defs>
          <filter id="liquidWobble" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              baseFrequency="0.02 0.03"
              numOctaves="3"
              seed="2"
              stitchTiles="stitch"
              result="turbulence"
            >
              <animate
                attributeName="baseFrequency"
                dur="8s"
                values="0.02 0.03;0.03 0.025;0.025 0.035;0.02 0.03"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="3"
              result="displacement"
            >
              <animate
                attributeName="scale"
                dur="6s"
                values="3;5;2;4;3"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
            <feGaussianBlur in="displacement" stdDeviation="0.5" result="blur" />
          </filter>

          <filter id="liquidGlass" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              baseFrequency="0.01 0.02"
              numOctaves="2"
              seed="5"
              result="noise"
            >
              <animate
                attributeName="seed"
                dur="12s"
                values="5;8;3;7;5"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="1.5"
              result="distortion"
            />
            <feGaussianBlur in="distortion" stdDeviation="0.8" result="softDistortion" />
            <feColorMatrix
              in="softDistortion"
              type="matrix"
              values="1.1 0 0 0 0.05  0 1.1 0 0 0.05  0 0 1.1 0 0.05  0 0 0 1 0"
              result="enhanced"
            />
          </filter>
        </defs>
      </svg>

      <div ref={containerRef} className="relative">
        <div className="relative mx-auto w-full max-w-[1300px] px-10">
          {hasAnySections ? sections.map((section, sectionIndex) => (
            <div
              key={section.id}
              id={`section-${section.id}`}
              className="chat-section mb-16"
              style={
                sectionIndex === sections.length - 1
                  ? { minHeight: 'calc(-228px + 100dvh)' }
                  : {}
              }
            >
              <div className="mb-16">
                <div
                  className="box-border flex flex-col justify-start items-start p-6 overflow-hidden content-start flex-nowrap gap-4 w-full max-w-[700px] mx-auto"
                  style={{
                    ...messageContainerStyle,
                    borderRadius: '20px 20px 20px 5px'
                  }}
                >
                  <RenderMessage
                    message={section.userMessage}
                    messageId={section.userMessage.id}
                    getIsOpen={getIsOpen}
                    onOpenChange={handleOpenChange}
                    onQuerySelect={onQuerySelect}
                    chatId={chatId}
                    addToolResult={addToolResult}
                    onUpdateMessage={onUpdateMessage}
                    reload={reload}
                  />
                </div>
              </div>

              {sectionIndex === 0 && searchResults && (
                <div className="mb-16">
                  <div className="p-8" style={projectCardStyle}>
                    <ImpactAnalysisDisplay
                      query={section.userMessage.content}
                      searchResults={searchResults}
                    />
                  </div>
                </div>
              )}

              {(searchResults || section.assistantMessages.length > 0) && (
                <div className="mb-24">
                  <div
                    className="p-12 flex flex-col lg:flex-row gap-12 items-start"
                    style={projectCardStyle}
                  >
                    <div className="w-full lg:w-1/2">
                      {searchResults?.images && searchResults.images.length > 0 ? (
                        <img
                          src={typeof searchResults.images[0] === 'string' ? searchResults.images[0] : searchResults.images[0].url}
                          alt="Search result"
                          className="w-full h-[431px] object-cover rounded-3xl"
                        />
                      ) : (
                        <div className="w-full h-[431px] rounded-3xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-6xl font-bold text-gray-400">AI</span>
                        </div>
                      )}
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col">
                      <div className="text-lg font-medium text-gray-900 mb-6">01</div>

                      <h3 className="text-3xl font-semibold text-gray-900 mb-6 leading-tight">
                        AI Search Results — {section.userMessage.content.slice(0, 40)}...
                      </h3>

                      {section.assistantMessages.length > 0 && (
                        <div className="mb-8 text-gray-700 leading-relaxed">
                          <RenderMessage
                            message={section.assistantMessages[0]}
                            messageId={section.assistantMessages[0].id}
                            getIsOpen={getIsOpen}
                            onOpenChange={handleOpenChange}
                            onQuerySelect={onQuerySelect}
                            chatId={chatId}
                            addToolResult={addToolResult}
                            onUpdateMessage={onUpdateMessage}
                            reload={reload}
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-8 mb-8">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                          <div className="text-4xl font-semibold text-gray-900 mb-2 leading-none">
                            {searchResults?.results?.length || 0}
                          </div>
                          <div className="text-sm text-gray-600">Sources found</div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                          <div className="text-4xl font-semibold text-gray-900 mb-2 leading-none">
                            {searchResults?.images?.length || 0}
                          </div>
                          <div className="text-sm text-gray-600">Images discovered</div>
                        </div>
                      </div>

                      {searchResults?.results && searchResults.results.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
                            Key Sources
                          </h4>
                          <div className="space-y-3">
                            {searchResults.results.slice(0, 3).map((result, sourceIndex) => (
                              <div key={sourceIndex} className="text-sm">
                                <a
                                  href={result.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 font-medium block truncate"
                                >
                                  {result.title}
                                </a>
                                <p className="text-gray-600 text-xs truncate mt-1">
                                  {result.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {showLoading && (
                <div className="mb-24">
                  <div
                    className="p-12 flex items-center justify-center h-96"
                    style={projectCardStyle}
                  >
                    <Spinner />
                  </div>
                </div>
              )}
            </div>
          )) : (
            <div className="flex items-center justify-center py-12 min-h-96">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          )}

          {showLoading && lastToolData && (
            <ToolSection
              key={manualToolCallId}
              tool={lastToolData}
              isOpen={getIsOpen(manualToolCallId)}
              onOpenChange={open => handleOpenChange(manualToolCallId, open)}
              addToolResult={addToolResult}
            />
          )}
        </div>

        {headerMagnifiers.map((header, index) => {
          const width = Math.max(header.bounds.width + 40, 150)
          const height = Math.max(header.bounds.height + 20, 80)
          const borderRadius = Math.min(width, height) / 2

          return (
            <div
              key={header.id}
              className="absolute pointer-events-none z-[1003] cursor-grab select-none"
              style={{
                left: header.bounds.left - 20,
                top: header.bounds.top - 10,
                width: width,
                height: height,
                WebkitUserSelect: 'none',
                filter: 'url(#liquidWobble)',
                animation: `wobble ${4 + index * 0.5}s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`
              }}
            >
              <div
                className="absolute inset-0 ring ring-black/10 dark:ring-white/10"
                style={{
                  borderRadius: `${borderRadius}px`,
                  boxShadow: `
                    rgba(0, 0, 0, 0.16) 0px 4px 9px,
                    rgba(0, 0, 0, 0.2) 0px 2px 24px inset,
                    rgba(255, 255, 255, 0.2) 0px -2px 24px inset
                  `,
                  filter: 'url(#liquidGlass)',
                  transform: 'scale(1) rotate(0deg)',
                  animation: `liquidMotion ${6 + index * 0.3}s ease-in-out infinite`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    borderRadius: `${borderRadius}px`,
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(0.5px)',
                    animation: `ripple ${8 + index * 0.2}s linear infinite`,
                    animationDelay: `${index * 0.15}s`
                  }}
                />

                <div
                  className="absolute"
                  style={{
                    top: `${height * 0.15}px`,
                    left: `${width * 0.2}px`,
                    width: `${Math.min(width * 0.3, 50)}px`,
                    height: `${Math.min(height * 0.4, 40)}px`,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 70%)',
                    filter: 'blur(8px)',
                    animation: `shimmer ${3 + index * 0.2}s ease-in-out infinite`,
                    animationDelay: `${index * 0.1}s`
                  }}
                />

                <div
                  className="absolute inset-1"
                  style={{
                    borderRadius: `${borderRadius - 5}px`,
                    background: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.1) 0%, transparent 60%)',
                    animation: `float ${5 + index * 0.3}s ease-in-out infinite reverse`,
                    animationDelay: `${index * 0.05}s`
                  }}
                />

                <div
                  className="absolute inset-2"
                  style={{
                    borderRadius: `${borderRadius - 10}px`,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(0.2px)',
                    animation: `textShimmer ${7 + index * 0.4}s ease-in-out infinite`,
                    animationDelay: `${index * 0.08}s`
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        @keyframes wobble {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.02) rotate(0.5deg); }
          50% { transform: scale(0.98) rotate(-0.3deg); }
          75% { transform: scale(1.01) rotate(0.2deg); }
        }

        @keyframes liquidMotion {
          0%, 100% { transform: scale(1) rotate(0deg) skew(0deg); }
          20% { transform: scale(1.01) rotate(0.3deg) skew(0.1deg); }
          40% { transform: scale(0.99) rotate(-0.2deg) skew(-0.1deg); }
          60% { transform: scale(1.005) rotate(0.1deg) skew(0.05deg); }
          80% { transform: scale(0.995) rotate(-0.1deg) skew(-0.05deg); }
        }

        @keyframes ripple {
          0% { transform: scale(1) translateX(0); }
          25% { transform: scale(1.002) translateX(0.5px); }
          50% { transform: scale(0.998) translateX(-0.3px); }
          75% { transform: scale(1.001) translateX(0.2px); }
          100% { transform: scale(1) translateX(0); }
        }

        @keyframes shimmer {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-1px) rotate(0.2deg); }
          66% { transform: translateY(1px) rotate(-0.1deg); }
        }

        @keyframes textShimmer {
          0%, 100% {
            opacity: 0.05;
            transform: scale(1) translateX(0px);
          }
          50% {
            opacity: 0.15;
            transform: scale(1.02) translateX(1px);
          }
        }
      `}</style>
    </div>
  )
}