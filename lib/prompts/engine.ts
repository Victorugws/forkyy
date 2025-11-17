import { PromptTemplate } from './types'

/**
 * Substitute variables in a template string
 * Replaces {{variable_name}} with actual values
 */
export function substituteVariables(
  template: string,
  variables: Record<string, any>
): string {
  let result = template

  // Replace all {{variable}} placeholders
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`
    const stringValue = value !== undefined && value !== null ? String(value) : ''
    result = result.replace(new RegExp(placeholder, 'g'), stringValue)
  })

  // Remove any remaining empty placeholders
  result = result.replace(/{{[^}]+}}\n?/g, '')

  return result.trim()
}

/**
 * Validate that all required variables are provided
 */
export function validateVariables(
  template: PromptTemplate,
  variables: Record<string, any>
): { valid: boolean; missing: string[] } {
  const missing: string[] = []

  template.variables.forEach(variable => {
    if (variable.required) {
      const value = variables[variable.name]
      if (value === undefined || value === null || value === '') {
        missing.push(variable.label || variable.name)
      }
    }
  })

  return {
    valid: missing.length === 0,
    missing
  }
}

/**
 * Prepare template for execution by substituting variables
 */
export function prepareTemplate(
  template: PromptTemplate,
  variables: Record<string, any>
): { systemPrompt: string; userPrompt: string } {
  // Add default values for variables not provided
  const completeVariables = { ...variables }
  template.variables.forEach(variable => {
    if (
      variable.defaultValue !== undefined &&
      (completeVariables[variable.name] === undefined ||
        completeVariables[variable.name] === '')
    ) {
      completeVariables[variable.name] = variable.defaultValue
    }
  })

  const systemPrompt = substituteVariables(
    template.systemPrompt,
    completeVariables
  )
  const userPrompt = substituteVariables(
    template.nextStepPrompt,
    completeVariables
  )

  return {
    systemPrompt,
    userPrompt
  }
}

/**
 * Generate a chat ID for template execution
 */
export function generateTemplateChatId(templateId: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  return `template-${templateId}-${timestamp}-${random}`
}
