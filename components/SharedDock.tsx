'use client'

import Dock from '@/components/reactbits/components/Dock'
import { VscHome, VscCompass, VscGraph, VscFileMedia, VscDeviceCameraVideo, VscReferences } from 'react-icons/vsc'

export function SharedDock() {
  const dockItems = [
    {
      icon: <VscHome size={20} />,
      label: 'Home',
      onClick: () => window.dispatchEvent(new CustomEvent('browser:navigate', { detail: { url: '/' } }))
    },
    {
      icon: <VscCompass size={20} />,
      label: 'Discover',
      onClick: () => window.dispatchEvent(new CustomEvent('browser:navigate', { detail: { url: '/discover' } }))
    },
    {
      icon: <VscGraph size={20} />,
      label: 'Finance',
      onClick: () => window.dispatchEvent(new CustomEvent('browser:navigate', { detail: { url: '/finance' } }))
    },
    {
      icon: <VscFileMedia size={20} />,
      label: 'Images',
      onClick: () => window.dispatchEvent(new CustomEvent('browser:navigate', { detail: { url: '/images' } }))
    },
    {
      icon: <VscDeviceCameraVideo size={20} />,
      label: 'Videos',
      onClick: () => window.dispatchEvent(new CustomEvent('browser:navigate', { detail: { url: '/videos' } }))
    },
    {
      icon: <VscReferences size={20} />,
      label: 'Spaces',
      onClick: () => window.dispatchEvent(new CustomEvent('browser:navigate', { detail: { url: '/spaces' } }))
    },
  ]

  return (
    <Dock
      items={dockItems}
      panelHeight={68}
      baseItemSize={50}
      magnification={70}
      distance={200}
    />
  )
}
