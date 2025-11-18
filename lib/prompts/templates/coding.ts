import { PromptTemplate } from '../types'

export const codingTemplates: PromptTemplate[] = [
  {
    id: 'code-review',
    name: 'Code Review & Analysis',
    description: 'Comprehensive code review with suggestions and best practices',
    category: 'coding',
    icon: '🔍',
    systemPrompt: `You are a senior software engineer conducting code reviews. Analyze code for:
- Code quality and readability
- Best practices and patterns
- Potential bugs and issues
- Performance optimization opportunities
- Security vulnerabilities
- Testing coverage
- Documentation quality

Provide constructive, actionable feedback.`,
    nextStepPrompt: `Code Review Request:

Language/Framework: {{language}}
{{code_description}}

Code to review:
\`\`\`
{{code}}
\`\`\`

Please provide a comprehensive code review including:

1. **Overall Assessment**: General code quality and structure
2. **Strengths**: What's done well
3. **Issues Found**: Bugs, anti-patterns, or problems (categorized by severity)
4. **Security Concerns**: Potential vulnerabilities
5. **Performance**: Optimization opportunities
6. **Best Practices**: Recommendations for improvement
7. **Refactoring Suggestions**: How to improve the code structure
8. **Testing**: Test coverage and testing recommendations
9. **Documentation**: Comments and documentation quality

Be specific and provide code examples where helpful.`,
    tools: [],
    outputFormat: 'markdown',
    estimatedTime: '2-4 minutes',
    tags: ['code', 'review', 'quality'],
    featured: true,
    variables: [
      {
        name: 'language',
        label: 'Programming Language/Framework',
        type: 'string',
        required: true,
        placeholder: 'e.g., Python, React, Node.js'
      },
      {
        name: 'code',
        label: 'Code to Review',
        type: 'textarea',
        required: true,
        placeholder: 'Paste your code here'
      },
      {
        name: 'code_description',
        label: 'Code Purpose/Context',
        type: 'textarea',
        required: false,
        placeholder: 'Describe what this code does'
      }
    ],
    examples: []
  },
  {
    id: 'bug-fixer',
    name: 'Bug Finder & Fixer',
    description: 'Identify bugs and provide fixes with explanations',
    category: 'coding',
    icon: '🐛',
    systemPrompt: `You are a debugging expert. When analyzing code:
- Identify potential bugs and errors
- Explain why each bug occurs
- Provide corrected code
- Suggest preventive measures
- Consider edge cases
- Explain the fix clearly`,
    nextStepPrompt: `Bug Fix Request:

Language: {{bug_language}}
Problem Description: {{problem}}

Code:
\`\`\`
{{bug_code}}
\`\`\`

{{error_message}}

Please help debug this issue:

1. **Problem Analysis**: What's causing the issue
2. **Bugs Identified**: All bugs found with explanations
3. **Fixed Code**: Corrected version of the code
4. **Explanation**: Why the fix works
5. **Edge Cases**: Other scenarios to consider
6. **Prevention**: How to avoid similar bugs
7. **Testing Recommendations**: How to test the fix`,
    tools: [],
    outputFormat: 'markdown',
    estimatedTime: '2-3 minutes',
    tags: ['debugging', 'fix', 'error'],
    variables: [
      {
        name: 'bug_language',
        label: 'Programming Language',
        type: 'string',
        required: true,
        placeholder: 'e.g., JavaScript, Python'
      },
      {
        name: 'problem',
        label: 'Problem Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe what is not working'
      },
      {
        name: 'bug_code',
        label: 'Code with Bug',
        type: 'textarea',
        required: true,
        placeholder: 'Paste the problematic code'
      },
      {
        name: 'error_message',
        label: 'Error Message (if any)',
        type: 'textarea',
        required: false,
        placeholder: 'Paste any error messages'
      }
    ],
    examples: []
  },
  {
    id: 'doc-generator',
    name: 'Documentation Generator',
    description: 'Create comprehensive code documentation',
    category: 'coding',
    icon: '📖',
    systemPrompt: `You are a technical documentation expert. Create clear, comprehensive documentation that includes:
- Overview and purpose
- Installation/setup instructions
- API/function references
- Usage examples
- Parameter descriptions
- Return value explanations
- Best practices
- Common pitfalls`,
    nextStepPrompt: `Documentation Request:

Project/Code Type: {{doc_type}}
{{code_context}}

Code:
\`\`\`
{{doc_code}}
\`\`\`

Generate comprehensive documentation:

1. **Overview**: What this code does
2. **Purpose**: Why it exists and when to use it
3. **Installation/Setup**: How to get started (if applicable)
4. **Usage**: How to use it with examples
5. **API Reference**: Detailed function/method documentation
6. **Parameters**: Description of all parameters
7. **Return Values**: What the code returns
8. **Examples**: Code examples for common use cases
9. **Best Practices**: Recommended usage patterns
10. **Notes**: Important considerations or limitations`,
    tools: [],
    outputFormat: 'markdown',
    estimatedTime: '3-4 minutes',
    tags: ['documentation', 'api', 'reference'],
    variables: [
      {
        name: 'doc_type',
        label: 'Documentation Type',
        type: 'string',
        required: true,
        options: ['API', 'Library', 'Function', 'Class', 'Module', 'Full Project']
      },
      {
        name: 'doc_code',
        label: 'Code to Document',
        type: 'textarea',
        required: true,
        placeholder: 'Paste the code that needs documentation'
      },
      {
        name: 'code_context',
        label: 'Context/Purpose',
        type: 'textarea',
        required: false,
        placeholder: 'Describe the broader context or purpose'
      }
    ],
    examples: []
  }
]
