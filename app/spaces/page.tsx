import {
  Folder,
  Plus,
  Search,
  TrendingUp,
  Brain,
  Code,
  BookOpen,
  Users
} from 'lucide-react'
import Link from 'next/link'

const defaultSpaces = [
  {
    name: 'Technology Research',
    description:
      'Curated collection of AI, ML, and emerging tech discussions',
    icon: Brain,
    threadsCount: 24,
    lastUpdated: '2 hours ago',
    color: 'bg-blue-500'
  },
  {
    name: 'Finance & Markets',
    description: 'Stock analysis, crypto trends, and market insights',
    icon: TrendingUp,
    threadsCount: 18,
    lastUpdated: '5 hours ago',
    color: 'bg-green-500'
  },
  {
    name: 'Programming',
    description: 'Code snippets, algorithms, and development tips',
    icon: Code,
    threadsCount: 42,
    lastUpdated: '1 day ago',
    color: 'bg-purple-500'
  },
  {
    name: 'Learning',
    description: 'Educational resources and study materials',
    icon: BookOpen,
    threadsCount: 15,
    lastUpdated: '3 days ago',
    color: 'bg-orange-500'
  }
]

export default function SpacesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Folder className="size-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Spaces</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            Organize your threads into collections for easy access and better
            knowledge management
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="size-4" />
              Create Space
            </button>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search spaces..."
                className="w-full rounded-full border border-input bg-background px-10 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-6 py-10 flex-1">
        {/* My Spaces Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            My Spaces
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {defaultSpaces.map((space, index) => (
              <Link
                key={index}
                href={`/spaces/${space.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`rounded-xl ${space.color} p-3 text-white`}
                  >
                    <space.icon className="size-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {space.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {space.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border">
                  <span>{space.threadsCount} threads</span>
                  <span>Updated {space.lastUpdated}</span>
                </div>
              </Link>
            ))}

            {/* Create New Space Card */}
            <button className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card p-6 transition-all hover:border-primary/50 hover:bg-accent">
              <div className="rounded-full bg-primary/10 p-4 mb-4 group-hover:bg-primary/20 transition-colors">
                <Plus className="size-8 text-primary" />
              </div>
              <h3 className="font-semibold text-base text-foreground">
                Create New Space
              </h3>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Organize threads by topic or project
              </p>
            </button>
          </div>
        </section>

        {/* Shared Spaces Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Users className="size-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Shared with Me
            </h2>
          </div>
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <div className="mx-auto w-fit rounded-full bg-muted p-6 mb-4">
              <Users className="size-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No shared spaces yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              When someone shares a space with you, it will appear here. You
              can collaborate and explore shared collections together.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
