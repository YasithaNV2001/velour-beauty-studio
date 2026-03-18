"use client"

import { format, parseISO } from "date-fns"
import { MessageCircle, Clock } from "lucide-react"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { buildAdminConfirmUrl } from "@/lib/whatsapp/build-message"
import { cn } from "@/lib/utils"
import type { Appointment } from "@/lib/supabase/types"

interface EnrichedAppointment extends Appointment {
  serviceName: string
  stylistName: string
}

interface UpcomingAppointmentsProps {
  appointments: EnrichedAppointment[]
}

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-cream-dark p-8 text-center shadow-sm">
        <Clock className="size-10 text-plum/20 mx-auto mb-3" aria-hidden="true" />
        <p className="text-plum/40 text-sm font-sans">No upcoming appointments</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-cream-dark shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-cream-dark">
        <h2 className="font-serif text-lg font-semibold text-plum">
          Upcoming Appointments
        </h2>
        <p className="text-xs text-plum/40 mt-0.5 font-sans">Next 5 scheduled bookings</p>
      </div>

      <ul role="list" className="divide-y divide-cream-dark">
        {appointments.map((appt) => {
          const dateFormatted = format(parseISO(appt.appointment_date), "MMM d, yyyy")
          const whatsappUrl = buildAdminConfirmUrl({
            customerName: appt.customer_name,
            customerPhone: appt.customer_phone,
            serviceName: appt.serviceName,
            stylistName: appt.stylistName,
            date: appt.appointment_date,
            time: appt.appointment_time,
            priceLkr: appt.total_price_lkr ?? 0,
          })

          return (
            <li
              key={appt.id}
              className="flex items-center gap-4 px-5 py-4 hover:bg-cream/50 transition-colors"
            >
              {/* Time chip */}
              <div
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg px-2.5 py-2 shrink-0",
                  "bg-plum/5 min-w-[56px]"
                )}
                aria-label={`Appointment at ${appt.appointment_time} on ${dateFormatted}`}
              >
                <span className="text-xs font-bold text-plum font-sans leading-none">
                  {appt.appointment_time}
                </span>
                <span className="text-[10px] text-plum/50 mt-0.5 font-sans">
                  {format(parseISO(appt.appointment_date), "d MMM")}
                </span>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-plum truncate font-sans">
                  {appt.customer_name}
                </p>
                <p className="text-xs text-plum/50 truncate font-sans mt-0.5">
                  {appt.serviceName}
                  {appt.stylistName ? (
                    <span className="text-plum/30"> &middot; {appt.stylistName}</span>
                  ) : null}
                </p>
              </div>

              {/* Status */}
              <StatusBadge status={appt.status} className="shrink-0 hidden sm:inline-flex" />

              {/* WhatsApp CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Send WhatsApp confirmation to ${appt.customer_name}`}
                className="shrink-0 flex items-center justify-center size-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
