'use client'
import { HeaderNavbar } from '@/components/header-navbar'

import { Layout, Users, Folder } from 'lucide-react'

export function NeumorphicSpacesPage() {
  const spaces = [
    { icon: Layout, title: 'Workspace 1', members: 12, files: 45 },
    { icon: Layout, title: 'Workspace 2', members: 8, files: 32 },
    { icon: Layout, title: 'Workspace 3', members: 15, files: 67 }
  ]

  return (
    <div className="w-full min-h-screen bg-background">
      <HeaderNavbar user={null} />
      <div className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="neu-card rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="neu-raised rounded-full p-3">
              <Layout className="size-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Spaces</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Collaborative workspaces for teams and projects
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space, i) => (
            <div key={i} className="neu-card rounded-2xl p-6 hover:shadow-neu-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
              <div className="neu-inset rounded-full p-4 w-fit mb-4">
                <space.icon className="size-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">{space.title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="size-4" />
                  <span>{space.members}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Folder className="size-4" />
                  <span>{space.files}</span>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  )
}
