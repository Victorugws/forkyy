'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface BlogPost {
  id: string
  category: 'changelog' | 'announcement' | 'all'
  title: string
  description: string
  date: string
  image: string
  authorName: string
  authorAvatar: string
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    category: 'changelog',
    title: 'Introducing OrbAI 1.0.7',
    description: 'OrbAI 1.0.7 brings seamless new integrations, live data updates, and essential fixes to enhance your overall experience. Here\'s what\'s new:',
    date: 'Nov 28, 2024',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    authorName: 'Changelog',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=changelog'
  },
  {
    id: '2',
    category: 'announcement',
    title: 'Introducing OrbAI 1.0.6',
    description: 'OrbAI 1.0.6 introduces powerful new analytics tools and improved accessibility upgrades to refine your workflows. Here\'s what\'s new:',
    date: 'Nov 28, 2023',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    authorName: 'Announcement',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=announcement'
  },
  {
    id: '3',
    category: 'changelog',
    title: 'Introducing OrbAI 1.0.5',
    description: 'OrbAI 1.0.5 introduces enhanced integrations and optimizations to improve performance and your overall experience. Here\'s what\'s new:',
    date: 'Nov 28, 2022',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    authorName: 'Changelog',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=changelog2'
  },
  {
    id: '4',
    category: 'announcement',
    title: 'Platform Updates & New Features',
    description: 'Exciting new platform capabilities that enhance collaboration and streamline your workflow. Discover what we\'ve built for you.',
    date: 'Oct 15, 2024',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    authorName: 'Announcement',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=announcement2'
  },
]

type FilterType = 'all' | 'announcements' | 'changelog'

export function BlogFeed({ showSidebar = true }: { showSidebar?: boolean }) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([])
  const [page, setPage] = useState(1)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const POSTS_PER_PAGE = 4

  const filteredPosts = BLOG_POSTS.filter(post => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'announcements') return post.category === 'announcement'
    if (activeFilter === 'changelog') return post.category === 'changelog'
    return true
  })

  // Load initial posts and when filter changes
  useEffect(() => {
    setPage(1)
    setDisplayedPosts(filteredPosts.slice(0, POSTS_PER_PAGE))
  }, [activeFilter])

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedPosts.length < filteredPosts.length) {
          // Load more posts by cycling through the original posts
          const nextPage = page + 1
          const startIndex = (nextPage - 1) * POSTS_PER_PAGE
          const newPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

          // If we've reached the end, start over with modified IDs to avoid key conflicts
          if (newPosts.length === 0) {
            const recycledPosts = filteredPosts.slice(0, POSTS_PER_PAGE).map((post, idx) => ({
              ...post,
              id: `${post.id}-${nextPage}-${idx}`
            }))
            setDisplayedPosts(prev => [...prev, ...recycledPosts])
          } else {
            setDisplayedPosts(prev => [...prev, ...newPosts])
          }

          setPage(nextPage)
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [displayedPosts, filteredPosts, page])

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center mb-16 relative flex flex-col items-center">
        <div className="inline-flex items-center gap-2 rounded-full neu-card px-6 py-2 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <span className="text-sm font-medium uppercase tracking-wider">OUR SAYINGS</span>
        </div>
        <h1
          className="font-medium mb-4"
          style={{
            width: '100%',
            height: 'auto',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            wordBreak: 'break-word',
            lineHeight: '1.2',
            fontSize: '56px',
            letterSpacing: '-0.01em',
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.6) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Fresh Takes & Updates
        </h1>
        <p
          className="text-lg text-muted-foreground mx-auto"
          style={{
            width: '100%',
            height: 'auto',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            wordBreak: 'break-word',
            maxWidth: '500px',
            opacity: 0.8,
            textAlign: 'center',
            lineHeight: '1.2',
          }}
        >
          AI agency that delivers smart solutions built to perform
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center mb-12">
        <div className="neu-card rounded-full p-2 inline-flex gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-6 py-2 rounded-full transition-all ${
              activeFilter === 'all'
                ? 'bg-background shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] font-medium'
                : 'hover:bg-background/50'
            }`}
          >
            All Posts
          </button>
          <button
            onClick={() => setActiveFilter('announcements')}
            className={`px-6 py-2 rounded-full transition-all ${
              activeFilter === 'announcements'
                ? 'bg-background shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] font-medium'
                : 'hover:bg-background/50'
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => setActiveFilter('changelog')}
            className={`px-6 py-2 rounded-full transition-all ${
              activeFilter === 'changelog'
                ? 'bg-background shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] font-medium'
                : 'hover:bg-background/50'
            }`}
          >
            Changelog
          </button>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div
        style={{
          width: '600px',
          height: 'min-content',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'visible',
          padding: '0px',
          alignContent: 'center',
          flexWrap: 'nowrap',
          gap: '44px',
          borderRadius: '0px',
        }}
      >
        {displayedPosts.map((post, index) => (
          <article
            key={post.id}
            className="neu-card rounded-3xl overflow-hidden hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-6px_-6px_12px_rgba(255,255,255,0.9)] transition-all duration-300 cursor-pointer w-full"
            onClick={() => {
              // Navigate to morphic search/prompt page with the post title
              const newChatId = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
              window.dispatchEvent(new CustomEvent('browser:navigate', {
                detail: { url: `/search/${newChatId}?q=${encodeURIComponent(post.title)}` }
              }))
            }}
          >
            {/* Post Image */}
            <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>

            {/* Post Content */}
            <div className="p-8">
              {/* Author & Date */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden neu-card">
                  <Image
                    src={post.authorAvatar}
                    alt={post.authorName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-sm">{post.authorName}</p>
                  <p className="text-sm text-muted-foreground">{post.date}</p>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold mb-3">{post.title}</h2>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">{post.description}</p>
            </div>
          </article>
        ))}

        {/* Infinite scroll trigger */}
        <div ref={loadMoreRef} className="h-20 w-full" />
      </div>
    </div>
  )
}
