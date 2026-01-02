'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

interface Template {
  id: string
  name: string
  description?: string
  category?: string
}

interface TemplateCardProps {
  template: Template
  onClick: () => void
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <CardTitle className="text-lg">{template.name}</CardTitle>
        </div>
        {template.category && (
          <span className="text-xs text-muted-foreground">{template.category}</span>
        )}
      </CardHeader>
      {template.description && (
        <CardContent>
          <CardDescription>{template.description}</CardDescription>
        </CardContent>
      )}
    </Card>
  )
}

