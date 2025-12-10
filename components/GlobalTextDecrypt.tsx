'use client'

import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import DecryptedText from './DecryptedText'

export function GlobalTextDecrypt() {
  const processedRef = useRef<WeakSet<Element>>(new WeakSet())
  const rootsRef = useRef<Map<Element, any>>(new Map())

  useEffect(() => {
    const processTextNodes = () => {
      const walker = document.createTreeWalker(
        document.body,
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
        if (!parent || processedRef.current.has(parent)) return

        // Mark parent as processed
        processedRef.current.add(parent)

        // Create wrapper element
        const wrapper = document.createElement('span')
        wrapper.className = 'decrypted-text-wrapper inline'
        
        // Replace text node with wrapper
        textNode.parentNode?.replaceChild(wrapper, textNode)
        
        // Render DecryptedText component into wrapper
        const root = createRoot(wrapper)
        root.render(
          <DecryptedText
            text={text}
            animateOn="auto"
            autoInterval={4000}
          />
        )
        rootsRef.current.set(wrapper, root)
      })
    }

    // Process on mount
    const timer = setTimeout(processTextNodes, 100)
    const interval = setInterval(processTextNodes, 2000)

    // Observe DOM changes
    const observer = new MutationObserver(() => {
      setTimeout(processTextNodes, 100)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false, // Don't observe character changes to avoid loops
    })

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
      observer.disconnect()
      // Cleanup React roots
      rootsRef.current.forEach((root, element) => {
        root.unmount()
      })
      rootsRef.current.clear()
    }
  }, [])

  return null
}

