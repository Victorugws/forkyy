'use client'

import { cn } from '@/lib/utils'

function IconLogo({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 256 256"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <defs>
        <linearGradient id="orbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        </linearGradient>
        <radialGradient id="orbHighlight" cx="40%" cy="40%" r="60%">
          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      {/* Main orb */}
      <circle cx="128" cy="128" r="100" fill="url(#orbGradient)" />
      {/* Highlight effect */}
      <circle cx="128" cy="128" r="100" fill="url(#orbHighlight)" />
      {/* AI Circuit rings */}
      <circle cx="128" cy="128" r="70" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
      <circle cx="128" cy="128" r="50" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
      {/* Center AI dot */}
      <circle cx="128" cy="128" r="12" fill="#ffffff" opacity="0.9" />
      {/* Orbital elements */}
      <circle cx="128" cy="58" r="6" fill="#ffffff" opacity="0.7" />
      <circle cx="198" cy="128" r="6" fill="#ffffff" opacity="0.7" />
      <circle cx="128" cy="198" r="6" fill="#ffffff" opacity="0.7" />
      <circle cx="58" cy="128" r="6" fill="#ffffff" opacity="0.7" />
    </svg>
  )
}

export { IconLogo }
