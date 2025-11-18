'use client'

interface StripeButtonProps {
  paymentLink?: string
  children: React.ReactNode
  className?: string
  popular?: boolean
}

export function StripeButton({
  paymentLink,
  children,
  className,
  popular = false,
}: StripeButtonProps) {
  const handleClick = () => {
    if (paymentLink) {
      // Open Stripe payment link in same window
      window.location.href = paymentLink
    } else {
      // Fallback: show alert or redirect to contact
      alert('Payment link not configured. Please contact us to get started.')
    }
  }

  const defaultClassName = `w-full py-4 rounded-2xl font-semibold transition-all duration-300 ${
    popular
      ? 'bg-foreground text-background hover:shadow-lg'
      : 'neu-card hover:shadow-neu-lg'
  }`

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className || defaultClassName}
    >
      {children}
    </button>
  )
}
