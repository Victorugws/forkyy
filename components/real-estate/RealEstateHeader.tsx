'use client'

import { Search, Bell, MessageSquare } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function RealEstateHeader() {
  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] px-6 flex-shrink-0">
      <div className="flex items-center justify-between h-full gap-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-[600px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-5 h-5 pointer-events-none" />
            <input
              type="text"
              defaultValue="American Canyon, CA"
              className="w-full h-10 pl-10 pr-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:ring-opacity-20 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6] rounded-lg transition-colors">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6] rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full border border-white"></span>
          </button>
          <Avatar className="w-10 h-10 cursor-pointer">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="neu-raised text-[#111827] text-sm font-medium">U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
