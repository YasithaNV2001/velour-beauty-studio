import { createClient } from "@/lib/supabase/server"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import WhatsAppFAB from "@/components/layout/WhatsAppFAB"
import GalleryGrid from "@/components/gallery/GalleryGrid"
import CTASection from "@/components/home/CTASection"
import type { GalleryItem } from "@/lib/supabase/types"

export const metadata = {
  title: "Gallery | Velour Beauty Studio",
  description: "See our stunning before & after transformations. Drag the slider to reveal each result.",
}

export default async function GalleryPage() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from("gallery_items")
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
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80')" }}
          />
          <div className="relative z-10">
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Our Work</p>
            <h1 className="font-serif text-6xl font-light text-cream">Before &amp; After</h1>
            <p className="text-cream/60 mt-4 text-sm tracking-wide">
              Drag the slider to reveal each transformation
            </p>
            <div className="w-16 h-px bg-gold mx-auto mt-6" />
          </div>
        </section>

        {/* Gallery grid */}
        <section className="py-20 px-6 bg-cream min-h-screen">
          <div className="max-w-7xl mx-auto">
            <GalleryGrid items={(items ?? []) as GalleryItem[]} />
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  )
}
