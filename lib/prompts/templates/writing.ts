import { PromptTemplate } from '../types'

export const writingTemplates: PromptTemplate[] = [
  {
    id: 'blog-post',
    name: 'Blog Post Generator',
    description: 'Create engaging, SEO-optimized blog posts on any topic',
    category: 'writing',
    icon: '✍️',
    systemPrompt: `You are a professional content writer specializing in creating engaging, informative blog posts. Your writing should be:
- Clear and accessible to the target audience
- Well-structured with compelling headlines
- SEO-optimized with natural keyword integration
- Engaging with storytelling elements
- Backed by research and examples
- Actionable with practical takeaways`,
    nextStepPrompt: `Blog Post Request:

Topic: {{topic}}
Target Audience: {{audience}}
Tone: {{tone}}
Word Count: {{word_count}} words
{{keywords}}

Create a comprehensive blog post including:
1. **Compelling Headline**: Attention-grabbing title
2. **Introduction**: Hook the reader and set context
3. **Main Content**: Well-structured body with subheadings (H2, H3)
4. **Key Points**: Bullet points or numbered lists where appropriate
5. **Examples/Stories**: Real-world examples or case studies
6. **Conclusion**: Summary and call-to-action
7. **Meta Description**: SEO-optimized meta description (155 characters)

Make it engaging, informative, and valuable to readers.`,
    tools: ['web_search'],
    outputFormat: 'markdown',
    estimatedTime: '3-5 minutes',
    tags: ['content', 'writing', 'seo'],
    featured: true,
    variables: [
      {
        name: 'topic',
        label: 'Blog Topic',
        type: 'string',
        required: true,
        placeholder: 'e.g., Benefits of Remote Work'
      },
      {
        name: 'audience',
        label: 'Target Audience',
        type: 'string',
        required: true,
        placeholder: 'e.g., Small business owners'
      },
      {
        name: 'tone',
        label: 'Tone/Style',
        type: 'string',
        required: false,
        defaultValue: 'Professional and friendly',
        options: [
          'Professional and formal',
          'Professional and friendly',
          'Casual and conversational',
          'Academic',
          'Inspiring and motivational'
        ]
      },
      {
        name: 'word_count',
        label: 'Target Word Count',
        type: 'number',
        required: false,
        defaultValue: 1000,
        placeholder: '1000'
      },
      {
        name: 'keywords',
        label: 'SEO Keywords (Optional)',
        type: 'string',
        required: false,
        placeholder: 'e.g., remote work, productivity, work from home'
      }
    ],
    examples: []
  },
  {
    id: 'email-composer',
    name: 'Professional Email Writer',
    description: 'Craft professional emails for any business situation',
    category: 'writing',
    icon: '📧',
    systemPrompt: `You are a professional communication expert. Write clear, effective emails that:
- Get to the point quickly
- Maintain appropriate tone and formality
- Include necessary context
- Have clear calls-to-action
- Are polite and professional
- Are formatted for easy reading`,
    nextStepPrompt: `Email Request:

Purpose: {{purpose}}
Recipient: {{recipient}}
Tone: {{email_tone}}
{{context}}

Write a professional email with:
1. **Subject Line**: Clear and specific
2. **Greeting**: Appropriate salutation
3. **Body**: Well-structured message
4. **Closing**: Professional sign-off
5. **Call-to-Action**: Clear next steps (if needed)`,
    tools: [],
    outputFormat: 'text',
    estimatedTime: '1-2 minutes',
    tags: ['email', 'communication', 'business'],
    variables: [
      {
        name: 'purpose',
        label: 'Email Purpose',
        type: 'string',
        required: true,
        placeholder: 'e.g., Follow up on meeting, Request information'
      },
      {
        name: 'recipient',
        label: 'Recipient',
        type: 'string',
        required: true,
        placeholder: 'e.g., Client, Manager, Colleague'
      },
      {
        name: 'email_tone',
        label: 'Tone',
        type: 'string',
        required: false,
        defaultValue: 'Professional',
        options: ['Formal', 'Professional', 'Friendly', 'Apologetic', 'Persuasive']
      },
      {
        name: 'context',
        label: 'Context/Details',
        type: 'textarea',
        required: true,
        placeholder: 'Provide relevant details and context'
      }
    ],
    examples: []
  },
  {
    id: 'report-writer',
    name: 'Business Report Generator',
    description: 'Create structured business reports and documentation',
    category: 'writing',
    icon: '📄',
    systemPrompt: `You are a business analyst and report writer. Create professional reports that:
- Follow standard business report structure
- Present data clearly with insights
- Include executive summaries
- Use professional language
- Support conclusions with evidence
- Are actionable`,
    nextStepPrompt: `Report Request:

Report Type: {{report_type}}
Topic: {{report_topic}}
Audience: {{report_audience}}
{{data_sources}}

Create a comprehensive business report including:
1. **Executive Summary**: Key findings and recommendations
2. **Introduction**: Background and objectives
3. **Methodology**: Approach and data sources
4. **Findings**: Detailed analysis with data
5. **Analysis**: Interpretation and insights
6. **Recommendations**: Actionable next steps
7. **Conclusion**: Summary of key points
8. **Appendix**: Supporting data (if needed)`,
    tools: ['web_search'],
    outputFormat: 'markdown',
    estimatedTime: '4-6 minutes',
    tags: ['report', 'business', 'analysis'],
    variables: [
      {
        name: 'report_type',
        label: 'Report Type',
        type: 'string',
        required: true,
        options: [
          'Market Analysis',
          'Project Status',
          'Financial Analysis',
          'Competitive Analysis',
          'Performance Review',
          'Research Summary'
        ]
      },
      {
        name: 'report_topic',
        label: 'Report Topic',
        type: 'string',
        required: true,
        placeholder: 'What is the report about?'
      },
      {
        name: 'report_audience',
        label: 'Target Audience',
        type: 'string',
        required: true,
        placeholder: 'e.g., Executive team, Stakeholders'
      },
      {
        name: 'data_sources',
        label: 'Data Sources/Context',
        type: 'textarea',
        required: false,
        placeholder: 'Any specific data, metrics, or context to include'
      }
    ],
    examples: []
  }
]
