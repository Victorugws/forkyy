'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import { Shield, AlertTriangle, Eye, Cookie, Database, Lock, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'motion/react'

export interface SecurityThreat {
  type: 'tracker' | 'cookie' | 'script' | 'iframe' | 'request'
  severity: 'low' | 'medium' | 'high'
  description: string
  element?: string
  timestamp: number
}

export interface RiskyElement {
  element: HTMLElement
  risks: string[]
  severity: 'low' | 'medium' | 'high'
}

interface DynamicIslandProps {
  pageUrl: string
  pageContent?: string
  onAnalyzeElement?: (element: HTMLElement) => void
}

type IslandView = 'compact' | 'expanded'

export function DynamicIsland({ pageUrl, pageContent, onAnalyzeElement }: DynamicIslandProps) {
  const [view, setView] = useState<IslandView>('compact')
  const [threats, setThreats] = useState<SecurityThreat[]>([])
  const [blockedCount, setBlockedCount] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [hoveredElement, setHoveredElement] = useState<RiskyElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const scanIntervalRef = useRef<NodeJS.Timeout>()
  const isExpanded = view === 'expanded'

  // Security scanning - detect trackers, third-party scripts, suspicious elements
  useEffect(() => {
    if (!pageUrl || pageUrl.startsWith('/')) return // Only scan external URLs

    const performSecurityScan = () => {
      setScanning(true)
      const detectedThreats: SecurityThreat[] = []
      let blocked = 0

      // Scan for third-party scripts
      const scripts = document.querySelectorAll('script[src]')
      scripts.forEach(script => {
        const src = script.getAttribute('src')
        if (src && isThirdPartyScript(src, pageUrl)) {
          detectedThreats.push({
            type: 'script',
            severity: 'medium',
            description: `Third-party script from ${new URL(src, pageUrl).hostname}`,
            element: src,
            timestamp: Date.now()
          })
          blocked++
        }
      })

      // Scan for tracking cookies
      const cookies = document.cookie.split(';')
      if (cookies.length > 5) {
        detectedThreats.push({
          type: 'cookie',
          severity: 'low',
          description: `${cookies.length} cookies detected`,
          timestamp: Date.now()
        })
        blocked += Math.floor(cookies.length / 2)
      }

      // Scan for iframes (potential trackers)
      const iframes = document.querySelectorAll('iframe')
      iframes.forEach(iframe => {
        const src = iframe.getAttribute('src')
        if (src && isThirdPartyDomain(src, pageUrl)) {
          detectedThreats.push({
            type: 'iframe',
            severity: 'high',
            description: `Embedded content from ${new URL(src, pageUrl).hostname}`,
            element: src,
            timestamp: Date.now()
          })
          blocked++
        }
      })

      // Scan for tracking pixels
      const images = document.querySelectorAll('img[src]')
      images.forEach(img => {
        const src = img.getAttribute('src')
        if (src && (src.includes('track') || src.includes('pixel') || src.includes('analytics'))) {
          detectedThreats.push({
            type: 'tracker',
            severity: 'medium',
            description: 'Tracking pixel detected',
            element: src,
            timestamp: Date.now()
          })
          blocked++
        }
      })

      setThreats(detectedThreats)
      setBlockedCount(blocked)
      setScanning(false)
    }

    // Initial scan
    setTimeout(performSecurityScan, 1000)

    // Periodic scanning
    scanIntervalRef.current = setInterval(performSecurityScan, 5000)

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
      }
    }
  }, [pageUrl])

  // Helper: Check if script is third-party
  const isThirdPartyScript = (scriptSrc: string, pageUrl: string): boolean => {
    try {
      const scriptDomain = new URL(scriptSrc, pageUrl).hostname
      const pageDomain = new URL(pageUrl).hostname
      return scriptDomain !== pageDomain
    } catch {
      return false
    }
  }

  // Helper: Check if domain is third-party
  const isThirdPartyDomain = (url: string, pageUrl: string): boolean => {
    try {
      const urlDomain = new URL(url, pageUrl).hostname
      const pageDomain = new URL(pageUrl).hostname
      return urlDomain !== pageDomain
    } catch {
      return false
    }
  }

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-blue-500'
      default: return 'text-gray-500'
    }
  }

  // Get threat icon
  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'tracker': return Eye
      case 'cookie': return Cookie
      case 'script': return Database
      case 'iframe': return AlertTriangle
      default: return Shield
    }
  }

  // Don't show on internal pages
  if (!pageUrl || pageUrl.startsWith('/')) {
    return null
  }

  return (
    <>
      {/* Main Dynamic Island */}
      <motion.div
        className={cn(
          'fixed top-4 left-1/2 -translate-x-1/2 z-[99999]',
          'cursor-pointer'
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0.5 }}
      >
        <motion.div
          className={cn(
            'relative overflow-hidden',
            'bg-black/90 backdrop-blur-xl border border-white/10',
            'shadow-2xl shadow-black/50'
          )}
          layout
          style={{ borderRadius: 32 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          onClick={() => setView(view === 'compact' ? 'expanded' : 'compact')}
        >
          {/* Compact State */}
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              <motion.div
                key="compact"
                initial={{ scale: 0.9, opacity: 0, filter: 'blur(5px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                exit={{ scale: 0.9, opacity: 0, filter: 'blur(5px)' }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.05 }}
                className="flex items-center gap-3 px-6 py-3"
              >
                <Shield className={cn(
                  'h-5 w-5',
                  blockedCount > 10 ? 'text-red-400' : blockedCount > 5 ? 'text-yellow-400' : 'text-green-400'
                )} />
                <div className="flex flex-col">
                  <span className="text-white text-sm font-semibold pointer-events-none">
                    {blockedCount} blocked
                  </span>
                  <span className="text-white/60 text-xs pointer-events-none">
                    {scanning ? 'Scanning...' : 'Protected'}
                  </span>
                </div>
              </motion.div>
            ) : (
              /* Expanded State */
              <motion.div
                key="expanded"
                initial={{ scale: 0.9, opacity: 0, filter: 'blur(5px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                exit={{ scale: 0.9, opacity: 0, filter: 'blur(5px)' }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.05 }}
                className="p-6 w-[450px]"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-green-400" />
                    <div>
                      <h3 className="text-white font-semibold">Security Shield</h3>
                      <p className="text-white/60 text-xs">Active Protection</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setView('compact')
                    }}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="text-2xl font-bold text-white">{blockedCount}</div>
                    <div className="text-xs text-white/60">Blocked</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="text-2xl font-bold text-green-400">{threats.filter(t => t.severity === 'high').length}</div>
                    <div className="text-xs text-white/60">High Risk</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="text-2xl font-bold text-yellow-400">{threats.filter(t => t.severity === 'medium').length}</div>
                    <div className="text-xs text-white/60">Medium</div>
                  </div>
                </div>

                {/* Threats List */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {threats.slice(0, 10).map((threat, index) => {
                    const Icon = getThreatIcon(threat.type)
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <Icon className={cn('h-4 w-4 mt-0.5', getSeverityColor(threat.severity))} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium">{threat.description}</p>
                          {threat.element && (
                            <p className="text-white/40 text-xs truncate mt-1">{threat.element}</p>
                          )}
                        </div>
                        <div className={cn(
                          'px-2 py-1 rounded text-xs font-medium',
                          threat.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                          threat.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        )}>
                          {threat.severity}
                        </div>
                      </div>
                    )
                  })}

                  {threats.length === 0 && (
                    <div className="text-center py-8">
                      <Lock className="h-12 w-12 text-green-400 mx-auto mb-2" />
                      <p className="text-white/60">No threats detected</p>
                      <p className="text-white/40 text-xs mt-1">You're browsing safely</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Hover Tooltip for Risky Elements */}
      <AnimatePresence>
        {hoveredElement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[100000] pointer-events-none"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: 'translate(-50%, -100%) translateY(-10px)'
            }}
          >
            <div className="bg-black/90 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 shadow-2xl max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={cn('h-4 w-4', getSeverityColor(hoveredElement.severity))} />
                <span className="text-white font-semibold text-sm">Security Risk</span>
              </div>
              <div className="space-y-1">
                {hoveredElement.risks.map((risk, i) => (
                  <p key={i} className="text-white/80 text-xs">• {risk}</p>
                ))}
              </div>
              <p className="text-white/40 text-xs mt-2">Triple-click for detailed analysis</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  )
}
