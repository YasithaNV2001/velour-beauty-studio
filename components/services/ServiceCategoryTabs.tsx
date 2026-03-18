"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Link from "next/link"
import { Clock, ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Service } from "@/lib/supabase/types"

const categories = [
  { id: "all",    label: "All Services" },
  { id: "hair",   label: "Hair" },
  { id: "skin",   label: "Skin" },
  { id: "nails",  label: "Nails" },
  { id: "bridal", label: "Bridal" },
  { id: "makeup", label: "Makeup" },
]

const categoryImages: Record<string, string> = {
  hair:   "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
  skin:   "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80",
  nails:  "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
  bridal: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  makeup: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80",
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 6) * 0.07 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image_url ?? categoryImages[service.category] ?? categoryImages.hair}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/50 to-transparent" />
        <span className="absolute top-3 right-3 bg-gold text-plum-dark text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded">
          {service.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-serif text-xl font-medium text-plum mb-2">{service.name}</h3>
        {service.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-5">{service.description}</p>
        )}

        {/* Price row */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <div className="text-plum font-bold text-xl">
              LKR {service.price_lkr.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs mt-0.5">
              <Clock size={11} />
              <span>{service.duration_min} min</span>
            </div>
          </div>
          <Link
            href={`/booking?service=${service.id}`}
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-plum hover:bg-plum-light text-cream text-xs tracking-widest uppercase gap-1"
            )}
          >
            Book <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function ServiceCategoryTabs({ services }: { services: Service[] }) {
  const [active, setActive] = useState("all")

  const filtered = active === "all"
    ? services
    : services.filter((s) => s.category === active)

  return (
    <div>
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map((cat) => {
          const count = cat.id === "all"
            ? services.length
            : services.filter((s) => s.category === cat.id).length
          if (count === 0 && cat.id !== "all") return null

          return (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={cn(
                "relative px-5 py-2 rounded-full text-sm tracking-wider uppercase transition-colors duration-200 font-medium",
                active === cat.id
                  ? "bg-plum text-cream"
                  : "bg-white text-plum/70 hover:text-plum border border-border"
              )}
            >
              {cat.label}
              {active === cat.id && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 bg-plum rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
