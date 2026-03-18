import { cn } from "@/lib/utils"

type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled"

interface StatusBadgeProps {
  status: AppointmentStatus
  className?: string
}

const statusConfig: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-800 border border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    className:
      "bg-emerald-100 text-emerald-800 border border-emerald-200",
  },
  completed: {
    label: "Completed",
    className:
      "bg-slate-100 text-slate-600 border border-slate-200",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-red-100 text-red-700 border border-red-200",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
