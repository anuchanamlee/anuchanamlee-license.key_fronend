"use client"
import { useEffect, useState } from "react"
import { api, LicenseKey } from "../lib/api"
import SettingsBar from "../components/SettingsBar"
import StatusBadge from "../components/StatusBadge"
import { useToast } from "../components/Toast"

export default function KeysPage() {
  const [allKeys,  setAllKeys]  = useState<LicenseKey[]>([])
  const [filtered, setFiltered] = useState<LicenseKey[]>([])
  const [loading,  setLoading]  = useState(false)
  const [search,   setSearch]   = useState("")
  const { toast } = useToast()

  async function load() {
    setLoading(true)
    try { const data = await api.list(); setAllKeys(data); setFiltered(data) }
    catch (e: unknown) { toast((e as Error).message, "error") }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(allKeys.filter(r =>
      r.key.toLowerCase().includes(q) ||
      (r.note ?? "").toLowerCase().includes(q) ||
      (r.hwid ?? "").toLowerCase().includes(q)
    ))
  }, [search, allKeys])

  async function revoke(key: string) {
    if (!confirm(`ยืนยันยกเลิก Key นี้?\n\n${key}`)) return
    try { await api.revoke(key); toast(`ยกเลิก ${key} แล้ว ✓`, "success"); load() }
    catch (e: unknown) { toast((e as Error).message, "error") }
  }

  return (
    <div>
      <SettingsBar />
      <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>รายการ Key ทั้งหมด</p>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>จัดการและยกเลิก License Key</p>

      <div className="card">
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input className="input" style={{ flex: 1 }} placeholder="ค้นหา Key, Note, HWID..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn btn-ghost" onClick={load} disabled={loading}>🔄 โหลด</button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead><tr>{["Key","Note","วันที่สร้าง","หมดอายุ","HWID","สถานะ",""].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}>⏳ กำลังโหลด...</td></tr>
              ) : filtered.length ? filtered.map(r => (
                <tr key={r.key}>
                  <td>
                    <span className="key-mono">{r.key}</span>
                    <button className="copy-btn" title="คัดลอก"
                      onClick={() => { navigator.clipboard.writeText(r.key); toast("คัดลอกแล้ว ✓", "success") }}>📋</button>
                  </td>
                  <td>{r.note || "—"}</td>
                  <td>{r.created_at || "—"}</td>
                  <td>{r.expires_at}</td>
                  <td><span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)" }}>{r.hwid ? r.hwid.slice(0,8)+"…" : "—"}</span></td>
                  <td><StatusBadge row={r} /></td>
                  <td>
                    {!r.revoked
                      ? <button className="btn btn-danger btn-sm" onClick={() => revoke(r.key)}>ยกเลิก</button>
                      : <span style={{ fontSize: 12, color: "var(--muted)" }}>—</span>}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}>ไม่มีข้อมูล</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}