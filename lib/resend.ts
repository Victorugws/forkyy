import { Resend } from 'resend'

// Initialize Resend client
export const resend = new Resend(process.env.RESEND_API_KEY)

// Default sender email (must be verified in Resend)
export const SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || 'onboarding@resend.dev'

// Email to receive contact form submissions
export const CONTACT_EMAIL = process.env.RESEND_CONTACT_EMAIL || 'contact@example.com'
