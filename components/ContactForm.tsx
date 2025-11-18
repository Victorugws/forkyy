'use client'

import { useState, FormEvent } from 'react'
import { toast } from 'sonner'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Message sent successfully!', {
          description: 'We\'ll get back to you as soon as possible.',
        })
        // Reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          message: '',
        })
      } else {
        toast.error('Failed to send message', {
          description: data.error || 'Please try again later.',
        })
      }
    } catch (error) {
      console.error('Contact form error:', error)
      toast.error('Something went wrong', {
        description: 'Please try again later or contact us directly.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="neu-card rounded-3xl p-8 bg-gradient-to-br from-background via-background to-muted/10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Full Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full neu-inset rounded-2xl px-6 py-4 bg-background/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-shadow"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@company.com"
            className="w-full neu-inset rounded-2xl px-6 py-4 bg-background/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-shadow"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-2">
            Company / Subject
          </label>
          <input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            placeholder="Acme Inc. or Subject of interest"
            className="w-full neu-inset rounded-2xl px-6 py-4 bg-background/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-shadow"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            How may we assist you? *
          </label>
          <textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your project or question..."
            rows={4}
            className="w-full neu-inset rounded-2xl px-6 py-4 bg-background/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none transition-shadow"
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-2xl font-semibold bg-foreground text-background hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </span>
          ) : (
            'Send Your Message'
          )}
        </button>
      </form>
    </div>
  )
}
