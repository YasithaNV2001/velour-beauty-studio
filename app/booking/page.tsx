import { createClient } from "@/lib/supabase/server"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import WhatsAppFAB from "@/components/layout/WhatsAppFAB"
import BookingWizard from "@/components/booking/BookingWizard"
import type { Service, Stylist } from "@/lib/supabase/types"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book an Appointment | Velour Beauty Studio",
  description:
    "Schedule your beauty appointment online. Choose your service, stylist, and preferred time — confirmed via WhatsApp.",
}

export default async function BookingPage() {
  const supabase = await createClient()

  const [{ data: services }, { data: stylists }] = await Promise.all([
    supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("display_order"),
    supabase
      .from("stylists")
      .select("*")
      .eq("is_active", true)
      .order("display_order"),
  ])

  return (
    <>
      <Navbar />

      {/* Page hero */}
      <section className="bg-plum pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">
            Online Booking
          </p>
          <h1 className="font-serif text-5xl text-cream mb-4">
            Book Your Visit
          </h1>
          <p className="text-cream/60 text-sm">
            Select your service, choose a stylist, and pick a time that works
            for you. We&apos;ll confirm via WhatsApp.
          </p>
        </div>
      </section>

      {/* Wizard */}
      <section className="bg-cream min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-6">
          <BookingWizard
            services={(services ?? []) as Service[]}
            stylists={(stylists ?? []) as Stylist[]}
          />
        </div>
      </section>

      <Footer />
      <WhatsAppFAB />
    </>
  )
}
