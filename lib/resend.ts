// Resend is server-only, not available in static export
let Resend: any
try {
  Resend = require('resend').Resend
} catch {
  // resend not available (e.g., in static export)
  Resend = null
}

// Initialize Resend client (only if available)
export const resend = Resend ? new Resend(process.env.RESEND_API_KEY) : null

// Default sender email (must be verified in Resend)
export const SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || 'onboarding@resend.dev'

// Email to receive contact form submissions
export const CONTACT_EMAIL = process.env.RESEND_CONTACT_EMAIL || 'contact@example.com'
