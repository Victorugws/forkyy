'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Terminal, Network, Code2, FileCode } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface DevToolsPanelProps {
  onClose: () => void
  pageUrl: string
}

export function DevToolsPanel({ onClose, pageUrl }: DevToolsPanelProps) {
  const [consoleLog, setConsoleLog] = useState<string[]>([
    '> Console initialized',
    '> Ready to debug',
  ])

  return (
    <div className="flex flex-col h-full bg-background border-t">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4" />
          <span className="text-sm font-semibold">Developer Tools</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="console" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b">
          <TabsTrigger value="console" className="gap-2">
            <Terminal className="h-3 w-3" />
            Console
          </TabsTrigger>
          <TabsTrigger value="network" className="gap-2">
            <Network className="h-3 w-3" />
            Network
          </TabsTrigger>
          <TabsTrigger value="elements" className="gap-2">
            <FileCode className="h-3 w-3" />
            Elements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="console" className="flex-1 m-0 p-0">
          <ScrollArea className="h-full">
            <div className="p-2 font-mono text-xs space-y-1">
              {consoleLog.map((log, i) => (
                <div key={i} className="text-muted-foreground">
                  {log}
                </div>
              ))}
              <div className="text-yellow-600">
                ⚠ Developer tools are limited in sandboxed iframe mode
              </div>
              <div className="text-muted-foreground">
                For full dev tools, open this page in a new browser tab
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="network" className="flex-1 m-0 p-0">
          <ScrollArea className="h-full">
            <div className="p-4 text-center text-sm text-muted-foreground">
              <Network className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p>Network monitoring</p>
              <p className="text-xs mt-1">
                Network requests will appear here
              </p>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="elements" className="flex-1 m-0 p-0">
          <ScrollArea className="h-full">
            <div className="p-4 text-center text-sm text-muted-foreground">
              <FileCode className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p>DOM Inspector</p>
              <p className="text-xs mt-1">
                Page structure will appear here
              </p>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
