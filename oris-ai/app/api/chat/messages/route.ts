import { type NextRequest, NextResponse } from "next/server"
import type { ChatMessage, ApiResponse } from "@/lib/types"

// GET /api/chat/messages?consultationId=...
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<ChatMessage[]>>> {
  try {
    const consultationId = request.nextUrl.searchParams.get("consultationId")

    if (!consultationId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing consultationId parameter",
        },
        { status: 400 },
      )
    }

    // TODO: Fetch from database
    // const messages = await db.chatMessages.findByConsultationId(consultationId)

    // Mock data for demonstration
    const messages: ChatMessage[] = [
      {
        id: "msg_1",
        consultationId,
        sender: "dentist",
        content: "Hello! How can I help you today?",
        timestamp: new Date(Date.now() - 5 * 60000),
      },
      {
        id: "msg_2",
        consultationId,
        sender: "user",
        content: "I have tooth sensitivity",
        timestamp: new Date(Date.now() - 3 * 60000),
      },
    ]

    return NextResponse.json({
      success: true,
      data: messages,
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch messages",
      },
      { status: 500 },
    )
  }
}
