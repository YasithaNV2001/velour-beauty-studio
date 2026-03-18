"use client"

import { useInView } from "react-intersection-observer"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { useRef } from "react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1470259078422-826894b933aa?w=1920&q=80')",
          y: bgY,
          scale: 1.1,
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-plum/80" />

      <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">Ready for a Transformation?</p>
          <h2 className="font-serif text-5xl md:text-6xl font-light text-cream leading-tight mb-6">
            Book Your Appointment Today
          </h2>
          <p className="text-cream/60 text-lg font-light mb-12 max-w-xl mx-auto">
            Experience the Velour difference. Our expert team is ready to bring out your most beautiful self.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-gold hover:bg-gold-dark text-plum-dark font-semibold tracking-widest text-xs uppercase px-12 py-6"
              )}
            >
              Book Now
            </Link>
            <Link
              href="/services"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-cream/40 text-cream hover:bg-cream/10 hover:text-cream hover:border-cream tracking-widest text-xs uppercase px-12 py-6"
              )}
            >
              Explore Services
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
