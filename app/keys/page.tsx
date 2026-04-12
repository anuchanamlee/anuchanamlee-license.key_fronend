"use client"
import { useCallback, useEffect, useMemo, useState } from "react"
import { api, LicenseKey, SystemType } from "../lib/api"
import SettingsBar from "../components/SettingsBar"
import StatusBadge from "../components/StatusBadge"
import { useToast } from "../components/Toast"

export default function KeysPage() {
  const [allKeys, setAllKeys] = useState<LicenseKey[]>([])
  const [loading, setLoading] = useState(false)
  const [search,  setSearch]  = useState("")
  const { toast } = useToast()

  // ── Create key form state ──
  const [showForm, setShowForm]     = useState(false)
  const [formDays, setFormDays]     = useState(30)
  const [formNote, setFormNote]     = useState("")
  const [formSystem, setFormSystem] = useState<SystemType>("CAPTCHA")
  const [creating, setCreating]     = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try { const data = await api.list(); setAllKeys(data) }
    catch (e: unknown) { toast((e as Error).message, "error") }
    finally { setLoading(false) }
  }, [toast])

  useEffect(() => { void load() }, [load])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return allKeys.filter(r =>
      r.key.toLowerCase().includes(q) ||
      (r.note ?? "").toLowerCase().includes(q) ||
      (r.hwid ?? "").toLowerCase().includes(q) ||
      r.system_type.toLowerCase().includes(q)
    )
  }, [search, allKeys])

  async function revoke(key: string) {
    if (!confirm(`ยืนยันยกเลิก Key นี้?\n\n${key}`)) return
    try {
      await api.revoke(key)
      toast(`ยกเลิก ${key} แล้ว ✓`, "success")
      setAllKeys(prev => prev.map(k => k.key === key ? { ...k, revoked: true } : k))
    } catch (e: unknown) { toast((e as Error).message, "error") }
  }

  async function handleCreate() {
    if (formDays < 1 || formDays > 3650) {
      toast("จำนวนวันต้องอยู่ระหว่าง 1–3650", "error")
      return
    }
    setCreating(true)
    try {
      const res = await api.create(formDays, formNote.trim(), formSystem)
      toast(`สร้าง Key สำเร็จ: ${res.key} ✓`, "success")
      setShowForm(false)
      setFormNote("")
      setFormDays(30)
      load()
    } catch (e: unknown) {
      toast((e as Error).message, "error")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <SettingsBar />
      <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>รายการ Key ทั้งหมด</p>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>จัดการและยกเลิก License Key</p>

      {/* ── Create Key Form ── */}
      {showForm && (
        <div className="card" style={{ marginBottom: 16, border: "1px solid var(--accent)" }}>
          <p style={{ fontWeight: 700, marginBottom: 12 }}>สร้าง Key ใหม่</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 12, color: "var(--muted)" }}>ระบบ</label>
              <select
                className="input"
                style={{ minWidth: 140 }}
                value={formSystem}
                onChange={e => setFormSystem(e.target.value as SystemType)}
              >
                <option value="CAPTCHA">🤖 Captcha (CNN)</option>
                <option value="FISHING">🎣 Fishing</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 12, color: "var(--muted)" }}>จำนวนวัน</label>
              <input
                className="input"
                type="number"
                min={1}
                max={3650}
                style={{ width: 100 }}
                value={formDays}
                onChange={e => setFormDays(Number(e.target.value))}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 200 }}>
              <label style={{ fontSize: 12, color: "var(--muted)" }}>โน้ต (ไม่บังคับ)</label>
              <input
                className="input"
                placeholder="ชื่อลูกค้า หรือหมายเหตุ..."
                value={formNote}
                onChange={e => setFormNote(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={handleCreate} disabled={creating}>
              {creating ? "กำลังสร้าง..." : "สร้าง Key"}
            </button>
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>ยกเลิก</button>
          </div>
        </div>
      )}

      <div className="card">
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <input className="input" style={{ flex: 1, minWidth: 200 }} placeholder="ค้นหา Key, Note, HWID..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn btn-ghost" onClick={load} disabled={loading}>🔄 โหลด</button>
          <button
            className="btn btn-primary"
            onClick={() => { setFormSystem("CAPTCHA"); setShowForm(s => !s) }}
          >
            + สร้าง Key
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead><tr>{["Key","Note","ระบบ","วันที่สร้าง","หมดอายุ","HWID","สถานะ",""].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}>⏳ กำลังโหลด...</td></tr>
              ) : filtered.length ? filtered.map(r => (
                <tr key={r.key}>
                  <td>
                    <span className="key-mono">{r.key}</span>
                    <button className="copy-btn" title="คัดลอก"
                      onClick={() => { navigator.clipboard.writeText(r.key); toast("คัดลอกแล้ว ✓", "success") }}>📋</button>
                  </td>
                  <td>{r.note || "—"}</td>
                  <td>
                    <span style={{ fontSize: 12, paddingInline: 6, paddingBlock: 3, borderRadius: 4, background: r.system_type === "FISHING" ? "rgba(100,200,150,.15)" : "rgba(79,142,247,.15)" }}>
                      {r.system_type === "FISHING" ? "🎣 Fishing" : "🤖 Captcha"}
                    </span>
                  </td>
                  <td>{r.created_at || "—"}</td>
                  <td>{r.expires_at || "—"}</td>
                  <td><span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)" }}>{r.hwid ? r.hwid.slice(0,8)+"…" : "—"}</span></td>
                  <td><StatusBadge row={r} /></td>
                  <td>
                    {!r.revoked
                      ? <button className="btn btn-danger btn-sm" onClick={() => revoke(r.key)}>ยกเลิก</button>
                      : <span style={{ fontSize: 12, color: "var(--muted)" }}>—</span>}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}>ไม่มีข้อมูล</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
