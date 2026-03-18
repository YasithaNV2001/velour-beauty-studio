import { motion } from "framer-motion"
import { Check } from "lucide-react"
import type { BookingStep } from "@/stores/booking-store"

const steps = [
  { n: 1, label: "Service" },
  { n: 2, label: "Stylist" },
  { n: 3, label: "Date & Time" },
  { n: 4, label: "Confirm" },
]

export default function StepIndicator({ current }: { current: BookingStep }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((step, i) => {
        const done   = current > step.n
        const active = current === step.n

        return (
          <div key={step.n} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  backgroundColor: done ? "#C9A84C" : active ? "#3D1A47" : "#e8ddef",
                  scale: active ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                style={{ color: done || active ? "#FAF7F2" : "#7a6a7f" }}
              >
                {done ? <Check size={16} strokeWidth={3} /> : step.n}
              </motion.div>
              <span
                className={`text-[10px] tracking-widest uppercase whitespace-nowrap ${
                  active ? "text-plum font-semibold" : done ? "text-gold" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="relative w-16 md:w-24 h-px mx-1 mb-5 bg-border overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gold"
                  initial={{ width: "0%" }}
                  animate={{ width: current > step.n ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
