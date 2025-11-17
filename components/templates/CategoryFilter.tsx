'use client'

import { TemplateCategory, categoryMetadata } from '@/lib/prompts/registry'
import { getAllCategories } from '@/lib/prompts/registry'

interface CategoryFilterProps {
  selectedCategory: TemplateCategory | 'all'
  onCategoryChange: (category: TemplateCategory | 'all') => void
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange
}: CategoryFilterProps) {
  const categories = getAllCategories()

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 neu-inset p-2 rounded-2xl inline-flex min-w-full">
        {/* All Category */}
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'neu-raised bg-primary text-primary-foreground'
              : 'neu-card text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="mr-2">🌟</span>
          All Templates
        </button>

        {/* Category Buttons */}
        {categories.map(category => {
          const meta = categoryMetadata[category]
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? 'neu-raised bg-primary text-primary-foreground'
                  : 'neu-card text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="mr-2">{meta.icon}</span>
              {meta.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
