'use client'

/**
 * Neumorphic Services Page Component
 */

export function NeumorphicServicesPage() {
  const services = [
    {
      title: 'AI Consulting',
      description: 'Strategic guidance for AI implementation',
      features: ['Custom AI Strategy', 'ROI Analysis', 'Implementation Roadmap']
    },
    {
      title: 'Machine Learning',
      description: 'Advanced ML models and solutions',
      features: ['Predictive Analytics', 'Custom Models', 'Model Training']
    },
    {
      title: 'NLP Solutions',
      description: 'Natural language processing services',
      features: ['Text Analysis', 'Chatbots', 'Sentiment Analysis']
    },
    {
      title: 'Computer Vision',
      description: 'Image and video AI analysis',
      features: ['Object Detection', 'Facial Recognition', 'Image Classification']
    },
    {
      title: 'AI Integration',
      description: 'Seamless integration with existing systems',
      features: ['API Development', 'System Integration', 'Automation']
    },
    {
      title: 'AI Training',
      description: 'Education and training programs',
      features: ['Workshops', 'Courses', 'Certification']
    }
  ]

  return (
    <div className="w-full min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="neu-card rounded-3xl p-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Our Services</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive AI solutions tailored to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div key={i} className="neu-card rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, j) => (
                  <li key={j} className="text-xs text-muted-foreground flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="neu-button w-full rounded-xl p-3 text-sm font-medium">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
