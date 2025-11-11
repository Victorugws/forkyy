'use client'

import { usePrePrompt } from './chat'

interface AppSidebarClientProps {
  children: React.ReactNode
}

export function AppSidebarClient({ children }: AppSidebarClientProps) {
  const isPrePrompt = usePrePrompt()

  if (isPrePrompt) {
    return null
  }

  return <>{children}</>
}