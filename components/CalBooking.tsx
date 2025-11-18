'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface CalBookingProps {
  calLink?: string
  buttonText?: string
  buttonClassName?: string
}

export function CalBooking({
  calLink = process.env.NEXT_PUBLIC_CAL_LINK || 'https://cal.com',
  buttonText = 'Book a call',
  buttonClassName = 'text-foreground font-semibold underline',
}: CalBookingProps) {
  const [isOpen, setIsOpen] = useState(false)

  // For a more integrated experience, you could use Cal.com's embed
  // For simplicity, we'll open in a new window or use an iframe

  const handleBooking = () => {
    // Option 1: Open in new window
    window.open(calLink, '_blank', 'noopener,noreferrer')

    // Option 2: Use modal with iframe (uncomment if preferred)
    // setIsOpen(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={handleBooking}
        className={buttonClassName}
      >
        {buttonText}
      </button>

      {/* Modal with Cal.com iframe (alternative approach) */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Book a Call</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[70vh] overflow-hidden rounded-lg">
            <iframe
              src={calLink}
              className="w-full h-full border-0"
              title="Book a Call"
              allow="payment"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Inline Cal.com component with embed script
export function CalInline({
  calLink = process.env.NEXT_PUBLIC_CAL_LINK || 'orbai/30min',
}: {
  calLink?: string
}) {
  return (
    <div className="w-full h-full min-h-[600px]">
      <iframe
        src={`https://cal.com/${calLink}`}
        className="w-full h-full border-0 rounded-lg"
        title="Book a Call"
        allow="payment"
      />
    </div>
  )
}
