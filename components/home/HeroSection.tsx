"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const words = ["Where", "Beauty", "Meets", "Artistry"]

export default function HeroSection() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "94771234567"
  const message = encodeURIComponent("Hi! I'd like to book an appointment at Velour Beauty Studio.")

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with Ken Burns */}
      <div className="absolute inset-0 z-0">
        <div
          className="ken-burns absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80')",
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-plum-dark/70 via-plum/50 to-plum-dark/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gold text-xs tracking-[0.4em] uppercase mb-8"
        >
          Colombo&apos;s Premier Beauty Destination
        </motion.div>

        {/* Headline — staggered word reveal */}
        <div className="font-serif text-6xl md:text-8xl font-light text-cream leading-tight mb-6 flex flex-wrap justify-center gap-x-5 gap-y-2">
          {words.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease: "easeOut" }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-cream/70 text-lg md:text-xl font-light tracking-wide max-w-xl mx-auto mb-12"
        >
          Premium hair, skin, nails &amp; bridal services crafted for the modern Sri Lankan woman.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/booking"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-gold hover:bg-gold-dark text-plum-dark font-semibold tracking-widest text-xs uppercase px-10 py-6"
            )}
          >
            Book Appointment
          </Link>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${message}`}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-cream/40 text-cream hover:bg-cream/10 hover:text-cream hover:border-cream tracking-widest text-xs uppercase px-10 py-6"
            )}
          >
            WhatsApp Us
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-cream/40 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent"
        />
      </motion.div>
    </section>
  )
}
