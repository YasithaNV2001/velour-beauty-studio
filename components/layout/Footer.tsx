import Link from "next/link"
import { Instagram, Facebook, MapPin, Phone, Clock } from "lucide-react"

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "94771234567"

  return (
    <footer className="bg-plum-dark text-cream/80">
      {/* Google Maps embed */}
      <div className="w-full h-56 bg-plum/50">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.80388607415!2d79.82119!3d6.92148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2003%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1700000000000"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "grayscale(30%) opacity(0.85)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Velour Beauty Studio location"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <div className="mb-4">
              <span className="font-serif text-3xl font-light tracking-widest text-cream">VELOUR</span>
              <div className="text-gold text-[10px] tracking-[0.3em] uppercase mt-1">Beauty Studio</div>
            </div>
            <p className="text-sm leading-relaxed text-cream/60 max-w-xs">
              Where beauty meets artistry. Experience luxury salon services crafted for the modern Sri Lankan woman.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/velourbeautystudio"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-cream/60 hover:text-gold transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com/velourbeautystudio"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="text-cream/60 hover:text-gold transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="text-cream/60 hover:text-gold transition-colors"
              >
                <Phone size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-cream font-semibold tracking-widest text-xs uppercase mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "Services & Pricing" },
                { href: "/gallery", label: "Gallery" },
                { href: "/booking", label: "Book Appointment" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-cream font-semibold tracking-widest text-xs uppercase mb-6">Visit Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                <span>123 Galle Road, Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="text-gold mt-0.5 shrink-0" />
                <a href={`https://wa.me/${whatsappNumber}`} className="hover:text-gold transition-colors">
                  +94 77 123 4567
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={16} className="text-gold mt-0.5 shrink-0" />
                <div>
                  <div>Mon – Fri: 9:00 AM – 7:00 PM</div>
                  <div>Saturday: 9:00 AM – 5:00 PM</div>
                  <div className="text-cream/40">Sunday: Closed</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-12 pt-8 text-center text-xs text-cream/30 tracking-widest">
          © {new Date().getFullYear()} Velour Beauty Studio. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
