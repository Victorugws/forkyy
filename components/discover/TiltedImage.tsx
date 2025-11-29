'use client'

import { useRef, useState, useEffect } from 'react'

interface TiltedImageProps {
  src: string
  alt: string
  className?: string
  onError?: () => void
}

export function TiltedImage({ src, alt, className = '', onError }: TiltedImageProps) {
  const imageRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const image = imageRef.current
    if (!image) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = image.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 20
      const rotateY = (centerX - x) / 20

      setRotation({ x: rotateX, y: rotateY })
    }

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 })
    }

    image.addEventListener('mousemove', handleMouseMove)
    image.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      image.removeEventListener('mousemove', handleMouseMove)
      image.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={imageRef}
      className={className}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.05, 1.05, 1.05)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={onError}
      />
    </div>
  )
}
