'use client'
import { HeaderNavbar } from '@/components/header-navbar'

import { Video, Play } from 'lucide-react'

export function NeumorphicVideosPage() {
  const videos = Array.from({ length: 6 }, (_, i) => ({
    title: `Video Title ${i + 1}`,
    duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    views: `${Math.floor(Math.random() * 1000)}K views`
  }))

  return (
    <div className="w-full min-h-screen bg-background">
      <HeaderNavbar user={null} />
      <div className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
        <div className="neu-card rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="neu-raised rounded-full p-3">
              <Video className="size-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Videos</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            AI-powered video search and recommendations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, i) => (
            <div key={i} className="neu-card rounded-2xl p-3 hover:shadow-neu-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
              <div className="neu-inset rounded-xl aspect-video bg-background/50 flex items-center justify-center mb-3 group relative">
                <div className="neu-raised rounded-full p-4 group-hover:scale-110 transition-transform">
                  <Play className="size-6 text-primary" />
                </div>
              </div>
              <div className="px-2">
                <h3 className="text-sm font-semibold text-foreground mb-1">{video.title}</h3>
                <p className="text-xs text-muted-foreground">{video.duration} • {video.views}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}
