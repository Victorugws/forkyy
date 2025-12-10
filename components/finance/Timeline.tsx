'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

interface TimelineEvent {
  date: string
  title: string
  description: string
  type?: 'blue' | 'green'
}

interface TimelineProps {
  events: TimelineEvent[]
  className?: string
}

export function Timeline({ events, className = '' }: TimelineProps) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = itemRefs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, index]))
          }
        },
        {
          threshold: 0.2,
          rootMargin: '0px 0px -50px 0px'
        }
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [events])

  return (
    <div className={`relative ${className}`}>
      {/* Animated vertical line with gradient */}
      <motion.div
        className="absolute left-12 top-0 bottom-0 w-1"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.3), rgba(16, 185, 129, 0.3), rgba(59, 130, 246, 0.3))',
          transformOrigin: 'top',
          borderRadius: '4px'
        }}
      />
      
      <div className="space-y-10">
        {events.map((event, index) => {
          const isVisible = visibleItems.has(index)
          
          return (
            <div
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              className="relative flex items-start gap-6"
            >
              {/* Date and marker */}
              <div className="flex flex-col items-center min-w-[100px]">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-sm font-semibold text-foreground mb-3 px-3 py-1.5 rounded-lg neu-inset"
                >
                  {event.date}
                </motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1 + 0.2,
                    type: 'spring',
                    stiffness: 200
                  }}
                  className={`relative z-10 w-6 h-6 rounded-full border-4 border-background shadow-lg ${
                    event.type === 'green' 
                      ? 'bg-gradient-to-br from-green-400 to-green-600' 
                      : 'bg-gradient-to-br from-blue-400 to-blue-600'
                  }`}
                  style={{
                    marginTop: '4px',
                    boxShadow: event.type === 'green'
                      ? '0 4px 12px rgba(16, 185, 129, 0.4), 0 0 0 2px rgba(16, 185, 129, 0.1)'
                      : '0 4px 12px rgba(59, 130, 246, 0.4), 0 0 0 2px rgba(59, 130, 246, 0.1)'
                  }}
                >
                  {/* Inner glow */}
                  <div className="absolute inset-0 rounded-full bg-white/30 blur-sm" />
                </motion.div>
              </div>
              
              {/* Event card with neumorphic styling */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1 + 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="flex-1 neu-card p-6 rounded-2xl group cursor-pointer"
              >
                {/* Gradient accent line */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={isVisible ? { width: '100%' } : { width: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                  className={`h-1 rounded-full mb-4 ${
                    event.type === 'green'
                      ? 'bg-gradient-to-r from-green-400 to-green-600'
                      : 'bg-gradient-to-r from-blue-400 to-blue-600'
                  }`}
                />
                
                <h4 className="font-bold text-lg text-foreground mb-3 group-hover:text-primary transition-colors">
                  {event.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
                
                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    background: event.type === 'green'
                      ? 'radial-gradient(circle at center, rgba(16, 185, 129, 0.05), transparent)'
                      : 'radial-gradient(circle at center, rgba(59, 130, 246, 0.05), transparent)'
                  }}
                />
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

