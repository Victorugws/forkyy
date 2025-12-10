'use client'

import { useEffect } from 'react'
import DecryptedText from './DecryptedText'

export function TextDecryptProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // This will be handled by CSS and a global script
    // For now, we'll rely on components using DecryptedText directly
  }, [])

  return <>{children}</>
}

