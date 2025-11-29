'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface Interest {
  id: string
  label: string
  icon: string
}

const AVAILABLE_INTERESTS: Interest[] = [
  { id: 'tech', label: 'Tech & Science', icon: '🔬' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'arts', label: 'Arts & Culture', icon: '🎨' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { id: 'health', label: 'Health', icon: '⚕️' },
  { id: 'politics', label: 'Politics', icon: '🏛️' },
  { id: 'business', label: 'Business', icon: '💼' }
]

export function InterestSelector() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['tech', 'finance'])
  const [showInfo, setShowInfo] = useState(true)

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const handleSave = () => {
    // In production, save to backend/localStorage
    console.log('Saving interests:', selectedInterests)
  }

  return (
    <div className="neu-card p-5 rounded-xl mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Make it yours</h3>
        {showInfo && (
          <button
            type="button"
            onClick={() => setShowInfo(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {showInfo && (
        <p className="text-xs text-muted-foreground mb-4">
          Select topics and interests to customize your Discover experience
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {AVAILABLE_INTERESTS.map((interest) => {
          const isSelected = selectedInterests.includes(interest.id)
          return (
            <button
              key={interest.id}
              type="button"
              onClick={() => toggleInterest(interest.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'neu-inset text-primary bg-primary/10'
                  : 'neu-button hover:neu-inset'
              }`}
            >
              <span>{interest.icon}</span>
              <span>{interest.label}</span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="w-full neu-button px-4 py-2.5 rounded-lg text-sm font-medium hover:neu-raised transition-all bg-primary/10 text-primary"
      >
        Save Interests
      </button>
    </div>
  )
}
