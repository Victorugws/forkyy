'use client'

import { cn } from '@/lib/utils'

interface PropertyCategorySectionProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { name: 'MLS', count: 40 },
  { name: 'Pre-Foreclosures', count: 20 },
  { name: 'Auctions', count: 20 },
  { name: 'Bank Owned', count: 4 },
  { name: 'Cash Buyers', count: 200 },
  { name: 'Liens', count: 100 },
  { name: 'Vacant', count: 4 },
  { name: 'High Equity', count: 500 },
]

export default function PropertyCategorySection({
  selectedCategory,
  onCategoryChange,
}: PropertyCategorySectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-[#111827]">Property category</h2>
        <p className="text-sm text-[#6B7280] mt-1.5">
          Select the property category for you to invest in.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name
          return (
            <button
              key={category.name}
              onClick={() => onCategoryChange(category.name)}
              className={cn(
                'text-sm font-medium transition-colors pb-2 relative',
                isSelected
                  ? 'text-[#111827]'
                  : 'text-[#374151] hover:text-[#111827]'
              )}
            >
              {category.count} {category.name}
              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#111827]" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
