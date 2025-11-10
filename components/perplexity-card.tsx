import { cn } from '@/lib/utils'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface PerplexityCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  image?: string
  href: string
  category?: string
  className?: string
}

export function PerplexityCard({
  title,
  description,
  icon: Icon,
  image,
  href,
  category,
  className
}: PerplexityCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg',
        className
      )}
    >
      {image && (
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        {category && (
          <span className="mb-2 text-xs font-medium text-primary uppercase tracking-wider">
            {category}
          </span>
        )}
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="mt-1 rounded-lg bg-primary/10 p-2">
              <Icon className="size-5 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-base leading-snug text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            {description && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

interface TrendingCardProps {
  title: string
  description: string
  views: string
  image?: string
  href: string
}

export function TrendingCard({
  title,
  description,
  views,
  image,
  href
}: TrendingCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg"
    >
      {image && (
        <div className="relative h-40 w-full overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {views}
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-sm leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  )
}
