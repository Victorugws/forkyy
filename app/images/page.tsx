import { BrowserClientEnhanced } from '@/components/browser/browser-client-enhanced'
import { getModels } from '@/lib/config/models'
import { generateId } from 'ai'

export default async function ImagesPage() {
  const id = generateId()
  const models = await getModels()
  return <BrowserClientEnhanced id={id} models={models} initialUrl="/images" />
}
