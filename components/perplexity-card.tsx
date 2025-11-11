import { cn } from '@/lib/utils'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import Image from 'next/image'

interface PerplexityCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  image?: string
  href: string
  category?: string
  className?: string
  trending?: boolean
}

export function PerplexityCard({
  title,
  description,
  icon: Icon,
  image,
  href,
  category,
  className,
  trending
}: PerplexityCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg hover:scale-[1.02]',
        className
      )}
    >
      {/* Image or Icon Header */}
      {image ? (
        <div className="relative h-40 w-full overflow-hidden bg-muted">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {trending && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-medium">
              Trending
            </div>
          )}
        </div>
      ) : Icon ? (
        <div className="flex items-center justify-center h-40 bg-gradient-to-br from-primary/10 to-primary/5">
          <Icon className="size-16 text-primary opacity-50" />
        </div>
      ) : null}

      {/* Content */}
      <div className="p-4 space-y-2">
        {category && (
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {category}
          </span>
        )}
        <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </Link>
  )
}

// Grid container for cards
export function PerplexityCardGrid({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
        className
      )}
    >
      {children}
    </div>
  )
}
