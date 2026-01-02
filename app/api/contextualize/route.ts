import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { getModel } from '@/lib/utils/registry'
import { getModels } from '@/lib/config/models'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { componentType, componentTitle, componentData, model: modelId } = await req.json()

    if (!componentType || !componentTitle) {
      return NextResponse.json(
        { error: 'Component type and title are required' },
        { status: 400 }
      )
    }

    // Get xai model or use provided model
    let model = modelId
    if (!model) {
      const models = await getModels()
      const xaiModel = models.find(m => m.enabled && m.providerId === 'xai') || models.find(m => m.enabled)
      if (!xaiModel) {
        return NextResponse.json(
          { error: 'No model available' },
          { status: 500 }
        )
      }
      model = `${xaiModel.providerId}:${xaiModel.id}`
    }
    
    console.log('Using model for contextualization:', model)

    // Prepare data summary for contextualization
    const dataSummary = typeof componentData === 'object' 
      ? JSON.stringify(componentData, null, 2).slice(0, 5000) // Limit data size
      : String(componentData).slice(0, 5000)

    const systemPrompt = `You are a financial data analyst AI assistant. Your task is to provide contextual insights and analysis about financial data components.

When analyzing component data, you should:
1. Explain what the data represents and its significance
2. Highlight key trends, patterns, or notable observations
3. Provide context about what users should look for in this data
4. Suggest relevant questions users might want to explore
5. Keep the analysis concise but informative (2-3 paragraphs)
6. Use professional but accessible language

Current date: ${new Date().toISOString().split('T')[0]}`

    const userPrompt = `Analyze this financial component and provide contextual insights:

Component Type: ${componentType}
Component Title: ${componentTitle}

Component Data:
${dataSummary}

Please provide a clear, insightful analysis of what this data represents and what users should know about it.`

    try {
      const modelInstance = getModel(model)
      console.log('Model instance created successfully')
      
      const result = await generateText({
        model: modelInstance,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
        maxTokens: 1000
      })

      console.log('Contextualization generated successfully')
      return NextResponse.json({ 
        contextualization: result.text 
      })
    } catch (genError: any) {
      console.error('Error generating text:', genError)
      console.error('Error stack:', genError.stack)
      console.error('Error details:', {
        message: genError.message,
        name: genError.name,
        cause: genError.cause
      })
      throw genError
    }
  } catch (error: any) {
    console.error('Contextualization API error:', error)
    console.error('Error stack:', error.stack)
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      cause: error.cause
    })
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

