"use client"
import { useEffect, useState } from "react"
import { api } from "../lib/api"
import { useToast } from "./Toast"

type Status = "idle" | "ok" | "err" | "loading"

export default function SettingsBar() {
  const [url,    setUrl]    = useState("")
  const [secret, setSecret] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [label,  setLabel]  = useState("ยังไม่ได้เชื่อมต่อ")
  const { toast } = useToast()

  useEffect(() => {
    setUrl(localStorage.getItem("api_url") || "https://license-api-seven-mocha.vercel.app")
    setSecret(localStorage.getItem("api_secret") || "X7kmP2$qR9vLw4NjZtYsB6hCeKdFuA3")
  }, [])

  async function save() {
    localStorage.setItem("api_url", url.trim().replace(/\/$/, ""))
    localStorage.setItem("api_secret", secret.trim())
    setStatus("loading"); setLabel("กำลังทดสอบ...")
    try {
      const data = await api.list()
      setStatus("ok"); setLabel(`เชื่อมต่อแล้ว (${data.length} keys)`)
      toast("เชื่อมต่อสำเร็จ ✓", "success")
    } catch (e: unknown) {
      setStatus("err"); setLabel("เชื่อมต่อไม่ได้")
      toast((e as Error).message, "error")
    }
  }

  const dotColor = status === "ok" ? "var(--success)" : status === "err" ? "var(--error)" : status === "loading" ? "var(--warning)" : "var(--muted)"
  const lblColor = status === "ok" ? "var(--success)" : status === "err" ? "var(--error)" : "var(--muted)"

  return (
    <div className="card" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "14px 18px", marginBottom: 28 }}>
      <label style={{ fontSize: 12, color: "var(--muted)", whiteSpace: "nowrap" }}>API URL</label>
      <input className="input" style={{ flex: 1, minWidth: 200 }} value={url} onChange={e => setUrl(e.target.value)} />

      <label style={{ fontSize: 12, color: "var(--muted)", whiteSpace: "nowrap" }}>Admin Secret</label>
      <input className="input" type="password"
        style={{ maxWidth: 180, fontFamily: "monospace", letterSpacing: 2 }}
        value={secret} onChange={e => setSecret(e.target.value)}
        onKeyDown={e => e.key === "Enter" && save()}
        placeholder="รหัสผ่าน admin" />

      <button className="btn btn-primary" onClick={save} disabled={status === "loading"}>
        บันทึก &amp; ทดสอบ
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor, display: "inline-block" }} />
        <span style={{ color: lblColor }}>{label}</span>
      </div>
    </div>
  )
}