/**
 * Target Cursor Content Script
 * Injects the target cursor into all web pages
 * Matches the React TargetCursor component exactly
 */

(function() {
  'use strict';

  // Check if already injected or if React version exists
  if (document.getElementById('forkyy-target-cursor-wrapper') || 
      document.querySelector('.target-cursor-wrapper')) {
    return;
  }

  // Skip extension pages (they use the React version)
  if (window.location.protocol === 'moz-extension:') {
    return;
  }

  // Inject CSS (matching React component CSS exactly - using same class names)
  const style = document.createElement('style');
  style.textContent = `
    .target-cursor-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: difference;
      transform: translate(-50%, -50%);
    }

    .target-cursor-dot {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 4px;
      height: 4px;
      background: #fff;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      will-change: transform;
    }

    .target-cursor-corner {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 12px;
      height: 12px;
      border: 3px solid #fff;
      will-change: transform;
    }

    .corner-tl {
      transform: translate(-150%, -150%);
      border-right: none;
      border-bottom: none;
    }

    .corner-tr {
      transform: translate(50%, -150%);
      border-left: none;
      border-bottom: none;
    }

    .corner-br {
      transform: translate(50%, 50%);
      border-left: none;
      border-top: none;
    }

    .corner-bl {
      transform: translate(-150%, 50%);
      border-right: none;
      border-top: none;
    }
  `;
  document.head.appendChild(style);

  // Create cursor DOM (matching React component structure exactly)
  const wrapper = document.createElement('div');
  wrapper.className = 'target-cursor-wrapper';
  
  const dot = document.createElement('div');
  dot.className = 'target-cursor-dot';
  
  const corners = [
    { pos: 'tl', className: 'corner-tl' },
    { pos: 'tr', className: 'corner-tr' },
    { pos: 'br', className: 'corner-br' },
    { pos: 'bl', className: 'corner-bl' }
  ].map(({ className }) => {
    const corner = document.createElement('div');
    corner.className = `target-cursor-corner ${className}`;
    return corner;
  });

  wrapper.appendChild(dot);
  corners.forEach(corner => wrapper.appendChild(corner));
  document.body.appendChild(wrapper);

  // Hide default cursor (matching React component)
  document.body.style.cursor = 'none';

  // Helper to check if element is clickable (same logic as React component)
  function isClickableElement(element) {
    if (!element) return false;
    
    // Skip body, html, and very large containers (likely the entire page)
    if (element === document.body || element === document.documentElement || element === wrapper) return false;
    
    // Skip if element is inside an iframe/webview
    if (element.closest('iframe, webview')) return false;
    
    // Check element size FIRST - skip very large elements (likely page containers)
    // This must happen before getBoundingClientRect to avoid issues
    try {
      const rect = element.getBoundingClientRect();
      const viewportWidth = window.innerWidth || 1920;
      const viewportHeight = window.innerHeight || 1080;
      
      // Skip if element is too large (more than 70% of viewport in both dimensions)
      if (rect.width > viewportWidth * 0.7 && rect.height > viewportHeight * 0.7) {
        return false;
      }
      
      // Skip if element covers too much area (more than 50% of viewport area)
      const elementArea = rect.width * rect.height;
      const viewportArea = viewportWidth * viewportHeight;
      if (elementArea > viewportArea * 0.5) {
        return false;
      }
    } catch (e) {
      // If getBoundingClientRect fails, skip
      return false;
    }
    
    // Check for explicit cursor-target class
    if (element.matches('.cursor-target')) return true;
    
    // Check for interactive elements
    const tagName = element.tagName.toLowerCase();
    const interactiveTags = ['a', 'button', 'input', 'select', 'textarea', 'label', 'summary', 'details'];
    if (interactiveTags.includes(tagName)) {
      if (tagName === 'input' || tagName === 'button') {
        if (element.hasAttribute('disabled') || element.hasAttribute('readonly')) {
          return false;
        }
      }
      if (tagName === 'a') {
        return element.href !== '' || element.hasAttribute('href');
      }
      return true;
    }
    
    // Check for cursor pointer
    try {
      const style = window.getComputedStyle(element);
      if ((style.cursor === 'pointer' || style.cursor === 'grab' || style.cursor === 'grabbing') &&
          style.pointerEvents !== 'none') {
        return true;
      }
    } catch (e) {}
    
    // Check for role attributes
    const role = element.getAttribute('role');
    if (role && ['button', 'link', 'menuitem', 'tab', 'option', 'checkbox', 'radio', 'switch'].includes(role)) {
      return true;
    }
    
    // Check for onclick handlers
    if (element.onclick !== null) return true;
    
    // Check for data attributes
    if (element.hasAttribute('data-clickable') || element.hasAttribute('data-interactive')) {
      return true;
    }
    
    // Check for tabindex
    const tabIndex = element.getAttribute('tabindex');
    if (tabIndex !== null && tabIndex !== '-1') {
      return true;
    }
    
    return false;
  }

  // Constants (matching React component exactly)
  const borderWidth = 3;
  const cornerSize = 12;
  const hoverDuration = 0.2;
  const spinDuration = 2; // seconds

  // Animation state
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let isActive = false;
  let activeTarget = null;
  let activeStrength = 0;
  let targetCornerPositions = null;
  let animationFrame = null;
  let currentLeaveHandler = null;
  let spinAnimationFrame = null;
  let rotation = 0;
  let isSpinning = true;

  // Initialize cursor position (matching React component: xPercent: -50, yPercent: -50, then x/y)
  wrapper.style.left = cursorX + 'px';
  wrapper.style.top = cursorY + 'px';
  
  // Default corner positions (matching React component)
  // These are relative to the cursor center (0, 0) - corners stay together and rotate
  const defaultPositions = [
    { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
    { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
    { x: cornerSize * 0.5, y: cornerSize * 0.5 },
    { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
  ];
  
  // Initialize corners to default positions (matching React component)
  // Use pixel-based transforms so they rotate correctly with the wrapper
  // These positions are relative to cursor center, so they rotate as the wrapper rotates
  // IMPORTANT: Corners have CSS `left: 50%; top: 50%` which centers them on cursor
  // Then we use transform to offset them from center
  corners.forEach((corner, i) => {
    const pos = defaultPositions[i];
    corner.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    corner.style.opacity = '1'; // Make visible - they should be visible at default positions
  });

  // Smooth easing function (matching GSAP power2.out and power3.out)
  function easeOutPower2(t) {
    return 1 - Math.pow(1 - t, 2);
  }

  function easeOutPower3(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Smooth cursor movement (matching React component's moveCursor with GSAP power3.out)
  let lastMoveTime = 0;
  let targetX = cursorX;
  let targetY = cursorY;
  let currentX = cursorX;
  let currentY = cursorY;

  function moveCursor(x, y) {
    targetX = x;
    targetY = y;
    lastMoveTime = performance.now();
  }

  // Smooth interpolation for cursor movement (matching GSAP duration: 0.1, ease: power3.out)
  function updateCursorPosition() {
    const now = performance.now();
    const deltaTime = Math.min((now - lastMoveTime) / 1000, 0.1); // Cap at 0.1s
    const progress = Math.min(deltaTime / 0.1, 1);
    const eased = easeOutPower3(progress);

    currentX += (targetX - currentX) * eased;
    currentY += (targetY - currentY) * eased;

    wrapper.style.left = currentX + 'px';
    wrapper.style.top = currentY + 'px';
    cursorX = currentX;
    cursorY = currentY;
  }

  // Spinning animation (matching React component's spin timeline)
  function updateSpin() {
    if (isSpinning && !isActive) {
      rotation += (360 / (spinDuration * 60)); // 60fps
      if (rotation >= 360) rotation -= 360;
      wrapper.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
    }
    spinAnimationFrame = requestAnimationFrame(updateSpin);
  }
  updateSpin();

  // Update corners based on target element (matching React component's ticker function)
  function updateCorners() {
    // Only update when active - when not active, corners maintain their default positions
    if (!isActive || !activeTarget || !targetCornerPositions) {
      return; // Don't update - corners should be at default positions already
    }

    const strength = activeStrength;
    if (strength === 0) {
      return; // Don't update
    }

    // Calculate corner positions relative to cursor (matching React component exactly)
    // React component uses: targetX = targetCornerPositions[i].x - cursorX
    corners.forEach((corner, i) => {
      const targetPos = targetCornerPositions[i];
      const targetX = targetPos.x - cursorX;
      const targetY = targetPos.y - cursorY;

      // Get current position from transform (or use default if no inline transform)
      // CSS default positions use percentages, so we need to calculate pixel equivalents
      // For 12px corner: -150% = -18px, 50% = 6px
      let currentX = defaultPositions[i].x;
      let currentY = defaultPositions[i].y;
      
      const currentTransform = corner.style.transform;
      if (currentTransform && currentTransform !== '' && currentTransform !== 'none') {
        const match = currentTransform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
        if (match) {
          currentX = parseFloat(match[1]);
          currentY = parseFloat(match[2]);
        }
      }

      // Interpolate based on strength (matching React component)
      // React uses: finalX = currentX + (targetX - currentX) * strength
      const finalX = currentX + (targetX - currentX) * strength;
      const finalY = currentY + (targetY - currentY) * strength;

      // Apply animation (matching React: duration: 0.2 if strength >= 0.99, else 0.05)
      const duration = strength >= 0.99 ? 0.2 : 0.05;
      const ease = duration === 0 ? 'none' : 'power1.out';
      
      // For smooth animation, we'll use a simple lerp in the animation loop
      corner.style.transform = `translate(${finalX}px, ${finalY}px)`;
      corner.style.opacity = strength.toString();
    });
  }

  // Animation loop (matching React component's ticker function)
  // IMPORTANT: The React component's tickerFn only runs when targetCornerPositions exists
  // When not active, corners maintain their default positions (set via GSAP initially)
  // We should only update corners when active, otherwise leave them at default positions
  function animate() {
    updateCursorPosition();
    
    // Only update corners if we're active (matching React component behavior)
    // The React tickerFn returns early if !targetCornerPositionsRef.current
    if (isActive && activeTarget && targetCornerPositions) {
      updateCorners();
    }
    // When not active, corners stay at their default positions (set during initialization)
    // They rotate with the wrapper via CSS transforms
    
    animationFrame = requestAnimationFrame(animate);
  }

  // Start animation loop
  animate();

  // Handle mouse enter on clickable element (matching React component's enterHandler)
  function handleElementEnter(element) {
    if (activeTarget === element) return;

    // Clean up previous target
    if (activeTarget && currentLeaveHandler) {
      activeTarget.removeEventListener('mouseleave', currentLeaveHandler);
    }

    // Safety check: verify element is reasonable size before activating
    const rect = element.getBoundingClientRect();
    const viewportWidth = window.innerWidth || 1920;
    const viewportHeight = window.innerHeight || 1080;
    
    // Don't activate on very large elements (likely page containers)
    if (rect.width > viewportWidth * 0.7 || rect.height > viewportHeight * 0.7) {
      console.warn('[TargetCursor] Skipping large element:', element.tagName, rect);
      return; // Don't activate on large elements
    }
    
    activeTarget = element;
    isActive = true;

    // Stop spinning (matching React component)
    isSpinning = false;
    wrapper.style.transform = `translate(-50%, -50%) rotate(0deg)`;
    rotation = 0;

    // Calculate corner positions (matching React component logic exactly)
    targetCornerPositions = [
      { x: rect.left - borderWidth, y: rect.top - borderWidth },
      { x: rect.right + borderWidth - cornerSize, y: rect.top - borderWidth },
      { x: rect.right + borderWidth - cornerSize, y: rect.bottom + borderWidth - cornerSize },
      { x: rect.left - borderWidth, y: rect.bottom + borderWidth - cornerSize }
    ];

    // When entering, corners start from CSS default positions
    // No need to set transform here - CSS handles it, we'll animate from default to target

    // Animate strength from 0 to 1 (matching React component: duration: hoverDuration, ease: power2.out)
    const startTime = performance.now();
    const duration = hoverDuration * 1000; // Convert to ms

    function animateStrength() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      activeStrength = easeOutPower2(progress);

      if (progress < 1) {
        requestAnimationFrame(animateStrength);
      } else {
        activeStrength = 1;
      }
    }

    animateStrength();

    // Set up leave handler
    currentLeaveHandler = () => handleElementLeave();
    element.addEventListener('mouseleave', currentLeaveHandler);
  }

  // Handle mouse leave from clickable element (matching React component's leaveHandler)
  function handleElementLeave() {
    if (!isActive) return;

    // Animate corners back to default positions (matching React component)
    // React component animates corners to default positions with duration: 0.3, ease: power3.out
    const startTime = performance.now();
    const duration = 0.3 * 1000; // 300ms
    
    // Store starting positions for animation
    const startPositions = corners.map(corner => {
      const transform = corner.style.transform;
      if (transform && transform !== '' && transform !== 'none') {
        const match = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
        if (match) {
          return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
        }
      }
      return defaultPositions[0]; // fallback
    });

    function animateOut() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutPower3(progress);

      // Animate each corner back to its default position
      corners.forEach((corner, i) => {
        const startPos = startPositions[i];
        const defaultPos = defaultPositions[i];
        const currentX = startPos.x + (defaultPos.x - startPos.x) * eased;
        const currentY = startPos.y + (defaultPos.y - startPos.y) * eased;
        corner.style.transform = `translate(${currentX}px, ${currentY}px)`;
        corner.style.opacity = (1 - eased).toString();
      });

      if (progress < 1) {
        requestAnimationFrame(animateOut);
      } else {
        // Animation complete - reset to defaults
        corners.forEach((corner, i) => {
          corner.style.transform = `translate(${defaultPositions[i].x}px, ${defaultPositions[i].y}px)`;
          corner.style.opacity = '0';
        });
        
        activeStrength = 0;
        isActive = false;
        activeTarget = null;
        targetCornerPositions = null;
        currentLeaveHandler = null;

        // Resume spinning after delay (matching React component: 50ms timeout)
        setTimeout(() => {
          if (!activeTarget) {
            isSpinning = true;
            rotation = 0;
          }
        }, 50);
      }
    }

    animateOut();
  }

  // Mouse down handler (matching React component: scale dot to 0.7, cursor to 0.9)
  function handleMouseDown() {
    dot.style.transform = 'translate(-50%, -50%) scale(0.7)';
    wrapper.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(0.9)';
  }

  // Mouse up handler (matching React component: scale dot to 1, cursor to 1)
  function handleMouseUp() {
    dot.style.transform = 'translate(-50%, -50%) scale(1)';
    if (!isActive) {
      wrapper.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(1)';
    } else {
      wrapper.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    }
  }

  // Mouse move handler (just update cursor position)
  function handleMouseMove(e) {
    moveCursor(e.clientX, e.clientY);
  }

  // Mouse over handler (matching React component's enterHandler - only fires when entering an element)
  // IMPORTANT: React component uses targetSelector='.cursor-target' by default, so it only activates
  // on elements with that class. But for external pages, we want to detect all clickable elements.
  // However, we should NOT activate on the entire body/document, only on actual interactive elements.
  function handleMouseOver(e) {
    // Don't activate on the wrapper itself or document body
    if (e.target === wrapper || e.target === document.body || e.target === document.documentElement) {
      // If we were active, deactivate
      if (isActive && activeTarget) {
        handleElementLeave();
      }
      return;
    }
    
    const directTarget = e.target;
    
    // Find the closest clickable element (matching React component logic)
    // But only activate on actual interactive elements, not containers
    const allTargets = [];
    let current = directTarget;
    while (current && current !== document.body && current !== document.documentElement) {
      if (isClickableElement(current)) {
        allTargets.push(current);
      }
      current = current.parentElement;
    }
    const target = allTargets[0] || null;
    
    // Only activate if we found a real target and it's not already active
    if (target && target !== activeTarget) {
      handleElementEnter(target);
    } else if (!target && isActive && activeTarget) {
      // No target found, but we were active - deactivate
      handleElementLeave();
    }
  }

  // Scroll handler (matching React component)
  function handleScroll() {
    if (!activeTarget) return;
    
    const elementUnderMouse = document.elementFromPoint(cursorX, cursorY);
    const isStillOverTarget =
      elementUnderMouse &&
      (elementUnderMouse === activeTarget || elementUnderMouse.closest('.cursor-target, a, button, input, select, textarea') === activeTarget);
    
    if (!isStillOverTarget) {
      if (currentLeaveHandler) {
        currentLeaveHandler();
      }
    }
  }

  // Cleanup on page unload
  function cleanup() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    if (spinAnimationFrame) {
      cancelAnimationFrame(spinAnimationFrame);
    }
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseover', handleMouseOver);
    document.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('scroll', handleScroll);
    if (activeTarget && currentLeaveHandler) {
      activeTarget.removeEventListener('mouseleave', currentLeaveHandler);
    }
    if (wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
    if (style.parentNode) {
      style.parentNode.removeChild(style);
    }
    document.body.style.cursor = '';
  }

  // Initialize event listeners (matching React component)
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseover', handleMouseOver, { passive: true });
  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('beforeunload', cleanup);

  // Handle page navigation (SPA)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      // Reset on navigation
      setTimeout(() => {
        if (activeTarget && currentLeaveHandler) {
          activeTarget.removeEventListener('mouseleave', currentLeaveHandler);
        }
        activeTarget = null;
        isActive = false;
        activeStrength = 0;
        targetCornerPositions = null;
        currentLeaveHandler = null;
        isSpinning = true;
        rotation = 0;
      }, 100);
    }
  }).observe(document, { subtree: true, childList: true });

})();
