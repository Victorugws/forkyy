'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface PoliticianAvatarProps {
  name: string
  size?: number
  className?: string
}

// Generate a consistent color based on name
function getColorFromName(name: string): string {
  const colors = [
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#F59E0B', // amber
    '#10B981', // emerald
    '#06B6D4', // cyan
    '#6366F1', // indigo
    '#EF4444', // red
    '#14B8A6', // teal
    '#F97316', // orange
  ]

  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

// Common politician bioguide IDs mapping (for well-known politicians)
// Bioguide IDs are unique identifiers for each member of Congress
// Source: https://theunitedstates.io/
const POLITICIAN_BIOGUIDE_IDS: Record<string, string> = {
  'Nancy Pelosi': 'P000197',
  'Josh Gottheimer': 'G000583',
  'Michael McCaul': 'M001165',
  'Dan Crenshaw': 'C001120',
  'Tommy Tuberville': 'T000278',
  // Additional well-known politicians
  'Kevin McCarthy': 'M001165',
  'Chuck Schumer': 'S000148',
  'Mitch McConnell': 'M000355',
  'Alexandria Ocasio-Cortez': 'O000172',
  'Ilhan Omar': 'O000172',
  'Rashida Tlaib': 'T000278',
  'Ayanna Pressley': 'P000617',
  'Marjorie Taylor Greene': 'G000596',
  'Matt Gaetz': 'G000579',
  'Adam Schiff': 'S001150',
  'Jim Jordan': 'J000289',
}

// Generate politician photo URL using bioguide ID
function getPoliticianPhotoUrl(name: string): string | null {
  // Check if we have a known bioguide ID for this politician
  const bioguideId = POLITICIAN_BIOGUIDE_IDS[name]
  
  if (bioguideId) {
    // Use GitHub raw content (Congress photos repository)
    // This is the most reliable source for Congress member photos
    // Format: https://raw.githubusercontent.com/unitedstates/images/gh-pages/congress/{size}/{bioguide_id}.jpg
    return `https://raw.githubusercontent.com/unitedstates/images/gh-pages/congress/450x550/${bioguideId}.jpg`
  }
  
  // If no bioguide ID found, return null to use fallback
  return null
}

export function PoliticianAvatar({ name, size = 48, className = '' }: PoliticianAvatarProps) {
  const [imageError, setImageError] = useState(false)
  
  const photoUrl = getPoliticianPhotoUrl(name)
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  const bgColor = getColorFromName(name)

  // If we have a photo URL and no error, try to show the image
  if (photoUrl && !imageError) {
    return (
      <div
        className={`relative rounded-full overflow-hidden ${className}`}
        style={{ width: size, height: size, minWidth: size, minHeight: size }}
      >
        <Image
          src={photoUrl}
          alt={name}
          width={size}
          height={size}
          className="object-cover w-full h-full"
          onError={() => setImageError(true)}
          unoptimized
        />
      </div>
    )
  }

  // Fallback to colored initials
  return (
    <div
      className={`rounded-full flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        backgroundColor: bgColor,
        color: 'white',
        fontSize: `${size * 0.35}px`,
        fontWeight: 'bold'
      }}
    >
      {initials}
    </div>
  )
}

