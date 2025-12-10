'use client'

import React, { useState } from 'react'
import { Scale, Briefcase, DollarSign, CheckSquare, Users, TrendingUp, Compass } from 'lucide-react'

interface ModeSelectionButtonsProps {
  onModeSelect: (mode: string) => void
  onAcknowledgement?: (message: string) => void
  onFinanceOverlay?: () => void
}

const modes = [
  { id: 'legality', label: 'Legality', message: 'Ready to legalize...', icon: Scale },
  { id: 'business', label: 'Business', message: 'Ready to businessize...', icon: Briefcase },
  { id: 'finance', label: 'Finance', message: 'Ready to financialize...', icon: DollarSign },
  { id: 'taskability', label: 'Taskability', message: 'Ready to taskify...', icon: CheckSquare },
  { id: 'socials', label: 'Socials', message: 'Ready to socialize...', icon: Users },
]

export function ModeSelectionButtons({ onModeSelect, onAcknowledgement, onFinanceOverlay }: ModeSelectionButtonsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleModeClick = (mode: typeof modes[0]) => {
    onModeSelect(mode.id)
    onAcknowledgement?.(mode.message)
    setIsOpen(false)
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

  const handleDiscoverClick = () => {
    window.dispatchEvent(new CustomEvent('browser:navigate', {
      detail: { url: '/discover' }
    }))
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
      {/* Main Button - Neumorphic */}
      <button
        onClick={() => setIsOpen(!isOpen)}
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height="20" width="20">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"></path>
        </svg>
      </button>
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

        {/* Discover Button */}
        <button
          className="button discover-link-button"
          onClick={handleDiscoverClick}
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
            transform: isOpen ? 'translate(-70px, 0px)' : 'translate(0, 0)',
            transitionDelay: isOpen ? '0.2s, 0s, 0.2s' : '0s',
          }}
        >
          <Compass className="size-5 text-gray-700" />
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
        .legality-button:hover {
          background: #6366f1;
        }
        .business-button:hover {
          background: #10b981;
        }
        .finance-button:hover {
          background: #f59e0b;
        }
        .taskability-button:hover {
          background: #8b5cf6;
        }
        .socials-button:hover {
          background: #ec4899;
        }
        .finance-link-button:hover {
          background: #3b82f6;
        }
        .discover-link-button:hover {
          background: #8b5cf6;
        }
      `}</style>
    </div>
  )
}

