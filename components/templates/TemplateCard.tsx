'use client'

import { PromptTemplate } from '@/lib/prompts/types'
import { ArrowRight, Clock, Tag } from 'lucide-react'
import Link from 'next/link'

interface TemplateCardProps {
  template: PromptTemplate
  onClick?: () => void
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <div
      onClick={handleClick}
      className="group relative rounded-2xl neu-card p-6 hover:neu-raised transition-all cursor-pointer"
    >
      {/* Icon */}
      <div className="w-12 h-12 neu-inset flex items-center justify-center mb-4">
        <span className="text-2xl">{template.icon}</span>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {template.name}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
        {template.description}
      </p>

      {/* Meta Info */}
      <div className="flex items-center gap-3 mb-4">
        {/* Category Badge */}
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full neu-inset text-xs font-medium text-foreground capitalize">
          {template.category}
        </span>

        {/* Estimated Time */}
        {template.estimatedTime && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {template.estimatedTime}
          </span>
        )}
      </div>

      {/* Tags */}
      {template.tags && template.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {template.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-muted-foreground"
            >
              <Tag className="size-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Featured Badge */}
      {template.featured && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            ⭐ Featured
          </span>
        </div>
      )}

      {/* Use Button */}
      <button className="absolute bottom-6 right-6 p-2.5 neu-button opacity-0 group-hover:opacity-100 transition-all group-hover:scale-110">
        <ArrowRight className="size-4" />
      </button>
    </div>
  )
}
