"use client"

import { useState } from "react"
import { api, DEFAULT_API_URL, getStoredApiUrl, getStoredSecret } from "../lib/api"
import { useToast } from "./Toast"
import Modal from "./Modal"

type Status = "idle" | "ok" | "err" | "loading"

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [url, setUrl] = useState(getStoredApiUrl)
  const [secret, setSecret] = useState(getStoredSecret)
  const [status, setStatus] = useState<Status>("idle")
  const [label, setLabel] = useState("เธขเธฑเธเนเธกเนเนเธ”เนเธ—เธ”เธชเธญเธ")
  const [showSecret, setShowSecret] = useState(false)
  const { toast } = useToast()

  async function save() {
    localStorage.setItem("api_url", url.trim().replace(/\/$/, ""))
    localStorage.setItem("api_secret", secret.trim())
    setStatus("loading")
    setLabel("เธเธณเธฅเธฑเธเธ—เธ”เธชเธญเธ...")

    try {
      const data = await api.list()
      setStatus("ok")
      setLabel(`เน€เธเธทเนเธญเธกเธ•เนเธญเธชเธณเน€เธฃเนเธ (${data.length} keys)`)
      toast("เน€เธเธทเนเธญเธกเธ•เนเธญ API เธชเธณเน€เธฃเนเธ", "success")
    } catch (e: unknown) {
      setStatus("err")
      setLabel("เน€เธเธทเนเธญเธกเธ•เนเธญเนเธกเนเนเธ”เน")
      toast((e as Error).message, "error")
    }
  }

  const dotClass =
    status === "ok" ? "status-dot-ok" :
    status === "err" ? "status-dot-err" :
    status === "loading" ? "status-dot-loading" : "status-dot-idle"

  return (
    <Modal open={open} onClose={onClose} title="เธ•เธฑเนเธเธเนเธฒเธฃเธฐเธเธ" large>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label className="label">API URL</label>
          <input
            className="input"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder={DEFAULT_API_URL}
          />
        </div>

        <div>
          <label className="label">Admin Secret</label>
          <div style={{ position: "relative" }}>
            <input
              className="input"
              type={showSecret ? "text" : "password"}
              value={secret}
              onChange={e => setSecret(e.target.value)}
              onKeyDown={e => e.key === "Enter" && save()}
              placeholder="เธฃเธซเธฑเธชเธเนเธฒเธ admin"
              style={{ fontFamily: "monospace", letterSpacing: 2, paddingRight: 44 }}
            />
            <button
              onClick={() => setShowSecret(!showSecret)}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: 14,
                padding: "4px 6px",
                borderRadius: 4,
              }}
            >
              {showSecret ? "เธเนเธญเธ" : "เนเธชเธ”เธ"}
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 16px",
            borderRadius: 8,
            background: "var(--bg)",
            border: "1px solid var(--border)",
          }}
        >
          <span className={`status-dot ${dotClass}`} />
          <span
            style={{
              fontSize: 13,
              color: status === "ok" ? "var(--accent)" : status === "err" ? "var(--danger)" : "var(--text-secondary)",
            }}
          >
            {label}
          </span>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn btn-ghost" onClick={onClose}>เธเธดเธ”</button>
          <button className="btn btn-primary" onClick={save} disabled={status === "loading"}>
            {status === "loading" ? "เธเธณเธฅเธฑเธเธ—เธ”เธชเธญเธ..." : "เธเธฑเธเธ—เธถเธเนเธฅเธฐเธ—เธ”เธชเธญเธ"}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default function SettingsBar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="header">
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            System Settings
          </span>
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Configure the license API endpoint and admin secret.
          </span>
        </div>
        <button className="btn btn-ghost" onClick={() => setOpen(true)}>
          Open Settings
        </button>
      </div>
      {open ? <SettingsModal open={open} onClose={() => setOpen(false)} /> : null}
    </>
  )
}
