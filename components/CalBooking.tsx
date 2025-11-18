'use client'

export function CalBooking() {
  return (
    <div className="neu-card rounded-3xl p-8 text-center">
      <h3 className="text-2xl font-bold mb-4">Schedule a Call</h3>
      <p className="text-muted-foreground mb-6">
        Book a free consultation to discuss your AI needs
      </p>
      <button
        onClick={() => window.open('https://cal.com', '_blank')}
        className="px-8 py-4 rounded-2xl font-semibold bg-foreground text-background hover:shadow-lg transition-all"
      >
        Book a Meeting
      </button>
    </div>
  )
}
