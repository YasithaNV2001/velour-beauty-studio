"use client"

import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { GalleryItem } from "@/lib/supabase/types"

// Placeholder images for demo
const placeholderBefore = [
  "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80",
  "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80",
  "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80",
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80",
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80",
]
const placeholderAfter = [
  "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=80",
  "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80",
  "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=600&q=80",
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
  "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&q=80",
  "https://images.unsplash.com/photo-1620122301756-07de886b2832?w=600&q=80",
]

function GalleryCard({ item, index, beforeSrc, afterSrc }: {
  item: GalleryItem
  index: number
  beforeSrc: string
  afterSrc: string
}) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-xl aspect-square cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      {/* Before image (base) */}
      <img
        src={item.before_image_url ?? beforeSrc}
        alt={`Before — ${item.title ?? item.category}`}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* After image — clip-path reveal on hover */}
      <div
        className="absolute inset-0 overflow-hidden transition-all duration-500 ease-in-out"
        style={{ clipPath: "inset(0 100% 0 0)" }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.clipPath = "inset(0 0% 0 0)"
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.clipPath = "inset(0 100% 0 0)"
        }}
      >
        <img
          src={item.after_image_url ?? afterSrc}
          alt={`After — ${item.title ?? item.category}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-gold text-plum-dark text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded">
          After
        </div>
      </div>

      {/* Before label */}
      <div className="absolute top-3 left-3 bg-plum/70 text-cream text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded group-hover:opacity-0 transition-opacity duration-300">
        Before
      </div>

      {/* Hover hint */}
      <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[9px] tracking-widest uppercase px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Hover to reveal
      </div>

      {/* Category badge */}
      {item.category && (
        <div className="absolute bottom-3 left-3 bg-plum-dark/80 text-cream text-[10px] tracking-widest uppercase px-2 py-1 rounded">
          {item.category}
        </div>
      )}
    </motion.div>
  )
}

export default function GalleryPreview({ items }: { items: GalleryItem[] }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  // Pad with placeholder items if fewer than 6
  const display = items.slice(0, 6)

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Transformations</p>
          <h2 className="font-serif text-5xl font-light text-plum">Before &amp; After</h2>
          <p className="text-muted-foreground mt-4 text-sm">Hover over each photo to see the transformation</p>
          <div className="w-16 h-px bg-gold mx-auto mt-6" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {display.map((item, i) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={i}
              beforeSrc={placeholderBefore[i % placeholderBefore.length]}
              afterSrc={placeholderAfter[i % placeholderAfter.length]}
            />
          ))}
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-14"
        >
          <Link
            href="/gallery"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-plum text-plum hover:bg-plum hover:text-cream tracking-widest text-xs uppercase px-10 py-5 gap-2"
            )}
          >
            View Full Gallery <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
