import { PromptTemplate } from '../types'

export const researchTemplates: PromptTemplate[] = [
  {
    id: 'deep-research',
    name: 'Deep Research & Analysis',
    description: 'Comprehensive research on any topic with citations and detailed analysis',
    longDescription:
      'Conduct in-depth research on any topic, gathering information from multiple sources, analyzing findings, and presenting a comprehensive report with citations.',
    category: 'research',
    icon: '🔍',
    systemPrompt: `You are OpenManus, a research assistant specialized in deep analysis and comprehensive investigation. Your task is to:

1. Research the given topic thoroughly using available search tools
2. Gather information from multiple credible sources
3. Analyze and synthesize the findings
4. Present a well-structured report with citations
5. Highlight key insights and conclusions

Always cite your sources and distinguish between facts, analysis, and opinion.`,
    nextStepPrompt: `Research Topic: {{topic}}

Please conduct comprehensive research on this topic and provide:

1. **Overview**: A clear summary of what this topic is about
2. **Key Findings**: Main discoveries and important facts (with sources)
3. **Detailed Analysis**: In-depth exploration of important aspects
4. **Different Perspectives**: Various viewpoints or approaches
5. **Current Trends**: Latest developments and future outlook
6. **Conclusions**: Key takeaways and insights
7. **Sources**: All references cited

{{focus_areas}}

Please use web search to find the most current and accurate information.`,
    tools: ['web_search', 'retrieve'],
    outputFormat: 'markdown',
    estimatedTime: '3-5 minutes',
    tags: ['research', 'analysis', 'investigation'],
    featured: true,
    variables: [
      {
        name: 'topic',
        label: 'Research Topic',
        type: 'string',
        required: true,
        placeholder: 'e.g., Impact of AI on healthcare',
        description: 'The main topic you want to research'
      },
      {
        name: 'focus_areas',
        label: 'Specific Focus Areas (Optional)',
        type: 'textarea',
        required: false,
        placeholder: 'e.g., Focus on recent developments in the last 2 years, include statistics',
        description: 'Any specific aspects you want the research to focus on'
      }
    ],
    examples: [
      {
        title: 'Technology Research',
        description: 'Research on emerging AI technologies',
        variables: {
          topic: 'Large Language Models in 2025',
          focus_areas: 'Focus on GPT-4, Claude, and Gemini capabilities'
        }
      }
    ]
  },
  {
    id: 'market-research',
    name: 'Market Research Report',
    description: 'Analyze market trends, competitors, and opportunities',
    category: 'research',
    icon: '📊',
    systemPrompt: `You are a market research analyst. Conduct thorough market analysis including:
- Market size and growth trends
- Key players and competitors
- Market opportunities and challenges
- Customer segments and behaviors
- Future predictions

Provide data-driven insights with sources.`,
    nextStepPrompt: `Market Research Request:

Industry/Product: {{industry}}
{{geographic_focus}}
{{specific_questions}}

Provide a comprehensive market research report covering:
1. Market Overview & Size
2. Growth Trends & Projections
3. Competitive Landscape
4. Key Players Analysis
5. Market Opportunities
6. Challenges & Risks
7. Customer Insights
8. Recommendations`,
    tools: ['web_search'],
    outputFormat: 'markdown',
    estimatedTime: '4-6 minutes',
    tags: ['market', 'business', 'analysis'],
    variables: [
      {
        name: 'industry',
        label: 'Industry/Product',
        type: 'string',
        required: true,
        placeholder: 'e.g., Electric Vehicle Market'
      },
      {
        name: 'geographic_focus',
        label: 'Geographic Focus',
        type: 'string',
        required: false,
        placeholder: 'e.g., North America, Global'
      },
      {
        name: 'specific_questions',
        label: 'Specific Questions',
        type: 'textarea',
        required: false,
        placeholder: 'Any specific questions you want answered'
      }
    ],
    examples: []
  },
  {
    id: 'fact-check',
    name: 'Fact-Checking Investigation',
    description: 'Verify claims and statements with evidence-based analysis',
    category: 'research',
    icon: '✅',
    systemPrompt: `You are a fact-checking specialist. Your job is to:
- Verify claims using credible sources
- Find supporting or contradicting evidence
- Assess the credibility of sources
- Provide a clear verdict with reasoning
- Distinguish between facts, opinions, and misinformation`,
    nextStepPrompt: `Fact-Check Request:

Claim to verify: {{claim}}

Please investigate this claim and provide:
1. **Claim Summary**: Restate the claim clearly
2. **Evidence For**: Supporting information and sources
3. **Evidence Against**: Contradicting information and sources
4. **Source Credibility**: Assessment of source reliability
5. **Context**: Important context or nuances
6. **Verdict**: True/False/Partially True/Misleading with explanation
7. **References**: All sources cited`,
    tools: ['web_search'],
    outputFormat: 'markdown',
    estimatedTime: '2-4 minutes',
    tags: ['verification', 'truth', 'investigation'],
    variables: [
      {
        name: 'claim',
        label: 'Claim to Verify',
        type: 'textarea',
        required: true,
        placeholder: 'Enter the claim you want to fact-check'
      }
    ],
    examples: []
  }
]
