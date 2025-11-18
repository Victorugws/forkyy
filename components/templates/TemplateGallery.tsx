'use client'

import { useState } from 'react'
import { TemplateCard } from './TemplateCard'
import { CategoryFilter } from './CategoryFilter'
import {
  getAllTemplates,
  getFeaturedTemplates,
  getTemplatesByCategory
} from '@/lib/prompts/registry'
import { TemplateCategory } from '@/lib/prompts/types'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function TemplateGallery() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<
    TemplateCategory | 'all'
  >('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Get templates based on selected category
  const getFilteredTemplates = () => {
    let templates =
      selectedCategory === 'all'
        ? getAllTemplates()
        : getTemplatesByCategory(selectedCategory)

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      templates = templates.filter(
        t =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return templates
  }

  const filteredTemplates = getFilteredTemplates()
  const featuredTemplates = getFeaturedTemplates()

  const handleTemplateClick = (templateId: string) => {
    router.push(`/templates/${templateId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              AI Task Templates
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Powered by OpenManus - Execute complex tasks with pre-configured
              AI workflows. From research to planning, writing to analysis.
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full neu-input rounded-2xl pl-12 pr-6 py-4 text-base placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6 py-12">
        {/* Featured Templates */}
        {!searchQuery && selectedCategory === 'all' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <span>⭐</span>
              Featured Templates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onClick={() => handleTemplateClick(template.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Templates Grid */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {selectedCategory === 'all'
              ? 'All Templates'
              : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Templates`}
            <span className="text-muted-foreground text-lg ml-2">
              ({filteredTemplates.length})
            </span>
          </h2>

          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onClick={() => handleTemplateClick(template.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 neu-card rounded-2xl">
              <p className="text-muted-foreground text-lg">
                No templates found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
