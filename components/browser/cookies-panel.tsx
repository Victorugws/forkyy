'use client'

import { Button } from '@/components/ui/button'
import { X, Trash2, Search, Shield, Cookie } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Cookie {
  name: string
  value: string
  domain: string
  path: string
  secure: boolean
  httpOnly: boolean
  sameSite: 'Strict' | 'Lax' | 'None'
  expires?: number
}

interface CookiesPanelProps {
  cookies: Cookie[]
  onDelete: (cookieName: string, domain: string) => void
  onDeleteAll: () => void
  onClose: () => void
}

export function CookiesPanel({
  cookies,
  onDelete,
  onDeleteAll,
  onClose,
}: CookiesPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCookie, setSelectedCookie] = useState<Cookie | null>(null)

  const filteredCookies = cookies.filter(cookie =>
    cookie.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cookie.domain.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedCookies = filteredCookies.reduce((acc, cookie) => {
    if (!acc[cookie.domain]) {
      acc[cookie.domain] = []
    }
    acc[cookie.domain].push(cookie)
    return acc
  }, {} as Record<string, Cookie[]>)

  return (
    <>
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            <h2 className="font-semibold">Cookies & Site Data</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cookies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-b flex gap-2">
          <Button variant="outline" size="sm" onClick={onDeleteAll}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>

        {/* Cookies List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {Object.entries(groupedCookies).map(([domain, domainCookies]) => (
              <div key={domain}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">{domain}</h3>
                    <span className="text-xs text-muted-foreground">
                      ({domainCookies.length} cookie{domainCookies.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      domainCookies.forEach(cookie => onDelete(cookie.name, cookie.domain))
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {domainCookies.map((cookie) => (
                    <div
                      key={`${cookie.domain}-${cookie.name}`}
                      className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedCookie(cookie)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{cookie.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            Path: {cookie.path}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {cookie.secure && (
                              <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                                Secure
                              </span>
                            )}
                            {cookie.httpOnly && (
                              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                                HttpOnly
                              </span>
                            )}
                            <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded">
                              {cookie.sameSite}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(cookie.name, cookie.domain)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredCookies.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Cookie className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No cookies found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Cookie Detail Dialog */}
      <Dialog open={!!selectedCookie} onOpenChange={() => setSelectedCookie(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cookie Details</DialogTitle>
            <DialogDescription>
              View and manage cookie information
            </DialogDescription>
          </DialogHeader>
          {selectedCookie && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
                  {selectedCookie.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Value</label>
                <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded break-all">
                  {selectedCookie.value}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Domain</label>
                  <p className="text-sm text-muted-foreground">{selectedCookie.domain}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Path</label>
                  <p className="text-sm text-muted-foreground">{selectedCookie.path}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Secure</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedCookie.secure ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">HttpOnly</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedCookie.httpOnly ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">SameSite</label>
                <p className="text-sm text-muted-foreground">{selectedCookie.sameSite}</p>
              </div>
              {selectedCookie.expires && (
                <div>
                  <label className="text-sm font-medium">Expires</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedCookie.expires * 1000).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

