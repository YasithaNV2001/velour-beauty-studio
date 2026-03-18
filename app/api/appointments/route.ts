import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"
import { appointmentSchema } from "@/lib/validations/appointment"
import { buildCustomerConfirmUrl } from "@/lib/whatsapp/build-message"

export async function POST(req: NextRequest) {
  const body = await req.json()

  // 1. Schema validation
  const parsed = appointmentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", code: "VALIDATION_ERROR", issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const {
    serviceId, stylistId, slotId,
    appointmentDate, appointmentTime,
    customerName, customerPhone, customerEmail,
    notes,
  } = parsed.data

  // 2. Past-date guard (server-side)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const bookingDate = new Date(appointmentDate)
  if (bookingDate < today) {
    return NextResponse.json({ error: "Cannot book appointments in the past", code: "INVALID_DATE" }, { status: 400 })
  }

  const supabase = createServiceClient()

  // 3. Verify service exists and is active — fetch real price here (ignore client price)
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("id, name, price_lkr, category, is_active")
    .eq("id", serviceId)
    .single()

  if (serviceError || !service || !service.is_active) {
    return NextResponse.json({ error: "Service not found or unavailable", code: "SERVICE_NOT_FOUND" }, { status: 404 })
  }

  // 4. Verify stylist exists, is active, and can perform this service category
  const { data: stylist, error: stylistError } = await supabase
    .from("stylists")
    .select("id, name, specialties, is_active")
    .eq("id", stylistId)
    .single()

  if (stylistError || !stylist || !stylist.is_active) {
    return NextResponse.json({ error: "Stylist not found or unavailable", code: "STYLIST_NOT_FOUND" }, { status: 404 })
  }

  if (!stylist.specialties.includes(service.category)) {
    return NextResponse.json(
      { error: "This stylist does not offer the selected service", code: "STYLIST_SERVICE_MISMATCH" },
      { status: 400 }
    )
  }

  // 5. Verify slot exists, belongs to this stylist, and is not already booked
  //    Atomic update: only succeeds if is_booked = false — eliminates race condition
  const { data: slotCheck } = await supabase
    .from("availability_slots")
    .select("id, stylist_id, is_booked")
    .eq("id", slotId)
    .eq("stylist_id", stylistId)   // ownership check
    .single()

  if (!slotCheck) {
    return NextResponse.json({ error: "Time slot not found for this stylist", code: "SLOT_NOT_FOUND" }, { status: 404 })
  }
  if (slotCheck.is_booked) {
    return NextResponse.json({ error: "This time slot is no longer available", code: "SLOT_TAKEN" }, { status: 409 })
  }

  // 6. Atomically claim the slot (UPDATE ... WHERE is_booked = false)
  //    This eliminates the race condition — if two requests pass the check above
  //    simultaneously, only one UPDATE will match the WHERE clause.
  const { data: claimed, error: claimError } = await supabase
    .from("availability_slots")
    .update({ is_booked: true })
    .eq("id", slotId)
    .eq("is_booked", false)        // only succeeds if still available
    .select("id")
    .single()

  if (claimError || !claimed) {
    return NextResponse.json({ error: "This time slot was just booked. Please choose another.", code: "SLOT_TAKEN" }, { status: 409 })
  }

  // 7. Insert appointment — use server-fetched price, not client-provided value
  const { data: appointment, error: insertError } = await supabase
    .from("appointments")
    .insert({
      service_id:       serviceId,
      stylist_id:       stylistId,
      slot_id:          slotId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      customer_name:    customerName,
      customer_phone:   customerPhone,
      customer_email:   customerEmail || null,
      notes:            notes || null,
      total_price_lkr:  service.price_lkr,   // always use DB price, never trust client
      status:           "pending",
    })
    .select()
    .single()

  if (insertError) {
    // Rollback: free the slot if appointment insert failed
    await supabase
      .from("availability_slots")
      .update({ is_booked: false })
      .eq("id", slotId)

    return NextResponse.json({ error: "Failed to create appointment", code: "DB_ERROR" }, { status: 500 })
  }

  // 8. Build WhatsApp confirmation URL
  const whatsappUrl = buildCustomerConfirmUrl({
    customerName,
    customerPhone,
    serviceName: service.name,
    stylistName: stylist.name,
    date:        appointmentDate,
    time:        appointmentTime,
    priceLkr:   service.price_lkr,
  })

  return NextResponse.json({ appointment, whatsappUrl }, { status: 201 })
}
