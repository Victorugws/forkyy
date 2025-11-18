'use client'
import { HeaderNavbar } from '@/components/header-navbar'

import { PenTool, FileText, Sparkles } from 'lucide-react'

export function NeumorphicWritingPage() {
  return (
    <div className="w-full min-h-screen bg-background">
      <HeaderNavbar user={null} />
      <div className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="neu-card rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="neu-raised rounded-full p-3">
              <PenTool className="size-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Writing</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            AI-powered writing assistant for all your content needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: FileText, title: 'Start Writing', description: 'Begin a new document with AI assistance' },
            { icon: Sparkles, title: 'AI Templates', description: 'Pre-built templates for common writing tasks' }
          ].map((item, i) => (
            <div key={i} className="neu-card rounded-2xl p-6 hover:shadow-neu-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
              <div className="neu-inset rounded-full p-4 w-fit mb-4">
                <item.icon className="size-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  )
}
