'use client'

import { useEffect, useRef } from 'react'
import DecryptedText from './DecryptedText'

interface GlobalTextWrapperProps {
  children: React.ReactNode
  autoInterval?: number
}

// Recursively wrap text nodes with DecryptedText
function wrapTextNodes(node: Node, autoInterval: number): void {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim()
    if (text && text.length > 0 && !node.parentElement?.classList.contains('decrypted-text-wrapper')) {
      const span = document.createElement('span')
      span.className = 'decrypted-text-wrapper inline'
      span.setAttribute('data-text', text)
      node.parentNode?.replaceChild(span, node)
      
      // We'll handle the actual wrapping in the effect
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element
    // Skip certain elements that shouldn't be wrapped
    if (
      element.tagName === 'SCRIPT' ||
      element.tagName === 'STYLE' ||
      element.tagName === 'NOSCRIPT' ||
      element.classList.contains('no-decrypt') ||
      element.closest('.no-decrypt')
    ) {
      return
    }
    
    // Recursively process child nodes
    Array.from(element.childNodes).forEach(child => {
      wrapTextNodes(child, autoInterval)
    })
  }
}

export function GlobalTextWrapper({ children, autoInterval = 4000 }: GlobalTextWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<MutationObserver | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const processTextNodes = () => {
      const walker = document.createTreeWalker(
        containerRef.current!,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const text = node.textContent?.trim()
            if (!text || text.length === 0) return NodeFilter.FILTER_REJECT
            if (node.parentElement?.classList.contains('decrypted-text-wrapper')) {
              return NodeFilter.FILTER_REJECT
            }
            if (node.parentElement?.tagName === 'SCRIPT' || 
                node.parentElement?.tagName === 'STYLE' ||
                node.parentElement?.closest('.no-decrypt')) {
              return NodeFilter.FILTER_REJECT
            }
            return NodeFilter.FILTER_ACCEPT
          }
        }
      )

      const textNodes: Text[] = []
      let node
      while (node = walker.nextNode()) {
        textNodes.push(node as Text)
      }

      textNodes.forEach(textNode => {
        const text = textNode.textContent?.trim()
        if (!text || text.length === 0) return

        const parent = textNode.parentElement
        if (!parent || parent.classList.contains('decrypted-text-wrapper')) return

        // Create wrapper span
        const wrapper = document.createElement('span')
        wrapper.className = 'decrypted-text-wrapper inline'
        wrapper.setAttribute('data-text', text)
        
        // Replace text node with wrapper
        textNode.parentNode?.replaceChild(wrapper, textNode)
      })
    }

    // Initial processing
    processTextNodes()

    // Observe DOM changes
    observerRef.current = new MutationObserver(() => {
      processTextNodes()
    })

    observerRef.current.observe(containerRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="decrypted-text-container">
      {children}
      <style jsx global>{`
        .decrypted-text-wrapper {
          display: inline;
        }
        .decrypted-text-wrapper[data-text]::before {
          content: attr(data-text);
        }
      `}</style>
    </div>
  )
}

// Alternative: Component that wraps specific text content
export function AutoDecryptText({ 
  children, 
  autoInterval = 4000,
  className = '' 
}: { 
  children: React.ReactNode
  autoInterval?: number
  className?: string
}) {
  if (typeof children === 'string') {
    return (
      <DecryptedText
        text={children}
        animateOn="auto"
        autoInterval={autoInterval}
        className={className}
      />
    )
  }
  
  return <span className={className}>{children}</span>
}

