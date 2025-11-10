'use client'

import {
  Video,
  Search,
  Filter,
  Play,
  Clock,
  Eye,
  TrendingUp
} from 'lucide-react'
import { useState } from 'react'

const videoCategories = [
  'All',
  'Technology',
  'Science',
  'Education',
  'News',
  'Entertainment',
  'How-to',
  'Reviews'
]

const sampleVideos = [
  {
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    title: 'The Future of Artificial Intelligence',
    channel: 'Tech Insights',
    views: '2.5M',
    duration: '15:32',
    uploadedAt: '2 days ago'
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
    title: 'Quantum Computing Explained',
    channel: 'Science Daily',
    views: '1.8M',
    duration: '22:15',
    uploadedAt: '1 week ago'
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2',
    title: 'Mars Mission 2024: Latest Updates',
    channel: 'Space News',
    views: '3.2M',
    duration: '18:45',
    uploadedAt: '3 days ago'
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b0',
    title: 'Climate Change Solutions',
    channel: 'Environmental Science',
    views: '1.5M',
    duration: '25:18',
    uploadedAt: '5 days ago'
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    title: 'Web Development in 2024',
    channel: 'Code Academy',
    views: '980K',
    duration: '32:22',
    uploadedAt: '1 week ago'
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    title: 'Understanding the Universe',
    channel: 'Physics Explained',
    views: '2.1M',
    duration: '28:55',
    uploadedAt: '4 days ago'
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    title: 'Machine Learning Basics',
    channel: 'AI Academy',
    views: '1.2M',
    duration: '19:40',
    uploadedAt: '6 days ago'
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    title: 'Startup Success Stories',
    channel: 'Business Insights',
    views: '750K',
    duration: '21:33',
    uploadedAt: '2 weeks ago'
  }
]

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-br from-background via-background to-red-500/5">
        <div className="container max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-red-500/10 p-3">
              <Video className="size-6 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Videos</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            Discover educational and informative videos from across the web
          </p>
          <div className="flex gap-3 items-center">
            <div className="relative flex-1 max-w-3xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-input bg-background px-12 py-4 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <button className="rounded-2xl border border-input bg-background p-4 hover:bg-accent transition-colors">
              <Filter className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-6 py-10 flex-1">
        {/* Categories */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            {videoCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-card hover:border-primary/50 hover:bg-accent'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Trending Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="size-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Trending Videos
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleVideos.map((video, index) => (
              <div
                key={index}
                className="group cursor-pointer"
              >
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted mb-3">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="rounded-full bg-white/90 p-4">
                      <Play className="size-6 text-black fill-black" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-medium text-white">
                    {video.duration}
                  </div>
                </div>
                <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                  {video.title}
                </h3>
                <div className="text-xs text-muted-foreground mb-1">
                  {video.channel}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="size-3" />
                    <span>{video.views}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>{video.uploadedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center mt-12">
            <button className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              Load More Videos
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
