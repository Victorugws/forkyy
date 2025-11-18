'use client'

import { getFeaturedTemplates, getAllTemplates } from '@/lib/prompts/registry'
import { TemplateCard } from './templates/TemplateCard'
import { useRouter } from 'next/navigation'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function FeaturedTemplates() {
  const router = useRouter()
  const featuredTemplates = getFeaturedTemplates()
  const allTemplates = getAllTemplates()

  // If no featured templates, show first 3 templates
  const templatesToShow = featuredTemplates.length > 0
    ? featuredTemplates.slice(0, 3)
    : allTemplates.slice(0, 3)

  const handleTemplateClick = (templateId: string) => {
    router.push(`/templates/${templateId}`)
  }

  return (
    <div className="w-full bg-background border-t border-border">
      <div className="container max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Sparkles className="size-8 text-primary" />
              AI Task Templates
            </h2>
            <p className="text-lg text-muted-foreground">
              Execute complex tasks with pre-configured AI workflows
            </p>
          </div>
          <Link
            href="/templates"
            className="neu-button px-6 py-3 font-medium flex items-center gap-2 hover:scale-105 transition-transform"
          >
            View All Templates
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Featured Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {templatesToShow.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onClick={() => handleTemplateClick(template.id)}
            />
          ))}
        </div>

        {/* Stats Bar */}
        <div className="neu-card p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">{allTemplates.length}+</p>
              <p className="text-sm text-muted-foreground mt-1">Templates</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">6</p>
              <p className="text-sm text-muted-foreground mt-1">Categories</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">100%</p>
              <p className="text-sm text-muted-foreground mt-1">Free</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">∞</p>
              <p className="text-sm text-muted-foreground mt-1">Possibilities</p>
            </div>
          </div>
        </div>

        {/* Categories Preview */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {['Research', 'Planning', 'Writing', 'Analysis', 'Coding', 'Creative'].map(category => (
            <Link
              key={category}
              href={`/templates?category=${category.toLowerCase()}`}
              className="neu-button px-4 py-2 text-sm font-medium hover:text-foreground transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
