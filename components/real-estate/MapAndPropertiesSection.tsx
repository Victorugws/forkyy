'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Check, MapPin, Maximize2, Plus, Minus, Circle } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Property {
  id: string
  name: string
  address: string
  zipCode: string
  estValue: string
  type: string
  bedrooms: number
  bathrooms: number
  squareFeet: number
  lotSize: number
  estLoanBalance: string
  estEquity: string
  lastSaleDate: string
}

const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Rumah Putih',
    address: 'American Canyon CA',
    zipCode: '94503',
    estValue: '$888,300',
    type: 'Single Family Residential',
    bedrooms: 4,
    bathrooms: 2,
    squareFeet: 2539,
    lotSize: 8002,
    estLoanBalance: '$666,808',
    estEquity: '$196,446',
    lastSaleDate: '08/17/2020',
  },
  {
    id: '2',
    name: 'Peacock Cir',
    address: 'American Canyon CA',
    zipCode: '2882',
    estValue: '$822,800',
    type: 'Single Family Residential',
    bedrooms: 8,
    bathrooms: 1,
    squareFeet: 2222,
    lotSize: 3003,
    estLoanBalance: '$666,808',
    estEquity: '$196,446',
    lastSaleDate: '08/17/2020',
  },
  {
    id: '3',
    name: 'Rumah kita',
    address: 'American Canyon CA',
    zipCode: '4004',
    estValue: '$666,600',
    type: 'Single Family Residential',
    bedrooms: 8,
    bathrooms: 8,
    squareFeet: 2222,
    lotSize: 8002,
    estLoanBalance: '$666,808',
    estEquity: '$196,446',
    lastSaleDate: '08/17/2020',
  },
]

export default function MapAndPropertiesSection() {
  const [selectedProperty, setSelectedProperty] = useState<string>('1')
  const [mapView, setMapView] = useState<'map' | 'satellite'>('map')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map Section - 2 columns */}
      <div className="lg:col-span-2">
        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
          {/* Map Container */}
          <div className="relative h-[600px] bg-[#F3F4F6]">
            {/* Map Background - using a map-like gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#E0F2FE] via-[#F0FDF4] to-[#FEF3C7] opacity-60"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>

            {/* Map Controls - Bottom Left */}
            <div className="absolute bottom-4 left-4 flex bg-white rounded-lg shadow-lg overflow-hidden border border-[#E5E7EB]">
              <button
                onClick={() => setMapView('map')}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-all',
                  mapView === 'map'
                    ? 'neu-inset text-[#111827]'
                    : 'bg-white text-[#374151] hover:bg-[#F9FAFB]'
                )}
              >
                Map
              </button>
              <button
                onClick={() => setMapView('satellite')}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-all border-l border-[#E5E7EB]',
                  mapView === 'satellite'
                    ? 'neu-inset text-[#111827]'
                    : 'bg-white text-[#374151] hover:bg-[#F9FAFB]'
                )}
              >
                Satellist
              </button>
            </div>

            {/* Zoom Controls - Bottom Right */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-1">
              <button className="w-8 h-8 bg-white border border-[#E5E7EB] rounded-md flex items-center justify-center text-[#374151] hover:bg-[#F9FAFB] transition-colors shadow-sm">
                <Plus className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 bg-white border border-[#E5E7EB] rounded-md flex items-center justify-center text-[#374151] hover:bg-[#F9FAFB] transition-colors shadow-sm">
                <Minus className="w-4 h-4" />
              </button>
            </div>

            {/* Fullscreen Button - Top Right */}
            <button className="absolute top-4 right-4 w-8 h-8 bg-white border border-[#E5E7EB] rounded-md flex items-center justify-center text-[#374151] hover:bg-[#F9FAFB] transition-colors shadow-sm">
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Center Pin */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-4 h-4 bg-[#111827] rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#111827]/20 rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties List - 1 column */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#111827]">
            Unique Properties (888)
          </h2>
          <Select defaultValue="all">
            <SelectTrigger className="w-[120px] h-9 border-[#E5E7EB] text-sm">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="price-high">Price: High</SelectItem>
              <SelectItem value="price-low">Price: Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Properties Scrollable List */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {mockProperties.map((property) => {
            const isSelected = selectedProperty === property.id
            return (
              <div
                key={property.id}
                className={cn(
                  'bg-white border rounded-xl p-4 cursor-pointer transition-all',
                  isSelected
                    ? 'neu-raised border-[#111827] border-opacity-30'
                    : 'border-[#E5E7EB] hover:shadow-md'
                )}
                onClick={() => setSelectedProperty(property.id)}
              >
                <div className="flex gap-4">
                  {/* Property Image */}
                  <div className="w-32 h-24 bg-[#F3F4F6] rounded-lg flex-shrink-0 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-[#FEF3C7] via-[#FDE68A] to-[#FCD34D] flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#111827] text-sm truncate mb-0.5">
                          {property.name}
                        </h3>
                        <p className="text-xs text-[#6B7280]">
                          {property.address} {property.zipCode}
                        </p>
                      </div>
                      {isSelected ? (
                        <Check className="w-5 h-5 text-[#111827] flex-shrink-0 ml-2" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#D1D5DB] flex-shrink-0 ml-2" />
                      )}
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="font-semibold text-[#111827]">
                        Est. value {property.estValue}
                      </div>
                      <div className="text-[#6B7280]">{property.type}</div>
                      <div className="text-[#6B7280]">
                        {property.bedrooms} Bd. {property.bathrooms} Ba. {property.squareFeet.toLocaleString()} SqFt. {property.lotSize.toLocaleString()}
                      </div>
                      <div className="text-[#6B7280]">
                        Est Loan Balance {property.estLoanBalance}
                      </div>
                      <div className="text-[#6B7280]">
                        Est. Equity {property.estEquity}
                      </div>
                      <div className="text-[#6B7280]">
                        Last Sale Date {property.lastSaleDate}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
