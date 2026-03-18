import { createClient } from "@/lib/supabase/server"
import { StatsCards } from "@/components/admin/StatsCards"
import { UpcomingAppointments } from "@/components/admin/UpcomingAppointments"
import type { Appointment } from "@/lib/supabase/types"

interface EnrichedAppointment extends Appointment {
  serviceName: string
  stylistName: string
}

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Get today's date range (local midnight to midnight)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split("T")[0]

  // Get this week's range (Monday to Sunday)
  const dayOfWeek = today.getDay() // 0 = Sunday
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() + mondayOffset)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  const weekStartStr = weekStart.toISOString().split("T")[0]
  const weekEndStr = weekEnd.toISOString().split("T")[0]

  // Get this month's range
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0]
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0]

  // Fetch all required data in parallel
  const [
    { count: todayCount },
    { count: weekCount },
    { count: pendingCount },
    { data: monthlyData },
    { data: upcomingRaw },
    { data: services },
    { data: stylists },
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("appointment_date", todayStr)
      .neq("status", "cancelled"),

    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .gte("appointment_date", weekStartStr)
      .lte("appointment_date", weekEndStr)
      .neq("status", "cancelled"),

    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),

    supabase
      .from("appointments")
      .select("total_price_lkr")
      .gte("appointment_date", monthStart)
      .lte("appointment_date", monthEnd)
      .eq("status", "confirmed"),

    supabase
      .from("appointments")
      .select("*")
      .gte("appointment_date", todayStr)
      .neq("status", "cancelled")
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true })
      .limit(5),

    supabase.from("services").select("id, name"),
    supabase.from("stylists").select("id, name"),
  ])

  const monthlyRevenue =
    ((monthlyData ?? []) as Array<{ total_price_lkr: number | null }>).reduce(
      (sum, row) => sum + (row.total_price_lkr ?? 0),
      0
    )

  // Build lookup maps
  const serviceMap = new Map<string, string>(
    ((services ?? []) as Array<{ id: string; name: string }>).map((s) => [s.id, s.name])
  )
  const stylistMap = new Map<string, string>(
    ((stylists ?? []) as Array<{ id: string; name: string }>).map((s) => [s.id, s.name])
  )

  const upcoming: EnrichedAppointment[] = ((upcomingRaw ?? []) as Appointment[]).map((appt) => ({
    ...appt,
    serviceName: appt.service_id ? (serviceMap.get(appt.service_id) ?? "Unknown Service") : "—",
    stylistName: appt.stylist_id ? (stylistMap.get(appt.stylist_id) ?? "Unknown Stylist") : "—",
  }))

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Page header */}
      <header>
        <h1 className="font-serif text-3xl font-semibold text-plum">Dashboard</h1>
        <p className="text-sm text-plum/50 mt-1 font-sans">
          Welcome back. Here&apos;s what&apos;s happening at Velour today.
        </p>
      </header>

      {/* KPI cards */}
      <StatsCards
        todayCount={todayCount ?? 0}
        weekCount={weekCount ?? 0}
        pendingCount={pendingCount ?? 0}
        monthlyRevenue={monthlyRevenue}
      />

      {/* Upcoming appointments */}
      <UpcomingAppointments appointments={upcoming} />
    </div>
  )
}
