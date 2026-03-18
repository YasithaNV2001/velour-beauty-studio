import { z } from "zod"

export const appointmentSchema = z.object({
  serviceId:       z.string().uuid("Invalid service"),
  stylistId:       z.string().uuid("Invalid stylist"),
  slotId:          z.string().uuid("Invalid time slot"),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Invalid time format"),
  customerName:    z.string().min(2, "Name is required").max(100),
  // Accepts: +94771234567, 0771234567, +1-800-555-0100 — international friendly
  customerPhone:   z.string().regex(/^\+?[\d\s\-]{7,20}$/, "Enter a valid phone number"),
  customerEmail:   z.string().email("Invalid email").optional().or(z.literal("")),
  notes:           z.string().max(500).optional(),
  // totalPriceLkr intentionally removed — price is always fetched from DB server-side
})

export type AppointmentInput = z.infer<typeof appointmentSchema>
