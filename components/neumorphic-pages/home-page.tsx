'use client'

import { useState } from 'react'
import { HeaderNavbar } from '@/components/header-navbar'
import { MorphingCanvas } from '@/components/MorphingCanvas'
import { FeaturedTemplates } from '@/components/FeaturedTemplates'
import { ContactForm } from '@/components/ContactForm'
import { CalBooking } from '@/components/CalBooking'
import { StripeButton } from '@/components/StripeButton'

/**
 * Neumorphic Home Page Component
 * Displays the main homepage with animated eye morphing canvas and all content sections
 */

export function NeumorphicHomePage() {
  const [hasSearched, setHasSearched] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Navigate to search results
    window.dispatchEvent(new CustomEvent('browser:navigate', {
      detail: { url: `/search?q=${encodeURIComponent(query)}` }
    }))
  }

  if (hasSearched) {
    // Redirect to search page handled above
    return null
  }

  return (
    <div className="w-full bg-background">
      {/* Header Navbar */}
      <HeaderNavbar user={null} />

      {/* Morphing Canvas with Eye Animation */}
      <MorphingCanvas
        onSearchSubmit={handleSearch}
        autoProgress={true}
      />

      {/* Featured Templates */}
      <FeaturedTemplates />

      {/* Process Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <div className="neu-card rounded-full px-6 py-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-medium uppercase tracking-wider">PROCESS</span>
          </div>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-4">
          Simple & Scalable
        </h2>
        <p className="text-center max-w-2xl mx-auto mb-16 text-lg text-muted-foreground">
          A transparent process of collaboration and feedback
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "📊",
              title: "Workflow Assessment",
              description: "We begin by examining your existing workflows to identify where AI can deliver the greatest impact.",
              number: "01"
            },
            {
              icon: "✏️",
              title: "Deploy with Confidence",
              description: "Our team develops custom AI systems built around your goals, ensuring safe and reliable deployment.",
              number: "02"
            },
            {
              icon: "🎯",
              title: "Ongoing Support & Optimization",
              description: "After deployment, we provide support and refine your AI systems to keep them performing at their best.",
              number: "03"
            }
          ].map((item, i) => (
            <div key={i} className="relative group">
              <div className="neu-card rounded-3xl p-8 h-full bg-gradient-to-br from-background via-background to-muted/10 hover:shadow-neu-lg transition-all duration-300">
                <div className="w-16 h-16 neu-raised rounded-2xl flex items-center justify-center text-2xl mb-6">
                  <span>{item.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed">{item.description}</p>
                <div className="absolute bottom-8 right-8 text-6xl font-bold text-muted/5">{item.number}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <div className="neu-card rounded-full px-6 py-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium uppercase tracking-wider">PROJECTS</span>
          </div>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-4">
          Proven Impact & Results
        </h2>
        <p className="text-center max-w-2xl mx-auto mb-16 text-lg text-muted-foreground">
          Explore Projects that reflect our AI expertise & real world impact
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "MedioCare — AI Triage Assistant for Healthcare",
              description: "We built a custom AI triage assistant that evaluates symptoms and routes patients to the appropriate care level.",
              stats: [
                { label: "Reduced average wait", value: "23%" },
                { label: "Rise in patient satisfaction", value: "17%" }
              ]
            },
            {
              title: "RetailBoost — Predictive Inventory System",
              description: "Developed an AI system that predicts inventory needs and optimizes stock levels across multiple locations.",
              stats: [
                { label: "Reduction in overstock", value: "31%" },
                { label: "Improvement in fulfillment", value: "24%" }
              ]
            },
            {
              title: "FinanceAI — Automated Risk Analysis",
              description: "Created an AI-powered risk analysis platform that evaluates financial portfolios in real-time.",
              stats: [
                { label: "Faster risk assessment", value: "45%" },
                { label: "Accuracy improvement", value: "28%" }
              ]
            }
          ].map((project, i) => (
            <div key={i} className="neu-card rounded-3xl p-8 bg-gradient-to-br from-background via-background to-muted/10 hover:shadow-neu-lg transition-all duration-300 group">
              <div className="relative overflow-hidden rounded-2xl mb-6 h-48 neu-inset bg-gradient-to-br from-muted/20 to-muted/5">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                <div className="absolute bottom-4 left-4 text-sm font-semibold text-muted-foreground">
                  0{i + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
              <p className="text-muted-foreground text-base leading-relaxed mb-6">{project.description}</p>
              <div className="grid grid-cols-2 gap-4">
                {project.stats.map((stat, j) => (
                  <div key={j} className="neu-inset rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customers Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <div className="neu-card rounded-full px-6 py-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-medium uppercase tracking-wider">CUSTOMERS</span>
          </div>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-4">
          What Our Clients Say
        </h2>
        <p className="text-center max-w-2xl mx-auto mb-16 text-lg text-muted-foreground">
          Join customers who trust AI to transform their business.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              text: "Their AI-driven approach helped us reach the right audience and grow faster with smarter insights—streamlining our strategy, improving engagement, and delivering results we couldn't achieve before.",
              rating: 4,
              name: "Brendan",
              title: "Marketing Director at StratIQ",
              avatar: "👨"
            },
            {
              text: "Their team helped us identify key opportunities for AI, then built tools that boosted both our speed and accuracy. We're already seeing results.",
              rating: 4,
              name: "Lena M",
              title: "Manager at NovaTech",
              avatar: "👩"
            },
            {
              text: "From ideation to final delivery, they were incredibly proactive and sharp. Our new AI-powered assistant reduced manual work and improved user satisfaction",
              rating: 4,
              name: "Eli R",
              title: "COO at GridFrame",
              avatar: "👨"
            }
          ].map((testimonial, i) => (
            <div key={i} className="neu-card rounded-3xl p-8 bg-gradient-to-br from-background via-background to-muted/10 hover:shadow-neu-lg transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className={j < testimonial.rating ? "text-yellow-500" : "text-muted"}>★</span>
                ))}
              </div>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">{testimonial.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full neu-card flex items-center justify-center text-2xl bg-gradient-to-br from-background to-muted/20">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <div className="neu-card rounded-full px-6 py-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium uppercase tracking-wider">PRICING</span>
          </div>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-4">
          Simple Price For All
        </h2>
        <p className="text-center max-w-2xl mx-auto mb-16 text-lg text-muted-foreground">
          Flexible pricing plans that fit your budget & scale with needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Starter",
              price: "$800",
              description: "Ideal for businesses ready to explore AI and intelligent automation",
              features: [
                "Basic AI Tools",
                "Limited Automation Features",
                "Real-Time Reporting",
                "Basic Chatbot Integration"
              ],
              popular: false
            },
            {
              name: "Pro",
              price: "$1700",
              description: "Built for companies that want to gain an edge with AI-powered automation",
              features: [
                "Advanced AI Tools",
                "Customizable Workflows",
                "AI-Powered Analytics",
                "Premium Chatbot Features",
                "Cross-Platform Integrations"
              ],
              popular: true
            },
            {
              name: "Enterprise",
              price: "$4700",
              description: "For businesses aiming to harness AI and automation to lead their industry",
              features: [
                "Fully Customized AI Solutions",
                "Unlimited Integrations",
                "Advanced Reporting & Insights",
                "Scalable AI Solutions",
                "Team Collaboration Features",
                "Priority Feature Access"
              ],
              popular: false
            }
          ].map((plan, i) => (
            <div key={i} className={`neu-card rounded-3xl p-8 bg-gradient-to-br from-background via-background to-muted/10 hover:shadow-neu-lg transition-all duration-300 ${plan.popular ? 'ring-2 ring-foreground/20' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                {plan.popular && (
                  <div className="neu-card rounded-full px-3 py-1 text-xs font-medium">Popular</div>
                )}
              </div>
              <div className="text-5xl font-bold mb-2">{plan.price}<span className="text-lg text-muted-foreground">/month</span></div>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">{plan.description}</p>
              <button className="w-full mb-8 py-4 neu-button rounded-2xl font-semibold hover:shadow-neu-lg transition-all">
                Get Started →
              </button>
              <div className="space-y-3">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <div className="neu-card rounded-full px-6 py-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium uppercase tracking-wider">CONTACT</span>
          </div>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-center mb-4">
          Let's Build Something
        </h2>
        <p className="text-center max-w-2xl mx-auto mb-16 text-lg text-muted-foreground">
          Ready to transform your business with AI? Get in touch.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="neu-card rounded-3xl p-8">
            <ContactForm />
          </div>
          <div className="neu-card rounded-3xl p-8">
            <CalBooking />
          </div>
        </div>
      </section>
    </div>
  )
}
