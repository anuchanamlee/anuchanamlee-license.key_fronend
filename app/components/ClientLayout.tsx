"use client"

import type { CSSProperties, ReactNode } from "react"
import { useState } from "react"
import Sidebar from "./Sidebar"
import { ToastProvider } from "./Toast"

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false
    return localStorage.getItem("sidebar_collapsed") === "true"
  })

  function handleCollapsedChange(next: boolean) {
    setCollapsed(next)
    localStorage.setItem("sidebar_collapsed", String(next))
  }

  const shellStyle = {
    "--layout-sidebar-offset": collapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-w)",
  } as CSSProperties

  return (
    <ToastProvider>
      <div className="app-shell" style={shellStyle}>
        <Sidebar collapsed={collapsed} onCollapsedChange={handleCollapsedChange} />
        <div className="app-shell-content">
          <main className="page-shell">{children}</main>
        </div>
      </div>
    </ToastProvider>
  )
}
