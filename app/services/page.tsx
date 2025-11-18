import Link from 'next/link'
import { ArrowRight, Bot, Brain, LineChart, Workflow, MessageSquare, Shield, Code, Sparkles } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Services - ORB AI | Custom AI Development & Automation',
  description: 'Explore ORB AI\'s comprehensive AI services including custom development, intelligent automation, chatbots, analytics, consulting, and security solutions for your business.',
  keywords: 'AI services, custom AI development, chatbot development, AI automation, machine learning, AI consulting, AI security',
  openGraph: {
    title: 'AI Services - ORB AI | End-to-End AI Solutions',
    description: 'From custom AI development to intelligent automation and analytics. Discover how ORB AI can transform your business.',
    type: 'website',
  },
}

export default function ServicesPage() {
  const services = [
    {
      icon: Bot,
      title: "Custom AI Development",
      description: "Tailored AI solutions built specifically for your business needs, from concept to deployment.",
      features: [
        "Machine learning model development",
        "Natural language processing",
        "Computer vision applications",
        "Predictive analytics systems",
        "Custom algorithm design"
      ],
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: Workflow,
      title: "Intelligent Automation",
      description: "Streamline operations and reduce manual work with AI-powered workflow automation.",
      features: [
        "Process automation & optimization",
        "Robotic process automation (RPA)",
        "Document processing & OCR",
        "Automated data entry & validation",
        "Integration with existing systems"
      ],
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: MessageSquare,
      title: "Chatbots & Virtual Assistants",
      description: "Enhance customer experience with intelligent conversational AI that works 24/7.",
      features: [
        "Custom chatbot development",
        "Multi-channel support (web, mobile, messaging)",
        "Natural language understanding",
        "Integration with CRM & databases",
        "Analytics & continuous improvement"
      ],
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: LineChart,
      title: "AI-Powered Analytics",
      description: "Transform data into actionable insights with advanced analytics and visualization.",
      features: [
        "Predictive analytics & forecasting",
        "Customer behavior analysis",
        "Real-time dashboards",
        "Anomaly detection",
        "Business intelligence integration"
      ],
      color: "from-orange-500/20 to-amber-500/20"
    },
    {
      icon: Brain,
      title: "AI Strategy & Consulting",
      description: "Expert guidance to help you navigate the AI landscape and maximize ROI.",
      features: [
        "AI readiness assessment",
        "Use case identification",
        "Technology stack recommendations",
        "Implementation roadmap",
        "Training & knowledge transfer"
      ],
      color: "from-indigo-500/20 to-violet-500/20"
    },
    {
      icon: Shield,
      title: "AI Security & Compliance",
      description: "Ensure your AI systems are secure, ethical, and compliant with regulations.",
      features: [
        "Data privacy & security audits",
        "Bias detection & mitigation",
        "GDPR & regulatory compliance",
        "Model explainability",
        "Ongoing monitoring & maintenance"
      ],
      color: "from-red-500/20 to-rose-500/20"
    }
  ]

  const industries = [
    { name: "Healthcare", icon: "🏥" },
    { name: "Finance", icon: "💰" },
    { name: "Retail & E-commerce", icon: "🛍️" },
    { name: "Manufacturing", icon: "🏭" },
    { name: "Education", icon: "📚" },
    { name: "Real Estate", icon: "🏘️" },
    { name: "Legal", icon: "⚖️" },
    { name: "Marketing", icon: "📱" }
  ]

  const process = [
    {
      step: "01",
      title: "Discovery",
      description: "We start by understanding your business, challenges, and goals through in-depth consultation."
    },
    {
      step: "02",
      title: "Strategy",
      description: "Our team designs a custom AI solution tailored to your specific needs and budget."
    },
    {
      step: "03",
      title: "Development",
      description: "We build and train your AI models using cutting-edge technology and best practices."
    },
    {
      step: "04",
      title: "Deployment",
      description: "Seamless integration into your existing systems with minimal disruption."
    },
    {
      step: "05",
      title: "Support",
      description: "Ongoing monitoring, optimization, and support to ensure continued success."
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="neu-card rounded-full px-6 py-2 flex items-center gap-2">
              <Sparkles className="size-4" />
              <span className="text-sm font-medium uppercase tracking-wider">OUR SERVICES</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
            AI Solutions for Every Business Need
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From custom AI development to intelligent automation, we deliver end-to-end solutions that drive real business results.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div
              key={i}
              className="neu-card rounded-3xl p-8 bg-gradient-to-br from-background via-background to-muted/10 hover:shadow-neu-lg transition-all duration-300"
            >
              <div className={`neu-inset w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${service.color}`}>
                <service.icon className="size-8 text-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {service.description}
              </p>
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
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Process</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A proven methodology that ensures successful AI implementation from start to finish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {process.map((step, i) => (
            <div key={i} className="neu-card rounded-2xl p-6 bg-gradient-to-br from-background via-background to-muted/10 relative">
              <div className="neu-raised w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-xl font-bold">
                {step.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              {i < process.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                  <ArrowRight className="size-6 text-muted-foreground/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Industries We Serve</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our AI solutions are tailored to meet the unique challenges of diverse industries.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {industries.map((industry, i) => (
            <div
              key={i}
              className="neu-card rounded-2xl p-6 bg-gradient-to-br from-background via-background to-muted/10 hover:shadow-neu-lg transition-all duration-300 text-center"
            >
              <div className="text-4xl mb-3">{industry.icon}</div>
              <h3 className="font-semibold">{industry.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="neu-card rounded-3xl p-12 bg-gradient-to-br from-background via-background to-muted/10">
          <div className="text-center mb-12">
            <Code className="size-12 mx-auto mb-4 text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Cutting-Edge Technology</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We leverage the latest AI frameworks and tools to build robust, scalable solutions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {["TensorFlow", "PyTorch", "OpenAI GPT", "LangChain", "Anthropic Claude", "Google AI", "Azure AI", "AWS AI"].map((tech, i) => (
              <div key={i} className="neu-inset rounded-xl px-4 py-3 font-medium text-sm">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-muted-foreground text-lg mb-8">
          Let's discuss which AI services are right for your business and create a custom solution together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold bg-foreground text-background hover:shadow-lg transition-all duration-300"
          >
            Contact Us
            <ArrowRight className="size-5" />
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold neu-card hover:shadow-neu-lg transition-all duration-300"
          >
            View Pricing
          </Link>
        </div>
      </section>
    </div>
  )
}
