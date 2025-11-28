import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, name, concern } = await request.json();

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { error: "Missing required fields: email and name" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Call your appointment booking service
    const backendUrl = process.env.ORIS_BACKEND_URL || "http://localhost:8000";

    const response = await fetch(`${backendUrl}/api/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ORIS_API_SECRET}`,
      },
      body: JSON.stringify({
        email,
        name,
        concern: concern || "General consultation",
        platform: "oris-ai-frontend",
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: `Appointment booking initiated for ${name}. Confirmation will be sent to ${email}.`,
      appointmentId: data.appointmentId,
    });
  } catch (error) {
    console.error("Appointment booking error:", error);
    return NextResponse.json(
      { error: "Failed to book appointment. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Check appointment status
    const backendUrl = process.env.ORIS_BACKEND_URL || "http://localhost:8000";

    const response = await fetch(
      `${backendUrl}/api/appointments/status?email=${encodeURIComponent(
        email
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.ORIS_API_SECRET}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Appointment status check error:", error);
    return NextResponse.json(
      { error: "Failed to check appointment status" },
      { status: 500 }
    );
  }
}
