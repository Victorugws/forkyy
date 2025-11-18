import { PromptTemplate } from '../types'

export const analysisTemplates: PromptTemplate[] = [
  {
    id: 'swot-analysis',
    name: 'SWOT Analysis',
    description: 'Comprehensive Strengths, Weaknesses, Opportunities, and Threats analysis',
    category: 'analysis',
    icon: '🧮',
    systemPrompt: `You are a strategic business analyst. Conduct thorough SWOT analysis by:
- Identifying internal Strengths and Weaknesses
- Analyzing external Opportunities and Threats
- Providing specific, actionable insights
- Prioritizing factors by impact
- Offering strategic recommendations
- Using data and research to support findings`,
    nextStepPrompt: `SWOT Analysis Request:

Subject: {{subject}}
Industry/Context: {{industry}}
{{specific_focus}}

Conduct a comprehensive SWOT analysis:

**STRENGTHS** (Internal positive factors)
- List and analyze key strengths
- Competitive advantages
- Unique capabilities

**WEAKNESSES** (Internal negative factors)
- Areas needing improvement
- Limitations and constraints
- Competitive disadvantages

**OPPORTUNITIES** (External positive factors)
- Market opportunities
- Growth potential
- Emerging trends to leverage

**THREATS** (External negative factors)
- Market challenges
- Competitive threats
- External risks

**STRATEGIC RECOMMENDATIONS**
- Key priorities based on analysis
- Actionable strategies
- Risk mitigation approaches`,
    tools: ['web_search'],
    outputFormat: 'markdown',
    estimatedTime: '3-5 minutes',
    tags: ['strategy', 'business', 'analysis'],
    featured: true,
    variables: [
      {
        name: 'subject',
        label: 'Analysis Subject',
        type: 'string',
        required: true,
        placeholder: 'e.g., Company name, Product, Business idea'
      },
      {
        name: 'industry',
        label: 'Industry/Market',
        type: 'string',
        required: true,
        placeholder: 'e.g., E-commerce, Healthcare, Technology'
      },
      {
        name: 'specific_focus',
        label: 'Specific Focus Areas',
        type: 'textarea',
        required: false,
        placeholder: 'Any specific aspects to emphasize in the analysis'
      }
    ],
    examples: []
  },
  {
    id: 'competitive-analysis',
    name: 'Competitive Analysis',
    description: 'Analyze competitors and market positioning',
    category: 'analysis',
    icon: '⚔️',
    systemPrompt: `You are a competitive intelligence analyst. Provide detailed competitive analysis including:
- Competitor identification and profiling
- Product/service comparison
- Pricing strategies
- Market positioning
- Strengths and weaknesses
- Market share and trends
- Strategic recommendations`,
    nextStepPrompt: `Competitive Analysis Request:

Your Business/Product: {{your_business}}
Industry: {{comp_industry}}
Key Competitors: {{competitors}}
{{analysis_focus}}

Provide comprehensive competitive analysis:

1. **Competitor Overview**: Profile of each major competitor
2. **Product/Service Comparison**: Feature, quality, and offering comparison
3. **Pricing Analysis**: Pricing strategies and positioning
4. **Market Position**: Each competitor's market share and positioning
5. **Strengths & Weaknesses**: Comparative analysis
6. **Differentiation Opportunities**: Where you can stand out
7. **Competitive Advantages**: Your unique value propositions
8. **Strategic Recommendations**: How to compete effectively`,
    tools: ['web_search'],
    outputFormat: 'markdown',
    estimatedTime: '4-6 minutes',
    tags: ['competition', 'strategy', 'market'],
    variables: [
      {
        name: 'your_business',
        label: 'Your Business/Product',
        type: 'string',
        required: true,
        placeholder: 'Describe your business or product'
      },
      {
        name: 'comp_industry',
        label: 'Industry',
        type: 'string',
        required: true,
        placeholder: 'Your industry or market'
      },
      {
        name: 'competitors',
        label: 'Key Competitors',
        type: 'textarea',
        required: false,
        placeholder: 'List main competitors (or leave blank for me to identify them)'
      },
      {
        name: 'analysis_focus',
        label: 'Analysis Focus',
        type: 'textarea',
        required: false,
        placeholder: 'Specific aspects to analyze (pricing, features, marketing, etc.)'
      }
    ],
    examples: []
  },
  {
    id: 'trend-analysis',
    name: 'Trend Analysis & Forecasting',
    description: 'Identify and analyze market trends with future predictions',
    category: 'analysis',
    icon: '📈',
    systemPrompt: `You are a trend analyst and futurist. Analyze trends by:
- Identifying current and emerging trends
- Analyzing historical patterns
- Evaluating trend drivers and factors
- Forecasting future developments
- Assessing potential impacts
- Providing strategic insights`,
    nextStepPrompt: `Trend Analysis Request:

Subject/Industry: {{trend_subject}}
Time Frame: {{time_frame}}
{{specific_trends}}

Conduct comprehensive trend analysis:

1. **Current State**: Where things are today
2. **Historical Context**: How we got here
3. **Key Trends Identified**: Major trends and patterns
4. **Trend Drivers**: What's causing these trends
5. **Future Projections**: Where trends are heading
6. **Potential Impacts**: How these trends will affect the industry
7. **Opportunities & Risks**: What to watch for
8. **Strategic Recommendations**: How to position for the future`,
    tools: ['web_search'],
    outputFormat: 'markdown',
    estimatedTime: '4-6 minutes',
    tags: ['trends', 'forecasting', 'future'],
    variables: [
      {
        name: 'trend_subject',
        label: 'Subject/Industry',
        type: 'string',
        required: true,
        placeholder: 'e.g., AI technology, Fashion, Consumer behavior'
      },
      {
        name: 'time_frame',
        label: 'Time Frame',
        type: 'string',
        required: false,
        defaultValue: 'Next 1-3 years',
        placeholder: 'e.g., Next 6 months, Next 5 years'
      },
      {
        name: 'specific_trends',
        label: 'Specific Trends to Analyze',
        type: 'textarea',
        required: false,
        placeholder: 'Any specific trends you want me to focus on'
      }
    ],
    examples: []
  }
]
