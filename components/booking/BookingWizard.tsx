"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useBookingStore } from "@/stores/booking-store"
import StepIndicator from "./StepIndicator"
import ServiceStep   from "./ServiceStep"
import StylistStep   from "./StylistStep"
import DateTimeStep  from "./DateTimeStep"
import ConfirmStep   from "./ConfirmStep"
import BookingSuccess from "./BookingSuccess"
import type { Service, Stylist } from "@/lib/supabase/types"

interface Props {
  services: Service[]
  stylists: Stylist[]
}

interface SuccessData {
  customerName: string
  serviceName:  string
  stylistName:  string
  date:         string
  time:         string
  priceLkr:     number
  whatsappUrl:  string
}

const variants = {
  enter: (dir: "forward" | "back") => ({
    x: dir === "forward" ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: "forward" | "back") => ({
    x: dir === "forward" ? -40 : 40,
    opacity: 0,
  }),
}

export default function BookingWizard({ services, stylists }: Props) {
  const { step, direction, setStep, setCustomer, service, stylist, slot, date, reset } =
    useBookingStore()

  const [submitting, setSubmitting] = useState(false)
  const [successData, setSuccessData] = useState<SuccessData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const goNext = () => setStep((step + 1) as 1 | 2 | 3 | 4, "forward")
  const goBack = () => setStep((step - 1) as 1 | 2 | 3 | 4, "back")

  const handleConfirm = async (fields: {
    name: string; phone: string; email?: string; notes?: string
  }) => {
    if (!service || !stylist || !slot || !date) return
    setCustomer({ name: fields.name, phone: fields.phone, email: fields.email ?? "", notes: fields.notes ?? "" })
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId:       service.id,
          stylistId:       stylist.id,
          slotId:          slot.id,
          appointmentDate: date,
          appointmentTime: slot.start_time.slice(0, 5),
          customerName:    fields.name,
          customerPhone:   fields.phone,
          customerEmail:   fields.email ?? "",
          notes:           fields.notes,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.")
        return
      }

      setSuccessData({
        customerName: fields.name,
        serviceName:  service.name,
        stylistName:  stylist.name,
        date,
        time:         slot.start_time,
        priceLkr:     service.price_lkr,
        whatsappUrl:  data.whatsappUrl,
      })
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleBookAgain = () => {
    reset()
    setSuccessData(null)
  }

  if (successData) {
    return <BookingSuccess {...successData} onBookAgain={handleBookAgain} />
  }

  return (
    <div>
      <StepIndicator current={step} />

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm text-center">
          {error}
        </div>
      )}

      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {step === 1 && (
              <ServiceStep services={services} onNext={goNext} />
            )}
            {step === 2 && (
              <StylistStep stylists={stylists} onNext={goNext} onBack={goBack} />
            )}
            {step === 3 && (
              <DateTimeStep onNext={goNext} onBack={goBack} />
            )}
            {step === 4 && (
              <ConfirmStep onSubmit={handleConfirm} onBack={goBack} loading={submitting} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
