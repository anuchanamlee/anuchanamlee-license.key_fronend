import Link from "next/link"
import {
  LayoutDashboard,
  CalendarCheck2,
  Users,
  Receipt,
  ScanEye,
  MessageSquareCode,
  ListChecks,
  CalendarSearch,
} from "lucide-react"

const NAV = [
  { href: "/keepkeen", label: "Overview", icon: LayoutDashboard },
  { href: "/keepkeen/slots", label: "Slot Finder", icon: CalendarSearch },
  { href: "/keepkeen/bookings", label: "Bookings", icon: CalendarCheck2 },
  { href: "/keepkeen/customers", label: "Customers", icon: Users },
  { href: "/keepkeen/payments", label: "Payments", icon: Receipt },
  { href: "/keepkeen/cases", label: "Cases (Vision)", icon: ScanEye },
  { href: "/keepkeen/prompts", label: "AI Prompts", icon: MessageSquareCode },
  { href: "/keepkeen/services", label: "Services", icon: ListChecks },
]

export default function KeepKeenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="w-60 shrink-0 border-r bg-white">
        <div className="px-5 py-5 border-b">
          <p className="text-lg font-bold tracking-tight">🌿 KeepKeen</p>
          <p className="text-xs text-slate-500">Admin Console</p>
        </div>
        <nav className="p-3 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                <Icon size={16} className="opacity-70" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
      <main className="flex-1 px-8 py-6 overflow-x-auto">{children}</main>
    </div>
  )
}
