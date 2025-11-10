import {
  GraduationCap,
  Search,
  BookOpen,
  FileText,
  Users,
  Award,
  Microscope,
  FlaskConical
} from 'lucide-react'
import Link from 'next/link'

const researchFields = [
  {
    name: 'Computer Science',
    icon: BookOpen,
    papers: '2.5M',
    color: 'bg-blue-500'
  },
  {
    name: 'Physics',
    icon: FlaskConical,
    papers: '1.8M',
    color: 'bg-purple-500'
  },
  {
    name: 'Biology',
    icon: Microscope,
    papers: '2.1M',
    color: 'bg-green-500'
  },
  { name: 'Mathematics', icon: Award, papers: '980K', color: 'bg-orange-500' },
  {
    name: 'Chemistry',
    icon: FlaskConical,
    papers: '1.5M',
    color: 'bg-red-500'
  },
  {
    name: 'Engineering',
    icon: BookOpen,
    papers: '1.2M',
    color: 'bg-indigo-500'
  }
]

const featuredPapers = [
  {
    title:
      'Attention Is All You Need: Transforming Natural Language Processing',
    authors: 'Vaswani et al.',
    journal: 'NeurIPS 2017',
    citations: '95,000+',
    year: '2017',
    href: '/search?q=attention+is+all+you+need'
  },
  {
    title: 'Deep Residual Learning for Image Recognition',
    authors: 'He et al.',
    journal: 'CVPR 2016',
    citations: '180,000+',
    year: '2016',
    href: '/search?q=resnet+paper'
  },
  {
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    authors: 'Devlin et al.',
    journal: 'NAACL 2019',
    citations: '65,000+',
    year: '2019',
    href: '/search?q=bert+paper'
  },
  {
    title: 'Generative Adversarial Networks',
    authors: 'Goodfellow et al.',
    journal: 'NeurIPS 2014',
    citations: '75,000+',
    year: '2014',
    href: '/search?q=gan+paper'
  }
]

const recentTopics = [
  'Artificial General Intelligence',
  'Quantum Machine Learning',
  'CRISPR Gene Editing',
  'Dark Matter Detection',
  'Fusion Energy',
  'Neuromorphic Computing',
  'Climate Modeling',
  'Protein Folding'
]

export default function AcademicPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-br from-background via-background to-blue-500/5">
        <div className="container max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-blue-500/10 p-3">
              <GraduationCap className="size-6 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Academic</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            Access scholarly articles, research papers, and academic resources
            from leading institutions worldwide
          </p>
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search papers, authors, topics..."
              className="w-full rounded-2xl border border-input bg-background px-12 py-4 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-6 py-10 flex-1">
        {/* Research Fields */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Browse by Field
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchFields.map((field, index) => (
              <Link
                key={index}
                href={`/search?q=${field.name.toLowerCase()}+research+papers`}
                className="group relative flex items-center gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className={`rounded-xl ${field.color} p-3 text-white`}>
                  <field.icon className="size-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                    {field.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {field.papers} papers
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Papers */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="size-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Highly Cited Papers
            </h2>
          </div>
          <div className="space-y-4">
            {featuredPapers.map((paper, index) => (
              <Link
                key={index}
                href={paper.href}
                className="group block rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                  {paper.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="size-4" />
                    <span>{paper.authors}</span>
                  </div>
                  <span>•</span>
                  <span>{paper.journal}</span>
                  <span>•</span>
                  <span>{paper.year}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-primary">
                    <Award className="size-4" />
                    <span className="font-medium">{paper.citations} citations</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Topics */}
          <section className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="size-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Trending Research Topics
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {recentTopics.map((topic, index) => (
                <Link
                  key={index}
                  href={`/search?q=${encodeURIComponent(topic)}+research`}
                  className="group rounded-2xl border border-border bg-card p-4 text-center hover:border-primary/50 hover:shadow-lg transition-all"
                >
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {topic}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Quick Links */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Resources
            </h2>
            <div className="space-y-3">
              <Link
                href="/search?q=arxiv+preprints"
                className="block rounded-2xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-sm text-foreground mb-1">
                  arXiv Preprints
                </h3>
                <p className="text-xs text-muted-foreground">
                  Latest research papers
                </p>
              </Link>
              <Link
                href="/search?q=peer+reviewed+journals"
                className="block rounded-2xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-sm text-foreground mb-1">
                  Peer-Reviewed Journals
                </h3>
                <p className="text-xs text-muted-foreground">
                  Published research
                </p>
              </Link>
              <Link
                href="/search?q=conference+proceedings"
                className="block rounded-2xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-sm text-foreground mb-1">
                  Conference Proceedings
                </h3>
                <p className="text-xs text-muted-foreground">
                  Academic conferences
                </p>
              </Link>
              <Link
                href="/search?q=research+datasets"
                className="block rounded-2xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-sm text-foreground mb-1">
                  Research Datasets
                </h3>
                <p className="text-xs text-muted-foreground">
                  Open data sources
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
