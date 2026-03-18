"use client"

import { motion } from "framer-motion"
import {
  CalendarCheck,
  CalendarRange,
  Clock,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCard {
  label: string
  value: string | number
  icon: LucideIcon
  iconBg: string
  iconColor: string
  description?: string
}

interface StatsCardsProps {
  todayCount: number
  weekCount: number
  pendingCount: number
  monthlyRevenue: number
}

export function StatsCards({
  todayCount,
  weekCount,
  pendingCount,
  monthlyRevenue,
}: StatsCardsProps) {
  const cards: StatCard[] = [
    {
      label: "Today's Bookings",
      value: todayCount,
      icon: CalendarCheck,
      iconBg: "bg-plum/10",
      iconColor: "text-plum",
      description: "appointments scheduled today",
    },
    {
      label: "This Week",
      value: weekCount,
      icon: CalendarRange,
      iconBg: "bg-gold/10",
      iconColor: "text-gold",
      description: "bookings this week",
    },
    {
      label: "Pending Approval",
      value: pendingCount,
      icon: Clock,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
      description: "awaiting confirmation",
    },
    {
      label: "Monthly Revenue",
      value: `LKR ${monthlyRevenue.toLocaleString()}`,
      icon: TrendingUp,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      description: "confirmed revenue this month",
    },
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {cards.map((card) => (
        <motion.div
          key={card.label}
          variants={cardVariants}
          className="bg-white rounded-xl border border-cream-dark p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-plum/50 uppercase tracking-wider font-sans">
                {card.label}
              </p>
              <p
                className={cn(
                  "mt-1.5 font-serif font-semibold text-plum truncate",
                  typeof card.value === "number" ? "text-3xl" : "text-xl"
                )}
              >
                {card.value}
              </p>
              {card.description && (
                <p className="mt-1 text-xs text-plum/40 font-sans">
                  {card.description}
                </p>
              )}
            </div>
            <div
              className={cn(
                "flex items-center justify-center size-11 rounded-xl shrink-0 ml-3",
                card.iconBg
              )}
              aria-hidden="true"
            >
              <card.icon className={cn("size-5", card.iconColor)} />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
