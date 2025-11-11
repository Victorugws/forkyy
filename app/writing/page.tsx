'use client'

import {
  Pen,
  FileText,
  Mail,
  MessageSquare,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Loader2
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleImprove = async () => {
    if (!prompt.trim()) {
      alert('Please enter some text to improve')
      return
    }
    setIsProcessing(true)
    setTimeout(() => {
      router.push(`/search?q=${encodeURIComponent(`Improve this text: ${prompt}`)}`)
    }, 500)
  }

  const handleGrammarCheck = async () => {
    if (!prompt.trim()) {
      alert('Please enter some text to check')
      return
    }
    setIsProcessing(true)
    setTimeout(() => {
      router.push(`/search?q=${encodeURIComponent(`Check grammar and fix errors in: ${prompt}`)}`)
    }, 500)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please describe what you want to write')
      return
    }
    setIsProcessing(true)
    setTimeout(() => {
      router.push(`/search?q=${encodeURIComponent(prompt)}`)
    }, 500)
  }

  const handleTemplateClick = (templateName: string) => {
    router.push(`/search?q=${encodeURIComponent(`Write a ${templateName.toLowerCase()} about: `)}`)
  }

  const handleToolClick = (toolName: string) => {
    if (!prompt.trim()) {
      alert(`Please enter text to ${toolName.toLowerCase()}`)
      return
    }
    let query = ''
    switch (toolName) {
      case 'Grammar Check':
        query = `Check grammar and fix errors in: ${prompt}`
        break
      case 'Tone Adjustment':
        query = `Adjust the tone of this text to be more professional: ${prompt}`
        break
      case 'Summarize':
        query = `Summarize this text: ${prompt}`
        break
      case 'Expand':
        query = `Expand on this text with more detail: ${prompt}`
        break
      case 'Simplify':
        query = `Simplify and make this text easier to read: ${prompt}`
        break
      case 'Translate':
        query = `Translate this text: ${prompt}`
        break
    }
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

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
                  <button
                    onClick={handleImprove}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="size-4 inline mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="size-4 inline mr-2" />
                    )}
                    Improve
                  </button>
                  <button
                    onClick={handleGrammarCheck}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="size-4 inline mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="size-4 inline mr-2" />
                    )}
                    Check Grammar
                  </button>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={isProcessing}
                  className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isProcessing && <Loader2 className="size-4 inline mr-2 animate-spin" />}
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
              <button
                key={index}
                onClick={() => handleTemplateClick(template.name)}
                className="group relative flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg text-left"
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
              </button>
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
                onClick={() => handleToolClick(tool.name)}
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
