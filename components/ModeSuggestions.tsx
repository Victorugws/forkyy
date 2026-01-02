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
  onOptionClick?: (option: Suggestion, position: { top: string; left?: string; right?: string }) => void
  onTaskClick?: (prompt: string) => void
  selectedOption?: string | null
  variations?: Suggestion[]
  morphPosition?: 'left' | 'right' // To position variations on opposite side
}

// Mock data for components
const mockCryptos = [
  { name: 'Bitcoin', ticker: 'BTC', symbol: 'BTC', price: '$43,250.50', change: '+2.34%', negative: false },
  { name: 'Ethereum', ticker: 'ETH', symbol: 'ETH', price: '$2,345.20', change: '+1.89%', negative: false },
  { name: 'Solana', ticker: 'SOL', symbol: 'SOL', price: '$98.45', change: '-0.56%', negative: true },
]

const mockTrades = [
  { name: 'Nancy Pelosi', position: 'House Speaker', ticker: 'NVDA', action: 'Buy' as const, shares: '50', value: '$24,260', date: '2024-11-15', source: 'House.gov', days: '45' },
  { name: 'Kevin McCarthy', position: 'House Rep', ticker: 'AAPL', action: 'Sell' as const, shares: '100', value: '$18,550', date: '2024-11-14', source: 'House.gov', days: '30' },
  { name: 'Mitch McConnell', position: 'Senate Leader', ticker: 'MSFT', action: 'Buy' as const, shares: '75', value: '$28,417', date: '2024-11-13', source: 'Senate.gov', days: '60' },
  { name: 'Chuck Schumer', position: 'Senate Majority Leader', ticker: 'GOOGL', action: 'Buy' as const, shares: '60', value: '$8,568', date: '2024-11-12', source: 'Senate.gov', days: '90' },
  { name: 'John Boehner', position: 'Former House Speaker', ticker: 'TSLA', action: 'Sell' as const, shares: '200', value: '$49,700', date: '2024-11-11', source: 'House.gov', days: '120' },
]

const modeSuggestions: Record<string, Suggestion[]> = {
  healthcare: [
    { title: 'build a telemedicine platform...', description: 'Complete turnkey telemedicine solution with video consultations, patient records, and prescription management' },
    { title: 'create a patient management system...', description: 'Full patient portal with appointment booking, medical history, and health records' },
    { title: 'develop a health monitoring app...', description: 'IoT-integrated health tracking with wearable device sync and analytics' },
    { title: 'build a pharmacy management system...', description: 'Complete pharmacy solution with inventory, prescriptions, and delivery tracking' },
    { title: 'create a mental health platform...', description: 'Therapy booking, session management, and wellness tracking system' },
    { title: 'develop a medical billing system...', description: 'HIPAA-compliant billing, insurance claims, and payment processing' },
  ],
  agriculture: [
    { title: 'build a farm management platform...', description: 'Complete farm operations system with crop tracking, livestock management, and yield analytics' },
    { title: 'create a crop monitoring system...', description: 'IoT sensors integration, weather data, and predictive analytics for crop health' },
    { title: 'develop a supply chain tracker...', description: 'Farm-to-table tracking with logistics, quality control, and market pricing' },
    { title: 'build an agricultural marketplace...', description: 'Connect farmers with buyers, pricing tools, and contract management' },
    { title: 'create a precision agriculture tool...', description: 'Satellite imagery analysis, soil mapping, and irrigation optimization' },
    { title: 'develop a livestock management system...', description: 'Animal health tracking, breeding records, and feed management' },
  ],
  education: [
    { title: 'build a learning management system...', description: 'Complete LMS with course creation, student enrollment, and progress tracking' },
    { title: 'create an online course platform...', description: 'Video hosting, quizzes, certificates, and student engagement tools' },
    { title: 'develop a student information system...', description: 'Enrollment, grades, attendance, and parent portal integration' },
    { title: 'build a tutoring marketplace...', description: 'Connect students with tutors, scheduling, payment processing, and reviews' },
    { title: 'create an assessment platform...', description: 'Automated grading, plagiarism detection, and performance analytics' },
    { title: 'develop a virtual classroom...', description: 'Live video sessions, whiteboard, breakout rooms, and collaboration tools' },
  ],
  realestate: [
    { title: 'build a property listing platform...', description: 'Complete MLS system with search, filters, virtual tours, and lead management' },
    { title: 'create a real estate CRM...', description: 'Client management, pipeline tracking, document management, and email automation' },
    { title: 'develop a property management system...', description: 'Tenant portal, maintenance requests, rent collection, and lease management' },
    { title: 'build a mortgage calculator tool...', description: 'Loan comparison, affordability analysis, and pre-approval workflow' },
    { title: 'create a virtual tour platform...', description: '360° tours, floor plans, neighborhood insights, and scheduling' },
    { title: 'develop a real estate analytics dashboard...', description: 'Market trends, property valuations, ROI calculator, and investment analysis' },
  ],
  ecommerce: [
    { title: 'build an online store...', description: 'Complete e-commerce platform with product catalog, shopping cart, and checkout' },
    { title: 'create a marketplace platform...', description: 'Multi-vendor marketplace with seller dashboard, commission management, and reviews' },
    { title: 'develop an inventory management system...', description: 'Stock tracking, automated reordering, warehouse management, and analytics' },
    { title: 'build a subscription service platform...', description: 'Recurring billing, subscription management, and customer lifecycle tools' },
    { title: 'create a dropshipping automation tool...', description: 'Supplier integration, order routing, and fulfillment tracking' },
    { title: 'develop a customer loyalty program...', description: 'Points system, rewards, referral program, and customer retention analytics' },
  ],
  energy: [
    { title: 'build an energy monitoring platform...', description: 'Smart meter integration, real-time consumption tracking, and cost analysis' },
    { title: 'create a carbon footprint tracker...', description: 'Emission calculations, offset recommendations, and sustainability reporting' },
    { title: 'develop a renewable energy marketplace...', description: 'Solar/wind installation quotes, financing options, and ROI calculator' },
    { title: 'build an energy trading platform...', description: 'Peer-to-peer energy trading, blockchain integration, and smart contracts' },
    { title: 'create a grid management system...', description: 'Load balancing, demand forecasting, and grid optimization tools' },
    { title: 'develop a sustainability dashboard...', description: 'ESG metrics, compliance tracking, and sustainability reporting' },
  ],
  foodbeverage: [
    { title: 'build a restaurant management system...', description: 'POS integration, table management, kitchen display, and staff scheduling' },
    { title: 'create an online ordering platform...', description: 'Menu builder, cart system, payment processing, and delivery integration' },
    { title: 'develop a food delivery marketplace...', description: 'Multi-restaurant platform with driver tracking, ratings, and commission management' },
    { title: 'build a recipe management app...', description: 'Recipe database, meal planning, grocery lists, and nutrition tracking' },
    { title: 'create a food safety compliance system...', description: 'HACCP tracking, temperature monitoring, and inspection management' },
    { title: 'develop a restaurant analytics dashboard...', description: 'Sales analytics, inventory optimization, and customer insights' },
  ],
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
  strategy: [
    { title: 'create a SWOT analysis...', description: 'Build a strategic SWOT analysis framework' },
    { title: 'make a business plan template...', description: 'Design a comprehensive business planning template' },
    { title: 'build a competitive analysis tool...', description: 'Develop a tool for analyzing competitors' },
    { title: 'create a goal tracking system...', description: 'Build a system for tracking strategic goals' },
    { title: 'make a decision matrix...', description: 'Create a framework for strategic decision-making' },
  ],
}

const suggestionPositions = [
  { top: '12%', left: '8%' },    // Top left - more spacing
  { top: '28%', left: '6%' },    // Mid left - increased vertical gap
  { top: '44%', left: '8%' },    // Bottom left - more spacing
  { top: '60%', left: '10%' },   // Lower left - additional spacing
  { top: '12%', right: '8%' },   // Top right
  { top: '28%', right: '6%' },   // Mid right
  { top: '44%', right: '8%' },   // Bottom right
]

export function ModeSuggestions({ mode, visible, onOptionClick, onTaskClick, selectedOption, variations, morphPosition }: ModeSuggestionsProps) {
  if (!mode || !visible) return null

  const suggestions = modeSuggestions[mode] || []
  // Show variations if they exist and an option is selected, otherwise show original suggestions
  const allSuggestions = (selectedOption && variations && variations.length > 0) ? variations : suggestions
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null)
  
  // If showing variations, position them on the opposite side of the morphed search tab
  const isShowingVariations = selectedOption && variations && variations.length > 0

  const handleDoubleClick = (index: number) => {
    setZoomedIndex(index)
  }

  const handleCloseZoom = () => {
    setZoomedIndex(null)
  }

  const handleOptionClick = (suggestion: Suggestion, index: number) => {
    // Mode suggestions are typically task-like, so trigger task overlay
    if (onTaskClick) {
      const prompt = `Create ${suggestion.title.replace('...', '').toLowerCase()}`
      onTaskClick(prompt)
    } else {
      // Fallback to original behavior
    const position = suggestionPositions[index] || suggestionPositions[0]
    onOptionClick?.(suggestion, position)
    }
  }

  return (
    <>
      {allSuggestions.map((suggestion, index) => {
        // For variations, position them on the OPPOSITE side of the morphed search tab
        let basePosition
        if (isShowingVariations && morphPosition) {
          // Variations appear on opposite side of morph position
          const variationPositions = morphPosition === 'left' 
            ? [
                { top: '12%', right: '8%' },    // Top right - more spacing
                { top: '28%', right: '6%' },    // Mid right - increased gap
                { top: '44%', right: '8%' },    // Bottom right - more spacing
                { top: '60%', right: '10%' },   // Lower right - additional spacing
                { top: '18%', right: '10%' },   // Additional positions
                { top: '36%', right: '8%' },
              ]
            : [
                { top: '12%', left: '8%' },     // Top left - more spacing
                { top: '28%', left: '6%' },     // Mid left - increased gap
                { top: '44%', left: '8%' },     // Bottom left - more spacing
                { top: '60%', left: '10%' },    // Lower left - additional spacing
                { top: '18%', left: '10%' },    // Additional positions
                { top: '36%', left: '8%' },
              ]
          basePosition = variationPositions[index] || variationPositions[0]
        } else {
          // Original suggestions use default positions
          basePosition = suggestionPositions[index] || suggestionPositions[0]
        }
        const position = basePosition
        const isZoomed = zoomedIndex === index
        const isSelected = selectedOption === suggestion.title
        
        return (
          <React.Fragment key={`${suggestion.title}-${index}`}>
            <div
              className="mode-suggestion-card"
              style={{
                position: 'absolute',
                ...position,
                zIndex: isZoomed ? 100 : 30,
                opacity: selectedOption && !isSelected && index < suggestions.length ? 0.3 : 1,
              }}
              onDoubleClick={() => handleDoubleClick(index)}
              onClick={() => handleOptionClick(suggestion, index)}
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
          margin-bottom: 24px; /* Add vertical spacing between cards */
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

