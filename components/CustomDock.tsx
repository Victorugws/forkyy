'use client'

import { motion, useMotionValue } from 'motion/react'
import {
  VscHome,
  VscCompass,
  VscGraph,
  VscShare,
  VscRocket,
  VscLaw,
  VscVerified,
  VscTools,
  VscOrganization,
  VscBriefcase,
  VscBeaker,
  VscBook,
  VscGlobe
} from 'react-icons/vsc'
import {
  RiDiscordFill,
  RiTwitterXFill,
  RiRedditFill,
  RiMessengerFill,
  RiPinterestFill,
  RiInstagramFill,
  RiSnapchatFill,
  RiWhatsappFill
} from 'react-icons/ri'
import { RadialExpandButton, type RadialButtonOption } from './RadialExpandButton'

interface DockItemProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

function DockItem({ icon, label, onClick }: DockItemProps) {
  return (
    <button
      onClick={onClick}
      className="relative group flex flex-col items-center justify-center w-[50px] h-[50px] rounded-full bg-[#060010] border-neutral-700 border-2 shadow-md text-white hover:scale-110 transition-transform duration-200"
      aria-label={label}
    >
      <div className="flex items-center justify-center text-white">
        {icon}
      </div>
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#060010] border border-neutral-700 rounded-md text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label}
      </div>
    </button>
  )
}

export function CustomDock() {
  const mouseX = useMotionValue(Infinity)

  // Autopilot options
  const autopilotOptions: RadialButtonOption[] = [
    {
      icon: <VscLaw size={20} />,
      label: 'Legality',
      onClick: () => {
        window.dispatchEvent(new CustomEvent('browser:navigate', {
          detail: { url: '/autopilot?mode=legality' }
        }))
      }
    },
    {
      icon: <VscVerified size={20} />,
      label: 'Veracity',
      onClick: () => {
        window.dispatchEvent(new CustomEvent('browser:navigate', {
          detail: { url: '/autopilot?mode=veracity' }
        }))
      }
    },
    {
      icon: <VscTools size={20} />,
      label: 'Engineering',
      onClick: () => {
        window.dispatchEvent(new CustomEvent('browser:navigate', {
          detail: { url: '/autopilot?mode=engineering' }
        }))
      }
    },
    {
      icon: <VscOrganization size={20} />,
      label: 'Business',
      onClick: () => {
        window.dispatchEvent(new CustomEvent('browser:navigate', {
          detail: { url: '/autopilot?mode=business' }
        }))
      }
    },
    {
      icon: <VscBriefcase size={20} />,
      label: 'Marketing',
      onClick: () => {
        window.dispatchEvent(new CustomEvent('browser:navigate', {
          detail: { url: '/autopilot?mode=marketing' }
        }))
      }
    },
    {
      icon: <VscBeaker size={20} />,
      label: 'Research',
      onClick: () => {
        window.dispatchEvent(new CustomEvent('browser:navigate', {
          detail: { url: '/autopilot?mode=research' }
        }))
      }
    },
    {
      icon: <VscBook size={20} />,
      label: 'Documentation',
      onClick: () => {
        window.dispatchEvent(new CustomEvent('browser:navigate', {
          detail: { url: '/autopilot?mode=documentation' }
        }))
      }
    },
    {
      icon: <VscGlobe size={20} />,
      label: 'Deployment',
      onClick: () => {
        window.dispatchEvent(new CustomEvent('browser:navigate', {
          detail: { url: '/autopilot?mode=deployment' }
        }))
      }
    }
  ]

  // Social media options
  const socialOptions: RadialButtonOption[] = [
    {
      icon: <RiDiscordFill size={20} />,
      label: 'Discord',
      onClick: () => handleSocialSelect('discord'),
      color: '#5865F2'
    },
    {
      icon: <RiTwitterXFill size={20} />,
      label: 'Twitter',
      onClick: () => handleSocialSelect('twitter'),
      color: '#1CA1F1'
    },
    {
      icon: <RiRedditFill size={20} />,
      label: 'Reddit',
      onClick: () => handleSocialSelect('reddit'),
      color: '#FF4500'
    },
    {
      icon: <RiMessengerFill size={20} />,
      label: 'Messenger',
      onClick: () => handleSocialSelect('messenger'),
      color: '#0093FF'
    },
    {
      icon: <RiPinterestFill size={20} />,
      label: 'Pinterest',
      onClick: () => handleSocialSelect('pinterest'),
      color: '#F0002A'
    },
    {
      icon: <RiInstagramFill size={20} />,
      label: 'Instagram',
      onClick: () => handleSocialSelect('instagram'),
      color: '#F914AF'
    },
    {
      icon: <RiSnapchatFill size={20} />,
      label: 'Snapchat',
      onClick: () => handleSocialSelect('snapchat'),
      color: '#FFFC00'
    },
    {
      icon: <RiWhatsappFill size={20} />,
      label: 'WhatsApp',
      onClick: () => handleSocialSelect('whatsapp'),
      color: '#25D366'
    }
  ]

  const handleSocialSelect = (platform: string) => {
    window.dispatchEvent(new CustomEvent('browser:navigate', {
      detail: { url: `/social?platforms=${platform}` }
    }))
  }

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none flex items-end h-[256px]">
      <motion.div
        onMouseMove={({ pageX }) => {
          mouseX.set(pageX)
        }}
        onMouseLeave={() => {
          mouseX.set(Infinity)
        }}
        className="flex items-center gap-4 rounded-2xl border-neutral-700 border-2 bg-black/80 backdrop-blur-md p-4 mb-4 pointer-events-auto shadow-2xl"
        role="toolbar"
        aria-label="Application dock"
      >
        {/* Home */}
        <DockItem
          icon={<VscHome size={20} />}
          label="Home"
          onClick={() => window.dispatchEvent(new CustomEvent('browser:navigate', { detail: { url: '/' } }))}
        />

        {/* Discover */}
        <DockItem
          icon={<VscCompass size={20} />}
          label="Discover"
          onClick={() => window.dispatchEvent(new CustomEvent('browser:navigate', { detail: { url: '/discover' } }))}
        />

        {/* Autopilot - Radial Expand */}
        <div className="flex items-center">
          <RadialExpandButton
            mainIcon={<VscRocket size={20} />}
            mainLabel="Autopilot"
            options={autopilotOptions}
            tooltip="Autopilot handles everything needed for your startup - Click to expand"
          />
        </div>

        {/* Social - Radial Expand */}
        <div className="flex items-center">
          <RadialExpandButton
            mainIcon={<VscShare size={20} />}
            mainLabel="Social"
            options={socialOptions}
            tooltip="Share to social media platforms - Click to expand"
          />
        </div>

        {/* Finance */}
        <DockItem
          icon={<VscGraph size={20} />}
          label="Finance"
          onClick={() => window.dispatchEvent(new CustomEvent('browser:navigate', { detail: { url: '/finance' } }))}
        />
      </motion.div>
    </div>
  )
}
