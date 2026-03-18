import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/types"

const patchSchema = z.object({
  status:     z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
  adminNotes: z.string().max(1000).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", code: "VALIDATION_ERROR" }, { status: 400 })
  }

  const supabase = await createClient()

  // Auth check — only admin can update appointments
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 })
  }
  const { data: adminUser } = await supabase
    .from("admin_users").select("id").eq("id", user.id).single()
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 })
  }

  const updateData: { status?: "pending" | "confirmed" | "completed" | "cancelled"; admin_notes?: string } = {}
  if (parsed.data.status)     updateData.status      = parsed.data.status
  if (parsed.data.adminNotes !== undefined) updateData.admin_notes = parsed.data.adminNotes

  const { data, error } = await supabase
    .from("appointments")
    .update(updateData)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: "Update failed", code: "DB_ERROR" }, { status: 500 })
  }

  return NextResponse.json({ appointment: data })
}
