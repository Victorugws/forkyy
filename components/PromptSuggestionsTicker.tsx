'use client'

import { Sparkles } from 'lucide-react'

const PROMPT_SUGGESTIONS = [
  "What's trending in AI today?",
  "Explain quantum computing simply",
  "Best productivity tips for developers",
  "How to build a startup in 2024",
  "Latest breakthroughs in biotech",
  "Top crypto trends to watch",
  "Climate tech innovations",
  "Future of remote work",
  "Space exploration updates",
  "Cybersecurity best practices",
  "Web3 development guide",
  "Mental health resources",
  "Investment strategies for beginners",
  "Sustainable living tips",
  "Machine learning tutorials"
]

export function PromptSuggestionsTicker() {
  const handlePromptClick = (prompt: string) => {
    // Generate a new chat ID and navigate to morphic chat page
    const newChatId = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    window.dispatchEvent(new CustomEvent('browser:navigate', {
      detail: { url: `/search/${newChatId}?q=${encodeURIComponent(prompt)}` }
    }))
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-muted/30 rounded-full border border-border/50 overflow-hidden w-full">
      <Sparkles className="w-3 h-3 text-primary flex-shrink-0 animate-pulse" />
      <div className="relative flex-1 overflow-hidden">
        <div className="ticker-wrapper">
          <div className="ticker-content">
            {/* First set of suggestions */}
            {PROMPT_SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={`first-${idx}`}
                onClick={() => handlePromptClick(suggestion)}
                className="ticker-item cursor-pointer hover:text-primary transition-colors"
              >
                {suggestion}
              </button>
            ))}
            {/* Duplicate for seamless loop */}
            {PROMPT_SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={`second-${idx}`}
                onClick={() => handlePromptClick(suggestion)}
                className="ticker-item cursor-pointer hover:text-primary transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .ticker-wrapper {
          width: 100%;
          overflow: hidden;
        }

        .ticker-content {
          display: flex;
          animation: scroll 60s linear infinite;
        }

        .ticker-item {
          display: inline-block;
          white-space: nowrap;
          padding-right: 3rem;
          font-size: 0.75rem;
          line-height: 1rem;
          color: hsl(var(--muted-foreground));
          background: transparent;
          border: none;
          outline: none;
        }

        .ticker-item::after {
          content: ' • ';
          padding-left: 3rem;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .ticker-content:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
