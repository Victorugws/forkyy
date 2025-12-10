'use client'

import { FileText, User, Database, Coins, HelpCircle, Search } from 'lucide-react'

interface Space {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  actionText: string
  category: 'markets' | 'crypto' | 'all'
}

interface PopularSpacesProps {
  type?: 'markets' | 'crypto' | 'all'
}

export function PopularSpaces({ type = 'all' }: PopularSpacesProps) {
  const spaces: Space[] = [
    {
      id: 'transcripts',
      icon: <FileText className="size-5" />,
      title: 'S&P 500 Transcripts',
      description: 'Query any S&P company transcript over the last two years',
      actionText: 'Search transcripts',
      category: 'markets'
    },
    {
      id: 'profile',
      icon: <User className="size-5" />,
      title: 'Profile Builder',
      description: 'Enter any company name to get a clear, comprehensive profile',
      actionText: 'Build profiles',
      category: 'markets'
    },
    {
      id: 'duediligence',
      icon: <Database className="size-5" />,
      title: 'Due Diligence Data Room',
      description: 'Evaluate startup investments by comparing with past deals and market signals',
      actionText: 'Analyze investments',
      category: 'markets'
    },
    {
      id: 'coin-explorer',
      icon: <Coins className="size-5" />,
      title: 'Crypto Coin Explorer',
      description: 'Enter any cryptocurrency to get an up-to-date overview',
      actionText: 'Analyze coins',
      category: 'crypto'
    },
    {
      id: 'investor-questions',
      icon: <HelpCircle className="size-5" />,
      title: 'Investor Question Generator',
      description: 'Get five strategic questions to ask before a potential investment',
      actionText: 'Generate questions',
      category: 'crypto'
    }
  ]

  const filteredSpaces = type === 'all'
    ? spaces
    : spaces.filter(space => space.category === type || space.category === 'all')

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Popular Spaces for Finance Research</h2>

      <div className="neu-card rounded-xl overflow-hidden">
        {filteredSpaces.map((space, index) => (
          <div key={space.id}>
            <div className="p-5 hover:bg-background/30 transition-all group cursor-pointer">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="p-3 rounded-lg neu-inset bg-background/50 flex-shrink-0">
                  {space.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">
                    {space.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {space.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="neu-button px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap hover:neu-raised transition-all flex-shrink-0"
              >
                {space.actionText}
              </button>
            </div>
            </div>
            {index < filteredSpaces.length - 1 && (
              <div className="border-t border-border/50 mx-5" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
