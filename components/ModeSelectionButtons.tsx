'use client'

import React, { useState } from 'react'
import { Globe, DollarSign, Presentation, Briefcase, Newspaper, Search, Target, TrendingUp, Rocket } from 'lucide-react'

interface ModeSelectionButtonsProps {
  onModeSelect: (mode: string) => void
  onAcknowledgement?: (message: string) => void
  onFinanceOverlay?: () => void
  onAutopilotDoubleClick?: () => void
}

const modes = [
  { id: 'webapp', label: 'Web app', message: 'Ready to webify...', icon: Globe },
  { id: 'finance', label: 'Finance', message: 'Ready to financialize...', icon: DollarSign },
  { id: 'slides', label: 'Slides', message: 'Ready to slideify...', icon: Presentation },
  { id: 'service', label: 'Service', message: 'Ready to servicize...', icon: Briefcase },
  { id: 'news', label: 'News', message: 'Ready to newsify...', icon: Newspaper },
  { id: 'research', label: 'Research', message: 'Ready to researchify...', icon: Search },
  { id: 'strategy', label: 'Strategy', message: 'Ready to strategize...', icon: Target },
]

export function ModeSelectionButtons({ onModeSelect, onAcknowledgement, onFinanceOverlay, onAutopilotDoubleClick }: ModeSelectionButtonsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [doubleClickTimer, setDoubleClickTimer] = useState<NodeJS.Timeout | null>(null)

  const handleModeClick = (mode: typeof modes[0]) => {
    onModeSelect(mode.id)
    onAcknowledgement?.(mode.message)
    setIsOpen(false)
  }

  const handleMainButtonClick = () => {
    if (doubleClickTimer) {
      // Double click detected
      clearTimeout(doubleClickTimer)
      setDoubleClickTimer(null)
      onAutopilotDoubleClick?.()
      setIsOpen(false)
    } else {
      // Single click - toggle open/close
      setIsOpen(!isOpen)
      const timer = setTimeout(() => {
        setDoubleClickTimer(null)
      }, 300)
      setDoubleClickTimer(timer)
    }
  }

  const handleFinanceClick = () => {
    if (onFinanceOverlay) {
      onFinanceOverlay()
    } else {
      window.dispatchEvent(new CustomEvent('browser:navigate', {
        detail: { url: '/finance' }
      }))
    }
  }


  return (
    <div 
      className="buttons"
      style={{
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        height: 'fit-content',
        width: 'fit-content',
        transition: '0.3s',
        borderRadius: '50%',
        padding: isOpen ? '60px' : '0',
      }}
    >
      {/* Main Button - Neumorphic with Autopilot Logo when open */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={handleMainButtonClick}
          className="main-button"
          style={{
            position: 'relative',
            display: 'grid',
            placeItems: 'center',
            padding: '10px',
            border: 'none',
            background: '#e8e8e8',
            boxShadow: '5px 5px 12px #cacaca, -5px -5px 12px #ffffff',
            borderRadius: '50%',
            transition: '0.2s',
            zIndex: 100,
            width: '48px',
            height: '48px',
            cursor: 'pointer',
          }}
        >
          <Rocket className="size-5 text-gray-700" />
        </button>
      </div>
        {/* Finance Button */}
        <button
          className="button finance-link-button"
          onClick={handleFinanceClick}
          style={{
            position: 'absolute',
            display: 'grid',
            placeItems: 'center',
            padding: '10px',
            border: 'none',
            background: '#e8e8e8',
            boxShadow: isOpen
              ? '5px 5px 12px #cacaca, -5px -5px 12px #ffffff'
              : '5px 5px 12px rgba(202, 202, 202, 0), -5px -5px 12px rgba(255, 255, 255, 0)',
            transition: '0.3s',
            transitionProperty: 'transform, opacity, background, box-shadow',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            cursor: 'pointer',
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            transform: isOpen ? 'translate(70px, 0px)' : 'translate(0, 0)',
            transitionDelay: isOpen ? '0.1s, 0s, 0.1s' : '0s',
          }}
        >
          <TrendingUp className="size-5 text-gray-700" />
        </button>


        {/* Mode Buttons - Positioned in circular pattern */}
        {modes.map((mode, index) => {
          // Calculate positions based on the CSS pattern from the user
          const positions = [
            { x: 47, y: -47 },  // Top-right diagonal
            { x: 0, y: -70 },   // Top
            { x: -47, y: -47 }, // Top-left diagonal
            { x: -70, y: 0 },   // Left
            { x: -47, y: 47 },  // Bottom-left diagonal
            { x: 0, y: 70 },    // Bottom
            { x: 47, y: 47 },   // Bottom-right diagonal
          ]
          
          const pos = positions[index] || { x: 0, y: 0 }

          return (
            <button
              key={mode.id}
              className={`button ${mode.id}-button`}
              onClick={() => handleModeClick(mode)}
              style={{
                position: 'absolute',
                display: 'grid',
                placeItems: 'center',
                padding: '10px',
                border: 'none',
                background: '#e8e8e8',
                boxShadow: isOpen
                  ? '5px 5px 12px #cacaca, -5px -5px 12px #ffffff'
                  : '5px 5px 12px rgba(202, 202, 202, 0), -5px -5px 12px rgba(255, 255, 255, 0)',
                transition: '0.3s',
                transitionProperty: 'transform, opacity, background, box-shadow',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                cursor: 'pointer',
                opacity: isOpen ? 1 : 0,
                pointerEvents: isOpen ? 'auto' : 'none',
                transform: isOpen ? `translate(${pos.x}px, ${pos.y}px)` : 'translate(0, 0)',
                transitionDelay: isOpen ? `${(index + 3) * 0.1}s, 0s, ${(index + 3) * 0.1}s` : '0s',
              }}
            >
              <mode.icon className="size-5 text-gray-700" />
            </button>
          )
        })}
      
      <style jsx>{`
        .buttons:hover .button {
          box-shadow: 5px 5px 12px #cacaca, -5px -5px 12px #ffffff;
        }
        .main-button:hover {
          box-shadow: 6px 6px 14px #cacaca, -6px -6px 14px #ffffff;
        }
        .main-button:active {
          box-shadow: inset 5px 5px 12px #cacaca, inset -5px -5px 12px #ffffff;
        }
        .button:hover {
          box-shadow: 6px 6px 14px #cacaca, -6px -6px 14px #ffffff;
        }
        .webapp-button:hover {
          background: #3b82f6;
        }
        .finance-button:hover {
          background: #f59e0b;
        }
        .slides-button:hover {
          background: #8b5cf6;
        }
        .service-button:hover {
          background: #10b981;
        }
        .news-button:hover {
          background: #ef4444;
        }
        .research-button:hover {
          background: #6366f1;
        }
        .strategy-button:hover {
          background: #ec4899;
        }
        .finance-link-button:hover {
          background: #3b82f6;
        }
      `}</style>
    </div>
  )
}

