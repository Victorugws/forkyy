'use client'
import { HeaderNavbar } from '@/components/header-navbar'

import { GraduationCap, BookOpen, FileText } from 'lucide-react'

export function NeumorphicAcademicPage() {
  const resources = [
    { icon: BookOpen, title: 'Research Papers', count: '10M+ papers' },
    { icon: FileText, title: 'Articles', count: '5M+ articles' },
    { icon: GraduationCap, title: 'Courses', count: '50K+ courses' }
  ]

  return (
    <div className="w-full min-h-screen bg-background">
      <HeaderNavbar user={null} />
      <div className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="neu-card rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="neu-raised rounded-full p-3">
              <GraduationCap className="size-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Academic</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Access research papers, academic articles, and educational resources
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {resources.map((resource, i) => (
            <div key={i} className="neu-card rounded-2xl p-6 hover:shadow-neu-lg transition-all duration-300">
              <div className="neu-inset rounded-full p-4 w-fit mb-4">
                <resource.icon className="size-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{resource.title}</h3>
              <p className="text-sm text-muted-foreground">{resource.count}</p>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  )
}
