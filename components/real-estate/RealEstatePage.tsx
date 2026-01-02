'use client'

import { useState } from 'react'
import RealEstateSidebar from './RealEstateSidebar'
import RealEstateHeader from './RealEstateHeader'
import StatisticsSection from './StatisticsSection'
import PropertyCategorySection from './PropertyCategorySection'
import MapAndPropertiesSection from './MapAndPropertiesSection'

export default function RealEstatePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Cash Buyers')

  return (
    <div className="h-screen w-screen bg-white flex overflow-hidden">
      {/* Left Sidebar */}
      <RealEstateSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <RealEstateHeader />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <div className="max-w-[1920px] mx-auto px-6 py-6 space-y-6">
            {/* Statistics Section */}
            <StatisticsSection />

            {/* Property Category Section */}
            <PropertyCategorySection
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            {/* Map and Properties Section */}
            <MapAndPropertiesSection />
          </div>
        </main>
      </div>
    </div>
  )
}

