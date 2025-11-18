'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, ExternalLink, Edit, Trash2 } from 'lucide-react'
import { Shortcut, addShortcut, updateShortcut, deleteShortcut } from '@/lib/storage/browser-home'

interface SpeedDialProps {
  shortcuts: Shortcut[]
  onUpdate: () => void
}

export function SpeedDial({ shortcuts, onUpdate }: SpeedDialProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingShortcut, setEditingShortcut] = useState<Shortcut | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    favicon: '',
  })

  const resetForm = () => {
    setFormData({ title: '', url: '', favicon: '' })
    setEditingShortcut(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.url.trim()) return

    // Ensure URL has protocol
    let url = formData.url.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    // Auto-generate favicon if not provided
    let favicon = formData.favicon.trim()
    if (!favicon) {
      try {
        const urlObj = new URL(url)
        favicon = `${urlObj.origin}/favicon.ico`
      } catch (e) {
        favicon = ''
      }
    }

    if (editingShortcut) {
      updateShortcut(editingShortcut.id, {
        title: formData.title.trim(),
        url,
        favicon,
      })
    } else {
      addShortcut({
        title: formData.title.trim(),
        url,
        favicon,
      })
    }

    resetForm()
    setIsAddDialogOpen(false)
    onUpdate()
  }

  const handleEdit = (shortcut: Shortcut) => {
    setEditingShortcut(shortcut)
    setFormData({
      title: shortcut.title,
      url: shortcut.url,
      favicon: shortcut.favicon || '',
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this shortcut?')) {
      deleteShortcut(id)
      onUpdate()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Quick Access
        </h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Shortcut
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingShortcut ? 'Edit Shortcut' : 'Add New Shortcut'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Gmail"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="e.g., gmail.com"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon URL (optional)</Label>
                <Input
                  id="favicon"
                  type="url"
                  placeholder="Will be auto-generated if left empty"
                  value={formData.favicon}
                  onChange={(e) => setFormData({ ...formData, favicon: e.target.value })}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setIsAddDialogOpen(false)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingShortcut ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {shortcuts.map((shortcut) => (
          <Card
            key={shortcut.id}
            className="group relative p-4 hover:shadow-lg transition-all duration-200 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200 dark:border-gray-800 cursor-pointer"
          >
            <a
              href={shortcut.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                {shortcut.favicon ? (
                  <img
                    src={shortcut.favicon}
                    alt={shortcut.title}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                ) : null}
                <ExternalLink className={`h-6 w-6 text-gray-400 ${shortcut.favicon ? 'hidden' : ''}`} />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                {shortcut.title}
              </span>
            </a>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                onClick={(e) => {
                  e.preventDefault()
                  handleEdit(shortcut)
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                onClick={(e) => {
                  e.preventDefault()
                  handleDelete(shortcut.id)
                }}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
