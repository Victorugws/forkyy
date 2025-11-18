import { PromptTemplate } from '../types'

export const planningTemplates: PromptTemplate[] = [
  {
    id: 'travel-planner',
    name: 'Travel Itinerary Planner',
    description: 'Create detailed travel plans with recommendations and schedules',
    longDescription:
      'Plan your perfect trip with day-by-day itineraries, accommodation suggestions, activity recommendations, and travel tips. Inspired by OpenManus travel planning capabilities.',
    category: 'planning',
    icon: '✈️',
    systemPrompt: `You are OpenManus, a travel planning expert. Create comprehensive, personalized travel itineraries that include:

- Day-by-day schedules with timing
- Accommodation recommendations with price ranges
- Activities and attractions aligned with interests
- Restaurant and dining suggestions
- Transportation tips
- Cultural insights and etiquette
- Budget breakdown
- Essential phrases (for international travel)
- Packing tips
- Emergency information

Make the itinerary practical, exciting, and culturally enriching.`,
    nextStepPrompt: `Travel Planning Request:

Destination: {{destination}}
Duration: {{duration}} days
Dates: {{travel_dates}}
Budget: {{budget}}
Travelers: {{travelers}}
Interests: {{interests}}

{{special_requests}}

Please create a comprehensive travel itinerary including:

1. **Overview**: Trip summary and highlights
2. **Day-by-Day Itinerary**: Detailed schedule for each day with activities, meals, and transportation
3. **Accommodation**: Hotel/lodging recommendations with price ranges
4. **Dining**: Restaurant suggestions for different meals
5. **Budget Breakdown**: Estimated costs for accommodations, food, activities, transportation
6. **Travel Tips**: Local customs, best times to visit attractions, transportation options
7. **Essential Information**: Emergency contacts, useful phrases, packing list
8. **Map References**: Key locations and how to get around

Format the output as a beautiful, easy-to-follow travel handbook.`,
    tools: ['web_search'],
    outputFormat: 'html',
    estimatedTime: '5-8 minutes',
    tags: ['travel', 'vacation', 'itinerary'],
    featured: true,
    variables: [
      {
        name: 'destination',
        label: 'Destination',
        type: 'string',
        required: true,
        placeholder: 'e.g., Japan'
      },
      {
        name: 'duration',
        label: 'Trip Duration (days)',
        type: 'number',
        required: true,
        placeholder: '7'
      },
      {
        name: 'travel_dates',
        label: 'Travel Dates',
        type: 'string',
        required: false,
        placeholder: 'e.g., April 15-23, 2025'
      },
      {
        name: 'budget',
        label: 'Total Budget',
        type: 'string',
        required: true,
        placeholder: '2500-5000'
      },
      {
        name: 'travelers',
        label: 'Number & Type of Travelers',
        type: 'string',
        required: true,
        placeholder: 'e.g., 2 adults'
      },
      {
        name: 'interests',
        label: 'Interests & Preferences',
        type: 'textarea',
        required: true,
        placeholder: 'e.g., Historical sites, local cuisine, hiking, photography'
      },
      {
        name: 'special_requests',
        label: 'Special Requests',
        type: 'textarea',
        required: false,
        placeholder: 'Any special requirements, dietary restrictions, accessibility needs, etc.'
      }
    ],
    examples: [
      {
        title: 'Japan Trip Example',
        description: '7-day cultural exploration',
        variables: {
          destination: 'Japan',
          duration: '7',
          travel_dates: 'April 15-23, 2025',
          budget: '3000-4000',
          travelers: '2 adults',
          interests: 'Historical sites, tea ceremonies, local cuisine, cherry blossoms'
        }
      }
    ]
  },
  {
    id: 'project-roadmap',
    name: 'Project Roadmap Planner',
    description: 'Create detailed project plans with milestones and timelines',
    category: 'planning',
    icon: '🎯',
    systemPrompt: `You are a project management expert. Create comprehensive project roadmaps with:
- Clear objectives and deliverables
- Phases and milestones
- Task breakdown with timelines
- Resource requirements
- Risk assessment
- Success metrics

Make it actionable and realistic.`,
    nextStepPrompt: `Project Roadmap Request:

Project: {{project_name}}
Objective: {{objective}}
Timeline: {{timeline}}
Team Size: {{team_size}}
{{constraints}}

Create a detailed project roadmap including:
1. Project Overview & Goals
2. Phase Breakdown with Milestones
3. Detailed Task List with Timelines
4. Resource Requirements
5. Risk Assessment & Mitigation
6. Success Metrics & KPIs
7. Dependencies & Critical Path
8. Timeline Visualization`,
    tools: [],
    outputFormat: 'markdown',
    estimatedTime: '3-5 minutes',
    tags: ['project', 'planning', 'management'],
    variables: [
      {
        name: 'project_name',
        label: 'Project Name',
        type: 'string',
        required: true,
        placeholder: 'e.g., New Website Launch'
      },
      {
        name: 'objective',
        label: 'Project Objective',
        type: 'textarea',
        required: true,
        placeholder: 'What do you want to achieve?'
      },
      {
        name: 'timeline',
        label: 'Timeline',
        type: 'string',
        required: true,
        placeholder: 'e.g., 3 months'
      },
      {
        name: 'team_size',
        label: 'Team Size',
        type: 'string',
        required: false,
        placeholder: 'e.g., 5 people'
      },
      {
        name: 'constraints',
        label: 'Constraints or Requirements',
        type: 'textarea',
        required: false,
        placeholder: 'Budget, technology, dependencies, etc.'
      }
    ],
    examples: []
  }
]
