'use client'

import { Model } from '@/lib/types/models'
import { cn } from '@/lib/utils'
import { withCustomNames } from '@/lib/utils/modelDisplayNames'
import { Message } from 'ai'
import {
  ArrowUp,
  ChevronDown,
  Mic,
  MicOff,
  Phone,
  Square,
  Mail,
  Paperclip,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Textarea from 'react-textarea-autosize'
import { useArtifact } from './artifact/artifact-context'
import { ModelSelector } from './model-selector'
import { SearchModeToggle } from './search-mode-toggle'
import { Button } from './ui/button'

interface ChatPanelProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  messages: Message[]
  setMessages: (messages: Message[]) => void
  query?: string
  stop: () => void
  append: (message: any) => void
  models?: Model[]
  showScrollToBottomButton: boolean
  scrollContainerRef: React.RefObject<HTMLDivElement>
  reload?: () => void
  // Add props for search sidebar control
  hasSearchResults?: boolean
  onOpenSearchSidebar?: () => void
}

export function ChatPanel({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  messages,
  setMessages,
  query,
  stop,
  append,
  models,
  showScrollToBottomButton,
  scrollContainerRef,
  hasSearchResults,
  onOpenSearchSidebar,
}: ChatPanelProps) {
  const [showEmptyScreen, setShowEmptyScreen] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const isFirstRender = useRef(true)
  const [isComposing, setIsComposing] = useState(false)
  const [enterDisabled, setEnterDisabled] = useState(false)
  const { close: closeArtifact } = useArtifact()
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const backgroundUrl = 'https://orbai-template.framer.website'

  // Auto-open search sidebar when results come in
  useEffect(() => {
    if (hasSearchResults && onOpenSearchSidebar) {
      onOpenSearchSidebar()
    }
  }, [hasSearchResults, onOpenSearchSidebar])

  const handleCompositionStart = () => setIsComposing(true)
  const handleCompositionEnd = () => {
    setIsComposing(false)
    setEnterDisabled(true)
    setTimeout(() => setEnterDisabled(false), 300)
  }

  const handleUserInteraction = () => {
    if (!hasUserInteracted) setHasUserInteracted(true)
  }

  const submitMessage = (message: string) => {
    append({ role: 'user', content: message })
    handleInputChange({
      target: { value: '' },
    } as React.ChangeEvent<HTMLTextAreaElement>)
  }

  const toggleListening = () => {
    if (!recognitionRef.current) return
    isListening ? recognitionRef.current.stop() : recognitionRef.current.start()
  }

  const handleScrollToBottom = () => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }

  const openElevenLabsWidget = () => {
    router.push('/elevenlabs-widget')
  }

  const isToolInvocationInProgress = () => {
    if (!messages.length) return false
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== 'assistant' || !lastMessage.parts) return false
    const lastPart = lastMessage.parts[lastMessage.parts.length - 1]
    return (
      lastPart?.type === 'tool-invocation' &&
      lastPart?.toolInvocation?.state === 'call'
    )
  }

  const isPrePrompt = messages.length === 0

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        alert('Image uploaded successfully!')
        append({
          role: 'assistant',
          content: `Uploaded your image successfully! Post ID: ${data.postId}`,
        })
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      alert('Upload error: ' + (error instanceof Error ? error.message : String(error)))
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.trim()
      if (transcript) submitMessage(transcript)
    }

    recognitionRef.current = recognition
  }, [append, handleInputChange])

  useEffect(() => {
    if (isFirstRender.current && query?.trim()) {
      append({ role: 'user', content: query })
      isFirstRender.current = false
    }
  }, [query, append])

  const buttonBaseClass =
    'rounded-full bg-white/70 border border-white/70 shadow-md text-gray-600 hover:text-white focus:text-white backdrop-filter-none backdrop-blur-none'

  const renderButtons = () => (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          className={buttonBaseClass}
          onClick={triggerFileInput}
          aria-label="Attach file"
          title="Attach file"
          disabled={isLoading || isToolInvocationInProgress()}
        >
          <Paperclip size={18} />
        </Button>

        <ModelSelector
          models={withCustomNames(
            (models || []).filter(m =>
              ['grok-3-beta', 'grok-2-1212'].includes(m.id)
            )
          )}
        />
        <SearchModeToggle />
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          onClick={toggleListening}
          className={cn(
            buttonBaseClass,
            'shrink-0',
            isListening && 'bg-white/80 text-white'
          )}
          variant="default"
          disabled={isLoading || isToolInvocationInProgress()}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </Button>
        <Button
          size="icon"
          onClick={openElevenLabsWidget}
          className={buttonBaseClass}
          variant="default"
          aria-label="Open ElevenLabs Widget"
        >
          <Phone size={18} />
        </Button>
        {!isPrePrompt && (
          <Button
            size="icon"
            variant="outline"
            className={buttonBaseClass}
            onClick={() => window.open('https://mail.google.com', '_blank')}
            aria-label="Open Gmail"
            title="Open Gmail"
          >
            <Mail size={18} />
          </Button>
        )}
        <Button
          type={isLoading ? 'button' : 'submit'}
          size="icon"
          className={cn(buttonBaseClass, isLoading && 'animate-pulse')}
          variant="default"
          disabled={
            (!(input?.length) && !isLoading) || isToolInvocationInProgress()
          }
          onClick={() => (isLoading ? stop() : handleUserInteraction())}
          aria-label={isLoading ? 'Stop' : 'Send message'}
        >
          {isLoading ? <Square size={20} /> : <ArrowUp size={20} />}
        </Button>
      </div>
    </>
  )

  if (isPrePrompt) {
    return (
      <div
        style={{
          position: 'relative',
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
        }}
      >
        <iframe
          src={backgroundUrl}
          className="absolute top-0 left-0 w-full h-full z-0"
          frameBorder="0"
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
          title="Background Website"
          style={{ pointerEvents: 'auto', border: 'none', outline: 'none' }}
        />

        <div
          className="fixed bottom-0 left-0 right-0 z-20 flex justify-center backdrop-filter-none backdrop-blur-none pointer-events-none"
        >
          <div className="w-full max-w-3xl px-4 pb-4 pointer-events-none">
            <form
              onSubmit={e => {
                handleUserInteraction()
                handleSubmit(e)
              }}
              className="w-full flex flex-col items-center relative pointer-events-auto"
            >
              {showScrollToBottomButton && (
                <Button
                  type="button"
                  size="icon"
                  className={cn(
                    'absolute -top-14 left-1/2 transform -translate-x-1/2 z-30',
                    buttonBaseClass
                  )}
                  onClick={handleScrollToBottom}
                  aria-label="Scroll to bottom"
                >
                  <ChevronDown size={18} />
                </Button>
              )}
              <div
                className={cn(
                  'flex items-center w-full p-3 rounded-xl',
                  'neu-raised',
                  buttonBaseClass
                )}
              >
                <Textarea
                  ref={inputRef}
                  name="input"
                  rows={1}
                  maxRows={5}
                  placeholder="Send a message..."
                  value={input}
                  disabled={isLoading || isToolInvocationInProgress()}
                  className="bg-transparent resize-none flex-1 min-h-12 px-4 py-2 text-base font-medium text-gray-800 placeholder:text-gray-500 focus-visible:outline-none disabled:cursor-not-allowed"
                  onChange={e => {
                    handleInputChange(e)
                    setShowEmptyScreen(e.target.value.length === 0)
                    handleUserInteraction()
                  }}
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={handleCompositionEnd}
                  onKeyDown={e => {
                    if (
                      e.key === 'Enter' &&
                      !e.shiftKey &&
                      !isComposing &&
                      !enterDisabled
                    ) {
                      if (!input?.trim()) {
                        e.preventDefault()
                        return
                      }
                      e.preventDefault()
                      e.currentTarget.form?.requestSubmit()
                    }
                  }}
                  aria-label="Chat message input"
                />
                <div className="flex items-center justify-end gap-2">
                  {renderButtons()}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Post-prompt: Frosted glass overlay over iframe background
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
      }}
    >
      {/* Background iframe - always visible */}
      <iframe
        src={backgroundUrl}
        className="absolute top-0 left-0 w-full h-full z-0"
        frameBorder="0"
        allowFullScreen
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
        title="Background Website"
        style={{ pointerEvents: 'none', border: 'none', outline: 'none' }}
      />

      {/* Frosted glass overlay */}
      <div
        className="absolute top-0 left-0 w-full h-full z-10"
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      {/* Chat input panel */}
      <div
        className="fixed bottom-0 left-0 right-0 z-20 flex justify-center"
        onClick={handleUserInteraction}
      >
        <div className="w-full max-w-3xl px-4 pb-4">
          <form
            onSubmit={e => {
              handleUserInteraction()
              handleSubmit(e)
            }}
            className="w-full flex flex-col items-center relative"
          >
            {showScrollToBottomButton && (
              <Button
                type="button"
                size="icon"
                className={cn(
                  'absolute -top-14 left-1/2 transform -translate-x-1/2 z-30',
                  buttonBaseClass
                )}
                onClick={handleScrollToBottom}
                aria-label="Scroll to bottom"
              >
                <ChevronDown size={18} />
              </Button>
            )}
            <div
              className={cn(
                'flex items-center w-full p-3 rounded-xl',
                'neu-raised',
                buttonBaseClass
              )}
            >
              <Textarea
                ref={inputRef}
                name="input"
                rows={1}
                maxRows={5}
                placeholder="Send a message..."
                value={input}
                disabled={isLoading || isToolInvocationInProgress()}
                className="bg-transparent resize-none flex-1 min-h-12 px-4 py-2 text-base font-medium text-gray-800 placeholder:text-gray-500 focus-visible:outline-none disabled:cursor-not-allowed"
                onChange={e => handleInputChange(e)}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                onKeyDown={e => {
                  if (
                    e.key === 'Enter' &&
                    !e.shiftKey &&
                    !isComposing &&
                    !enterDisabled
                  ) {
                    if (!input?.trim()) {
                      e.preventDefault()
                      return
                    }
                    e.preventDefault()
                    e.currentTarget.form?.requestSubmit()
                  }
                }}
                aria-label="Chat message input"
              />
              <div className="flex items-center justify-end gap-2">
                {renderButtons()}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}