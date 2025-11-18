import { NextRequest, NextResponse } from 'next/server'
import { resend, SENDER_EMAIL, CONTACT_EMAIL } from '@/lib/resend'
import { z } from 'zod'

// Validation schema for contact form
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json()

    // Validate input
    const validationResult = contactSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { name, email, company, message } = validationResult.data

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        {
          success: false,
          error: 'Email service is not configured. Please contact us directly.',
        },
        { status: 503 }
      )
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact Form Submission</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
              <div style="margin-bottom: 20px;">
                <h2 style="color: #6366f1; margin: 0 0 10px 0; font-size: 18px;">Contact Information</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #6b7280; width: 120px;">Name:</td>
                    <td style="padding: 8px 0; color: #111827;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Email:</td>
                    <td style="padding: 8px 0; color: #111827;"><a href="mailto:${email}" style="color: #6366f1; text-decoration: none;">${email}</a></td>
                  </tr>
                  ${company ? `
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Company:</td>
                    <td style="padding: 8px 0; color: #111827;">${company}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              <div style="margin-top: 25px;">
                <h2 style="color: #6366f1; margin: 0 0 10px 0; font-size: 18px;">Message</h2>
                <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; white-space: pre-wrap; color: #111827;">${message}</div>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">This email was sent from your ORB AI contact form.</p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend API error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send email. Please try again later.',
        },
        { status: 500 }
      )
    }

    // Also send a confirmation email to the user
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: 'Thank you for contacting ORB AI',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank You</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Thank You!</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
              <p style="color: #111827; font-size: 16px; margin-bottom: 20px;">Hi ${name},</p>
              <p style="color: #374151; margin-bottom: 20px;">Thank you for reaching out to ORB AI! We've received your message and will get back to you as soon as possible.</p>
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #6366f1; margin: 25px 0;">
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">Your Message:</p>
                <p style="color: #111827; margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
              <p style="color: #374151; margin-top: 25px;">We typically respond within 24 hours during business days.</p>
              <p style="color: #374151; margin-top: 20px;">Best regards,<br><strong style="color: #6366f1;">The ORB AI Team</strong></p>
            </div>
            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">© ${new Date().getFullYear()} ORB AI. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
      emailId: data?.id,
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    )
  }
}
