import { type NextRequest, NextResponse } from "next/server"
import type { ChatMessage, ApiResponse } from "@/lib/types"

// POST /api/chat/send
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<ChatMessage>>> {
  try {
    const { consultationId, message } = await request.json()

    if (!consultationId || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      consultationId,
      sender: "user",
      content: message,
      timestamp: new Date(),
    }

    // TODO: Save to database
    // await db.chatMessages.create(chatMessage)

    // TODO: Send to dentist via WebSocket or real-time service
    // await notifyDentist(consultationId, chatMessage)

    return NextResponse.json(
      {
        success: true,
        data: chatMessage,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message",
      },
      { status: 500 },
    )
  }
}
