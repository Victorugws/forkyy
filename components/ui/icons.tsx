'use client'

import { cn } from '@/lib/utils'

interface IconWrapperProps {
  children: React.ReactNode
  className?: string
  isLogo?: boolean // true for brand logos, false for UI icons
}

/**
 * Neumorphic icon wrapper with glassmorphic shadow effect
 * - For UI icons: Black background with white phosphor icons
 * - For logos: Preserve original colors, apply shadow/gradient with lighting effect
 */
function IconWrapper({ children, className, isLogo = false }: IconWrapperProps) {
  return (
    <div
      className={cn('icon-wrapper', isLogo && 'icon-wrapper-logo', className)}
      style={{
        boxSizing: 'border-box',
        width: 'min-content',
        height: 'min-content',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isLogo ? '4px' : '8px 10px',
        boxShadow: `
          0px 0.7065919983928324px 0.7065919983928324px -0.5416666666666666px rgba(171, 171, 171, 0.64),
          0px 1.8065619053231785px 1.8065619053231785px -1.0833333333333333px rgba(171, 171, 171, 0.63),
          0px 3.6217592146567767px 3.6217592146567767px -1.625px rgba(171, 171, 171, 0.61),
          0px 6.8655999097303715px 6.8655999097303715px -2.1666666666666665px rgba(171, 171, 171, 0.58),
          0px 13.646761411524492px 13.646761411524492px -2.7083333333333335px rgba(171, 171, 171, 0.51),
          0px 30px 30px -3.25px rgba(171, 171, 171, 0.35)
        `,
        background: isLogo
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 50%, rgb(255, 255, 255) 170%)'
          : 'linear-gradient(180deg, #000000 0%, rgb(255, 255, 255) 170%)',
        overflow: 'visible',
        alignContent: 'center',
        flexWrap: 'nowrap',
        gap: 0,
        borderRadius: '10px',
        position: 'relative',
      }}
    >
      {isLogo && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)',
            borderRadius: '10px',
            pointerEvents: 'none',
          }}
        />
      )}
      <div className={cn(!isLogo && 'text-white')} style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}

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

export { IconLogo, IconWrapper }
