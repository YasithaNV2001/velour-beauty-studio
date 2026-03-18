"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useBookingStore } from "@/stores/booking-store"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Stylist } from "@/lib/supabase/types"

const placeholderPhotos = [
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
]

export default function StylistStep({
  stylists,
  onNext,
  onBack,
}: {
  stylists: Stylist[]
  onNext: () => void
  onBack: () => void
}) {
  const { stylist: selected, service, setStylist } = useBookingStore()

  // Filter stylists whose specialties include the selected service category
  const relevant = service
    ? stylists.filter(
        (s) => s.specialties.length === 0 || s.specialties.includes(service.category)
      )
    : stylists

  const display = relevant.length > 0 ? relevant : stylists

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl text-plum">Choose Your Stylist</h2>
        <p className="text-muted-foreground text-sm mt-2">
          {service ? `Showing specialists for ${service.name}` : "Select a stylist"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
        {display.map((s, i) => {
          const isSelected = selected?.id === s.id
          return (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setStylist(s)}
              className={cn(
                "relative rounded-2xl overflow-hidden border-2 transition-all duration-200 text-left focus:outline-none",
                isSelected
                  ? "border-gold shadow-lg shadow-gold/20"
                  : "border-transparent hover:border-plum/30"
              )}
            >
              {/* Photo */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={s.photo_url ?? placeholderPhotos[i % placeholderPhotos.length]}
                  alt={s.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/70 to-transparent" />
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gold flex items-center justify-center"
                  >
                    <Check size={14} className="text-plum-dark" strokeWidth={3} />
                  </motion.div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-gold text-[9px] tracking-[0.3em] uppercase">{s.role}</div>
                  <div className="font-serif text-lg text-cream">{s.name}</div>
                </div>
              </div>

              {/* Specialties */}
              <div className={cn("px-4 py-3 bg-white", isSelected && "bg-gold/5")}>
                <div className="flex flex-wrap gap-1">
                  {s.specialties.map((sp) => (
                    <span
                      key={sp}
                      className="text-[9px] tracking-widest uppercase bg-cream text-plum/70 px-2 py-0.5 rounded"
                    >
                      {sp}
                    </span>
                  ))}
                  {s.specialties.length === 0 && (
                    <span className="text-[9px] text-muted-foreground">All services</span>
                  )}
                </div>
              </div>
            </motion.button>
          )
        })}
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
          disabled={!selected}
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-plum hover:bg-plum-light text-cream tracking-widest text-xs uppercase px-10",
            !selected && "opacity-40 cursor-not-allowed"
          )}
        >
          Next: Pick Date & Time →
        </button>
      </div>
    </div>
  )
}
