// Cursor overlay script with GSAP animations (bulletproof solution)
const { ipcRenderer } = require('electron');

// Configuration
const CONFIG = {
  spinDuration: 2,
  hoverDuration: 0.2,
  parallaxOn: true,
  borderWidth: 3,
  cornerSize: 12
};

// State
let cursorWrapper = null;
let dot = null;
let corners = [];
let spinTl = null;
let isActive = false;
let targetCornerPositions = null;
let activeStrength = 0;
let tickerFn = null;

// Wait for DOM and GSAP to be ready
function initCursor() {
  cursorWrapper = document.getElementById('target-cursor-wrapper');
  dot = document.getElementById('target-cursor-dot');
  corners = Array.from(document.querySelectorAll('.target-cursor-corner'));

  if (!cursorWrapper || !gsap) {
    setTimeout(initCursor, 50);
    return;
  }

  // Create spinning animation
  createSpinTimeline();

  // Cache window position for coordinate conversion
  let windowX = window.screenX || 0;
  let windowY = window.screenY || 0;
  let updateCount = 0;

  // Update cached position when window moves
  setInterval(() => {
    windowX = window.screenX || 0;
    windowY = window.screenY || 0;
  }, 100);

  // Debug: log initial window position
  console.log('[CursorOverlay] Initial window position:', { windowX, windowY });

  // Listen for cursor position updates (screen coordinates)
  ipcRenderer.on('cursor-update', (_, { x, y }) => {
    // Convert screen coordinates to window-local coordinates
    const localX = x - windowX;
    const localY = y - windowY;

    // Debug: log first few updates
    if (updateCount < 5) {
      console.log('[CursorOverlay] Cursor update:', { screenX: x, screenY: y, windowX, windowY, localX, localY });
      updateCount++;
    }

    gsap.to(cursorWrapper, {
      x: localX,
      y: localY,
      duration: 0.05,
      ease: 'power3.out'
    });
  });

  // Listen for hover target updates from main window
  ipcRenderer.on('hover-target-update', (_, data) => {
    if (data.isHovering) {
      handleTargetEnter(data.targetBounds);
    } else {
      handleTargetLeave();
    }
  });

  // Handle click animations
  ipcRenderer.on('cursor-mousedown', () => {
    if (dot) gsap.to(dot, { scale: 0.7, duration: 0.3 });
    if (cursorWrapper) gsap.to(cursorWrapper, { scale: 0.9, duration: 0.2 });
  });

  ipcRenderer.on('cursor-mouseup', () => {
    if (dot) gsap.to(dot, { scale: 1, duration: 0.3 });
    if (cursorWrapper) gsap.to(cursorWrapper, { scale: 1, duration: 0.2 });
  });
}

function createSpinTimeline() {
  if (spinTl) spinTl.kill();
  spinTl = gsap.timeline({ repeat: -1 }).to(cursorWrapper, {
    rotation: '+=360',
    duration: CONFIG.spinDuration,
    ease: 'none'
  });
}

function handleTargetEnter(targetBounds) {
  if (!cursorWrapper || !corners.length) return;

  // Stop spinning
  gsap.killTweensOf(cursorWrapper, 'rotation');
  spinTl?.pause();
  gsap.set(cursorWrapper, { rotation: 0 });

  // Calculate corner positions
  const rect = targetBounds;
  const { borderWidth, cornerSize } = CONFIG;
  const cursorX = gsap.getProperty(cursorWrapper, 'x');
  const cursorY = gsap.getProperty(cursorWrapper, 'y');

  targetCornerPositions = [
    { x: rect.left - borderWidth, y: rect.top - borderWidth },
    { x: rect.right + borderWidth - cornerSize, y: rect.top - borderWidth },
    { x: rect.right + borderWidth - cornerSize, y: rect.bottom + borderWidth - cornerSize },
    { x: rect.left - borderWidth, y: rect.bottom + borderWidth - cornerSize }
  ];

  isActive = true;

  // Set up ticker for smooth parallax
  if (!tickerFn) {
    tickerFn = () => {
      if (!targetCornerPositions || !cursorWrapper || !corners.length) return;

      const strength = activeStrength;
      if (strength === 0) return;

      const cursorX = gsap.getProperty(cursorWrapper, 'x');
      const cursorY = gsap.getProperty(cursorWrapper, 'y');

      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, 'x');
        const currentY = gsap.getProperty(corner, 'y');

        const targetX = targetCornerPositions[i].x - cursorX;
        const targetY = targetCornerPositions[i].y - cursorY;

        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;

        const duration = strength >= 0.99 ? (CONFIG.parallaxOn ? 0.2 : 0) : 0.05;

        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration,
          ease: duration === 0 ? 'none' : 'power1.out',
          overwrite: 'auto'
        });
      });
    };
  }

  gsap.ticker.add(tickerFn);

  // Animate strength for smooth expansion
  gsap.to({ value: activeStrength }, {
    value: 1,
    duration: CONFIG.hoverDuration,
    ease: 'power2.out',
    onUpdate: function() {
      activeStrength = this.targets()[0].value;
    }
  });

  // Initial corner animation
  corners.forEach((corner, i) => {
    gsap.to(corner, {
      x: targetCornerPositions[i].x - cursorX,
      y: targetCornerPositions[i].y - cursorY,
      duration: 0.2,
      ease: 'power2.out'
    });
  });
}

function handleTargetLeave() {
  if (!corners.length) return;

  gsap.ticker.remove(tickerFn);
  isActive = false;
  targetCornerPositions = null;

  // Reset strength
  activeStrength = 0;

  // Return corners to default positions
  const { cornerSize } = CONFIG;
  const positions = [
    { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
    { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
    { x: cornerSize * 0.5, y: cornerSize * 0.5 },
    { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
  ];

  corners.forEach((corner, index) => {
    gsap.to(corner, {
      x: positions[index].x,
      y: positions[index].y,
      duration: 0.3,
      ease: 'power3.out'
    });
  });

  // Resume spinning
  setTimeout(() => {
    if (!isActive && cursorWrapper && spinTl) {
      const currentRotation = gsap.getProperty(cursorWrapper, 'rotation');
      const normalizedRotation = currentRotation % 360;

      spinTl.kill();
      spinTl = gsap.timeline({ repeat: -1 }).to(cursorWrapper, {
        rotation: '+=360',
        duration: CONFIG.spinDuration,
        ease: 'none'
      });

      gsap.to(cursorWrapper, {
        rotation: normalizedRotation + 360,
        duration: CONFIG.spinDuration * (1 - normalizedRotation / 360),
        ease: 'none',
        onComplete: () => {
          spinTl?.restart();
        }
      });
    }
  }, 50);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCursor);
} else {
  initCursor();
}
