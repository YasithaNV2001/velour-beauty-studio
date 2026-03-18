"use client"

import { useRef } from "react"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import Link from "next/link"
import { Clock, ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Service } from "@/lib/supabase/types"

const categoryImages: Record<string, string> = {
  hair:   "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
  skin:   "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80",
  nails:  "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
  bridal: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  makeup: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80",
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={service.image_url ?? categoryImages[service.category] ?? categoryImages.hair}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/60 to-transparent" />
        <span className="absolute top-3 right-3 bg-gold text-plum-dark text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded">
          {service.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-serif text-xl font-medium text-plum mb-1">{service.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{service.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-plum font-bold text-lg">
              LKR {service.price_lkr.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs mt-0.5">
              <Clock size={11} />
              {service.duration_min} min
            </div>
          </div>
          <Link
            href="/booking"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-plum hover:bg-plum-light text-cream text-xs tracking-widest uppercase"
            )}
          >
            Book
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function ServicesPreview({ services }: { services: Service[] }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section className="py-24 px-6 bg-cream">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">What We Offer</p>
          <h2 className="font-serif text-5xl font-light text-plum">Our Services</h2>
          <div className="w-16 h-px bg-gold mx-auto mt-6" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-14"
        >
          <Link
            href="/services"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-plum text-plum hover:bg-plum hover:text-cream tracking-widest text-xs uppercase px-10 py-5 gap-2"
            )}
          >
            View All Services <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
