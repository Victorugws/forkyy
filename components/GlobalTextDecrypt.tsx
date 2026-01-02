'use client'

import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import DecryptedText from './DecryptedText'

export function GlobalTextDecrypt() {
  const processedRef = useRef<WeakSet<Element>>(new WeakSet())
  const rootsRef = useRef<Map<Element, any>>(new Map())

  useEffect(() => {
    const processTextNodes = () => {
      // Clean up roots for elements that are no longer in the DOM
      rootsRef.current.forEach((root, element) => {
        if (!element.isConnected) {
          try {
            root.unmount()
          } catch (error) {
            // Element may have been removed by React
          }
          rootsRef.current.delete(element)
        }
      })

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

        // Verify the text node is still connected and has a valid parent
        if (!textNode.parentNode || !textNode.isConnected) {
          return
        }

        // Mark parent as processed BEFORE any DOM manipulation
        processedRef.current.add(parent)

        // Create wrapper element
        const wrapper = document.createElement('span')
        wrapper.className = 'decrypted-text-wrapper inline'
        
        // Safely replace text node with wrapper
        // Instead of removing the text node (which causes conflicts with React),
        // we'll hide it with CSS and insert the wrapper
        try {
          const parentNode = textNode.parentNode
          
          // Multiple validation checks before replacement
          if (!parentNode) return
          if (!textNode.isConnected) return
          if (textNode.parentNode !== parentNode) return
          
          // Verify node is actually a child
          const childNodes = Array.from(parentNode.childNodes)
          const isDirectChild = childNodes.includes(textNode)
          
          if (!isDirectChild) {
            return
          }
          
          // Hide the original text node instead of removing it
          // This avoids conflicts with React's DOM management
          // We'll insert the wrapper and let React handle cleanup naturally
          try {
            // Insert wrapper after the text node
            // If text node gets removed by React, wrapper will still be there
            if (textNode.nextSibling) {
              parentNode.insertBefore(wrapper, textNode.nextSibling)
            } else {
              parentNode.appendChild(wrapper)
            }
          } catch (insertError) {
            // If insertion fails, skip this node
            return
          }
          
          // Try to remove text node, but wrap in comprehensive error handling
          // React may have already removed it, which is fine - wrapper is already inserted
          // Use requestAnimationFrame to ensure DOM is stable before attempting removal
          requestAnimationFrame(() => {
            try {
              // Comprehensive validation before removal
              if (!textNode || !textNode.isConnected) {
                return // Node already removed
              }
              
              const currentParent = textNode.parentNode
              if (!currentParent || currentParent !== parentNode) {
                return // Node moved or parent changed
              }
              
              if (!parentNode.isConnected) {
                return // Parent removed
              }
              
              // Final check: verify node is still a direct child
              const currentChildren = Array.from(parentNode.childNodes)
              if (!currentChildren.includes(textNode)) {
                return // Node already removed
              }
              
              // Verify removeChild exists and is callable
              if (typeof parentNode.removeChild !== 'function') {
                return
              }
              
              // Attempt removal with error handling
              parentNode.removeChild(textNode)
            } catch (removeError: any) {
              // Silently ignore all removal errors
              // This is expected when React removes nodes concurrently
              // The wrapper is already inserted and will display the content
            }
          })
        } catch (error) {
          // Node may have been removed by React during processing
          // This is expected and safe to ignore
          if (process.env.NODE_ENV === 'development') {
            console.debug('Error processing text node (node may have been removed by React):', error)
          }
          return
        }
        
        // Render DecryptedText component into wrapper
        try {
          // Verify wrapper is still in DOM before creating root
          if (wrapper.isConnected) {
            const root = createRoot(wrapper)
            root.render(
              <DecryptedText
                text={text}
                animateOn="auto"
                autoInterval={4000}
              />
            )
            rootsRef.current.set(wrapper, root)
          }
        } catch (error) {
          // Root creation may fail if element was removed
          if (process.env.NODE_ENV === 'development') {
            console.debug('Error creating root:', error)
          }
        }
      })
    }

    // Debounce function to prevent rapid successive calls
    let processTimeout: NodeJS.Timeout | null = null
    const debouncedProcessTextNodes = () => {
      if (processTimeout) {
        clearTimeout(processTimeout)
      }
      processTimeout = setTimeout(() => {
        processTextNodes()
        processTimeout = null
      }, 150) // Increased delay to let React finish rendering
    }

    // Process on mount
    const timer = setTimeout(debouncedProcessTextNodes, 200)
    const interval = setInterval(debouncedProcessTextNodes, 2000)

    // Observe DOM changes with debouncing
    const observer = new MutationObserver(() => {
      debouncedProcessTextNodes()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false, // Don't observe character changes to avoid loops
    })

    return () => {
      clearTimeout(timer)
      if (processTimeout) {
        clearTimeout(processTimeout)
      }
      clearInterval(interval)
      observer.disconnect()
      // Cleanup React roots - defer to avoid race conditions with React rendering
      // Use requestIdleCallback if available, otherwise setTimeout
      const cleanupRoots = () => {
        const rootsToUnmount = Array.from(rootsRef.current.entries())
        rootsRef.current.clear()
        
        rootsToUnmount.forEach(([element, root]) => {
          try {
            // Only unmount if element is still in the DOM
            // This prevents errors when React has already removed the element
            if (element && element.isConnected && root) {
              root.unmount()
            }
          } catch (error) {
            // Silently handle errors - element may have been removed by React
            // or root may have already been unmounted
            if (process.env.NODE_ENV === 'development') {
              console.debug('Error unmounting root:', error)
            }
          }
        })
      }
      
      // Defer cleanup to next event loop tick to avoid race conditions
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(cleanupRoots, { timeout: 100 })
      } else {
        setTimeout(cleanupRoots, 0)
      }
    }
  }, [])

  return null
}

