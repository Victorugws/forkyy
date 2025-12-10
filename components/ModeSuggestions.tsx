'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MarketMovers } from '@/components/finance/MarketMovers'
import { MarketStatus } from '@/components/finance/MarketStatus'
import { CryptoGrid } from '@/components/finance/CryptoGrid'
import { PoliticianTrades } from '@/components/finance/PoliticianTrades'
import { RecentDevelopments } from '@/components/finance/RecentDevelopments'
import { X } from 'lucide-react'

interface Suggestion {
  title: string
  description: string
  component?: React.ReactNode
}

interface ModeSuggestionsProps {
  mode: string | null
  visible: boolean
}

// Mock data for components
const mockCryptos = [
  { name: 'Bitcoin', ticker: 'BTC', symbol: 'BTC', price: '$43,250.50', change: '+2.34%', negative: false },
  { name: 'Ethereum', ticker: 'ETH', symbol: 'ETH', price: '$2,345.20', change: '+1.89%', negative: false },
  { name: 'Solana', ticker: 'SOL', symbol: 'SOL', price: '$98.45', change: '-0.56%', negative: true },
]

const mockTrades = [
  { name: 'Nancy Pelosi', position: 'House Speaker', ticker: 'NVDA', action: 'Buy', shares: '50', value: '$24,260', date: '2024-11-15' },
  { name: 'Kevin McCarthy', position: 'House Rep', ticker: 'AAPL', action: 'Sell', shares: '100', value: '$18,550', date: '2024-11-14' },
  { name: 'Mitch McConnell', position: 'Senate Leader', ticker: 'MSFT', action: 'Buy', shares: '75', value: '$28,417', date: '2024-11-13' },
  { name: 'Chuck Schumer', position: 'Senate Majority Leader', ticker: 'GOOGL', action: 'Buy', shares: '60', value: '$8,568', date: '2024-11-12' },
  { name: 'John Boehner', position: 'Former House Speaker', ticker: 'TSLA', action: 'Sell', shares: '200', value: '$49,700', date: '2024-11-11' },
]

const modeSuggestions: Record<string, Suggestion[]> = {
  finance: [
    { 
      title: 'crypto today...', 
      description: 'Latest cryptocurrency trends and market updates',
      component: <CryptoGrid cryptos={mockCryptos} loading={false} />
    },
    { 
      title: 'Market Movers...', 
      description: 'Top gaining and losing stocks in real-time',
      component: <MarketMovers type="gainers" limit={5} />
    },
    { 
      title: 'Market Status...', 
      description: 'Current market conditions and trading hours',
      component: <MarketStatus compact={false} />
    },
    { 
      title: 'Politicians wallets...', 
      description: 'Track political stock trades and disclosures',
      component: <PoliticianTrades trades={mockTrades} loading={false} />
    },
    { 
      title: 'Recent Developments...', 
      description: 'Breaking financial news and market analysis',
      component: <RecentDevelopments topic="US markets" limit={3} />
    },
  ],
  legality: [
    { title: 'Legal Updates...', description: 'Recent changes in laws and regulations' },
    { title: 'Case Studies...', description: 'Important legal precedents and rulings' },
    { title: 'Compliance Guide...', description: 'Step-by-step compliance documentation' },
  ],
  business: [
    { title: 'Market Analysis...', description: 'Industry trends and business insights' },
    { title: 'Startup Guide...', description: 'Resources for building your business' },
    { title: 'Growth Strategies...', description: 'Proven methods for scaling operations' },
  ],
  taskability: [
    { title: 'Task Management...', description: 'Organize and prioritize your workflow' },
    { title: 'Productivity Tips...', description: 'Boost efficiency with proven techniques' },
    { title: 'Project Planning...', description: 'Tools and templates for project success' },
  ],
  socials: [
    { title: 'Social Trends...', description: 'Latest social media and networking insights' },
    { title: 'Community Building...', description: 'Strategies for growing your audience' },
    { title: 'Content Ideas...', description: 'Creative content suggestions and templates' },
  ],
}

const suggestionPositions = [
  { top: '15%', left: '10%' },   // Top left
  { top: '35%', left: '8%' },   // Mid left
  { top: '55%', left: '10%' },  // Bottom left
  { top: '15%', right: '10%' },  // Top right
  { top: '35%', right: '8%' },  // Mid right
]

export function ModeSuggestions({ mode, visible }: ModeSuggestionsProps) {
  if (!mode || !visible) return null

  const suggestions = modeSuggestions[mode] || []
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null)

  const handleDoubleClick = (index: number) => {
    setZoomedIndex(index)
  }

  const handleCloseZoom = () => {
    setZoomedIndex(null)
  }

  return (
    <>
      {suggestions.map((suggestion, index) => {
        const position = suggestionPositions[index] || suggestionPositions[0]
        const isZoomed = zoomedIndex === index
        
        return (
          <React.Fragment key={index}>
            <div
              className="mode-suggestion-card"
              style={{
                position: 'absolute',
                ...position,
                zIndex: isZoomed ? 100 : 30,
              }}
              onDoubleClick={() => handleDoubleClick(index)}
            >
              <div className="icon">{suggestion.title}</div>
              <div className="content">
                {suggestion.component ? (
                  <div className="zoomed-out-preview-wrapper">
                    <div className="zoomed-out-preview">
                      {suggestion.component}
                    </div>
                  </div>
                ) : (
                  <>
                    <h3>{suggestion.title}</h3>
                    <p>{suggestion.description}</p>
                  </>
                )}
              </div>
            </div>
            
            {/* Zoomed in overlay */}
            {isZoomed && (
              <div 
                className="zoomed-overlay"
                onClick={handleCloseZoom}
              >
                <div 
                  className="zoomed-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={handleCloseZoom}
                    className="close-button"
                  >
                    <X className="size-4" />
                  </button>
                  <div className="zoomed-component">
                    {suggestion.component}
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        )
      })}
      <style jsx>{`
        .mode-suggestion-card {
          display: inline-flex;
          flex-direction: column;
          padding: 8px 16px;
          background-color: transparent; /* Transparent background */
          text-align: center;
          border: 2px solid transparent; /* No border initially */
          border-radius: 20px;
          transition: all 0.5s ease;
          cursor: pointer;
          overflow: visible; /* Allow content to determine size */
          max-height: 50px;
          max-width: 180px; /* Reduced container width */
        }

        .mode-suggestion-card:hover {
          border: 2px dotted #999; /* Dotted border on hover */
          max-height: none; /* Remove max-height constraint on hover */
          max-width: none; /* Remove max-width constraint on hover */
          width: fit-content; /* Size to content */
          height: fit-content; /* Size to content */
          padding: 12px 16px 4px 16px; /* Reduced bottom padding to 4px */
          overflow: visible; /* Allow content to determine size */
        }
        
        .zoomed-out-preview-wrapper {
          width: 100%;
          height: 150px; /* Reduced height to match visible card rows */
          max-height: 150px;
          overflow: hidden; /* Clip the bottom */
          position: relative;
        }
        
        .zoomed-out-preview {
          transform: scale(0.25); /* Very zoomed out - 25% scale */
          transform-origin: top left;
          width: 400%; /* 4x to compensate for scale */
          height: fit-content; /* Dynamic height based on actual content */
          min-height: 0; /* Allow shrinking */
          max-height: 600px; /* Reduced to match wrapper height (150px * 4) */
          overflow: hidden; /* Hide overflow */
          pointer-events: none; /* Prevent interaction in zoomed out view */
          position: relative;
          margin-bottom: 0; /* No bottom margin */
          display: inline-block; /* Allow content to determine size */
        }
        
        .zoomed-out-preview > * {
          width: 320px; /* Match content max-width */
          max-width: 320px;
          display: block; /* Ensure proper sizing */
          margin-bottom: 0 !important; /* Remove bottom margins from components */
        }
        
        /* Override component-specific bottom spacing */
        .zoomed-out-preview .neu-card,
        .zoomed-out-preview div[class*="mb-6"],
        .zoomed-out-preview div[class*="mb-8"] {
          margin-bottom: 0 !important;
        }
        
        .zoomed-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }
        
        .zoomed-content {
          position: relative;
          background: white;
          border-radius: 20px;
          padding: 24px;
          max-width: 90vw;
          max-height: 90vh;
          overflow: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .close-button {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f3f4f6;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: background 0.2s;
        }
        
        .close-button:hover {
          background: #e5e7eb;
        }
        
        .zoomed-component {
          width: 100%;
        }

        .icon {
          font-size: 14px; /* Reduced font size */
          font-weight: 600;
          color: #bababa; /* Same color as acknowledgement */
          margin-bottom: 10px;
        }

        .content {
          color: #bababa; /* Same color as acknowledgement */
          background-color: #ffffff;
          padding: 12px 12px 0 12px; /* Removed bottom padding */
          margin: 8px 0 0 0; /* No bottom margin */
          border-radius: 15px;
          box-shadow:
            8px 8px 16px #d1d1d1,
            -8px -8px 16px #ffffff;
          opacity: 0;
          transform: translateY(-20px) scale(0.9);
          transition: all 0.5s ease;
          width: fit-content; /* Size to content */
          min-width: 280px; /* Minimum width for readability */
          max-width: 320px; /* Maximum width */
          max-height: 220px; /* Reduced to match wrapper height + padding */
          overflow: hidden; /* Hide overflow */
          text-align: left; /* Left align for component content */
          position: relative;
          padding-bottom: 0; /* Explicitly no bottom padding */
        }
        
        .mode-suggestion-card:hover .content {
          overflow: hidden; /* Keep hidden on hover */
          width: fit-content; /* Size to content */
        }
        
        .content::-webkit-scrollbar {
          width: 4px;
        }
        
        .content::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .content::-webkit-scrollbar-thumb {
          background: #d1d1d1;
          border-radius: 2px;
        }

        .mode-suggestion-card:hover .content {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .content h3 {
          text-shadow: none;
          margin: 0 0 8px 0;
          font-size: 14px; /* Reduced font size */
          font-weight: 600;
        }

        .content p {
          margin: 0;
          font-size: 12px; /* Reduced font size */
          line-height: 1.4;
        }
      `}</style>
    </>
  )
}

