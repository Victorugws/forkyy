'use client'

import {
  Pen,
  FileText,
  Mail,
  MessageSquare,
  BookOpen,
  Sparkles,
  CheckCircle2
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

const writingTemplates = [
  {
    name: 'Blog Post',
    icon: FileText,
    description: 'Create engaging blog content with AI assistance',
    color: 'bg-blue-500'
  },
  {
    name: 'Email',
    icon: Mail,
    description: 'Draft professional emails quickly',
    color: 'bg-green-500'
  },
  {
    name: 'Social Media',
    icon: MessageSquare,
    description: 'Write compelling social media posts',
    color: 'bg-purple-500'
  },
  {
    name: 'Essay',
    icon: BookOpen,
    description: 'Structure and write academic essays',
    color: 'bg-orange-500'
  },
  {
    name: 'Report',
    icon: FileText,
    description: 'Generate detailed reports and summaries',
    color: 'bg-red-500'
  },
  {
    name: 'Creative Writing',
    icon: Sparkles,
    description: 'Unleash your creativity with AI',
    color: 'bg-pink-500'
  }
]

const writingTools = [
  { name: 'Grammar Check', description: 'Fix grammar and spelling errors' },
  { name: 'Tone Adjustment', description: 'Adjust writing tone and style' },
  { name: 'Summarize', description: 'Create concise summaries' },
  { name: 'Expand', description: 'Add more detail and depth' },
  { name: 'Simplify', description: 'Make complex text easier to read' },
  { name: 'Translate', description: 'Translate to other languages' }
]

export default function WritingPage() {
  const [prompt, setPrompt] = useState('')

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Pen className="size-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Writing Assistant
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            Enhance your writing with AI-powered assistance. Create, edit, and
            improve content effortlessly.
          </p>

          {/* Writing Input */}
          <div className="max-w-4xl">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What would you like to write about? Describe your topic or paste your text here for improvement..."
                className="w-full min-h-[200px] bg-transparent text-base resize-none focus:outline-none placeholder:text-muted-foreground"
              />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium hover:bg-accent transition-colors">
                    <Sparkles className="size-4 inline mr-2" />
                    Improve
                  </button>
                  <button className="px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium hover:bg-accent transition-colors">
                    <CheckCircle2 className="size-4 inline mr-2" />
                    Check Grammar
                  </button>
                </div>
                <button className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-6 py-10 flex-1">
        {/* Templates Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Writing Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {writingTemplates.map((template, index) => (
              <Link
                key={index}
                href={`/search?q=write+${template.name.toLowerCase()}`}
                className="group relative flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div
                  className={`rounded-xl ${template.color} p-3 text-white flex-shrink-0`}
                >
                  <template.icon className="size-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Writing Tools */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Writing Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {writingTools.map((tool, index) => (
              <button
                key={index}
                className="group text-left rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors mb-1">
                  {tool.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Tips Section */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Writing Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-lg text-foreground mb-3">
                Be Specific
              </h3>
              <p className="text-sm text-muted-foreground">
                The more specific your prompt, the better the AI can assist
                you. Include details about tone, length, and target audience.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-lg text-foreground mb-3">
                Iterate and Refine
              </h3>
              <p className="text-sm text-muted-foreground">
                Don't expect perfection on the first try. Use the AI's output
                as a starting point and refine it to match your voice.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-lg text-foreground mb-3">
                Provide Context
              </h3>
              <p className="text-sm text-muted-foreground">
                Give background information about your topic to help the AI
                generate more relevant and accurate content.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-lg text-foreground mb-3">
                Review Carefully
              </h3>
              <p className="text-sm text-muted-foreground">
                Always review and fact-check AI-generated content before using
                it. Add your personal touch and expertise.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
