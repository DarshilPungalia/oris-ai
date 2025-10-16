import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { roomName, participantName, participantIdentity, metadata } = await request.json()

    // Validate required fields
    if (!roomName || !participantName) {
      return NextResponse.json(
        { error: 'Missing required fields: roomName and participantName' },
        { status: 400 }
      )
    }

    // Call your Oris AI backend token service
    const backendUrl = process.env.ORIS_BACKEND_URL || 'http://localhost:8000'
    
    const response = await fetch(`${backendUrl}/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ORIS_API_SECRET}`,
      },
      body: JSON.stringify({
        room_name: roomName,
        participant_name: participantName,
        participant_identity: participantIdentity,
        metadata: metadata,
      }),
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      token: data.token,
      url: data.url || process.env.NEXT_PUBLIC_LIVEKIT_URL,
      roomName: roomName,
      participantName: participantName,
    })

  } catch (error) {
    console.error('Token generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate access token' },
      { status: 500 }
    )
  }
}