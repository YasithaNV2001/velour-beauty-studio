"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { format } from "date-fns"
import { CheckCircle2 } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Props {
  customerName: string
  serviceName:  string
  stylistName:  string
  date:         string
  time:         string
  priceLkr:     number
  whatsappUrl:  string
  onBookAgain:  () => void
}

export default function BookingSuccess({
  customerName, serviceName, stylistName, date, time, priceLkr, whatsappUrl, onBookAgain,
}: Props) {
  const formatTime = (t: string) => {
    const [h, m] = t.split(":")
    const hour = parseInt(h)
    return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? "PM" : "AM"}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-lg mx-auto py-8"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="flex justify-center mb-6"
      >
        <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center">
          <CheckCircle2 size={48} className="text-gold" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-gold text-xs tracking-[0.4em] uppercase mb-2">Booking Received</p>
        <h2 className="font-serif text-4xl text-plum mb-3">
          Thank you, {customerName.split(" ")[0]}!
        </h2>
        <p className="text-muted-foreground text-sm mb-8">
          Your appointment request has been submitted. Please send us a WhatsApp message to confirm your booking.
        </p>

        {/* Summary card */}
        <div className="bg-cream-dark rounded-2xl p-6 text-left mb-8 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service</span>
            <span className="font-medium text-plum">{serviceName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Stylist</span>
            <span className="font-medium text-plum">{stylistName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium text-plum">
              {format(new Date(date + "T00:00:00"), "EEEE, MMM d yyyy")}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Time</span>
            <span className="font-medium text-plum">{formatTime(time)}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-border pt-3">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold text-gold text-lg">LKR {priceLkr.toLocaleString()}</span>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className={cn(
            buttonVariants({ size: "lg" }),
            "w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold tracking-widest text-sm uppercase gap-3 py-6 mb-4"
          )}
        >
          {/* WhatsApp icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5 shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Confirm via WhatsApp
        </a>

        <div className="flex gap-3">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex-1 border-plum/30 text-plum hover:bg-plum/5 tracking-widest text-xs uppercase"
            )}
          >
            Back to Home
          </Link>
          <button
            onClick={onBookAgain}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex-1 border-plum/30 text-plum hover:bg-plum/5 tracking-widest text-xs uppercase"
            )}
          >
            Book Another
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
