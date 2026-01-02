'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface RadialButtonOption {
  icon: React.ReactNode
  label: string
  onClick: () => void
  color?: string
}

interface RadialExpandButtonProps {
  mainIcon: React.ReactNode
  mainLabel: string
  options: RadialButtonOption[]
  tooltip?: string
  size?: number
}

export function RadialExpandButton({
  mainIcon,
  mainLabel,
  options,
  tooltip,
  size = 50
}: RadialExpandButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleMainClick = () => {
    setIsExpanded(!isExpanded)
  }

  const handleOptionClick = (onClick: () => void) => {
    onClick()
    setIsExpanded(false)
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      {showTooltip && tooltip && !isExpanded && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none z-50">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900" />
        </div>
      )}

      {/* Container that expands on hover */}
      <div
        className={cn(
          "relative transition-all duration-300 rounded-full",
          isExpanded ? "p-[60px]" : "p-0"
        )}
      >
        {/* Main button */}
        <button
          onClick={handleMainClick}
          className="relative z-[100] grid place-items-center p-2.5 border-none bg-black shadow-[5px_5px_12px_#cacaca,-5px_-5px_12px_#ffffff] rounded-full transition-all duration-200 hover:scale-110"
          style={{ width: size, height: size }}
          aria-label={mainLabel}
        >
          <div className="text-white">
            {mainIcon}
          </div>
        </button>

        {/* Option buttons */}
        {options.map((option, index) => {
          const angle = (360 / options.length) * index
          const radians = (angle * Math.PI) / 180
          const distance = 70 // Distance from center

          const x = Math.cos(radians) * distance
          const y = Math.sin(radians) * distance

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(option.onClick)}
              className={cn(
                "absolute grid place-items-center p-2.5 border-none bg-black rounded-full transition-all duration-300",
                isExpanded
                  ? "shadow-[5px_5px_12px_#cacaca,-5px_-5px_12px_#ffffff] opacity-100"
                  : "shadow-[5px_5px_12px_rgba(202,202,202,0),-5px_-5px_12px_rgba(255,255,255,0)] opacity-0"
              )}
              style={{
                width: size,
                height: size,
                transform: isExpanded
                  ? `translate(${x}px, ${y}px)`
                  : 'translate(0px, 0px)',
                transitionDelay: isExpanded ? `${index * 0.05}s` : '0s',
                top: '50%',
                left: '50%',
                marginLeft: -size / 2,
                marginTop: -size / 2,
                backgroundColor: option.color || '#000000'
              }}
              aria-label={option.label}
            >
              <div className="text-white">
                {option.icon}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
