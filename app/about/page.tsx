import Link from 'next/link'
import { ArrowRight, Target, Lightbulb, Users, Award } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - ORB AI | AI Solutions & Automation Experts',
  description: 'Learn about ORB AI\'s mission to democratize AI technology. We deliver custom, scalable AI solutions that drive real business value for organizations of all sizes.',
  keywords: 'AI company, AI solutions, machine learning, automation, artificial intelligence, about ORB AI',
  openGraph: {
    title: 'About ORB AI - Transforming Business Through Intelligent AI',
    description: 'Discover how ORB AI empowers businesses with advanced AI technology, automation, and custom solutions.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="neu-card rounded-full px-6 py-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-medium uppercase tracking-wider">ABOUT ORB AI</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
            Transforming Business Through Intelligent AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make advanced AI accessible to every business, empowering organizations to automate, optimize, and innovate like never before.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="neu-card rounded-3xl p-10 bg-gradient-to-br from-background via-background to-muted/10">
            <div className="neu-inset w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Target className="size-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              To democratize AI technology by delivering custom, scalable solutions that drive real business value. We believe every organization deserves access to cutting-edge AI, regardless of their size or technical expertise.
            </p>
          </div>

          <div className="neu-card rounded-3xl p-10 bg-gradient-to-br from-background via-background to-muted/10">
            <div className="neu-inset w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Lightbulb className="size-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              To become the trusted AI partner for businesses worldwide, creating a future where intelligent automation enhances human potential and drives sustainable growth across all industries.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h2>
          <div className="space-y-6 text-left">
            <p className="text-muted-foreground text-lg leading-relaxed">
              ORB AI was founded with a simple yet powerful idea: artificial intelligence shouldn't be reserved for tech giants with unlimited budgets. We saw countless businesses struggling to leverage AI effectively, facing steep learning curves, high costs, and complex implementations.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our team of AI experts, developers, and business strategists came together to bridge this gap. We've spent years refining our approach, combining cutting-edge AI technology with practical business sense to deliver solutions that actually work.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Today, we're proud to serve businesses across industries, helping them automate workflows, gain insights from data, improve customer experiences, and make smarter decisions. Every project we take on is guided by our commitment to delivering measurable results and exceptional service.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Values</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            These principles guide everything we do, from how we build solutions to how we work with clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: "🎯",
              title: "Results-Driven",
              description: "We measure success by the tangible impact our solutions have on your business."
            },
            {
              icon: "🤝",
              title: "Client-Focused",
              description: "Your success is our success. We're partners in your AI journey, not just vendors."
            },
            {
              icon: "⚡",
              title: "Innovation",
              description: "We stay ahead of AI trends to bring you the most advanced, effective solutions."
            },
            {
              icon: "🔒",
              title: "Trust & Security",
              description: "Your data security and privacy are non-negotiable priorities in everything we build."
            },
            {
              icon: "🌟",
              title: "Excellence",
              description: "We hold ourselves to the highest standards in code quality, design, and delivery."
            },
            {
              icon: "📚",
              title: "Education",
              description: "We empower clients with knowledge, ensuring you understand and can leverage your AI tools."
            },
            {
              icon: "🚀",
              title: "Scalability",
              description: "We build solutions that grow with your business, from startup to enterprise."
            },
            {
              icon: "💡",
              title: "Simplicity",
              description: "Complex technology, simple experience. We make AI accessible and easy to use."
            }
          ].map((value, i) => (
            <div key={i} className="neu-card rounded-2xl p-6 bg-gradient-to-br from-background via-background to-muted/10 hover:shadow-neu-lg transition-all duration-300">
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="neu-card rounded-3xl p-12 bg-gradient-to-br from-background via-background to-muted/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-primary mb-2">100+</div>
              <div className="text-sm text-muted-foreground">Projects Delivered</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">10+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">24/7</div>
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
          Let's discuss how ORB AI can help you achieve your goals with intelligent automation and custom AI solutions.
        </p>
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold bg-foreground text-background hover:shadow-lg transition-all duration-300"
        >
          Get In Touch
          <ArrowRight className="size-5" />
        </Link>
      </section>
    </div>
  )
}
