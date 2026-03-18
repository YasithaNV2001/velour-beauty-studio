"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"
import {
  LayoutDashboard,
  CalendarDays,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: "true" }>
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Appointments", href: "/admin/appointments", icon: CalendarDays },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-plum" aria-label="Admin navigation">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-white/10">
        <Link href="/admin" aria-label="Velour admin dashboard home">
          <span className="font-serif text-2xl font-semibold text-gold tracking-wide">
            Velour
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Main menu">
        <ul role="list" className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    "border-l-2",
                    isActive
                      ? "border-gold bg-white/10 text-gold"
                      : "border-transparent text-white/60 hover:border-white/30 hover:bg-white/5 hover:text-white/90"
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-4 shrink-0 transition-colors",
                      isActive ? "text-gold" : "text-white/50 group-hover:text-white/80"
                    )}
                    aria-hidden="true"
                  />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Sign out */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 transition-all hover:bg-white/5 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
          aria-label="Sign out of admin dashboard"
        >
          <LogOut className="size-4 shrink-0" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
