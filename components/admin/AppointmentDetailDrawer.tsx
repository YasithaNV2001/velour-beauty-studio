"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, parseISO } from "date-fns"
import {
  X,
  User,
  Phone,
  Mail,
  Scissors,
  Calendar,
  Clock,
  DollarSign,
  MessageCircle,
  FileText,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { buildAdminConfirmUrl } from "@/lib/whatsapp/build-message"
import { cn } from "@/lib/utils"
import type { Appointment } from "@/lib/supabase/types"

type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled"

interface AppointmentDetailDrawerProps {
  appointment: Appointment
  serviceName: string
  stylistName: string
  open: boolean
  onClose: () => void
  onStatusChange: (id: string, status: AppointmentStatus) => void
}

interface DetailRowProps {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: "true" }>
  label: string
  value: string | null | undefined
}

function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center justify-center size-8 rounded-lg bg-cream shrink-0 mt-0.5">
        <Icon className="size-4 text-plum/50" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-plum/40 uppercase tracking-wider font-sans">
          {label}
        </p>
        <p className="text-sm text-plum font-sans mt-0.5 break-words">{value}</p>
      </div>
    </div>
  )
}

export function AppointmentDetailDrawer({
  appointment,
  serviceName,
  stylistName,
  open,
  onClose,
  onStatusChange,
}: AppointmentDetailDrawerProps) {
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus>(
    appointment.status
  )
  const [adminNotes, setAdminNotes] = useState(appointment.admin_notes ?? "")
  const [isSavingStatus, setIsSavingStatus] = useState(false)
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [notesSaved, setNotesSaved] = useState(false)

  // Sync local state when appointment prop changes
  useEffect(() => {
    setSelectedStatus(appointment.status)
    setAdminNotes(appointment.admin_notes ?? "")
    setSaveError(null)
    setNotesSaved(false)
  }, [appointment.id, appointment.status, appointment.admin_notes])

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  const patchAppointment = useCallback(
    async (payload: { status?: AppointmentStatus; adminNotes?: string }) => {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error ?? "Update failed")
      }
      return res.json()
    },
    [appointment.id]
  )

  async function handleStatusChange(value: AppointmentStatus | null) {
    if (!value) return
    const status = value as AppointmentStatus
    setSelectedStatus(status)
    setSaveError(null)
    setIsSavingStatus(true)
    try {
      await patchAppointment({ status })
      onStatusChange(appointment.id, status)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to update status")
      setSelectedStatus(appointment.status) // revert
    } finally {
      setIsSavingStatus(false)
    }
  }

  async function handleSaveNotes() {
    setSaveError(null)
    setNotesSaved(false)
    setIsSavingNotes(true)
    try {
      await patchAppointment({ adminNotes })
      setNotesSaved(true)
      setTimeout(() => setNotesSaved(false), 2500)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save notes")
    } finally {
      setIsSavingNotes(false)
    }
  }

  const whatsappUrl = buildAdminConfirmUrl({
    customerName: appointment.customer_name,
    customerPhone: appointment.customer_phone,
    serviceName,
    stylistName,
    date: appointment.appointment_date,
    time: appointment.appointment_time,
    priceLkr: appointment.total_price_lkr ?? 0,
  })

  const dateFormatted = format(
    parseISO(appointment.appointment_date),
    "EEEE, MMMM d, yyyy"
  )

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-plum/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            initial={{ x: 420, opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            aria-label="Appointment details"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cream-dark px-5 py-4 bg-plum">
              <div>
                <h2 className="font-serif text-lg font-semibold text-cream">
                  Appointment Details
                </h2>
                <p className="text-xs text-cream/50 font-sans mt-0.5">
                  ID: {appointment.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center size-8 rounded-lg text-cream/60 hover:bg-white/10 hover:text-cream transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                aria-label="Close appointment details"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              {/* Status banner */}
              <div className="px-5 py-4 bg-cream/60 border-b border-cream-dark flex items-center justify-between">
                <StatusBadge status={selectedStatus} />
                <span className="text-xs text-plum/40 font-sans">
                  Booked {format(parseISO(appointment.created_at), "d MMM yyyy")}
                </span>
              </div>

              {/* Customer info */}
              <section className="px-5 py-5 space-y-4 border-b border-cream-dark">
                <h3 className="text-xs font-semibold text-plum/40 uppercase tracking-widest font-sans">
                  Customer
                </h3>
                <DetailRow icon={User} label="Name" value={appointment.customer_name} />
                <DetailRow icon={Phone} label="Phone" value={appointment.customer_phone} />
                <DetailRow icon={Mail} label="Email" value={appointment.customer_email} />
              </section>

              {/* Booking info */}
              <section className="px-5 py-5 space-y-4 border-b border-cream-dark">
                <h3 className="text-xs font-semibold text-plum/40 uppercase tracking-widest font-sans">
                  Booking
                </h3>
                <DetailRow icon={Scissors} label="Service" value={serviceName} />
                <DetailRow icon={User} label="Stylist" value={stylistName} />
                <DetailRow icon={Calendar} label="Date" value={dateFormatted} />
                <DetailRow icon={Clock} label="Time" value={appointment.appointment_time} />
                <DetailRow
                  icon={DollarSign}
                  label="Price"
                  value={
                    appointment.total_price_lkr != null
                      ? `LKR ${appointment.total_price_lkr.toLocaleString()}`
                      : null
                  }
                />
                {appointment.notes && (
                  <DetailRow icon={FileText} label="Customer Notes" value={appointment.notes} />
                )}
              </section>

              {/* Status change */}
              <section className="px-5 py-5 border-b border-cream-dark space-y-3">
                <h3 className="text-xs font-semibold text-plum/40 uppercase tracking-widest font-sans">
                  Update Status
                </h3>
                <div className="flex items-center gap-3">
                  <Select
                    value={selectedStatus}
                    onValueChange={(v) => void handleStatusChange(v as AppointmentStatus | null)}
                    disabled={isSavingStatus}
                  >
                    <SelectTrigger
                      className="w-44 border-cream-dark"
                      aria-label="Change appointment status"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  {isSavingStatus && (
                    <Loader2
                      className="size-4 animate-spin text-plum/40"
                      aria-label="Saving status"
                    />
                  )}
                </div>
              </section>

              {/* Admin notes */}
              <section className="px-5 py-5 border-b border-cream-dark space-y-3">
                <h3 className="text-xs font-semibold text-plum/40 uppercase tracking-widest font-sans">
                  Admin Notes
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="admin-notes" className="sr-only">
                    Admin notes
                  </Label>
                  <Textarea
                    id="admin-notes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes about this appointment…"
                    className="min-h-24 resize-none border-cream-dark focus-visible:border-gold focus-visible:ring-gold/30 text-sm"
                    rows={4}
                  />
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-xs transition-colors",
                        notesSaved ? "text-emerald-600" : "text-transparent"
                      )}
                      aria-live="polite"
                    >
                      {notesSaved ? "Notes saved" : "placeholder"}
                    </span>
                    <Button
                      onClick={handleSaveNotes}
                      disabled={isSavingNotes}
                      size="sm"
                      className="bg-plum text-cream hover:bg-plum-light"
                    >
                      {isSavingNotes ? (
                        <>
                          <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                          Saving…
                        </>
                      ) : (
                        "Save Notes"
                      )}
                    </Button>
                  </div>
                </div>
              </section>

              {/* Error state */}
              {saveError && (
                <div
                  role="alert"
                  className="mx-5 mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                >
                  {saveError}
                </div>
              )}
            </div>

            {/* Footer: WhatsApp CTA */}
            <div className="border-t border-cream-dark px-5 py-4 bg-white">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Send WhatsApp confirmation to ${appointment.customer_name}`}
                className={cn(
                  "flex w-full items-center justify-center gap-2.5 rounded-xl py-3 text-sm font-semibold",
                  "bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700",
                  "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
                )}
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Send WhatsApp Confirmation
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
