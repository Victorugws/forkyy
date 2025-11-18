export type TemplateCategory =
  | 'research'
  | 'planning'
  | 'writing'
  | 'analysis'
  | 'coding'
  | 'creative'
  | 'academic'

export type OutputFormat = 'text' | 'html' | 'markdown' | 'json'

export interface TemplateVariable {
  name: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'textarea'
  required: boolean
  placeholder?: string
  defaultValue?: any
  options?: string[] // For select/dropdown
  description?: string
}

export interface TemplateExample {
  title: string
  description: string
  variables: Record<string, any>
  expectedOutput?: string
}

export interface PromptTemplate {
  id: string
  name: string
  description: string
  longDescription?: string
  category: TemplateCategory
  icon: string
  systemPrompt: string
  nextStepPrompt: string
  tools?: string[] // Available tools for this template
  outputFormat: OutputFormat
  examples: TemplateExample[]
  variables: TemplateVariable[]
  estimatedTime?: string // e.g., "2-3 minutes"
  tags?: string[]
  featured?: boolean
}

export interface TemplateExecutionRequest {
  templateId: string
  variables: Record<string, any>
  chatId?: string
}

export interface TemplateExecutionResult {
  success: boolean
  chatId: string
  output?: string
  error?: string
}
