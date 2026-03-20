"use client"
import { useEffect, useState } from "react"
import { api, LicenseKey } from "../lib/api"
import SettingsBar from "../components/SettingsBar"
import StatusBadge from "../components/StatusBadge"
import { useToast } from "../components/Toast"

export default function DashboardPage() {
  const [keys,    setKeys]    = useState<LicenseKey[]>([])
  const [loading, setLoading] = useState(false)
  const [errMsg,  setErrMsg]  = useState("")
  const { toast } = useToast()

  async function load() {
    setLoading(true); setErrMsg("")
    try   { setKeys(await api.list()) }
    catch (e: unknown) { const m = (e as Error).message; setErrMsg(m); toast(m, "error") }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const today   = new Date().toISOString().slice(0, 10)
  const active  = keys.filter(r => !r.revoked && r.expires_at >= today).length
  const revoked = keys.length - active

  return (
    <div>
      <SettingsBar />
      <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Dashboard</p>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>ภาพรวมการใช้งาน License</p>

      {errMsg && <div className="err-banner">⚠️ {errMsg}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { val: keys.length, lbl: "Key ทั้งหมด",      color: "var(--accent)"  },
          { val: active,      lbl: "ใช้งานได้",          color: "var(--success)" },
          { val: revoked,     lbl: "ยกเลิก / หมดอายุ", color: "var(--error)"   },
        ].map(s => (
          <div key={s.lbl} className="card" style={{ marginBottom: 0 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{loading ? "—" : s.val}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">Key ล่าสุด</div>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead><tr>{["Key","Note","หมดอายุ","HWID","สถานะ"].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}>⏳ กำลังโหลด...</td></tr>
              ) : keys.slice(0,10).length ? keys.slice(0,10).map(r => (
                <tr key={r.key}>
                  <td><span className="key-mono">{r.key}</span></td>
                  <td>{r.note || "—"}</td>
                  <td>{r.expires_at}</td>
                  <td><span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)" }}>{r.hwid ? r.hwid.slice(0,8)+"…" : "—"}</span></td>
                  <td><StatusBadge row={r} /></td>
                </tr>
              )) : (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}>ยังไม่มี Key</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 14 }}>
          <button className="btn btn-ghost" onClick={load} disabled={loading}>🔄 รีเฟรช</button>
        </div>
      </div>
    </div>
  )
}