import { type NextRequest, NextResponse } from "next/server"
import type { ConsultationBooking, ApiResponse } from "@/lib/types"

// POST /api/consultations/book
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<ConsultationBooking>>> {
  try {
    const body = await request.json()

    // Validate required fields
    const { name, email, phone, date, time, concerns } = body

    if (!name || !email || !phone || !date || !time) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 },
      )
    }

    // Create consultation booking
    const booking: ConsultationBooking = {
      id: `cons_${Date.now()}`,
      userId: `user_${Date.now()}`, // In production, get from auth
      dentistId: `dentist_${Math.floor(Math.random() * 100)}`, // In production, assign based on availability
      name,
      email,
      phone,
      scheduledDate: new Date(date),
      scheduledTime: time,
      concerns,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // TODO: Save to database
    // await db.consultationBookings.create(booking)

    // TODO: Send confirmation email
    // await sendConfirmationEmail(email, booking)

    return NextResponse.json(
      {
        success: true,
        data: booking,
        message: "Consultation booked successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error booking consultation:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to book consultation",
      },
      { status: 500 },
    )
  }
}
