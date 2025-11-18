'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getTemplateById } from '@/lib/prompts/registry'
import { TemplateForm } from '@/components/templates/TemplateForm'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { prepareTemplate, generateTemplateChatId } from '@/lib/prompts/engine'

interface TemplatePageProps {
  params: Promise<{ id: string }>
}

export default function TemplatePage({ params }: TemplatePageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [isExecuting, setIsExecuting] = useState(false)

  const template = getTemplateById(id)

  if (!template) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center neu-card rounded-2xl p-12 max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Template Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The template you're looking for doesn't exist.
          </p>
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg neu-button bg-primary text-primary-foreground font-medium"
          >
            <ArrowLeft className="size-4" />
            Back to Templates
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (variables: Record<string, any>) => {
    setIsExecuting(true)

    try {
      // Prepare the prompts with variables
      const { systemPrompt, userPrompt } = prepareTemplate(template, variables)

      // Generate a chat ID for this execution
      const chatId = generateTemplateChatId(template.id)

      // Create the chat with the template prompts
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          id: chatId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to execute template')
      }

      // Redirect to the chat page to see the results
      router.push(`/search/${chatId}`)
    } catch (error) {
      console.error('Error executing template:', error)
      alert('Failed to execute template. Please try again.')
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container max-w-4xl mx-auto px-6 py-8">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 neu-button px-4 py-2 rounded-lg"
          >
            <ArrowLeft className="size-4" />
            Back to Templates
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto px-6 py-12">
        <TemplateForm
          template={template}
          onSubmit={handleSubmit}
          isLoading={isExecuting}
        />

        {/* Example Section */}
        {template.examples && template.examples.length > 0 && (
          <div className="mt-12 neu-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              💡 Examples
            </h3>
            <div className="space-y-4">
              {template.examples.map((example, index) => (
                <div
                  key={index}
                  className="neu-inset rounded-xl p-4 space-y-2"
                >
                  <h4 className="font-medium text-foreground">
                    {example.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {example.description}
                  </p>
                  {example.expectedOutput && (
                    <p className="text-xs text-muted-foreground italic">
                      Expected output: {example.expectedOutput}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Powered By Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by{' '}
            <a
              href="https://github.com/FoundationAgents/OpenManus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              OpenManus
              <ExternalLink className="size-3" />
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
