import Link from 'next/link'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Visual */}
        <div className="mb-8">
          <div className="neu-card rounded-3xl p-12 inline-block bg-gradient-to-br from-background via-background to-muted/10">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-foreground via-foreground/60 to-foreground/40 bg-clip-text text-transparent">
              404
            </h1>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Page Not Found
        </h2>
        <p className="text-muted-foreground text-lg mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold bg-foreground text-background hover:shadow-lg transition-all duration-300"
          >
            <Home className="size-5" />
            Back to Home
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold neu-card hover:shadow-neu-lg transition-all duration-300"
          >
            <Search className="size-5" />
            Start Searching
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">You might be looking for:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/about"
              className="neu-button px-4 py-2 text-sm rounded-xl hover:shadow-neu-sm transition-all"
            >
              About Us
            </Link>
            <Link
              href="/services"
              className="neu-button px-4 py-2 text-sm rounded-xl hover:shadow-neu-sm transition-all"
            >
              Services
            </Link>
            <Link
              href="/templates"
              className="neu-button px-4 py-2 text-sm rounded-xl hover:shadow-neu-sm transition-all"
            >
              Templates
            </Link>
            <Link
              href="/#contact"
              className="neu-button px-4 py-2 text-sm rounded-xl hover:shadow-neu-sm transition-all"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Search Bar Alternative */}
        <div className="mt-8 neu-inset rounded-2xl p-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="size-5" />
            <span>Try searching for what you need...</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
