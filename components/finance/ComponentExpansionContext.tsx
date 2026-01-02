'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface ComponentData {
  id: string
  title: string
  type: string
  data: any
  component: ReactNode
}

interface ComponentExpansionContextType {
  expandedComponent: ComponentData | null
  expandComponent: (data: ComponentData) => void
  closeExpanded: () => void
  isExpanded: boolean
}

const ComponentExpansionContext = createContext<ComponentExpansionContextType | undefined>(undefined)

export function ComponentExpansionProvider({ children }: { children: ReactNode }) {
  const [expandedComponent, setExpandedComponent] = useState<ComponentData | null>(null)

  const expandComponent = useCallback((data: ComponentData) => {
    setExpandedComponent(data)
  }, [])

  const closeExpanded = useCallback(() => {
    setExpandedComponent(null)
  }, [])

  return (
    <ComponentExpansionContext.Provider
      value={{
        expandedComponent,
        expandComponent,
        closeExpanded,
        isExpanded: expandedComponent !== null
      }}
    >
      {children}
    </ComponentExpansionContext.Provider>
  )
}

export function useComponentExpansion() {
  const context = useContext(ComponentExpansionContext)
  if (context === undefined) {
    throw new Error('useComponentExpansion must be used within a ComponentExpansionProvider')
  }
  return context
}

