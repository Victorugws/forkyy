'use client'

import { useState, useEffect } from 'react'
import { CustomDock } from '@/components/CustomDock'
import { VscShare, VscCheck, VscLoading } from 'react-icons/vsc'
import {
  RiDiscordFill,
  RiTwitterXFill,
  RiRedditFill,
  RiMessengerFill,
  RiPinterestFill,
  RiInstagramFill,
  RiSnapchatFill,
  RiWhatsappFill,
  RiFacebookFill,
  RiLinkedinFill,
  RiYoutubeFill,
  RiTiktokFill
} from 'react-icons/ri'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

interface PlatformInfo {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  maxLength: number
}

const platforms: PlatformInfo[] = [
  { id: 'facebook', name: 'Facebook', icon: <RiFacebookFill size={24} />, color: '#1877F2', maxLength: 63206 },
  { id: 'twitter', name: 'Twitter/X', icon: <RiTwitterXFill size={24} />, color: '#1CA1F1', maxLength: 280 },
  { id: 'instagram', name: 'Instagram', icon: <RiInstagramFill size={24} />, color: '#F914AF', maxLength: 2200 },
  { id: 'linkedin', name: 'LinkedIn', icon: <RiLinkedinFill size={24} />, color: '#0A66C2', maxLength: 3000 },
  { id: 'pinterest', name: 'Pinterest', icon: <RiPinterestFill size={24} />, color: '#F0002A', maxLength: 500 },
  { id: 'reddit', name: 'Reddit', icon: <RiRedditFill size={24} />, color: '#FF4500', maxLength: 40000 },
  { id: 'youtube', name: 'YouTube', icon: <RiYoutubeFill size={24} />, color: '#FF0000', maxLength: 5000 },
  { id: 'tiktok', name: 'TikTok', icon: <RiTiktokFill size={24} />, color: '#000000', maxLength: 2200 },
]

export default function SocialPage() {
  const searchParams = useSearchParams()
  const preselectedPlatforms = searchParams.get('platforms')?.split(',') || []

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(preselectedPlatforms)
  const [postContent, setPostContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
  }

  const handleSelectAll = () => {
    if (selectedPlatforms.length === platforms.length) {
      setSelectedPlatforms([])
    } else {
      setSelectedPlatforms(platforms.map(p => p.id))
    }
  }

  const getCharacterLimit = () => {
    if (selectedPlatforms.length === 0) return Infinity
    const limits = selectedPlatforms.map(id => {
      const platform = platforms.find(p => p.id === id)
      return platform?.maxLength || Infinity
    })
    return Math.min(...limits)
  }

  const charLimit = getCharacterLimit()
  const remainingChars = charLimit - postContent.length

  const handlePost = async () => {
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform')
      return
    }

    if (!postContent.trim()) {
      toast.error('Please enter your post content')
      return
    }

    if (postContent.length > charLimit) {
      toast.error(`Post exceeds character limit for selected platforms (${charLimit} chars)`)
      return
    }

    setIsPosting(true)

    try {
      const response = await fetch('/api/social/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platforms: selectedPlatforms,
          post: postContent,
          imageUrl: imageUrl || undefined
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to post')
      }

      toast.success('Successfully posted to selected platforms!')
      setShowSuccess(true)

      // Reset form after success
      setTimeout(() => {
        setPostContent('')
        setImageUrl('')
        setShowSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Error posting:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to post to social media')
    } finally {
      setIsPosting(false)
    }
  }

  const handleAIGenerate = () => {
    // This could integrate with the chat API to generate post content
    toast.info('AI generation coming soon!')
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <CustomDock />

      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-br from-background via-background to-purple-500/5">
        <div className="container max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-purple-500/10 p-3">
              <VscShare className="size-6 text-purple-500" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Share to Social Media</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Post your content directly to multiple social media platforms at once. Select your platforms,
            craft your message, and share instantly.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto px-6 py-12 flex-1">
        {/* Platform Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Select Platforms</h2>
            <button
              onClick={handleSelectAll}
              className="text-sm text-purple-500 hover:text-purple-600 font-medium"
            >
              {selectedPlatforms.length === platforms.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handlePlatformToggle(platform.id)}
                className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                  selectedPlatforms.includes(platform.id)
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-border bg-background hover:bg-accent'
                }`}
              >
                {selectedPlatforms.includes(platform.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <VscCheck className="text-white" size={16} />
                  </div>
                )}
                <div style={{ color: platform.color }}>
                  {platform.icon}
                </div>
                <span className="text-sm font-medium text-center">{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Create Your Post</h2>
            <button
              onClick={handleAIGenerate}
              className="text-sm text-purple-500 hover:text-purple-600 font-medium"
            >
              Generate with AI
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="postContent" className="block text-sm font-medium">
                  Post Content *
                </label>
                <span className={`text-sm ${remainingChars < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {remainingChars < Infinity ? `${remainingChars} chars remaining` : 'No limit'}
                </span>
              </div>
              <textarea
                id="postContent"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Write your post content here..."
                rows={8}
                className={`w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                  remainingChars < 0 ? 'border-red-500' : 'border-border'
                }`}
              />
              {selectedPlatforms.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Character limit based on: {selectedPlatforms.map(id =>
                    platforms.find(p => p.id === id)?.name
                  ).join(', ')}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium mb-2">
                Image URL (Optional)
              </label>
              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {imageUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Image Preview:</p>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-w-md rounded-xl border border-border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      toast.error('Invalid image URL')
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Post Button */}
        <div className="flex justify-center">
          <button
            onClick={handlePost}
            disabled={selectedPlatforms.length === 0 || !postContent.trim() || isPosting || remainingChars < 0}
            className="px-8 py-4 rounded-2xl bg-purple-500 text-white font-semibold text-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            {isPosting ? (
              <>
                <VscLoading className="animate-spin" size={20} />
                Posting...
              </>
            ) : showSuccess ? (
              <>
                <VscCheck size={20} />
                Posted Successfully!
              </>
            ) : (
              <>
                <VscShare size={20} />
                Post to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-12 p-6 rounded-2xl border border-border bg-accent/50">
          <h3 className="font-semibold mb-2">Social Media Integration</h3>
          <p className="text-sm text-muted-foreground mb-3">
            This feature uses Ayrshare API to post to multiple social media platforms simultaneously.
            Before you can post, you need to connect your social media accounts in the Ayrshare dashboard.
          </p>
          <a
            href="https://app.ayrshare.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-500 hover:text-purple-600 font-medium"
          >
            Connect Social Media Accounts →
          </a>
        </div>
      </div>
    </div>
  )
}
