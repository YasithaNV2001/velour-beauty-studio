"use client"

import { useState, useEffect } from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"
import { motion } from "framer-motion"
import { format, isBefore, startOfDay, addDays } from "date-fns"
import { Clock } from "lucide-react"
import { useBookingStore } from "@/stores/booking-store"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { AvailabilitySlot } from "@/lib/supabase/types"

export default function DateTimeStep({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const { stylist, date, slot: selectedSlot, setDate, setSlot } = useBookingStore()
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(
    date ? new Date(date + "T00:00:00") : undefined
  )

  const today = startOfDay(new Date())
  const maxDate = addDays(today, 60)

  // Fetch available slots when date or stylist changes
  useEffect(() => {
    if (!selectedDay || !stylist) return
    const d = format(selectedDay, "yyyy-MM-dd")
    setSlots([])
    setSlot(null as unknown as AvailabilitySlot)
    setLoading(true)
    fetch(`/api/availability?stylistId=${stylist.id}&date=${d}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false))
  }, [selectedDay, stylist]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDaySelect = (day: Date | undefined) => {
    setSelectedDay(day)
    if (day) setDate(format(day, "yyyy-MM-dd"))
  }

  const formatTime = (t: string) => {
    const [h, m] = t.split(":")
    const hour = parseInt(h)
    return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? "PM" : "AM"}`
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl text-plum">Choose Date &amp; Time</h2>
        <p className="text-muted-foreground text-sm mt-2">
          {stylist ? `Booking with ${stylist.name}` : "Select a date and time"}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Calendar */}
        <div className="flex-1 flex justify-center">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-border w-full max-w-sm">
            <DayPicker
              mode="single"
              selected={selectedDay}
              onSelect={handleDaySelect}
              disabled={[
                { before: addDays(today, 1) },
                { after: maxDate },
                { dayOfWeek: [0] }, // Sunday closed
              ]}
              classNames={{
                root:         "w-full",
                months:       "w-full",
                month:        "w-full",
                month_caption: "flex justify-center mb-4 font-serif text-plum font-medium",
                weekdays:     "grid grid-cols-7 mb-2",
                weekday:      "text-center text-xs text-muted-foreground uppercase tracking-wider",
                weeks:        "w-full",
                week:         "grid grid-cols-7",
                day:          "text-center",
                day_button:   cn(
                  "w-9 h-9 mx-auto rounded-full text-sm transition-colors duration-150",
                  "hover:bg-plum/10 text-foreground"
                ),
                selected:     "[&>button]:bg-plum [&>button]:text-cream [&>button]:hover:bg-plum",
                today:        "[&>button]:border [&>button]:border-gold [&>button]:font-bold",
                disabled:     "[&>button]:opacity-30 [&>button]:cursor-not-allowed [&>button]:hover:bg-transparent",
                outside:      "[&>button]:opacity-20",
                nav:          "flex justify-between mb-2",
                button_previous: "p-1 rounded hover:bg-plum/10 text-plum",
                button_next:     "p-1 rounded hover:bg-plum/10 text-plum",
              }}
            />
          </div>
        </div>

        {/* Time slots */}
        <div className="flex-1">
          {!selectedDay ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Select a date to see available times
            </div>
          ) : loading ? (
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-border animate-pulse" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <Clock size={36} className="text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">
                No available slots for this date.<br />Try another day.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
                Available times — {format(selectedDay, "EEEE, MMM d")}
              </p>
              <div className="grid grid-cols-3 gap-3">
                {slots.map((s, i) => {
                  const isSelected = selectedSlot?.id === s.id
                  return (
                    <motion.button
                      key={s.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setSlot(s)}
                      className={cn(
                        "h-12 rounded-xl text-sm font-medium border-2 transition-all duration-150",
                        isSelected
                          ? "bg-plum border-plum text-cream shadow-md"
                          : "bg-white border-border hover:border-plum/40 text-foreground"
                      )}
                    >
                      {formatTime(s.start_time)}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-plum/30 text-plum hover:bg-plum/5 tracking-widest text-xs uppercase px-8"
          )}
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!selectedSlot}
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-plum hover:bg-plum-light text-cream tracking-widest text-xs uppercase px-10",
            !selectedSlot && "opacity-40 cursor-not-allowed"
          )}
        >
          Next: Confirm →
        </button>
      </div>
    </div>
  )
}
