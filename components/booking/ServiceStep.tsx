"use client"

import { motion } from "framer-motion"
import { Clock, Check } from "lucide-react"
import { useBookingStore } from "@/stores/booking-store"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Service } from "@/lib/supabase/types"

const categoryImages: Record<string, string> = {
  hair:   "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80",
  skin:   "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&q=80",
  nails:  "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80",
  bridal: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
  makeup: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
}

export default function ServiceStep({
  services,
  onNext,
}: {
  services: Service[]
  onNext: () => void
}) {
  const { service: selected, setService } = useBookingStore()

  const handleSelect = (s: Service) => {
    setService(s)
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl text-plum">Choose a Service</h2>
        <p className="text-muted-foreground text-sm mt-2">Select the service you'd like to book</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {services.map((s, i) => {
          const isSelected = selected?.id === s.id
          return (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => handleSelect(s)}
              className={cn(
                "relative text-left rounded-2xl overflow-hidden border-2 transition-all duration-200 focus:outline-none",
                isSelected
                  ? "border-gold shadow-lg shadow-gold/20"
                  : "border-transparent hover:border-plum/30"
              )}
            >
              {/* Image */}
              <div className="relative h-36 overflow-hidden">
                <img
                  src={s.image_url ?? categoryImages[s.category]}
                  alt={s.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/60 to-transparent" />
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gold flex items-center justify-center"
                  >
                    <Check size={14} className="text-plum-dark" strokeWidth={3} />
                  </motion.div>
                )}
              </div>

              {/* Info */}
              <div className={cn("p-4 bg-white", isSelected && "bg-gold/5")}>
                <div className="font-serif text-base font-medium text-plum">{s.name}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-plum font-bold">LKR {s.price_lkr.toLocaleString()}</span>
                  <span className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Clock size={11} /> {s.duration_min} min
                  </span>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!selected}
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-plum hover:bg-plum-light text-cream tracking-widest text-xs uppercase px-10",
            !selected && "opacity-40 cursor-not-allowed"
          )}
        >
          Next: Choose Stylist →
        </button>
      </div>
    </div>
  )
}
