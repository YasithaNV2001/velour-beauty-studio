import { createClient } from "@/lib/supabase/server"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import WhatsAppFAB from "@/components/layout/WhatsAppFAB"
import ServiceCategoryTabs from "@/components/services/ServiceCategoryTabs"
import CTASection from "@/components/home/CTASection"
import type { Service } from "@/lib/supabase/types"

export const metadata = {
  title: "Services & Pricing | Velour Beauty Studio",
  description: "Explore our full range of luxury hair, skin, nails, bridal and makeup services with transparent pricing.",
}

export default async function ServicesPage() {
  const supabase = await createClient()

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("display_order")

  return (
    <>
      <Navbar />
      <main>
        {/* Page Hero */}
        <section className="pt-32 pb-16 px-6 bg-plum text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&q=80')" }}
          />
          <div className="relative z-10">
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">What We Offer</p>
            <h1 className="font-serif text-6xl font-light text-cream">Services &amp; Pricing</h1>
            <div className="w-16 h-px bg-gold mx-auto mt-6" />
          </div>
        </section>

        {/* Services tabs + grid */}
        <section className="py-20 px-6 bg-cream min-h-screen">
          <div className="max-w-7xl mx-auto">
            <ServiceCategoryTabs services={(services ?? []) as Service[]} />
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  )
}
