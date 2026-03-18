"use client"

import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import { Instagram } from "lucide-react"
import type { Stylist } from "@/lib/supabase/types"

const placeholderPhotos = [
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
]

function StylistCard({ stylist, index, photo }: { stylist: Stylist; index: number; photo: string }) {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="group perspective"
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative w-full transition-transform duration-700 ease-in-out"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Card container — flip on group hover */}
        <div className="group/card relative overflow-hidden rounded-2xl">
          {/* Front */}
          <div className="relative h-96">
            <img
              src={stylist.photo_url ?? photo}
              alt={stylist.name}
              className="w-full h-full object-cover transition-transform duration-700 group/card:hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/80 via-transparent to-transparent" />

            {/* Name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300">
              <div className="text-gold text-[10px] tracking-[0.3em] uppercase mb-1">{stylist.role}</div>
              <h3 className="font-serif text-2xl text-cream">{stylist.name}</h3>
            </div>

            {/* Hover overlay with bio */}
            <div className="absolute inset-0 bg-plum/90 flex flex-col justify-center items-center p-8 text-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-400">
              <div className="text-gold text-[10px] tracking-[0.3em] uppercase mb-2">{stylist.role}</div>
              <h3 className="font-serif text-2xl text-cream mb-4">{stylist.name}</h3>
              {stylist.bio && (
                <p className="text-cream/70 text-sm leading-relaxed">{stylist.bio}</p>
              )}
              {stylist.specialties.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {stylist.specialties.map((s) => (
                    <span
                      key={s}
                      className="bg-gold/20 text-gold text-[10px] tracking-widest uppercase px-2 py-1 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {stylist.instagram_url && (
                <a
                  href={stylist.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 text-cream/60 hover:text-gold transition-colors"
                >
                  <Instagram size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function TeamSection({ stylists }: { stylists: Stylist[] }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section className="py-24 px-6 bg-cream-dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">The Experts</p>
          <h2 className="font-serif text-5xl font-light text-plum">Meet Our Team</h2>
          <div className="w-16 h-px bg-gold mx-auto mt-6" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stylists.map((stylist, i) => (
            <StylistCard
              key={stylist.id}
              stylist={stylist}
              index={i}
              photo={placeholderPhotos[i % placeholderPhotos.length]}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
