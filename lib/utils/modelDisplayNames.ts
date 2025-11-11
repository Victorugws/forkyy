import { Model } from '@/lib/types/models'

interface ModelWithDisplayName extends Model {
  displayName?: string
}

/**
 * Add custom display names to models
 */
export function withCustomNames(models: Model[]): ModelWithDisplayName[] {
  return models.map(model => ({
    ...model,
    displayName: getCustomDisplayName(model.id) || model.name
  }))
}

/**
 * Get custom display name for a model ID
 */
function getCustomDisplayName(modelId: string): string | undefined {
  const customNames: Record<string, string> = {
    'grok-3-beta': 'Grok 3 Beta',
    'grok-2-1212': 'Grok 2',
    'claude-3-5-sonnet-20241022': 'Claude 3.5 Sonnet',
    'claude-3-5-haiku-20241022': 'Claude 3.5 Haiku',
    'gpt-4o': 'GPT-4o',
    'gpt-4o-mini': 'GPT-4o Mini'
  }

  return customNames[modelId]
}