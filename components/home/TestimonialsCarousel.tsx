"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Star } from "lucide-react"
import type { Testimonial } from "@/lib/supabase/types"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 justify-center mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? "fill-gold text-gold" : "text-cream/20"}
        />
      ))}
    </div>
  )
}

export default function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % testimonials.length)
  }, [testimonials.length])

  useEffect(() => {
    if (paused || testimonials.length <= 1) return
    const id = setInterval(next, 4000)
    return () => clearInterval(id)
  }, [paused, next, testimonials.length])

  if (!testimonials.length) return null

  return (
    <section
      className="py-24 px-6 bg-plum relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-gold" />
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-gold" />
      </div>

      <div className="max-w-3xl mx-auto relative">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">What They Say</p>
          <h2 className="font-serif text-5xl font-light text-cream">Client Stories</h2>
          <div className="w-16 h-px bg-gold mx-auto mt-6" />
        </motion.div>

        {/* Carousel */}
        <div className="relative min-h-[220px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-center w-full"
            >
              <StarRating rating={testimonials[current].rating} />

              {/* Quote */}
              <blockquote className="font-serif text-xl md:text-2xl font-light text-cream/90 leading-relaxed mb-8 italic">
                &ldquo;{testimonials[current].review_text}&rdquo;
              </blockquote>

              {/* Customer */}
              <div>
                <div className="text-gold font-semibold text-sm tracking-widest">
                  {testimonials[current].customer_name}
                </div>
                {testimonials[current].service_name && (
                  <div className="text-cream/40 text-xs tracking-widest uppercase mt-1">
                    {testimonials[current].service_name}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Testimonial ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 h-2 bg-gold"
                  : "w-2 h-2 bg-cream/20 hover:bg-cream/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
