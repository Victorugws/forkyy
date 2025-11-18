import { Chat } from '@/components/chat'
import { SearchResults } from '@/components/search/SearchResults'
import { getModels } from '@/lib/config/models'
import { generateId } from 'ai'
import { redirect } from 'next/navigation'

export const maxDuration = 60

export default async function SearchPage(props: {
  searchParams: Promise<{ q: string; tab?: string }>
}) {
  const { q, tab } = await props.searchParams
  if (!q) {
    redirect('/')
  }

  // Use the new SearchResults component with tabs
  const initialTab = (tab as 'all' | 'images' | 'videos' | 'news') || 'all'
  return <SearchResults query={q} initialTab={initialTab} />
}
