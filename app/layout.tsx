import type { Metadata } from "next"
import { Inter, Cormorant_Garamond } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Velour Beauty Studio | Luxury Salon in Colombo",
  description:
    "Experience the elegance of Velour Beauty Studio. Premium hair, skin, nails and bridal services in Colombo, Sri Lanka. Book your appointment today.",
  openGraph: {
    title: "Velour Beauty Studio",
    description: "Luxury salon services in Colombo, Sri Lanka.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
