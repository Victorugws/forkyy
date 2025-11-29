'use client'

import { useState, useEffect } from 'react'
import { CustomDock } from '@/components/CustomDock'
import { VscRocket, VscCheck } from 'react-icons/vsc'
import { useSearchParams, useRouter } from 'next/navigation'
import { generateId } from 'ai'

const autopilotModes = {
  legality: {
    title: 'Legal Compliance',
    description: 'Ensure your startup meets all legal requirements',
    specs: [
      'Business structure (LLC, C-Corp, etc.)',
      'Terms of Service',
      'Privacy Policy',
      'GDPR Compliance',
      'Trademark & Copyright',
      'Employment law compliance'
    ]
  },
  veracity: {
    title: 'Fact Checking & Verification',
    description: 'Verify claims and ensure accuracy',
    specs: [
      'Market research validation',
      'Competitor analysis',
      'Technology feasibility',
      'Financial projections review',
      'User research validation'
    ]
  },
  engineering: {
    title: 'Engineering & Development',
    description: 'Build your technical infrastructure',
    specs: [
      'Tech stack selection',
      'Architecture design',
      'API development',
      'Database design',
      'DevOps setup',
      'Testing & QA'
    ]
  },
  business: {
    title: 'Business Strategy',
    description: 'Develop your business model and strategy',
    specs: [
      'Business model canvas',
      'Revenue model',
      'Growth strategy',
      'Competitive positioning',
      'Target market analysis',
      'Pricing strategy'
    ]
  },
  marketing: {
    title: 'Marketing & Growth',
    description: 'Create your go-to-market strategy',
    specs: [
      'Brand identity',
      'Content strategy',
      'Social media plan',
      'SEO strategy',
      'Paid advertising',
      'Email marketing'
    ]
  },
  research: {
    title: 'Research & Analysis',
    description: 'Deep dive into your market and users',
    specs: [
      'User research',
      'Market analysis',
      'Competitive research',
      'Industry trends',
      'Customer interviews',
      'Data analysis'
    ]
  },
  documentation: {
    title: 'Documentation',
    description: 'Create comprehensive documentation',
    specs: [
      'Technical documentation',
      'API documentation',
      'User guides',
      'Internal wikis',
      'Process documentation',
      'Knowledge base'
    ]
  },
  deployment: {
    title: 'Deployment & Launch',
    description: 'Deploy and launch your product',
    specs: [
      'Hosting setup',
      'Domain configuration',
      'SSL certificates',
      'CI/CD pipeline',
      'Monitoring & alerts',
      'Backup strategy'
    ]
  }
}

export default function AutopilotPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = (searchParams.get('mode') || 'all') as keyof typeof autopilotModes | 'all'
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([])
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [isStarting, setIsStarting] = useState(false)

  const currentMode = mode !== 'all' ? autopilotModes[mode] : null

  const handleSpecToggle = (spec: string) => {
    setSelectedSpecs(prev =>
      prev.includes(spec)
        ? prev.filter(s => s !== spec)
        : [...prev, spec]
    )
  }

  const handleSelectAll = () => {
    if (currentMode) {
      setSelectedSpecs(currentMode.specs)
    } else {
      const allSpecs = Object.values(autopilotModes).flatMap(m => m.specs)
      setSelectedSpecs(allSpecs)
    }
  }

  const handleStart = () => {
    if (!projectName || selectedSpecs.length === 0) {
      alert('Please enter a project name and select at least one specification')
      return
    }

    setIsStarting(true)

    // Create a search query with all the selected specs
    const query = `Help me build a startup called "${projectName}". ${projectDescription ? `Description: ${projectDescription}.` : ''} I need help with: ${selectedSpecs.join(', ')}. Please create a comprehensive plan and guide me through the implementation.`

    // Navigate to search with this query
    const chatId = generateId()
    window.dispatchEvent(new CustomEvent('browser:navigate', {
      detail: { url: `/search/${chatId}?q=${encodeURIComponent(query)}` }
    }))
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <CustomDock />

      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-br from-background via-background to-blue-500/5">
        <div className="container max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-blue-500/10 p-3">
              <VscRocket className="size-6 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              {currentMode ? currentMode.title : 'Autopilot'}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {currentMode
              ? currentMode.description
              : 'Autopilot handles everything needed for the completion of your startup. Select the areas you need help with, and our AI will guide you through the entire process.'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto px-6 py-12 flex-1">
        {/* Project Info */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Project Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium mb-2">
                Project Name *
              </label>
              <input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., My SaaS Startup"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="projectDescription" className="block text-sm font-medium mb-2">
                Project Description (Optional)
              </label>
              <textarea
                id="projectDescription"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Briefly describe your startup idea..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Select Specifications
            </h2>
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium"
            >
              Select All
            </button>
          </div>

          {currentMode ? (
            // Single mode view
            <div className="space-y-2">
              {currentMode.specs.map((spec) => (
                <label
                  key={spec}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className={`flex items-center justify-center w-5 h-5 rounded border-2 ${
                    selectedSpecs.includes(spec)
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-border'
                  }`}>
                    {selectedSpecs.includes(spec) && (
                      <VscCheck className="text-white" size={14} />
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedSpecs.includes(spec)}
                    onChange={() => handleSpecToggle(spec)}
                    className="sr-only"
                  />
                  <span className="flex-1 text-sm font-medium">{spec}</span>
                </label>
              ))}
            </div>
          ) : (
            // All modes view
            <div className="space-y-6">
              {Object.entries(autopilotModes).map(([key, modeData]) => (
                <div key={key} className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {modeData.title}
                  </h3>
                  <div className="grid gap-2">
                    {modeData.specs.map((spec) => (
                      <label
                        key={spec}
                        className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background hover:bg-accent cursor-pointer transition-colors"
                      >
                        <div className={`flex items-center justify-center w-5 h-5 rounded border-2 ${
                          selectedSpecs.includes(spec)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-border'
                        }`}>
                          {selectedSpecs.includes(spec) && (
                            <VscCheck className="text-white" size={14} />
                          )}
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedSpecs.includes(spec)}
                          onChange={() => handleSpecToggle(spec)}
                          className="sr-only"
                        />
                        <span className="flex-1 text-sm font-medium">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <button
            onClick={handleStart}
            disabled={!projectName || selectedSpecs.length === 0 || isStarting}
            className="px-8 py-4 rounded-2xl bg-blue-500 text-white font-semibold text-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
          >
            {isStarting ? 'Starting Autopilot...' : 'Start Autopilot'}
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-12 p-6 rounded-2xl border border-border bg-accent/50">
          <h3 className="font-semibold mb-2">How Autopilot Works</h3>
          <p className="text-sm text-muted-foreground">
            Once you start Autopilot, our AI will create a comprehensive plan tailored to your project.
            It will guide you through each selected specification step-by-step, providing actionable
            insights, templates, and resources. You can interact with the AI at any point to ask
            questions or request modifications to the plan.
          </p>
        </div>
      </div>
    </div>
  )
}
