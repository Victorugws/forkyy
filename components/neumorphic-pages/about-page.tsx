'use client'

import Link from 'next/link'
import { Target, Lightbulb, ArrowRight } from 'lucide-react'

export function NeumorphicAboutPage() {
  return (
    <div className="min-h-screen bg-background overflow-auto">
      {/* Hero Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="neu-card rounded-full px-6 py-2">
              <span className="text-sm font-medium uppercase tracking-wider">ABOUT ORB AI</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Transforming Business Through Intelligent AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We&apos;re on a mission to make advanced AI accessible to every business.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="neu-card rounded-3xl p-10">
            <div className="neu-inset w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Target className="size-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground text-lg">
              To democratize AI technology by delivering custom, scalable solutions that drive real business value.
            </p>
          </div>

          <div className="neu-card rounded-3xl p-10">
            <div className="neu-inset w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Lightbulb className="size-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground text-lg">
              To become the trusted AI partner for businesses worldwide, creating a future where intelligent automation enhances human potential.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "🎯", title: "Results-Driven", description: "We measure success by tangible impact." },
            { icon: "🤝", title: "Client-Focused", description: "Your success is our success." },
            { icon: "⚡", title: "Innovation", description: "We stay ahead of AI trends." },
            { icon: "🔒", title: "Trust & Security", description: "Your data security is our priority." }
          ].map((value, i) => (
            <div key={i} className="neu-card rounded-2xl p-6">
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="neu-card rounded-3xl p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">100+</div>
              <div className="text-sm text-muted-foreground">Projects Delivered</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">10+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Transform Your Business?
        </h2>
        <p className="text-muted-foreground text-lg mb-8">
          Let&apos;s discuss how ORB AI can help you achieve your goals.
        </p>
        <a
          href="/#contact"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold bg-foreground text-background hover:shadow-lg transition-all"
        >
          Get In Touch
          <ArrowRight className="size-5" />
        </a>
      </section>
    </div>
  )
}
