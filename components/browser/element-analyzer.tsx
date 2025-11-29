'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { AlertTriangle, Shield, ExternalLink, Code, Database, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RiskyElement {
  element: HTMLElement
  risks: string[]
  severity: 'low' | 'medium' | 'high'
  position: { x: number; y: number; width: number; height: number }
}

interface ElementAnalyzerProps {
  pageUrl: string
  enabled: boolean
  onTripleClick?: (element: HTMLElement, text: string) => void
}

export function ElementAnalyzer({ pageUrl, enabled, onTripleClick }: ElementAnalyzerProps) {
  const [riskyElements, setRiskyElements] = useState<RiskyElement[]>([])
  const [hoveredRisk, setHoveredRisk] = useState<RiskyElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [highlightedElements, setHighlightedElements] = useState<Set<HTMLElement>>(new Set())

  // Selection toolbar state
  const [selectedText, setSelectedText] = useState('')
  const [selectionToolbarPosition, setSelectionToolbarPosition] = useState({ x: 0, y: 0 })
  const [showSelectionToolbar, setShowSelectionToolbar] = useState(false)
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null)

  // Context menu state
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [contextSelectedText, setContextSelectedText] = useState('')
  const [contextSelectedElement, setContextSelectedElement] = useState<HTMLElement | null>(null)

  // Scan page for risky elements
  useEffect(() => {
    if (!enabled || !pageUrl || pageUrl.startsWith('/')) return

    const scanForRiskyElements = () => {
      const risks: RiskyElement[] = []

      // Check all links
      document.querySelectorAll('a[href]').forEach((link) => {
        const href = link.getAttribute('href')
        if (!href) return

        const elementRisks: string[] = []
        let severity: 'low' | 'medium' | 'high' = 'low'

        // Check for external links
        if (href.startsWith('http') && !href.includes(new URL(pageUrl).hostname)) {
          elementRisks.push('External link to different domain')
          severity = 'low'
        }

        // Check for suspicious patterns
        if (href.includes('track') || href.includes('redirect') || href.includes('click')) {
          elementRisks.push('Potential tracking link')
          severity = 'medium'
        }

        // Check for data URIs or javascript:
        if (href.startsWith('javascript:') || href.startsWith('data:')) {
          elementRisks.push('Suspicious link protocol')
          severity = 'high'
        }

        if (elementRisks.length > 0) {
          const rect = link.getBoundingClientRect()
          risks.push({
            element: link as HTMLElement,
            risks: elementRisks,
            severity,
            position: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
          })
        }
      })

      // Check forms
      document.querySelectorAll('form').forEach((form) => {
        const action = form.getAttribute('action')
        const method = form.getAttribute('method')
        const elementRisks: string[] = []
        let severity: 'low' | 'medium' | 'high' = 'low'

        if (action && action.startsWith('http') && !action.includes(new URL(pageUrl).hostname)) {
          elementRisks.push('Form submits to external domain')
          severity = 'high'
        }

        if (method?.toLowerCase() === 'get' && form.querySelector('input[type="password"]')) {
          elementRisks.push('Password field in GET form (insecure)')
          severity = 'high'
        }

        if (elementRisks.length > 0) {
          const rect = form.getBoundingClientRect()
          risks.push({
            element: form as HTMLElement,
            risks: elementRisks,
            severity,
            position: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
          })
        }
      })

      // Check scripts
      document.querySelectorAll('script[src]').forEach((script) => {
        const src = script.getAttribute('src')
        if (!src) return

        const elementRisks: string[] = []
        let severity: 'low' | 'medium' | 'high' = 'low'

        try {
          const scriptDomain = new URL(src, pageUrl).hostname
          const pageDomain = new URL(pageUrl).hostname

          if (scriptDomain !== pageDomain) {
            elementRisks.push(`Third-party script from ${scriptDomain}`)
            severity = 'medium'
          }
        } catch {
          elementRisks.push('Invalid script source')
          severity = 'medium'
        }

        if (elementRisks.length > 0) {
          const rect = script.getBoundingClientRect()
          if (rect.width > 0 || rect.height > 0) {
            risks.push({
              element: script as HTMLElement,
              risks: elementRisks,
              severity,
              position: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
            })
          }
        }
      })

      setRiskyElements(risks)
    }

    // Initial scan
    setTimeout(scanForRiskyElements, 1000)

    // Rescan on DOM changes
    const observer = new MutationObserver(() => {
      setTimeout(scanForRiskyElements, 500)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [pageUrl, enabled])

  // Add hover listeners to risky elements
  useEffect(() => {
    if (!enabled) return

    const handleMouseEnter = (risk: RiskyElement) => (e: MouseEvent) => {
      setHoveredRisk(risk)
      const rect = risk.element.getBoundingClientRect()
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      })

      // Add highlight
      risk.element.style.outline = '2px solid rgba(239, 68, 68, 0.5)'
      risk.element.style.outlineOffset = '2px'
    }

    const handleMouseLeave = (risk: RiskyElement) => () => {
      setHoveredRisk(null)
      risk.element.style.outline = ''
      risk.element.style.outlineOffset = ''
    }

    riskyElements.forEach((risk) => {
      risk.element.addEventListener('mouseenter', handleMouseEnter(risk) as any)
      risk.element.addEventListener('mouseleave', handleMouseLeave(risk) as any)
    })

    return () => {
      riskyElements.forEach((risk) => {
        risk.element.removeEventListener('mouseenter', handleMouseEnter(risk) as any)
        risk.element.removeEventListener('mouseleave', handleMouseLeave(risk) as any)
        risk.element.style.outline = ''
        risk.element.style.outlineOffset = ''
      })
    }
  }, [riskyElements, enabled])

  // Text selection detection
  useEffect(() => {
    if (!enabled) return

    const handleSelectionChange = () => {
      const selection = window.getSelection()
      const text = selection?.toString().trim()

      if (text && text.length > 3) {
        const range = selection?.getRangeAt(0)
        const rect = range?.getBoundingClientRect()

        if (rect) {
          setSelectedText(text)
          setSelectionToolbarPosition({
            x: rect.left + rect.width / 2,
            y: rect.top
          })
          setShowSelectionToolbar(true)

          // Get the element that contains the selection
          const container = range?.commonAncestorContainer
          const element = container?.nodeType === 1
            ? container as HTMLElement
            : container?.parentElement
          setSelectedElement(element || null)
        }
      } else {
        setShowSelectionToolbar(false)
      }
    }

    // Add delay to prevent toolbar flashing during selection
    let timeoutId: NodeJS.Timeout
    const debouncedHandler = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleSelectionChange, 100)
    }

    document.addEventListener('selectionchange', debouncedHandler)
    document.addEventListener('mouseup', debouncedHandler)

    return () => {
      document.removeEventListener('selectionchange', debouncedHandler)
      document.removeEventListener('mouseup', debouncedHandler)
      clearTimeout(timeoutId)
    }
  }, [enabled])

  // Right-click context menu
  useEffect(() => {
    if (!enabled) return

    const handleContextMenu = (e: MouseEvent) => {
      const selection = window.getSelection()
      const text = selection?.toString().trim()

      // Only show our context menu if text is selected
      if (text && text.length > 3) {
        e.preventDefault()

        setContextMenuPosition({ x: e.clientX, y: e.clientY })
        setContextSelectedText(text)

        // Get the element that was right-clicked
        const target = e.target as HTMLElement
        setContextSelectedElement(target)

        setShowContextMenu(true)
        setShowSelectionToolbar(false) // Hide selection toolbar
      }
    }

    const handleClick = () => {
      setShowContextMenu(false)
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('click', handleClick)
    }
  }, [enabled])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500/50 bg-red-500/10'
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10'
      case 'low': return 'border-blue-500/50 bg-blue-500/10'
      default: return 'border-gray-500/50 bg-gray-500/10'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-400" />
      case 'medium': return <Shield className="h-4 w-4 text-yellow-400" />
      default: return <Shield className="h-4 w-4 text-blue-400" />
    }
  }

  if (!enabled) return null

  return (
    <>
      {/* Hover Tooltip */}
      <AnimatePresence>
        {hoveredRisk && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="fixed z-[10000] pointer-events-none"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: 'translate(-50%, calc(-100% - 12px))'
            }}
          >
            <div className={cn(
              'rounded-2xl border-2 backdrop-blur-xl p-4 shadow-2xl max-w-xs',
              getSeverityColor(hoveredRisk.severity)
            )}>
              <div className="flex items-center gap-2 mb-2">
                {getSeverityIcon(hoveredRisk.severity)}
                <span className="text-white font-semibold text-sm">Security Risk Detected</span>
              </div>
              <div className="space-y-1 mb-3">
                {hoveredRisk.risks.map((risk, i) => (
                  <p key={i} className="text-white/90 text-xs">• {risk}</p>
                ))}
              </div>
              <div className="pt-2 border-t border-white/20">
                <p className="text-white/60 text-xs flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-purple-400" />
                  Select text to analyze impact
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection Toolbar */}
      <AnimatePresence>
        {showSelectionToolbar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', bounce: 0.4, duration: 0.3 }}
            className="fixed z-[10000]"
            style={{
              left: selectionToolbarPosition.x,
              top: selectionToolbarPosition.y,
              transform: 'translate(-50%, calc(-100% - 16px))'
            }}
          >
            <div className="flex items-center gap-2 bg-gradient-to-br from-purple-600 to-pink-600 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-2xl shadow-purple-500/40 border border-white/20">
              <button
                onClick={() => {
                  if (onTripleClick && selectedElement) {
                    onTripleClick(selectedElement, selectedText)
                    setShowSelectionToolbar(false)
                    window.getSelection()?.removeAllRanges()
                  }
                }}
                className="flex items-center gap-2 text-white hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all group"
              >
                <Sparkles className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold">Analyze Impact</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right-Click Context Menu */}
      <AnimatePresence>
        {showContextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[10000]"
            style={{
              left: contextMenuPosition.x,
              top: contextMenuPosition.y
            }}
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-2 min-w-[200px]">
              <button
                onClick={() => {
                  if (onTripleClick && contextSelectedElement) {
                    onTripleClick(contextSelectedElement, contextSelectedText)
                    setShowContextMenu(false)
                    window.getSelection()?.removeAllRanges()
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-colors text-left group"
              >
                <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Analyze Impact</div>
                  <div className="text-xs text-gray-500">AI-powered content analysis</div>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
