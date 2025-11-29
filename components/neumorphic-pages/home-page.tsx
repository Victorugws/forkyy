'use client'

import { useState } from 'react'
import { MorphingCanvas } from '@/components/MorphingCanvas'
import { RayCardsWithRays } from '@/components/home/RayCardsWithRays'
import { BlogFeed } from '@/components/discover/BlogFeed'
import GradualBlur from '@/components/reactbits/animations/GradualBlur'
import { ContactForm } from '@/components/ContactForm'
import { CalBooking } from '@/components/CalBooking'
import { TestimonialSection } from '@/components/home/TestimonialSection'

/**
 * Neumorphic Home Page Component
 * Displays the main homepage with animated eye morphing canvas and all content sections
 * Now using EXACT reactbits.dev components
 */

export function NeumorphicHomePage() {
  const [hasSearched, setHasSearched] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Generate a new chat ID and navigate to chat page with query
    const newChatId = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    window.dispatchEvent(new CustomEvent('browser:navigate', {
      detail: { url: `/search/${newChatId}?q=${encodeURIComponent(query)}` }
    }))
  }

  if (hasSearched) {
    // Redirect to search page handled above
    return null
  }

  return (
    <div className="w-full bg-background relative">
      {/* Target Cursor is rendered at browser-client-enhanced level */}

      {/* Morphing Canvas with Eye Animation and Ray Cards */}
      <div className="relative min-h-screen">
        <MorphingCanvas
          onSearchSubmit={handleSearch}
          autoProgress={true}
        />
        {/* Ray Cards with Electric Border and CSS light rays - exact reactbits components */}
        {/* <RayCardsWithRays /> */}
      </div>

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* Blog Feed Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <BlogFeed showSidebar={false} />
      </section>

      {/* Gradual Blur at bottom of screen - exact reactbits.dev component */}
      <GradualBlur
        position="bottom"
        height="12rem"
        strength={3}
        divCount={8}
        curve="bezier"
        exponential={true}
        opacity={1}
        target="page"
      />
    </div>
  )
}
