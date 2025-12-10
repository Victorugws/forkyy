"use client";

import {
  useScroll,
  motion,
  useSpring,
  useTransform,
} from "motion/react";
import React, { useRef, useState, useEffect } from "react";

interface TimelineItem {
  title: string;
  content: React.ReactNode;
  images?: string[];
}

export const Timeline = ({ data }: { data: Array<TimelineItem> }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [displayedItems, setDisplayedItems] = useState<Array<TimelineItem & { id: string }>>([]);
  const [renderedItemCount, setRenderedItemCount] = useState(0);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Use scroll from the scrollable container, not the page
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start 0.9", "end 0.1"],
  });

  const animatedProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // Initialize with initial data
  useEffect(() => {
    if (data.length > 0) {
      const initialItems = data.map((item, idx) => ({
        ...item,
        id: `timeline-item-${idx}-${Date.now()}`
      }));
      setDisplayedItems(initialItems);
      setRenderedItemCount(0); // Start at 0 so all initial items animate
    }
  }, [data.length]); // Only depend on data length, not full data array

  // Mark items as rendered after they're added (for animation tracking)
  useEffect(() => {
    if (displayedItems.length > renderedItemCount) {
      const timeout = setTimeout(() => {
        setRenderedItemCount(displayedItems.length);
      }, 3000); // After all animations should complete
      return () => clearTimeout(timeout);
    }
  }, [displayedItems.length, renderedItemCount]);

  // Infinite scroll for timeline items - observe within the scroll container
  useEffect(() => {
    if (!loadMoreRef.current || !scrollContainerRef.current || data.length === 0) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Add more timeline items from the slit (duplicate from data)
          setDisplayedItems(prev => {
            const newCount = prev.length;
            const newItems = data.map((item, idx) => ({
              ...item,
              id: `timeline-item-${newCount + idx}-${Date.now()}`
            }));
            return [...prev, ...newItems];
          });
        }
      },
      { 
        threshold: 0.1, 
        root: scrollContainerRef.current, // Use the scroll container as root
        rootMargin: '50px' 
      }
    );

    observerRef.current.observe(loadMoreRef.current);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [data.length]); // Only depend on data array length

  return (
    <div className="relative w-full">
      {/* Fixed-height scrollable container - fits ~1 timeline card */}
      <div
        ref={scrollContainerRef}
        className="relative overflow-y-auto overflow-x-hidden rounded-xl border-2 border-border/50"
        style={{
          maxHeight: '400px', // Height for ~1 card
          scrollBehavior: 'smooth',
        }}
      >
        {/* Blur overlay at top-right corner */}
        <div 
          className="absolute top-0 right-0 w-32 h-32 pointer-events-none z-10"
          style={{
            background: 'radial-gradient(circle at top right, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
            filter: 'blur(12px)',
          }}
        />
        <motion.div
          ref={containerRef}
          className="relative w-full"
        >
          {/* SVG for animated connecting lines */}
          <svg
            className="absolute md:block hidden top-0 left-[40px] w-0.5 h-full pointer-events-none z-0"
            style={{ overflow: "visible" }}
          >
            <defs>
              <linearGradient id="timeline-gradient" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="20%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="80%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Main vertical line that animates on scroll */}
            <motion.line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              stroke="url(#timeline-gradient)"
              strokeWidth="2"
              strokeDasharray="2000"
              style={{
                strokeDashoffset: useTransform(animatedProgress, (progress) => {
                  return 2000 * (1 - progress);
                }),
              }}
            />
          </svg>

          <div className="relative pb-32">
            {displayedItems.map((item, index) => {
              // Animate items that haven't been rendered yet
              const shouldAnimate = index >= renderedItemCount
              const startY = 200 // Start from well below the slit
              const delayIndex = index - renderedItemCount
              
              return (
                <motion.div
                  key={item.id}
                  initial={shouldAnimate ? { 
                    opacity: 0, 
                    y: startY, 
                    scale: 0.8,
                    filter: 'blur(8px)'
                  } : false}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    filter: 'blur(0px)'
                  }}
                  transition={shouldAnimate ? { 
                    duration: 1.8, 
                    delay: delayIndex * 0.3,
                    type: "spring",
                    stiffness: 50,
                    damping: 30,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  } : {}}
                  ref={(el) => {
                    itemsRef.current[index] = el;
                  }}
                  className="flex flex-col md:flex-row md:items-start md:justify-start mb-[10px] last:mb-0"
                >
                  <div className="flex flex-col md:flex-row items-start relative mx-auto md:mx-0 w-full">
                    <div className="flex items-center gap-4 md:w-64 md:flex-col md:justify-start md:pt-2 md:pb-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.5, 
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 200
                        }}
                        className="z-10 flex items-center justify-center w-10 h-10 rounded-full neu-inset border-2 border-background"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ 
                            duration: 0.3, 
                            delay: index * 0.1 + 0.2,
                            type: "spring",
                            stiffness: 300
                          }}
                          className="w-3 h-3 rounded-full bg-primary"
                        />
                      </motion.div>
                      <div className="flex flex-col md:flex-row md:flex-1 md:justify-center md:min-w-[200px]">
                        <motion.h3
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
                          className="text-xl md:text-2xl font-bold text-foreground px-4 py-2"
                        >
                          {item.title}
                        </motion.h3>
                      </div>
                    </div>
                    <div className="relative md:pl-4 md:w-[calc(100%-250px)] flex-1 overflow-visible">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                        className="neu-card p-6 rounded-2xl min-h-[200px] relative overflow-visible"
                      >
                        {item.content}
                        
                        {/* Static images for timeline items */}
                        {item.images && item.images.length > 0 && (
                          <div className="mt-6 flex items-center relative overflow-visible" style={{ width: '100%', marginLeft: '0' }}>
                            {item.images.slice(0, 3).map((imageUrl, imgIndex) => {
                              const rotation = -8 + (imgIndex % 3) * 4
                              
                              return (
                                <motion.div
                                  key={imgIndex}
                                  initial={{ opacity: 0, rotate: rotation, y: 20, scale: 0.9 }}
                                  whileInView={{ opacity: 1, rotate: rotation, y: 0, scale: 1 }}
                                  viewport={{ once: true }}
                                  transition={{ 
                                    duration: 0.6, 
                                    delay: index * 0.1 + 0.3 + (imgIndex % 3) * 0.15,
                                    type: "spring",
                                    stiffness: 150
                                  }}
                                  className="relative cursor-pointer hover:z-50 transition-all duration-300 hover:scale-105 flex-shrink-0"
                                  style={{
                                    marginLeft: imgIndex > 0 ? '-35px' : '0',
                                    zIndex: 10 - imgIndex,
                                  }}
                                >
                                  <div 
                                    className="w-32 h-48 md:w-40 md:h-60 rounded-lg overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] neu-card border-2 border-background/50"
                                    style={{
                                      transform: `rotate(${rotation}deg)`,
                                    }}
                                  >
                                    <img
                                      src={imageUrl}
                                      alt={`Article image ${imgIndex + 1}`}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src = `https://via.placeholder.com/400x600/6366f1/ffffff?text=Market+News`
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
                                    <div className="absolute inset-0 border border-white/20 rounded-lg pointer-events-none" />
                                  </div>
                                </motion.div>
                              )
                            })}
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
            
            {/* Load more trigger - positioned to trigger when scrolling near the end */}
            <div ref={loadMoreRef} className="absolute bottom-0 h-1 w-full flex-shrink-0" style={{ pointerEvents: 'none' }} />
          </div>
        </motion.div>
      </div>

      {/* Slit opening at bottom of fixed container - where timeline cards emerge from (under the rug effect) */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-10 bg-gradient-to-r from-transparent via-background/98 to-transparent z-40 pointer-events-none"
        style={{
          boxShadow: '0 -12px 50px rgba(0, 0, 0, 0.4), inset 0 6px 30px rgba(0, 0, 0, 0.35)',
          clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
          borderTop: '4px solid rgba(0, 0, 0, 0.2)',
        }}
      />
    </div>
  );
};
