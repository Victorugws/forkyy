import { BrowserClientEnhanced } from '@/components/browser/browser-client-enhanced'
import { getModels } from '@/lib/config/models'
import { generateId } from 'ai'

export default async function HomePage() {
  const id = generateId()
  const models = await getModels()

  // Start with the neumorphic homepage loaded in the browser
  return <BrowserClientEnhanced id={id} models={models} initialUrl="/" />
}
