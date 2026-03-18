import { createClient } from "@/lib/supabase/server"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import WhatsAppFAB from "@/components/layout/WhatsAppFAB"
import HeroSection from "@/components/home/HeroSection"
import ServicesPreview from "@/components/home/ServicesPreview"
import GalleryPreview from "@/components/home/GalleryPreview"
import TeamSection from "@/components/home/TeamSection"
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel"
import CTASection from "@/components/home/CTASection"
import type { Service, GalleryItem, Stylist, Testimonial } from "@/lib/supabase/types"

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: services }, { data: gallery }, { data: stylists }, { data: testimonials }] =
    await Promise.all([
      supabase.from("services").select("*").eq("is_active", true).order("display_order").limit(6),
      supabase.from("gallery_items").select("*").eq("is_active", true).order("display_order").limit(6),
      supabase.from("stylists").select("*").eq("is_active", true).order("display_order"),
      supabase.from("testimonials").select("*").eq("is_featured", true).eq("is_active", true).order("display_order"),
    ])

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesPreview services={(services ?? []) as Service[]} />
        <GalleryPreview items={(gallery ?? []) as GalleryItem[]} />
        <TeamSection stylists={(stylists ?? []) as Stylist[]} />
        <TestimonialsCarousel testimonials={(testimonials ?? []) as Testimonial[]} />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  )
}
