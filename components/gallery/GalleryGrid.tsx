"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider"
import type { GalleryItem } from "@/lib/supabase/types"

const categories = [
  { id: "all", label: "All" },
  { id: "hair", label: "Hair" },
  { id: "skin", label: "Skin" },
  { id: "nails", label: "Nails" },
  { id: "bridal", label: "Bridal" },
  { id: "makeup", label: "Makeup" },
]

const placeholderBefore = [
  "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80",
  "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
  "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80",
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80",
]
const placeholderAfter = [
  "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80",
  "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800&q=80",
  "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=800&q=80",
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
  "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&q=80",
  "https://images.unsplash.com/photo-1620122301756-07de886b2832?w=800&q=80",
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
      transition={{ duration: 0.5, delay: (index % 6) * 0.08 }}
      className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      {/* Drag slider */}
      <div className="relative">
        <ReactCompareSlider
          itemOne={
            <ReactCompareSliderImage
              src={item.before_image_url ?? beforeSrc}
              alt={`Before — ${item.title ?? item.category}`}
              style={{ objectFit: "cover" }}
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={item.after_image_url ?? afterSrc}
              alt={`After — ${item.title ?? item.category}`}
              style={{ objectFit: "cover" }}
            />
          }
          style={{ height: 300 }}
          handle={
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold shadow-lg border-2 border-white">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M8 5l-5 7 5 7M16 5l5 7-5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          }
        />

        {/* Labels */}
        <div className="absolute top-3 left-3 bg-plum/80 text-cream text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded pointer-events-none">
          Before
        </div>
        <div className="absolute top-3 right-3 bg-gold text-plum-dark text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded pointer-events-none">
          After
        </div>
      </div>

      {/* Info bar */}
      <div className="bg-white px-4 py-3 flex items-center justify-between">
        <div className="font-serif text-plum text-sm font-medium">
          {item.title ?? "Transformation"}
        </div>
        {item.category && (
          <span className="text-[10px] tracking-widest uppercase bg-cream text-plum/60 px-2 py-0.5 rounded">
            {item.category}
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState("all")

  const filtered = active === "all"
    ? items
    : items.filter((i) => i.category === active)

  const available = categories.filter(
    (cat) => cat.id === "all" || items.some((i) => i.category === cat.id)
  )

  return (
    <div>
      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-12">
        {available.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className={`px-5 py-2 rounded-full text-sm tracking-wider uppercase transition-colors duration-200 font-medium ${
              active === cat.id
                ? "bg-plum text-cream"
                : "bg-white text-plum/70 hover:text-plum border border-border"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((item, i) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={i}
              beforeSrc={placeholderBefore[i % placeholderBefore.length]}
              afterSrc={placeholderAfter[i % placeholderAfter.length]}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
