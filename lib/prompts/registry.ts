import { PromptTemplate, TemplateCategory } from './types'
import { researchTemplates } from './templates/research'
import { planningTemplates } from './templates/planning'
import { writingTemplates } from './templates/writing'
import { analysisTemplates } from './templates/analysis'
import { codingTemplates } from './templates/coding'
import { creativeTemplates } from './templates/creative'
import { academicTemplates } from './templates/academic'

// Combine all templates
export const allTemplates: PromptTemplate[] = [
  ...researchTemplates,
  ...planningTemplates,
  ...writingTemplates,
  ...analysisTemplates,
  ...codingTemplates,
  ...creativeTemplates,
  ...academicTemplates
]

// Get all templates
export function getAllTemplates(): PromptTemplate[] {
  return allTemplates
}

// Get template by ID
export function getTemplateById(id: string): PromptTemplate | undefined {
  return allTemplates.find(template => template.id === id)
}

// Get templates by category
export function getTemplatesByCategory(
  category: TemplateCategory
): PromptTemplate[] {
  return allTemplates.filter(template => template.category === category)
}

// Get featured templates
export function getFeaturedTemplates(): PromptTemplate[] {
  return allTemplates.filter(template => template.featured === true)
}

// Search templates by query
export function searchTemplates(query: string): PromptTemplate[] {
  const lowerQuery = query.toLowerCase()
  return allTemplates.filter(
    template =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

// Get category metadata
export const categoryMetadata: Record<
  TemplateCategory,
  { name: string; description: string; icon: string }
> = {
  research: {
    name: 'Research',
    description: 'In-depth research and investigation',
    icon: '🔍'
  },
  planning: {
    name: 'Planning',
    description: 'Project and travel planning',
    icon: '📋'
  },
  writing: {
    name: 'Writing',
    description: 'Content creation and writing',
    icon: '✍️'
  },
  analysis: {
    name: 'Analysis',
    description: 'Data and business analysis',
    icon: '📊'
  },
  coding: {
    name: 'Coding',
    description: 'Software development tasks',
    icon: '💻'
  },
  creative: {
    name: 'Creative',
    description: 'Ideation and creative work',
    icon: '🎨'
  },
  academic: {
    name: 'Academic',
    description: 'Academic research and writing',
    icon: '🎓'
  }
}

export function getAllCategories(): TemplateCategory[] {
  return Object.keys(categoryMetadata) as TemplateCategory[]
}
