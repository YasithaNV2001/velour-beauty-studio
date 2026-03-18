import { format } from "date-fns"

interface BookingDetails {
  customerName: string
  customerPhone: string
  serviceName: string
  stylistName: string
  date: string        // ISO date string e.g. "2025-03-20"
  time: string        // "14:00"
  priceLkr: number
}

const salonNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "94771234567"

/** URL a customer clicks after booking — sends their booking details to the salon */
export function buildCustomerConfirmUrl(details: BookingDetails): string {
  const date = format(new Date(details.date), "EEEE, MMMM d yyyy")
  const message =
    `Hi Velour Beauty Studio! I'd like to confirm my appointment:\n\n` +
    `👤 Name: ${details.customerName}\n` +
    `📞 Phone: ${details.customerPhone}\n` +
    `💅 Service: ${details.serviceName}\n` +
    `👩‍🎨 Stylist: ${details.stylistName}\n` +
    `📅 Date: ${date}\n` +
    `🕐 Time: ${details.time}\n` +
    `💰 Price: LKR ${details.priceLkr.toLocaleString()}\n\n` +
    `Please confirm my booking. Thank you!`

  return `https://wa.me/${salonNumber}?text=${encodeURIComponent(message)}`
}

/** URL admin clicks to confirm an appointment to a customer */
export function buildAdminConfirmUrl(details: BookingDetails): string {
  const date = format(new Date(details.date), "EEEE, MMMM d yyyy")
  const message =
    `Hi ${details.customerName}! 🌸\n\n` +
    `Your appointment at Velour Beauty Studio is *confirmed*!\n\n` +
    `💅 Service: ${details.serviceName}\n` +
    `👩‍🎨 Stylist: ${details.stylistName}\n` +
    `📅 Date: ${date}\n` +
    `🕐 Time: ${details.time}\n` +
    `💰 Price: LKR ${details.priceLkr.toLocaleString()}\n\n` +
    `📍 123 Galle Road, Colombo 03\n\n` +
    `See you soon! If you need to reschedule, please let us know 24 hours in advance.`

  return `https://wa.me/${details.customerPhone}?text=${encodeURIComponent(message)}`
}

/** Generic "chat with us" URL for the FAB and hero */
export function buildGeneralEnquiryUrl(): string {
  const message = "Hi! I'd like to book an appointment at Velour Beauty Studio."
  return `https://wa.me/${salonNumber}?text=${encodeURIComponent(message)}`
}
