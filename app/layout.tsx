import type { Metadata } from "next"
import "./globals.css"
import Sidebar from "../app/components/Sidebar"
import { ToastProvider } from "../app/components/Toast"

export const metadata: Metadata = {
  title: "License Admin — Captcha Collector",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <ToastProvider>
          <Sidebar />
          <main style={{ marginLeft: 220, padding: 32, minHeight: "100vh" }}>
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  )
}