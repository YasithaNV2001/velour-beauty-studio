import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Service, Stylist, AvailabilitySlot } from "@/lib/supabase/types"

export type BookingStep = 1 | 2 | 3 | 4

interface BookingState {
  step: BookingStep
  direction: "forward" | "back"
  // Selected data
  service:  Service | null
  stylist:  Stylist | null
  slot:     AvailabilitySlot | null
  date:     string | null   // "YYYY-MM-DD"
  // Customer info (step 4)
  customerName:  string
  customerPhone: string
  customerEmail: string
  notes:         string
  // Actions
  setStep:      (step: BookingStep, dir?: "forward" | "back") => void
  setService:   (service: Service) => void
  setStylist:   (stylist: Stylist) => void
  setSlot:      (slot: AvailabilitySlot) => void
  setDate:      (date: string) => void
  setCustomer:  (fields: { name: string; phone: string; email: string; notes: string }) => void
  reset:        () => void
}

const initial = {
  step:          1 as BookingStep,
  direction:     "forward" as const,
  service:       null,
  stylist:       null,
  slot:          null,
  date:          null,
  customerName:  "",
  customerPhone: "",
  customerEmail: "",
  notes:         "",
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      ...initial,

      setStep: (step, dir = "forward") =>
        set({ step, direction: dir }),

      setService: (service) =>
        set({ service, stylist: null, slot: null, date: null }),

      setStylist: (stylist) =>
        set({ stylist, slot: null, date: null }),

      setSlot: (slot) =>
        set({ slot }),

      setDate: (date) =>
        set({ date, slot: null }),

      setCustomer: ({ name, phone, email, notes }) =>
        set({ customerName: name, customerPhone: phone, customerEmail: email, notes }),

      reset: () => set(initial),
    }),
    {
      name: "velour-booking",
      // Only persist form data, not step (restart from step 1 on reload)
      partialize: (s) => ({
        service:       s.service,
        stylist:       s.stylist,
        slot:          s.slot,
        date:          s.date,
        customerName:  s.customerName,
        customerPhone: s.customerPhone,
        customerEmail: s.customerEmail,
        notes:         s.notes,
      }),
    }
  )
)
