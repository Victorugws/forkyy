'use client'

import { useState } from 'react'
import { PromptTemplate, TemplateVariable } from '@/lib/prompts/types'
import { validateVariables } from '@/lib/prompts/engine'
import { Loader2, Sparkles } from 'lucide-react'

interface TemplateFormProps {
  template: PromptTemplate
  onSubmit: (variables: Record<string, any>) => Promise<void>
  isLoading?: boolean
}

export function TemplateForm({
  template,
  onSubmit,
  isLoading = false
}: TemplateFormProps) {
  const [values, setValues] = useState<Record<string, any>>(() => {
    // Initialize with default values
    const initial: Record<string, any> = {}
    template.variables.forEach(variable => {
      if (variable.defaultValue !== undefined) {
        initial[variable.name] = variable.defaultValue
      }
    })
    return initial
  })
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const validation = validateVariables(template, values)
    if (!validation.valid) {
      setErrors(validation.missing.map(field => `${field} is required`))
      return
    }

    setErrors([])
    await onSubmit(values)
  }

  const handleChange = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const renderField = (variable: TemplateVariable) => {
    const value = values[variable.name] || ''

    // For select/dropdown
    if (variable.options && variable.options.length > 0) {
      return (
        <select
          value={value}
          onChange={e => handleChange(variable.name, e.target.value)}
          required={variable.required}
          className="w-full neu-input rounded-lg px-4 py-3 text-base"
        >
          <option value="">Select an option...</option>
          {variable.options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )
    }

    // For textarea
    if (variable.type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={e => handleChange(variable.name, e.target.value)}
          required={variable.required}
          placeholder={variable.placeholder}
          rows={4}
          className="w-full neu-input rounded-lg px-4 py-3 text-base resize-none"
        />
      )
    }

    // For number
    if (variable.type === 'number') {
      return (
        <input
          type="number"
          value={value}
          onChange={e => handleChange(variable.name, e.target.value)}
          required={variable.required}
          placeholder={variable.placeholder}
          className="w-full neu-input rounded-lg px-4 py-3 text-base"
        />
      )
    }

    // For boolean/checkbox
    if (variable.type === 'boolean') {
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!!value}
            onChange={e => handleChange(variable.name, e.target.checked)}
            className="w-5 h-5 rounded neu-input"
          />
          <span className="text-sm text-muted-foreground">
            {variable.description || variable.label}
          </span>
        </label>
      )
    }

    // Default: text input
    return (
      <input
        type="text"
        value={value}
        onChange={e => handleChange(variable.name, e.target.value)}
        required={variable.required}
        placeholder={variable.placeholder}
        className="w-full neu-input rounded-lg px-4 py-3 text-base"
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Template Info */}
      <div className="neu-card rounded-2xl p-6 bg-gradient-to-br from-background to-primary/5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl neu-inset flex items-center justify-center bg-background">
            <span className="text-3xl">{template.icon}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {template.name}
            </h2>
            <p className="text-muted-foreground">
              {template.longDescription || template.description}
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="neu-card rounded-2xl p-4 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900">
          <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            Please fix the following errors:
          </p>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, i) => (
              <li
                key={i}
                className="text-sm text-red-700 dark:text-red-300"
              >
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-5">
        {template.variables.map(variable => (
          <div key={variable.name} className="space-y-2">
            <label className="block">
              <span className="text-sm font-medium text-foreground">
                {variable.label}
                {variable.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </span>
              {variable.description && variable.type !== 'boolean' && (
                <span className="block text-xs text-muted-foreground mt-1">
                  {variable.description}
                </span>
              )}
            </label>
            {renderField(variable)}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full neu-button rounded-xl px-6 py-4 bg-primary text-primary-foreground font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Executing Template...
          </>
        ) : (
          <>
            <Sparkles className="size-5" />
            Execute Template
          </>
        )}
      </button>

      {/* Estimated Time */}
      {template.estimatedTime && (
        <p className="text-center text-sm text-muted-foreground">
          Estimated completion time: {template.estimatedTime}
        </p>
      )}
    </form>
  )
}
