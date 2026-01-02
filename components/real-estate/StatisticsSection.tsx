'use client'

import { Download, MoreVertical, TrendingUp, TrendingDown } from 'lucide-react'

export default function StatisticsSection() {
  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827] leading-tight">
            Statistics for American Canyon, CA
          </h1>
          <p className="text-sm text-[#6B7280] mt-1.5 leading-relaxed">
            Choose the type of property you are looking for, such as a house, apartment, land or commercial property.
          </p>
        </div>
        <button className="h-10 px-4 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2 flex-shrink-0">
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sales Trend Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#6B7280]">Sales Trend</h3>
            <button className="text-[#9CA3AF] hover:text-[#6B7280] p-1">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-[#111827]">$622,357</div>
            <div className="text-xs text-[#6B7280]">Last 30 Days average sale price</div>
            <div className="flex items-center gap-1.5 text-[#10B981] text-sm font-medium pt-1">
              <TrendingUp className="w-4 h-4" />
              <span>+12.08%</span>
            </div>
          </div>
        </div>

        {/* Days on Market Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#6B7280]">Days on market vs inventory</h3>
            <button className="text-[#9CA3AF] hover:text-[#6B7280] p-1">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="h-24 relative">
            <svg className="w-full h-full" viewBox="0 0 200 96" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 8,76 Q 40,60 70,52 T 140,38 T 192,32"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 8,76 Q 40,60 70,52 T 140,38 T 192,32 L 192,96 L 8,96 Z"
                fill="url(#lineGradient)"
              />
            </svg>
            <div className="absolute bottom-0 left-0 text-xs text-[#6B7280] font-medium">
              Last 30 Days Statistics for American
            </div>
          </div>
        </div>

        {/* Listing Trend Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#6B7280]">Listing Trend</h3>
            <button className="text-[#9CA3AF] hover:text-[#6B7280] p-1">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-[#111827]">$222</div>
            <div className="text-xs text-[#6B7280]">Last 30 Days average sale $/SqFt</div>
            <div className="flex items-center gap-1.5 text-[#EF4444] text-sm font-medium pt-1">
              <TrendingDown className="w-4 h-4" />
              -22.88%
            </div>
          </div>
        </div>

        {/* New Pre-Foreclosure Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#6B7280]">New Pre-Foreclosure</h3>
            <button className="text-[#9CA3AF] hover:text-[#6B7280] p-1">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="h-24 relative flex items-end gap-1.5">
            {[68, 48, 72, 58, 63, 52, 78].map((height, index) => (
              <div
                key={index}
                className="flex-1 bg-[#111827] rounded-t"
                style={{ height: `${height}%`, minHeight: '8px' }}
              />
            ))}
            <div className="absolute bottom-0 left-0 text-xs text-[#6B7280] font-medium">
              Last 30 Days Statistics for American
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
