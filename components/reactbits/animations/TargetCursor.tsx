'use client'

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import './TargetCursor.css';

interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
}

// Helper function to check if an element is clickable
const isClickableElement = (element: Element): boolean => {
  if (!element) return false;
  
  // Skip if element is inside an iframe/webview (handled separately)
  if (element.closest('iframe, webview')) return false;
  
  // Check for explicit cursor-target class
  if (element.matches('.cursor-target')) return true;
  
  // Check for interactive elements
  const tagName = element.tagName.toLowerCase();
  const interactiveTags = ['a', 'button', 'input', 'select', 'textarea', 'label', 'summary', 'details'];
  if (interactiveTags.includes(tagName)) {
    // For inputs and buttons, check if they're not disabled
    if (tagName === 'input' || tagName === 'button') {
      const htmlElement = element as HTMLElement;
      if (htmlElement.hasAttribute('disabled') || htmlElement.hasAttribute('readonly')) {
        return false;
      }
    }
    // For links, check if they have an href
    if (tagName === 'a') {
      const linkElement = element as HTMLAnchorElement;
      return linkElement.href !== '' || linkElement.hasAttribute('href');
    }
    return true;
  }
  
  // Check for elements with click handlers or cursor pointer
  const htmlElement = element as HTMLElement;
  try {
    const style = window.getComputedStyle(htmlElement);
    if (style.cursor === 'pointer' || style.cursor === 'grab' || style.cursor === 'grabbing') {
      // Make sure it's not just inheriting the cursor style
      if (style.pointerEvents !== 'none') {
        return true;
      }
    }
  } catch (e) {
    // getComputedStyle might fail in some cases
  }
  
  // Check for role attributes that indicate interactivity
  const role = htmlElement.getAttribute('role');
  if (role && ['button', 'link', 'menuitem', 'tab', 'option', 'checkbox', 'radio', 'switch'].includes(role)) {
    return true;
  }
  
  // Check for onclick handlers
  if (htmlElement.onclick !== null) {
    return true;
  }
  
  // Check for data-clickable or similar attributes
  if (htmlElement.hasAttribute('data-clickable') || htmlElement.hasAttribute('data-interactive')) {
    return true;
  }
  
  // Check for elements with tabindex (focusable)
  const tabIndex = htmlElement.getAttribute('tabindex');
  if (tabIndex !== null && tabIndex !== '-1') {
    return true;
  }
  
  return false;
};

const TargetCursor = ({
  targetSelector = '.cursor-target',
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true
}: TargetCursorProps) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<NodeListOf<Element> | null>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const isActiveRef = useRef(false);
  const targetCornerPositionsRef = useRef<Array<{ x: number; y: number }> | null>(null);
  const tickerFnRef = useRef<(() => void) | null>(null);
  const activeStrengthRef = useRef(0);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
    return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
  }, []);

  const constants = useMemo(
    () => ({
      borderWidth: 3,
      cornerSize: 12
    }),
    []
  );

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.1,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll('.target-cursor-corner');

    let activeTarget: Element | null = null;
    let currentLeaveHandler: (() => void) | null = null;
    let resumeTimeout: NodeJS.Timeout | null = null;
    let activeWebviewClickable: { left: number; top: number; right: number; bottom: number } | null = null;

    const cleanupTarget = (target: Element) => {
      if (currentLeaveHandler) {
        target.removeEventListener('mouseleave', currentLeaveHandler);
      }
      currentLeaveHandler = null;
    };

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });

    const createSpinTimeline = () => {
      if (spinTl.current) {
        spinTl.current.kill();
      }
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    };

    createSpinTimeline();

    const tickerFn = () => {
      if (!targetCornerPositionsRef.current || !cursorRef.current || !cornersRef.current) {
        return;
      }

      const strength = activeStrengthRef.current;
      if (strength === 0) return;

      const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
      const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;

      const corners = Array.from(cornersRef.current);
      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, 'x') as number;
        const currentY = gsap.getProperty(corner, 'y') as number;

        const targetX = targetCornerPositionsRef.current![i].x - cursorX;
        const targetY = targetCornerPositionsRef.current![i].y - cursorY;

        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;

        const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;

        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration: duration,
          ease: duration === 0 ? 'none' : 'power1.out',
          overwrite: 'auto'
        });
      });
    };

    tickerFnRef.current = tickerFn;

    // Track last known mouse position globally
    let lastMouseX = window.innerWidth / 2;
    let lastMouseY = window.innerHeight / 2;
    let rafId: number | null = null;

    const moveHandler = (e: MouseEvent | PointerEvent) => {
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      moveCursor(e.clientX, e.clientY);
    };

    // Use both mousemove and pointermove for better cross-iframe support
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('pointermove', moveHandler);

    // Handle clickable element snapping from webview
    const handleWebviewClickable = (clickableRect: { left: number; top: number; right: number; bottom: number; width: number; height: number } | null) => {
      if (!clickableRect || !cursorRef.current || !cornersRef.current) {
        // No clickable element, exit snapping if active
        if (activeWebviewClickable) {
          activeWebviewClickable = null;
          if (currentLeaveHandler) {
            currentLeaveHandler();
          }
        }
        return;
      }

      // Check if this is the same clickable element (within small threshold)
      if (activeWebviewClickable) {
        const threshold = 5; // pixels
        if (Math.abs(activeWebviewClickable.left - clickableRect.left) < threshold &&
            Math.abs(activeWebviewClickable.top - clickableRect.top) < threshold &&
            Math.abs(activeWebviewClickable.right - clickableRect.right) < threshold &&
            Math.abs(activeWebviewClickable.bottom - clickableRect.bottom) < threshold) {
          // Same element, just update corner positions if needed
          const rect = clickableRect;
          const { borderWidth, cornerSize } = constants;
          const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
          const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;

          targetCornerPositionsRef.current = [
            { x: rect.left - borderWidth, y: rect.top - borderWidth },
            { x: rect.right + borderWidth - cornerSize, y: rect.top - borderWidth },
            { x: rect.right + borderWidth - cornerSize, y: rect.bottom + borderWidth - cornerSize },
            { x: rect.left - borderWidth, y: rect.bottom + borderWidth - cornerSize }
          ];
          return;
        }
      }

      // Clean up previous target
      if (activeTarget) {
        cleanupTarget(activeTarget);
        activeTarget = null;
      }

      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeWebviewClickable = {
        left: clickableRect.left,
        top: clickableRect.top,
        right: clickableRect.right,
        bottom: clickableRect.bottom
      };
      const corners = Array.from(cornersRef.current);
      corners.forEach(corner => gsap.killTweensOf(corner));

      gsap.killTweensOf(cursorRef.current, 'rotation');
      spinTl.current?.pause();
      gsap.set(cursorRef.current, { rotation: 0 });

      const rect = clickableRect;
      const { borderWidth, cornerSize } = constants;
      const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
      const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;

      targetCornerPositionsRef.current = [
        { x: rect.left - borderWidth, y: rect.top - borderWidth },
        { x: rect.right + borderWidth - cornerSize, y: rect.top - borderWidth },
        { x: rect.right + borderWidth - cornerSize, y: rect.bottom + borderWidth - cornerSize },
        { x: rect.left - borderWidth, y: rect.bottom + borderWidth - cornerSize }
      ];

      isActiveRef.current = true;
      if (tickerFnRef.current) {
        gsap.ticker.add(tickerFnRef.current);
      }

      gsap.to(activeStrengthRef, {
        current: 1,
        duration: hoverDuration,
        ease: 'power2.out'
      });

      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: targetCornerPositionsRef.current![i].x - cursorX,
          y: targetCornerPositionsRef.current![i].y - cursorY,
          duration: 0.2,
          ease: 'power2.out'
        });
      });

      // Create leave handler for virtual target
      const leaveHandler = () => {
        gsap.ticker.remove(tickerFnRef.current!);
        isActiveRef.current = false;
        targetCornerPositionsRef.current = null;
        gsap.set(activeStrengthRef, { current: 0, overwrite: true });
        activeTarget = null;
        activeWebviewClickable = null;

        if (cornersRef.current) {
          const corners = Array.from(cornersRef.current);
          gsap.killTweensOf(corners);
          const { cornerSize } = constants;
          const positions = [
            { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: cornerSize * 0.5 },
            { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
          ];
          const tl = gsap.timeline();
          corners.forEach((corner, index) => {
            tl.to(
              corner,
              {
                x: positions[index].x,
                y: positions[index].y,
                duration: 0.3,
                ease: 'power3.out'
              },
              0
            );
          });
        }

        resumeTimeout = setTimeout(() => {
          if (!activeTarget && cursorRef.current && spinTl.current) {
            const currentRotation = gsap.getProperty(cursorRef.current, 'rotation') as number;
            const normalizedRotation = currentRotation % 360;
            spinTl.current.kill();
            spinTl.current = gsap
              .timeline({ repeat: -1 })
              .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
            gsap.to(cursorRef.current, {
              rotation: normalizedRotation + 360,
              duration: spinDuration * (1 - normalizedRotation / 360),
              ease: 'none',
              onComplete: () => {
                spinTl.current?.restart();
              }
            });
          }
          resumeTimeout = null;
        }, 50);
      };

      currentLeaveHandler = leaveHandler;
    };

    // Listen for cursor position updates from Electron webviews via IPC
    const handleIPCCursorMove = (event: CustomEvent) => {
      const { x, y, clickable, image } = event.detail;
      if (typeof x === 'number' && typeof y === 'number') {
        lastMouseX = x;
        lastMouseY = y;
        moveCursor(x, y);
        
        // Handle clickable element snapping from webview
        if (clickable && typeof clickable === 'object') {
          handleWebviewClickable(clickable);
        } else {
          // No clickable element, exit snapping
          handleWebviewClickable(null);
        }
      }
    };

    // Listen for custom events from Electron webviews
    window.addEventListener('cursor:move', handleIPCCursorMove as EventListener);

    // Continuous tracking for iframes/webviews using requestAnimationFrame
    // This helps track mouse position even when inside iframes
    const trackMousePosition = () => {
      if (cursorRef.current) {
        const currentX = gsap.getProperty(cursorRef.current, 'x') as number;
        const currentY = gsap.getProperty(cursorRef.current, 'y') as number;

        // Try to detect if mouse is over an iframe/webview using elementFromPoint
        // This helps update cursor position even when inside cross-origin iframes
        try {
          const elementAtPoint = document.elementFromPoint(lastMouseX, lastMouseY);
          if (elementAtPoint) {
            const iframe = elementAtPoint.closest('iframe, webview');
            if (iframe) {
              // Mouse is over an iframe/webview - use the last known position
              // For Electron webviews, IPC messages will update this
              // For regular iframes, we maintain the last known position
              const dx = lastMouseX - currentX;
              const dy = lastMouseY - currentY;
              
              // Smoothly interpolate to last known position
              if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                moveCursor(lastMouseX, lastMouseY);
              }
            }
          }
        } catch (e) {
          // elementFromPoint might fail in some cases, fall back to simple tracking
        }

        // Always maintain smooth tracking
        const dx = lastMouseX - currentX;
        const dy = lastMouseY - currentY;

        // Only update if there's a significant difference to avoid jitter
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          moveCursor(lastMouseX, lastMouseY);
        }
      }

      rafId = requestAnimationFrame(trackMousePosition);
    };

    // Start continuous tracking
    rafId = requestAnimationFrame(trackMousePosition);

    // Also add mouseenter/mouseleave handlers to iframes/webviews
    // to detect when mouse enters/leaves them
    const handleIframeEnter = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      lastMouseX = mouseEvent.clientX;
      lastMouseY = mouseEvent.clientY;
      moveCursor(mouseEvent.clientX, mouseEvent.clientY);
    };

    const addIframeListeners = () => {
      const iframes = document.querySelectorAll('iframe, webview');
      iframes.forEach((iframe) => {
        // Track when mouse enters iframe area
        iframe.addEventListener('mouseenter', handleIframeEnter);
        // Also try to track mousemove on the iframe element itself
        iframe.addEventListener('mousemove', handleIframeEnter);
      });
    };

    // Initial setup
    addIframeListeners();

    // Watch for dynamically added iframes/webviews
    const observer = new MutationObserver(() => {
      addIframeListeners();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return;
      const mouseX = gsap.getProperty(cursorRef.current, 'x') as number;
      const mouseY = gsap.getProperty(cursorRef.current, 'y') as number;
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      
      // Check if still over the active target or another clickable element
      let isStillOverTarget = false;
      if (elementUnderMouse) {
        if (elementUnderMouse === activeTarget) {
          isStillOverTarget = true;
        } else {
          // Check if element matches target selector or is clickable
          const closestTarget = elementUnderMouse.closest(targetSelector);
          if (closestTarget === activeTarget) {
            isStillOverTarget = true;
          } else if (isClickableElement(elementUnderMouse)) {
            // Check if it's the same clickable element
            let current: Element | null = elementUnderMouse;
            while (current && current !== document.body) {
              if (current === activeTarget) {
                isStillOverTarget = true;
                break;
              }
              current = current.parentElement;
            }
          }
        }
      }
      
      if (!isStillOverTarget) {
        if (currentLeaveHandler) {
          currentLeaveHandler();
        }
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    const mouseDownHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
    };

    const mouseUpHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    const enterHandler = (e: MouseEvent) => {
      const directTarget = e.target as Element;
      const allTargets: Element[] = [];
      let current: Element | null = directTarget;
      
      // Walk up the DOM tree to find clickable elements
      while (current && current !== document.body) {
        // Check for explicit target selector first
        if (current.matches(targetSelector)) {
          allTargets.push(current);
        }
        // Also check if element is clickable
        else if (isClickableElement(current)) {
          allTargets.push(current);
        }
        current = current.parentElement;
      }
      const target = allTargets[0] || null;
      if (!target || !cursorRef.current || !cornersRef.current) return;
      if (activeTarget === target) return;
      if (activeTarget) {
        cleanupTarget(activeTarget);
      }
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;
      const corners = Array.from(cornersRef.current);
      corners.forEach(corner => gsap.killTweensOf(corner));

      gsap.killTweensOf(cursorRef.current, 'rotation');
      spinTl.current?.pause();
      gsap.set(cursorRef.current, { rotation: 0 });

      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;
      const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
      const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;

      targetCornerPositionsRef.current = [
        { x: rect.left - borderWidth, y: rect.top - borderWidth },
        { x: rect.right + borderWidth - cornerSize, y: rect.top - borderWidth },
        { x: rect.right + borderWidth - cornerSize, y: rect.bottom + borderWidth - cornerSize },
        { x: rect.left - borderWidth, y: rect.bottom + borderWidth - cornerSize }
      ];

      isActiveRef.current = true;
      if (tickerFnRef.current) {
        gsap.ticker.add(tickerFnRef.current);
      }

      gsap.to(activeStrengthRef, {
        current: 1,
        duration: hoverDuration,
        ease: 'power2.out'
      });

      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: targetCornerPositionsRef.current![i].x - cursorX,
          y: targetCornerPositionsRef.current![i].y - cursorY,
          duration: 0.2,
          ease: 'power2.out'
        });
      });

      const leaveHandler = () => {
        gsap.ticker.remove(tickerFnRef.current!);

        isActiveRef.current = false;
        targetCornerPositionsRef.current = null;
        gsap.set(activeStrengthRef, { current: 0, overwrite: true });
        activeTarget = null;

        if (cornersRef.current) {
          const corners = Array.from(cornersRef.current);
          gsap.killTweensOf(corners);
          const { cornerSize } = constants;
          const positions = [
            { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: cornerSize * 0.5 },
            { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
          ];
          const tl = gsap.timeline();
          corners.forEach((corner, index) => {
            tl.to(
              corner,
              {
                x: positions[index].x,
                y: positions[index].y,
                duration: 0.3,
                ease: 'power3.out'
              },
              0
            );
          });
        }

        resumeTimeout = setTimeout(() => {
          if (!activeTarget && cursorRef.current && spinTl.current) {
            const currentRotation = gsap.getProperty(cursorRef.current, 'rotation') as number;
            const normalizedRotation = currentRotation % 360;
            spinTl.current.kill();
            spinTl.current = gsap
              .timeline({ repeat: -1 })
              .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
            gsap.to(cursorRef.current, {
              rotation: normalizedRotation + 360,
              duration: spinDuration * (1 - normalizedRotation / 360),
              ease: 'none',
              onComplete: () => {
                spinTl.current?.restart();
              }
            });
          }
          resumeTimeout = null;
        }, 50);

        cleanupTarget(target);
      };

      currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);
    };

    window.addEventListener('mouseover', enterHandler, { passive: true });

    return () => {
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
      }

      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('pointermove', moveHandler);
      window.removeEventListener('cursor:move', handleIPCCursorMove as EventListener);
      window.removeEventListener('mouseover', enterHandler);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);

      // Stop continuous tracking
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      // Clean up iframe listeners
      const iframes = document.querySelectorAll('iframe, webview');
      iframes.forEach((iframe) => {
        iframe.removeEventListener('mouseenter', handleIframeEnter);
        iframe.removeEventListener('mousemove', handleIframeEnter);
      });

      observer.disconnect();

      if (activeTarget) {
        cleanupTarget(activeTarget);
      }

      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
      }

      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;

      isActiveRef.current = false;
      targetCornerPositionsRef.current = null;
      activeStrengthRef.current = 0;
    };
  }, [targetSelector, spinDuration, moveCursor, constants, hideDefaultCursor, isMobile, hoverDuration, parallaxOn]);

  useEffect(() => {
    if (isMobile || !cursorRef.current || !spinTl.current) return;
    if (spinTl.current.isActive()) {
      spinTl.current.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    }
  }, [spinDuration, isMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <div ref={cursorRef} className="target-cursor-wrapper">
      <div ref={dotRef} className="target-cursor-dot" />
      <div className="target-cursor-corner corner-tl" />
      <div className="target-cursor-corner corner-tr" />
      <div className="target-cursor-corner corner-br" />
      <div className="target-cursor-corner corner-bl" />
    </div>
  );
};

export default TargetCursor;

