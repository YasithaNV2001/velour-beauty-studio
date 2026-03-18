import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const stylistId = searchParams.get("stylistId")
  const date      = searchParams.get("date")

  if (!stylistId || !date) {
    return NextResponse.json({ error: "Missing stylistId or date", code: "MISSING_PARAMS" }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from("availability_slots")
    .select("*")
    .eq("stylist_id", stylistId)
    .eq("date", date)
    .eq("is_booked", false)
    .order("start_time")

  if (error) {
    return NextResponse.json({ error: "Failed to fetch slots", code: "DB_ERROR" }, { status: 500 })
  }

  return NextResponse.json({ slots: data })
}
