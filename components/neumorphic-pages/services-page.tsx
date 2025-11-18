'use client'

import Link from 'next/link'
import { Bot, Workflow, MessageSquare, LineChart, Brain, Shield, ArrowRight } from 'lucide-react'
import { HeaderNavbar } from '@/components/header-navbar'
import { VideoBackground } from '@/components/VideoBackground'

export function NeumorphicServicesPage() {
  const services = [
    {
      icon: Bot,
      title: "Custom AI Development",
      description: "Tailored AI solutions built specifically for your business needs.",
      features: [
        "Machine learning model development",
        "Natural language processing",
        "Computer vision applications"
      ]
    },
    {
      icon: Workflow,
      title: "Intelligent Automation",
      description: "Streamline operations with AI-powered workflow automation.",
      features: [
        "Process automation & optimization",
        "Robotic process automation (RPA)",
        "Document processing & OCR"
      ]
    },
    {
      icon: MessageSquare,
      title: "Chatbots & Virtual Assistants",
      description: "Enhance customer experience with intelligent conversational AI.",
      features: [
        "Custom chatbot development",
        "Multi-channel support",
        "Natural language understanding"
      ]
    },
    {
      icon: LineChart,
      title: "AI-Powered Analytics",
      description: "Transform data into actionable insights with advanced analytics.",
      features: [
        "Predictive analytics & forecasting",
        "Customer behavior analysis",
        "Real-time dashboards"
      ]
    },
    {
      icon: Brain,
      title: "AI Strategy & Consulting",
      description: "Expert guidance to navigate the AI landscape and maximize ROI.",
      features: [
        "AI readiness assessment",
        "Use case identification",
        "Implementation roadmap"
      ]
    },
    {
      icon: Shield,
      title: "AI Security & Compliance",
      description: "Ensure your AI systems are secure, ethical, and compliant.",
      features: [
        "Data privacy & security audits",
        "Bias detection & mitigation",
        "GDPR & regulatory compliance"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background overflow-auto">
      <VideoBackground />
      <div className="relative z-10">
        <HeaderNavbar user={null} />
      {/* Hero */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="neu-card rounded-full px-6 py-2">
              <span className="text-sm font-medium uppercase tracking-wider">OUR SERVICES</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            AI Solutions for Every Business Need
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From custom AI development to intelligent automation, we deliver end-to-end solutions.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div key={i} className="neu-card rounded-3xl p-8">
              <div className="neu-inset w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <service.icon className="size-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Our Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { step: "01", title: "Discovery", description: "Understanding your business and goals" },
            { step: "02", title: "Strategy", description: "Designing custom AI solutions" },
            { step: "03", title: "Development", description: "Building and training AI models" },
            { step: "04", title: "Deployment", description: "Seamless system integration" },
            { step: "05", title: "Support", description: "Ongoing optimization and support" }
          ].map((step, i) => (
            <div key={i} className="neu-card rounded-2xl p-6">
              <div className="text-2xl font-bold mb-2">{step.step}</div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-muted-foreground text-lg mb-8">
          Let&apos;s discuss which AI services are right for your business.
        </p>
        <a
          href="/#contact"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold bg-foreground text-background hover:shadow-lg transition-all"
        >
          Contact Us
          <ArrowRight className="size-5" />
        </a>
      </section>
      </div>
    </div>
  )
}
