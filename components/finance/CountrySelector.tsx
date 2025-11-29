'use client'

import { Globe, ChevronDown, Check } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { IconWrapper } from '@/components/ui/icons'

export interface Country {
  name: string
  code: string
  flag: string
  abbreviation: string
}

// Country data with flags and codes
const COUNTRIES: Country[] = [
  { name: 'United States', code: 'US', flag: '🇺🇸', abbreviation: 'USA' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', abbreviation: 'GBR' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦', abbreviation: 'CAN' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪', abbreviation: 'DEU' },
  { name: 'France', code: 'FR', flag: '🇫🇷', abbreviation: 'FRA' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵', abbreviation: 'JPN' },
  { name: 'China', code: 'CN', flag: '🇨🇳', abbreviation: 'CHN' },
  { name: 'India', code: 'IN', flag: '🇮🇳', abbreviation: 'IND' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺', abbreviation: 'AUS' },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷', abbreviation: 'BRA' },
  { name: 'South Korea', code: 'KR', flag: '🇰🇷', abbreviation: 'KOR' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹', abbreviation: 'ITA' },
  { name: 'Spain', code: 'ES', flag: '🇪🇸', abbreviation: 'ESP' },
  { name: 'Mexico', code: 'MX', flag: '🇲🇽', abbreviation: 'MEX' },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱', abbreviation: 'NLD' },
  { name: 'Switzerland', code: 'CH', flag: '🇨🇭', abbreviation: 'CHE' },
  { name: 'Sweden', code: 'SE', flag: '🇸🇪', abbreviation: 'SWE' },
  { name: 'Singapore', code: 'SG', flag: '🇸🇬', abbreviation: 'SGP' },
  { name: 'Hong Kong', code: 'HK', flag: '🇭🇰', abbreviation: 'HKG' },
  { name: 'South Africa', code: 'ZA', flag: '🇿🇦', abbreviation: 'ZAF' },
  { name: 'Russia', code: 'RU', flag: '🇷🇺', abbreviation: 'RUS' },
  { name: 'Poland', code: 'PL', flag: '🇵🇱', abbreviation: 'POL' },
  { name: 'Turkey', code: 'TR', flag: '🇹🇷', abbreviation: 'TUR' },
  { name: 'Indonesia', code: 'ID', flag: '🇮🇩', abbreviation: 'IDN' },
  { name: 'Thailand', code: 'TH', flag: '🇹🇭', abbreviation: 'THA' },
  { name: 'Malaysia', code: 'MY', flag: '🇲🇾', abbreviation: 'MYS' },
  { name: 'Philippines', code: 'PH', flag: '🇵🇭', abbreviation: 'PHL' },
  { name: 'Vietnam', code: 'VN', flag: '🇻🇳', abbreviation: 'VNM' },
  { name: 'Argentina', code: 'AR', flag: '🇦🇷', abbreviation: 'ARG' },
  { name: 'Chile', code: 'CL', flag: '🇨🇱', abbreviation: 'CHL' },
  { name: 'Colombia', code: 'CO', flag: '🇨🇴', abbreviation: 'COL' },
  { name: 'Peru', code: 'PE', flag: '🇵🇪', abbreviation: 'PER' },
  { name: 'Belgium', code: 'BE', flag: '🇧🇪', abbreviation: 'BEL' },
  { name: 'Austria', code: 'AT', flag: '🇦🇹', abbreviation: 'AUT' },
  { name: 'Norway', code: 'NO', flag: '🇳🇴', abbreviation: 'NOR' },
  { name: 'Denmark', code: 'DK', flag: '🇩🇰', abbreviation: 'DNK' },
  { name: 'Finland', code: 'FI', flag: '🇫🇮', abbreviation: 'FIN' },
  { name: 'Ireland', code: 'IE', flag: '🇮🇪', abbreviation: 'IRL' },
  { name: 'Portugal', code: 'PT', flag: '🇵🇹', abbreviation: 'PRT' },
  { name: 'Greece', code: 'GR', flag: '🇬🇷', abbreviation: 'GRC' },
  { name: 'Czech Republic', code: 'CZ', flag: '🇨🇿', abbreviation: 'CZE' },
  { name: 'Romania', code: 'RO', flag: '🇷🇴', abbreviation: 'ROU' },
  { name: 'Hungary', code: 'HU', flag: '🇭🇺', abbreviation: 'HUN' },
  { name: 'Israel', code: 'IL', flag: '🇮🇱', abbreviation: 'ISR' },
  { name: 'UAE', code: 'AE', flag: '🇦🇪', abbreviation: 'ARE' },
  { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', abbreviation: 'SAU' },
  { name: 'Egypt', code: 'EG', flag: '🇪🇬', abbreviation: 'EGY' },
  { name: 'Nigeria', code: 'NG', flag: '🇳🇬', abbreviation: 'NGA' },
  { name: 'Kenya', code: 'KE', flag: '🇰🇪', abbreviation: 'KEN' },
  { name: 'New Zealand', code: 'NZ', flag: '🇳🇿', abbreviation: 'NZL' },
  { name: 'Pakistan', code: 'PK', flag: '🇵🇰', abbreviation: 'PAK' },
  { name: 'Bangladesh', code: 'BD', flag: '🇧🇩', abbreviation: 'BGD' },
  { name: 'Ukraine', code: 'UA', flag: '🇺🇦', abbreviation: 'UKR' },
  { name: 'Kazakhstan', code: 'KZ', flag: '🇰🇿', abbreviation: 'KAZ' }
]

interface CountrySelectorProps {
  value?: string
  onChange?: (country: Country) => void
  className?: string
}

export function CountrySelector({ value, onChange, className = '' }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRIES.find(c => c.name === value) || COUNTRIES[0]
  )
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    // Add slight delay to prevent immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Update selected country when value prop changes
  useEffect(() => {
    if (value) {
      const country = COUNTRIES.find(c => c.name === value)
      if (country) {
        setSelectedCountry(country)
      }
    }
  }, [value])

  const handleSelect = (country: Country) => {
    console.log('Country selected:', country.name)
    setSelectedCountry(country)
    setIsOpen(false)
    setSearchQuery('')
    onChange?.(country)
  }

  // Filter countries based on search query
  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          console.log('Country selector clicked, current state:', isOpen)
          setIsOpen(!isOpen)
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg neu-button cursor-pointer"
        style={{ pointerEvents: 'auto' }}
      >
        <IconWrapper>
          <Globe className="size-4" />
        </IconWrapper>
        <span className="text-sm font-medium flex items-center gap-2">
          <span className="hidden sm:inline">{selectedCountry.flag}</span>
          <span className="hidden sm:inline">{selectedCountry.name}</span>
          <span className="sm:hidden">{selectedCountry.flag} {selectedCountry.abbreviation}</span>
        </span>
        <IconWrapper>
          <ChevronDown className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </IconWrapper>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-xl neu-raised shadow-lg z-[100] overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-border">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-lg neu-input text-sm"
              autoFocus
            />
          </div>

          {/* Country List */}
          <div className="max-h-80 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  type="button"
                  key={country.code}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleSelect(country)
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent transition-colors flex items-center justify-between ${
                    selectedCountry.code === country.code ? 'bg-accent text-primary' : 'text-foreground'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{country.flag}</span>
                    <span>{country.name}</span>
                    <span className="text-xs text-muted-foreground">({country.code})</span>
                  </span>
                  {selectedCountry.code === country.code && (
                    <IconWrapper>
                      <Check className="size-4 text-primary" />
                    </IconWrapper>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Export countries list for use in other components
export { COUNTRIES }
