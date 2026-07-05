import { NextRequest, NextResponse } from "next/server";
import { TripPlanRequest } from "@/types/planner";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TripPlanRequest;

    // Fallback to NEXT_PUBLIC_API_BASE_URL if API_URL is not set
    const apiUrl =
      process.env.API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

    const response = await fetch(`${apiUrl}/api/v1/plan-trip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend Error:", errorText);
      return NextResponse.json(
        { error: `Backend returned ${response.status}: ${errorText}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
