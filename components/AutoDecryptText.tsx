'use client'

import { ReactNode, isValidElement, cloneElement, Children } from 'react'
import DecryptedText from './DecryptedText'

interface AutoDecryptTextProps {
  children: ReactNode
  autoInterval?: number
  className?: string
}

// Recursively process children and wrap text nodes
function processChildren(children: ReactNode, autoInterval: number): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === 'string') {
      // Wrap string children with DecryptedText
      return (
        <DecryptedText
          text={child}
          animateOn="auto"
          autoInterval={autoInterval}
        />
      )
    }
    
    if (isValidElement(child)) {
      // If it's a React element, recursively process its children
      if (child.props.children) {
        return cloneElement(child, {
          ...child.props,
          children: processChildren(child.props.children, autoInterval),
        } as any)
      }
      return child
    }
    
    return child
  })
}

export function AutoDecryptText({ 
  children, 
  autoInterval = 4000,
  className = '' 
}: AutoDecryptTextProps) {
  const processedChildren = processChildren(children, autoInterval)
  
  return <span className={className}>{processedChildren}</span>
}

