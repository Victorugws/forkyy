import { PromptTemplate } from '../types'

export const creativeTemplates: PromptTemplate[] = [
  {
    id: 'brainstorm',
    name: 'Idea Brainstorming',
    description: 'Generate creative ideas and innovative solutions',
    category: 'creative',
    icon: '💡',
    systemPrompt: `You are a creative thinking facilitator. Generate innovative ideas by:
- Thinking divergently and exploring multiple angles
- Building on concepts creatively
- Challenging assumptions
- Combining ideas in novel ways
- Considering different perspectives
- Providing practical and wild ideas

Be creative, bold, and comprehensive.`,
    nextStepPrompt: `Brainstorming Session:

Challenge/Topic: {{brainstorm_topic}}
Goal: {{brainstorm_goal}}
{{constraints}}

Generate creative ideas:

1. **Problem Reframe**: Different ways to look at this challenge
2. **Quick Ideas**: 10-20 initial ideas (rapid-fire)
3. **Categorized Ideas**: Ideas grouped by theme or approach
4. **Wild Ideas**: Unconventional, bold concepts
5. **Practical Ideas**: Immediately actionable solutions
6. **Combined Concepts**: Innovative combinations of ideas
7. **Top Recommendations**: Best 3-5 ideas with reasoning
8. **Next Steps**: How to develop the top ideas`,
    tools: [],
    outputFormat: 'markdown',
    estimatedTime: '2-4 minutes',
    tags: ['creativity', 'ideation', 'innovation'],
    variables: [
      {
        name: 'brainstorm_topic',
        label: 'Topic/Challenge',
        type: 'textarea',
        required: true,
        placeholder: 'What do you need ideas for?'
      },
      {
        name: 'brainstorm_goal',
        label: 'Goal/Objective',
        type: 'string',
        required: true,
        placeholder: 'What are you trying to achieve?'
      },
      {
        name: 'constraints',
        label: 'Constraints/Requirements',
        type: 'textarea',
        required: false,
        placeholder: 'Any limitations or requirements to consider'
      }
    ],
    examples: []
  },
  {
    id: 'story-writer',
    name: 'Creative Story Writer',
    description: 'Write engaging stories and narratives',
    category: 'creative',
    icon: '📚',
    systemPrompt: `You are a creative storyteller. Craft engaging narratives with:
- Compelling characters
- Vivid descriptions
- Engaging plot
- Emotional resonance
- Clear pacing
- Satisfying resolution

Make the story immersive and memorable.`,
    nextStepPrompt: `Story Request:

Genre: {{genre}}
Theme/Topic: {{story_theme}}
Length: {{story_length}}
{{story_details}}

Write a creative story including:
- Engaging opening hook
- Well-developed characters
- Vivid setting descriptions
- Compelling plot progression
- Emotional depth
- Satisfying conclusion`,
    tools: [],
    outputFormat: 'markdown',
    estimatedTime: '3-5 minutes',
    tags: ['story', 'narrative', 'fiction'],
    variables: [
      {
        name: 'genre',
        label: 'Genre',
        type: 'string',
        required: true,
        options: [
          'Science Fiction',
          'Fantasy',
          'Mystery',
          'Romance',
          'Thriller',
          'Adventure',
          'Historical',
          'Contemporary'
        ]
      },
      {
        name: 'story_theme',
        label: 'Theme/Topic',
        type: 'textarea',
        required: true,
        placeholder: 'What should the story be about?'
      },
      {
        name: 'story_length',
        label: 'Length',
        type: 'string',
        required: false,
        defaultValue: 'Short story (1000-1500 words)',
        options: [
          'Flash fiction (500 words)',
          'Short story (1000-1500 words)',
          'Long story (2000-3000 words)'
        ]
      },
      {
        name: 'story_details',
        label: 'Additional Details',
        type: 'textarea',
        required: false,
        placeholder: 'Character ideas, setting preferences, plot elements, etc.'
      }
    ],
    examples: []
  }
]
