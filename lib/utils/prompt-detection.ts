/**
 * Detects if a prompt is task-like (should trigger task overlay) vs chat-like (should trigger chat overlay)
 */

export function isTaskLikePrompt(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase().trim()
  
  // Task-like keywords and patterns
  const taskKeywords = [
    'create', 'build', 'develop', 'make', 'generate', 'write', 'design',
    'analyze', 'research', 'find', 'search for', 'compile', 'organize',
    'plan', 'schedule', 'track', 'monitor', 'update', 'sync', 'integrate',
    'implement', 'deploy', 'setup', 'configure', 'install', 'test',
    'execute', 'run', 'perform', 'complete', 'finish', 'deliver',
    'produce', 'construct', 'assemble', 'prepare', 'arrange', 'format'
  ]
  
  // Action phrases that indicate tasks
  const taskPhrases = [
    'step by step', 'step-by-step', 'stepwise', 'in steps',
    'with steps', 'show me how', 'guide me', 'walk me through',
    'do this', 'get this done', 'handle this', 'take care of',
    'work on', 'focus on', 'tackle', 'address', 'solve',
    'automate', 'script', 'program', 'code', 'build a',
    'create a', 'make a', 'develop a', 'design a'
  ]
  
  // Check for task keywords
  const hasTaskKeyword = taskKeywords.some(keyword => 
    lowerPrompt.startsWith(keyword) || 
    lowerPrompt.includes(` ${keyword} `) ||
    lowerPrompt.includes(`${keyword} a`) ||
    lowerPrompt.includes(`${keyword} an`)
  )
  
  // Check for task phrases
  const hasTaskPhrase = taskPhrases.some(phrase => 
    lowerPrompt.includes(phrase)
  )
  
  // Check for imperative mood (commands)
  const isImperative = /^(create|build|make|develop|write|design|analyze|research|find|search|compile|organize|plan|schedule|track|monitor|update|sync|integrate|implement|deploy|setup|configure|install|test|execute|run|perform|complete|finish|deliver|produce|construct|assemble|prepare|arrange|format)/i.test(prompt)
  
  // Check for question words (more likely chat)
  const isQuestion = /^(what|when|where|who|why|how|which|is|are|can|could|would|should|will|do|does|did)/i.test(prompt)
  
  // Check for conversational patterns (more likely chat)
  const isConversational = /^(tell me|explain|describe|help me|i need|i want|i\'m looking for|can you|could you|would you)/i.test(prompt)
  
  // If it's clearly a question or conversational, it's chat-like
  if (isQuestion || isConversational) {
    return false
  }
  
  // If it has task keywords/phrases or is imperative, it's task-like
  if (hasTaskKeyword || hasTaskPhrase || isImperative) {
    return true
  }
  
  // Default: if it's short and direct, likely a task; if it's longer and descriptive, likely chat
  return prompt.length < 100 && !prompt.includes('?')
}

