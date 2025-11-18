import { TemplateGallery } from '@/components/templates/TemplateGallery'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Task Templates | Forkyy',
  description:
    'Execute complex tasks with pre-configured AI workflows powered by OpenManus. Research, planning, writing, analysis, and more.'
}

export default function TemplatesPage() {
  return <TemplateGallery />
}
