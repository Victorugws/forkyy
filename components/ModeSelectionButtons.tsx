'use client'

import React, { useState } from 'react'
import { 
  Heart, 
  Sprout, 
  GraduationCap, 
  Home, 
  ShoppingCart, 
  Zap, 
  Utensils, 
  DollarSign, 
  Target, 
  Rocket 
} from 'lucide-react'

interface ModeSelectionButtonsProps {
  onModeSelect: (mode: string) => void
  onAcknowledgement?: (message: string) => void
  onAutopilotDoubleClick?: () => void
}

const modes = [
  { id: 'healthcare', label: 'Healthcare', message: 'Ready to healthify...', icon: Heart },
  { id: 'agriculture', label: 'Agriculture', message: 'Ready to cultivate...', icon: Sprout },
  { id: 'education', label: 'Education', message: 'Ready to educate...', icon: GraduationCap },
  { id: 'realestate', label: 'Real Estate', message: 'Ready to propertyfy...', icon: Home },
  { id: 'ecommerce', label: 'E-commerce', message: 'Ready to commercialize...', icon: ShoppingCart },
  { id: 'energy', label: 'Energy', message: 'Ready to energize...', icon: Zap },
  { id: 'foodbeverage', label: 'Food & Beverage', message: 'Ready to serve...', icon: Utensils },
  { id: 'finance', label: 'Finance', message: 'Ready to financialize...', icon: DollarSign },
  { id: 'strategy', label: 'Strategy', message: 'Ready to strategize...', icon: Target },
]

export function ModeSelectionButtons({ onModeSelect, onAcknowledgement, onAutopilotDoubleClick }: ModeSelectionButtonsProps) {
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
        padding: isOpen ? '90px' : '0', // Increased padding for better spacing
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
            background: '#000000',
            boxShadow: '5px 5px 12px #cacaca, -5px -5px 12px #ffffff',
            borderRadius: '50%',
            transition: '0.2s',
            zIndex: 100,
            width: '48px',
            height: '48px',
            cursor: 'pointer',
          }}
        >
          <Rocket className="size-5 text-white" />
        </button>
      </div>

        {/* Mode Buttons - Positioned in circular pattern with better spacing */}
        {modes.map((mode, index) => {
          // Calculate positions for 9 modes in circular pattern with improved spacing
          // Using larger radius and better angular distribution
          const radius = 85 // Increased from 70 for better spacing
          const angleStep = (2 * Math.PI) / modes.length
          const startAngle = -Math.PI / 2 // Start at top
          
          const angle = startAngle + (index * angleStep)
          const x = Math.round(radius * Math.cos(angle))
          const y = Math.round(radius * Math.sin(angle))
          
          const pos = { x, y }

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
                background: '#000000',
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
              <mode.icon className="size-5 text-white" />
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
        .healthcare-button:hover {
          background: #ef4444;
        }
        .agriculture-button:hover {
          background: #10b981;
        }
        .education-button:hover {
          background: #3b82f6;
        }
        .realestate-button:hover {
          background: #f59e0b;
        }
        .ecommerce-button:hover {
          background: #8b5cf6;
        }
        .energy-button:hover {
          background: #fbbf24;
        }
        .foodbeverage-button:hover {
          background: #f97316;
        }
        .finance-button:hover {
          background: #06b6d4;
        }
        .strategy-button:hover {
          background: #ec4899;
        }
      `}</style>
    </div>
  )
}

