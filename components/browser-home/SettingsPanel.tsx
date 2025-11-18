'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Settings, Download, Upload } from 'lucide-react'
import { BrowserHomeSettings, updateSettings, getBrowserHomeData, saveBrowserHomeData } from '@/lib/storage/browser-home'

interface SettingsPanelProps {
  settings: BrowserHomeSettings
  onUpdate: () => void
}

export function SettingsPanel({ settings, onUpdate }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localSettings, setLocalSettings] = useState(settings)

  const handleSave = () => {
    updateSettings(localSettings)
    onUpdate()
    setIsOpen(false)
  }

  const handleExport = () => {
    const data = getBrowserHomeData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `forkyy-browser-home-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string)
            saveBrowserHomeData(data)
            onUpdate()
            alert('Settings imported successfully!')
          } catch (error) {
            alert('Error importing settings. Please check the file format.')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-4 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Browser Home Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Widget Visibility */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Widget Visibility
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-speed-dial">Show Speed Dial</Label>
                <Switch
                  id="show-speed-dial"
                  checked={localSettings.showSpeedDial}
                  onCheckedChange={(checked) =>
                    setLocalSettings({ ...localSettings, showSpeedDial: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-clock">Show Clock</Label>
                <Switch
                  id="show-clock"
                  checked={localSettings.showClock}
                  onCheckedChange={(checked) =>
                    setLocalSettings({ ...localSettings, showClock: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-weather">Show Weather</Label>
                <Switch
                  id="show-weather"
                  checked={localSettings.showWeather}
                  onCheckedChange={(checked) =>
                    setLocalSettings({ ...localSettings, showWeather: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-todo">Show Tasks</Label>
                <Switch
                  id="show-todo"
                  checked={localSettings.showTodo}
                  onCheckedChange={(checked) =>
                    setLocalSettings({ ...localSettings, showTodo: checked })
                  }
                />
              </div>
            </div>
          </div>

          {/* Clock Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Clock Settings
            </h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="clock-format">24-Hour Format</Label>
              <Switch
                id="clock-format"
                checked={localSettings.clockFormat === '24'}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, clockFormat: checked ? '24' : '12' })
                }
              />
            </div>
          </div>

          {/* Weather Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Weather Settings
            </h3>
            <div className="space-y-2">
              <Label htmlFor="weather-location">Location</Label>
              <Input
                id="weather-location"
                placeholder="e.g., New York"
                value={localSettings.weatherLocation}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, weatherLocation: e.target.value })
                }
              />
            </div>
          </div>

          {/* Background Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Background
            </h3>
            <div className="space-y-2">
              <Label htmlFor="background-type">Background Type</Label>
              <select
                id="background-type"
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
                value={localSettings.backgroundType}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    backgroundType: e.target.value as 'solid' | 'gradient' | 'image',
                  })
                }
              >
                <option value="solid">Solid Color</option>
                <option value="gradient">Gradient</option>
                <option value="image">Image URL</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="background-value">
                {localSettings.backgroundType === 'image' ? 'Image URL' : 'Color/Gradient'}
              </Label>
              <Input
                id="background-value"
                placeholder={
                  localSettings.backgroundType === 'image'
                    ? 'https://example.com/image.jpg'
                    : localSettings.backgroundType === 'gradient'
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#667eea'
                }
                value={localSettings.backgroundValue}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, backgroundValue: e.target.value })
                }
              />
            </div>
          </div>

          {/* Import/Export */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Backup & Restore
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export Settings
              </Button>
              <Button variant="outline" onClick={handleImport} className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Import Settings
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
