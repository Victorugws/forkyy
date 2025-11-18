'use client'

interface StripeButtonProps {
  paymentLink?: string
  popular?: boolean
  children: React.ReactNode
}

export function StripeButton({ paymentLink, popular = false, children }: StripeButtonProps) {
  const handleClick = () => {
    if (paymentLink) {
      window.open(paymentLink, '_blank')
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 ${
        popular
          ? 'bg-foreground text-background hover:shadow-lg'
          : 'neu-card hover:shadow-neu-lg'
      }`}
    >
      {children}
    </button>
  )
}
