'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ImageWithFallbackProps {
  url?: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
}

export function ImageWithFallback({
  url,
  alt,
  className,
  fill = false,
  width,
  height
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImage = async () => {
      if (!url) {
        setImgSrc(getPlaceholder(alt))
        setLoading(false)
        return
      }

      try {
        // Try to fetch metadata from our API
        const res = await fetch(`/api/images/metadata?url=${encodeURIComponent(url)}`)

        if (res.ok) {
          const data = await res.json()
          setImgSrc(data.image || getPlaceholder(alt))
        } else {
          setImgSrc(getPlaceholder(alt))
        }
      } catch (error) {
        console.error('Error fetching image:', error)
        setImgSrc(getPlaceholder(alt))
      } finally {
        setLoading(false)
      }
    }

    fetchImage()
  }, [url, alt])

  if (loading) {
    return <div className={`${className} bg-muted animate-pulse`} />
  }

  const imageProps = fill
    ? { fill: true }
    : { width: width || 800, height: height || 600 }

  return (
    <Image
      src={imgSrc || getPlaceholder(alt)}
      alt={alt}
      {...imageProps}
      className={className}
      onError={() => setImgSrc(getPlaceholder(alt))}
    />
  )
}

function getPlaceholder(text: string): string {
  // Generate Unsplash placeholder based on keywords
  const keywords = text.split(' ').slice(0, 2).join(',')
  return `https://source.unsplash.com/800x600/?${keywords}`
}
