import { NextRequest, NextResponse } from 'next/server'

const AYRSHARE_API_KEY = '1941FF00-3D5A464C-9AC3E540-3E4069B3'
const AYRSHARE_API_URL = 'https://app.ayrshare.com/api'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { platforms, post, imageUrl, profileKey } = body

    if (!platforms || platforms.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one platform must be selected' },
        { status: 400 }
      )
    }

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post content is required' },
        { status: 400 }
      )
    }

    // Prepare the post data for Ayrshare
    const postData: any = {
      post,
      platforms,
    }

    // Add image if provided
    if (imageUrl) {
      postData.mediaUrls = [imageUrl]
    }

    // Add profile key if provided (for managing multiple social accounts)
    if (profileKey) {
      postData.profileKey = profileKey
    }

    // Call Ayrshare API
    const response = await fetch(`${AYRSHARE_API_URL}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`
      },
      body: JSON.stringify(postData)
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.message || 'Failed to post to social media',
          details: data
        },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Successfully posted to selected platforms!'
    })
  } catch (error) {
    console.error('Error posting to social media:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while posting to social media',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Get social media profiles/accounts
export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${AYRSHARE_API_URL}/profiles`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`
      }
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.message || 'Failed to get social media profiles'
        },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      profiles: data
    })
  } catch (error) {
    console.error('Error getting social media profiles:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while getting social media profiles'
      },
      { status: 500 }
    )
  }
}
