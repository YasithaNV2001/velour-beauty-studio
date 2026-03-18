"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname])

  const isHome = pathname === "/"

  return (
    <motion.nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled || !isHome
          ? "bg-plum/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      )}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-serif text-2xl font-light tracking-widest text-cream">
            VELOUR
          </span>
          <span className="text-gold text-[10px] tracking-[0.3em] uppercase">
            Beauty Studio
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm tracking-widest uppercase transition-colors duration-200",
                pathname === link.href
                  ? "text-gold"
                  : "text-cream/80 hover:text-cream"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Book Now CTA */}
        <div className="hidden md:block">
          <Link
            href="/booking"
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-gold hover:bg-gold-dark text-plum-dark font-semibold tracking-widest text-xs uppercase px-6"
            )}
          >
            Book Now
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-cream p-1"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-plum-dark md:hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm tracking-widest uppercase",
                    pathname === link.href ? "text-gold" : "text-cream/80"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/booking"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "bg-gold hover:bg-gold-dark text-plum-dark font-semibold tracking-widest text-xs uppercase w-full mt-2 justify-center"
                )}
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
