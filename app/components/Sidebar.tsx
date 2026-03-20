"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV = [
  { href: "/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/create",    icon: "➕", label: "สร้าง Key" },
  { href: "/keys",      icon: "🗂",  label: "รายการ Key" },
]

export default function Sidebar() {
  const path = usePathname()
  return (
    <aside style={{
      position: "fixed", top: 0, left: 0, bottom: 0, width: 220,
      background: "var(--surface)", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column", zIndex: 10,
    }}>
      <div style={{ padding: "24px 20px", borderBottom: "1px solid var(--border)" }}>
        <h1 style={{ fontSize: 16, fontWeight: 700 }}>🔑 License Admin</h1>
        <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Captcha Collector</p>
      </div>
      <nav style={{ padding: "16px 12px", flex: 1 }}>
        {NAV.map(n => {
          const active = path === n.href
          return (
            <Link key={n.href} href={n.href} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 8, fontSize: 13, marginBottom: 2,
              background: active ? "var(--accent)" : "transparent",
              color: active ? "#fff" : "var(--muted)",
              textDecoration: "none", transition: "all .15s",
            }}>
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--muted)" }}>
        License Admin v1.0
      </div>
    </aside>
  )
}