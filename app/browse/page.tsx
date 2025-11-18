import { BrowserClient } from '@/components/browser/browser-client'
import { getModels } from '@/lib/config/models'
import { generateId } from 'ai'

export default async function BrowsePage() {
  const id = generateId()
  const models = await getModels()

  return <BrowserClient id={id} models={models} />
}
