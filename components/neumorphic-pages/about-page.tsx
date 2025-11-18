'use client'

/**
 * Neumorphic About Page Component
 */

export function NeumorphicAboutPage() {
  return (
    <div className="w-full min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="neu-card rounded-3xl p-8">
          <h1 className="text-4xl font-bold text-foreground mb-6">About ORB AI</h1>
          <p className="text-lg text-muted-foreground mb-4">
            ORB AI is a cutting-edge artificial intelligence platform designed to transform how businesses and individuals interact with technology.
          </p>
          <p className="text-muted-foreground">
            Our mission is to make AI accessible, powerful, and intuitive for everyone. We combine advanced machine learning, natural language processing, and computer vision to deliver comprehensive AI solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Innovation', description: 'Leading AI research and development' },
            { title: 'Reliability', description: 'Enterprise-grade solutions' },
            { title: 'Accessibility', description: 'AI for everyone' }
          ].map((item, i) => (
            <div key={i} className="neu-card rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
