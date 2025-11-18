import { PromptTemplate } from '../types'

export const academicTemplates: PromptTemplate[] = [
  {
    id: 'literature-review',
    name: 'Literature Review',
    description: 'Comprehensive academic literature review with citations',
    category: 'academic',
    icon: '📚',
    systemPrompt: `You are an academic researcher conducting literature reviews. Provide:
- Comprehensive coverage of relevant literature
- Critical analysis of findings
- Identification of gaps and trends
- Proper academic formatting
- Citations and references
- Synthesis of multiple sources`,
    nextStepPrompt: `Literature Review Request:

Research Topic: {{research_topic}}
Academic Field: {{academic_field}}
{{time_period}}
{{specific_focus}}

Conduct a comprehensive literature review including:

1. **Introduction**: Research topic and significance
2. **Methodology**: Search strategy and selection criteria
3. **Key Themes**: Major themes and findings from literature
4. **Analysis**: Critical evaluation of existing research
5. **Gaps**: Identified gaps in current research
6. **Trends**: Emerging trends and future directions
7. **Conclusion**: Summary and implications
8. **References**: Cited sources

Use academic tone and scholarly approach.`,
    tools: ['web_search'],
    outputFormat: 'markdown',
    estimatedTime: '5-7 minutes',
    tags: ['academic', 'research', 'literature'],
    featured: true,
    variables: [
      {
        name: 'research_topic',
        label: 'Research Topic',
        type: 'textarea',
        required: true,
        placeholder: 'e.g., Impact of social media on mental health'
      },
      {
        name: 'academic_field',
        label: 'Academic Field',
        type: 'string',
        required: true,
        placeholder: 'e.g., Psychology, Computer Science, Education'
      },
      {
        name: 'time_period',
        label: 'Time Period',
        type: 'string',
        required: false,
        placeholder: 'e.g., Last 5 years, 2015-2025'
      },
      {
        name: 'specific_focus',
        label: 'Specific Focus Areas',
        type: 'textarea',
        required: false,
        placeholder: 'Any specific aspects or subtopics to emphasize'
      }
    ],
    examples: []
  },
  {
    id: 'research-proposal',
    name: 'Research Proposal Generator',
    description: 'Create structured research proposals for academic projects',
    category: 'academic',
    icon: '🎓',
    systemPrompt: `You are an academic advisor helping to create research proposals. Include:
- Clear research questions
- Literature review
- Methodology
- Expected outcomes
- Timeline
- Budget considerations (if applicable)
- References`,
    nextStepPrompt: `Research Proposal Request:

Research Title: {{proposal_title}}
Field of Study: {{field_of_study}}
Research Question: {{research_question}}
{{background}}

Create a comprehensive research proposal:

1. **Title & Abstract**: Concise summary
2. **Introduction & Background**: Context and significance
3. **Literature Review**: Related work and gaps
4. **Research Questions/Hypotheses**: Clear, specific questions
5. **Methodology**: Research approach and methods
6. **Expected Outcomes**: Anticipated results and contributions
7. **Timeline**: Project phases and milestones
8. **Resources**: Required resources and budget
9. **References**: Cited literature`,
    tools: ['web_search'],
    outputFormat: 'markdown',
    estimatedTime: '5-8 minutes',
    tags: ['academic', 'research', 'proposal'],
    variables: [
      {
        name: 'proposal_title',
        label: 'Research Title',
        type: 'string',
        required: true,
        placeholder: 'Working title for your research'
      },
      {
        name: 'field_of_study',
        label: 'Field of Study',
        type: 'string',
        required: true,
        placeholder: 'e.g., Neuroscience, Economics'
      },
      {
        name: 'research_question',
        label: 'Main Research Question',
        type: 'textarea',
        required: true,
        placeholder: 'What question are you trying to answer?'
      },
      {
        name: 'background',
        label: 'Background Information',
        type: 'textarea',
        required: false,
        placeholder: 'Context, motivation, and preliminary ideas'
      }
    ],
    examples: []
  }
]
