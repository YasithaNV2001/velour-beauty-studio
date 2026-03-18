import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { AppointmentsTable } from "@/components/admin/AppointmentsTable"
import type { Appointment } from "@/lib/supabase/types"

interface EnrichedAppointment extends Appointment {
  serviceName: string
  stylistName: string
}

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Appointments | Velour Admin",
}

export default async function AppointmentsPage() {
  const supabase = await createClient()

  const [{ data: appointments }, { data: services }, { data: stylists }] =
    await Promise.all([
      supabase
        .from("appointments")
        .select("*")
        .order("appointment_date", { ascending: false })
        .order("appointment_time", { ascending: false }),
      supabase.from("services").select("id, name"),
      supabase.from("stylists").select("id, name"),
    ])

  const serviceMap = new Map<string, string>(
    ((services ?? []) as Array<{ id: string; name: string }>).map((s) => [s.id, s.name])
  )
  const stylistMap = new Map<string, string>(
    ((stylists ?? []) as Array<{ id: string; name: string }>).map((s) => [s.id, s.name])
  )

  const enriched: EnrichedAppointment[] = ((appointments ?? []) as Appointment[]).map((appt) => ({
    ...appt,
    serviceName: appt.service_id
      ? (serviceMap.get(appt.service_id) ?? "Unknown Service")
      : "—",
    stylistName: appt.stylist_id
      ? (stylistMap.get(appt.stylist_id) ?? "Unknown Stylist")
      : "—",
  }))

  return (
    <div className="p-6 lg:p-8 max-w-screen-xl mx-auto space-y-6">
      {/* Page header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-plum">Appointments</h1>
          <p className="text-sm text-plum/50 mt-1 font-sans">
            {enriched.length} total booking{enriched.length !== 1 ? "s" : ""}
          </p>
        </div>
      </header>

      {/* Table */}
      <AppointmentsTable appointments={enriched} />
    </div>
  )
}
