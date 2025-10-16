import { type NextRequest, NextResponse } from "next/server"
import type { Dentist, ApiResponse } from "@/lib/types"

// GET /api/dentists
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Dentist[]>>> {
  try {
    // TODO: Fetch from database
    // const dentists = await db.dentists.findAll()

    // Mock data for demonstration
    const dentists: Dentist[] = [
      {
        id: "dentist_1",
        name: "Dr. Sarah Smith",
        specialization: "General Dentistry",
        licenseNumber: "DDS-12345",
        bio: "Experienced dentist with 10+ years of practice",
        rating: 4.8,
        reviewCount: 156,
        isAvailable: true,
        availableSlots: ["09:00", "10:00", "14:00", "15:00"],
      },
      {
        id: "dentist_2",
        name: "Dr. Michael Johnson",
        specialization: "Orthodontics",
        licenseNumber: "DDS-67890",
        bio: "Specialist in teeth alignment and braces",
        rating: 4.9,
        reviewCount: 203,
        isAvailable: true,
        availableSlots: ["10:00", "11:00", "15:00", "16:00"],
      },
    ]

    return NextResponse.json({
      success: true,
      data: dentists,
    })
  } catch (error) {
    console.error("Error fetching dentists:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dentists",
      },
      { status: 500 },
    )
  }
}
