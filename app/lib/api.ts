export type SystemType = "FISHING" | "CAPTCHA"

export interface LicenseKey {
  key: string
  note: string
  days: number
  created_at: string
  expires_at: string
  hwid: string | null
  revoked: boolean
  system_type: SystemType
}
export interface CreateResult {
  key: string
  expires_at: string
  note: string
  system_type: SystemType
}

function secret() {
  const stored = typeof window !== "undefined" ? localStorage.getItem("api_secret") : ""
  return stored || "X7kmP2$qR9vLw4NjZtYsB6hCeKdFuA3"
}

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("api_url") || "https://license-api-seven-mocha.vercel.app/license"
  }
  return "https://license-api-seven-mocha.vercel.app/license"
}

async function req<T>(path: string, init: RequestInit = {}, includeSecret: boolean = true): Promise<T> {
  const baseUrl = getBaseUrl()
  const url = baseUrl.endsWith("/") ? baseUrl + path.slice(1) : baseUrl + path
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> ?? {}),
  }
  
  if (includeSecret) {
    headers["x-admin-secret"] = secret()
  }
  
  const res = await fetch(url, {
    ...init,
    headers,
  })
  
  if (res.status === 401) throw new Error("Admin secret ไม่ถูกต้อง (401)")
  if (res.status === 403) throw new Error("ไม่มีสิทธิ์เข้าถึง (403)")
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try { const d = await res.json(); msg = d.message ?? msg } catch {}
    throw new Error(msg)
  }
  return res.json()
}

export const api = {
  list: () => req<LicenseKey[]>("/list"),
  create: (days: number, note: string, system_type: SystemType) => 
    req<CreateResult>("/create", {
      method: "POST",
      body: JSON.stringify({ days, note, system_type }),
    }, true),
  revoke: (key: string) => req<{ revoked: boolean; key: string }>("/revoke", {
    method: "POST",
    body: JSON.stringify({ key }),
  }, true),
  validate: (key: string, hwid: string, system_type: SystemType) =>
    req<{ valid: boolean; message: string }>("/validate", {
      method: "POST",
      body: JSON.stringify({ key, hwid, system_type }),
    }, false),
}