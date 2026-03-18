"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Calendar, Clock, User, Scissors } from "lucide-react"
import { useBookingStore } from "@/stores/booking-store"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const confirmSchema = z.object({
  name:  z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Phone number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  notes: z.string().max(300).optional(),
})
type ConfirmFields = z.infer<typeof confirmSchema>

export default function ConfirmStep({
  onSubmit,
  onBack,
  loading,
}: {
  onSubmit: (fields: ConfirmFields) => void
  onBack: () => void
  loading: boolean
}) {
  const { service, stylist, slot, date, customerName, customerPhone, customerEmail, notes } =
    useBookingStore()

  const { register, handleSubmit, formState: { errors } } = useForm<ConfirmFields>({
    resolver: zodResolver(confirmSchema),
    defaultValues: {
      name:  customerName,
      phone: customerPhone,
      email: customerEmail,
      notes: notes,
    },
  })

  const formatTime = (t: string) => {
    const [h, m] = t.split(":")
    const hour = parseInt(h)
    return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? "PM" : "AM"}`
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl text-plum">Confirm Your Booking</h2>
        <p className="text-muted-foreground text-sm mt-2">Review your details and enter your contact info</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking summary */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-plum rounded-2xl p-6 text-cream space-y-4"
        >
          <h3 className="font-serif text-lg text-gold mb-6">Booking Summary</h3>

          <div className="flex items-start gap-3">
            <Scissors size={16} className="text-gold mt-0.5 shrink-0" />
            <div>
              <div className="text-[10px] tracking-widest uppercase text-cream/40 mb-0.5">Service</div>
              <div className="font-medium">{service?.name}</div>
              <div className="text-gold font-bold mt-0.5">
                LKR {service?.price_lkr.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User size={16} className="text-gold mt-0.5 shrink-0" />
            <div>
              <div className="text-[10px] tracking-widest uppercase text-cream/40 mb-0.5">Stylist</div>
              <div className="font-medium">{stylist?.name}</div>
              <div className="text-cream/50 text-xs">{stylist?.role}</div>
            </div>
          </div>

          {date && (
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-gold mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] tracking-widest uppercase text-cream/40 mb-0.5">Date</div>
                <div className="font-medium">
                  {format(new Date(date + "T00:00:00"), "EEEE, MMMM d yyyy")}
                </div>
              </div>
            </div>
          )}

          {slot && (
            <div className="flex items-start gap-3">
              <Clock size={16} className="text-gold mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] tracking-widest uppercase text-cream/40 mb-0.5">Time</div>
                <div className="font-medium">{formatTime(slot.start_time)}</div>
                <div className="text-cream/50 text-xs">
                  Duration: {service?.duration_min} min
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-cream/10 pt-4 flex justify-between items-center">
            <span className="text-cream/60 text-sm">Total</span>
            <span className="text-gold font-bold text-xl">
              LKR {service?.price_lkr.toLocaleString()}
            </span>
          </div>
        </motion.div>

        {/* Contact form */}
        <motion.form
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div>
            <label className="text-xs tracking-widest uppercase text-plum/70 mb-1.5 block">
              Full Name *
            </label>
            <input
              {...register("name")}
              placeholder="e.g. Amaya Perera"
              className={cn(
                "w-full h-11 px-4 rounded-xl border bg-white text-sm outline-none transition-colors",
                "focus:border-plum focus:ring-2 focus:ring-plum/10",
                errors.name ? "border-destructive" : "border-border"
              )}
            />
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-xs tracking-widest uppercase text-plum/70 mb-1.5 block">
              WhatsApp / Phone *
            </label>
            <input
              {...register("phone")}
              placeholder="e.g. 0771234567"
              type="tel"
              className={cn(
                "w-full h-11 px-4 rounded-xl border bg-white text-sm outline-none transition-colors",
                "focus:border-plum focus:ring-2 focus:ring-plum/10",
                errors.phone ? "border-destructive" : "border-border"
              )}
            />
            {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="text-xs tracking-widest uppercase text-plum/70 mb-1.5 block">
              Email <span className="text-muted-foreground font-normal normal-case">(optional)</span>
            </label>
            <input
              {...register("email")}
              placeholder="your@email.com"
              type="email"
              className="w-full h-11 px-4 rounded-xl border border-border bg-white text-sm outline-none focus:border-plum focus:ring-2 focus:ring-plum/10 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs tracking-widest uppercase text-plum/70 mb-1.5 block">
              Notes <span className="text-muted-foreground font-normal normal-case">(optional)</span>
            </label>
            <textarea
              {...register("notes")}
              placeholder="Any special requests or allergies..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm outline-none focus:border-plum focus:ring-2 focus:ring-plum/10 transition-colors resize-none"
            />
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={onBack}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-plum/30 text-plum hover:bg-plum/5 tracking-widest text-xs uppercase px-8"
              )}
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-gold hover:bg-gold-dark text-plum-dark font-bold tracking-widest text-xs uppercase px-10",
                loading && "opacity-60 cursor-not-allowed"
              )}
            >
              {loading ? "Booking..." : "Confirm Booking ✓"}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  )
}
