export type SystemType = "FISHING" | "CAPTCHA"

export const DEFAULT_API_URL = "https://license-api-seven-mocha.vercel.app"
export const DEFAULT_SECRET = "X7kmP2$qR9vLw4NjZtYsB6hCeKdFuA3"

export interface LicenseKey {
  key: string
  note: string
  days: number
  created_at: string
  expires_at: string | null
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

export function getStoredSecret() {
  if (typeof window === "undefined") return DEFAULT_SECRET
  return localStorage.getItem("api_secret") || DEFAULT_SECRET
}

export function getStoredApiUrl() {
  if (typeof window === "undefined") return DEFAULT_API_URL
  return localStorage.getItem("api_url") || DEFAULT_API_URL
}

async function req<T>(path: string, init: RequestInit = {}, includeSecret: boolean = true): Promise<T> {
  const baseUrl = getStoredApiUrl()
  const url = baseUrl.endsWith("/") ? baseUrl + path.slice(1) : baseUrl + path
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> ?? {}),
  }

  if (includeSecret) {
    headers["x-admin-secret"] = getStoredSecret()
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
  list: () => req<LicenseKey[]>("/license/list"),
  create: (days: number, note: string, system_type: SystemType) =>
    req<CreateResult>("/license/create", {
      method: "POST",
      body: JSON.stringify({ days, note, system_type }),
    }),
  revoke: (key: string) => req<{ revoked: boolean; key: string }>("/license/revoke", {
    method: "PATCH",
    body: JSON.stringify({ key }),
  }, true),
  validate: (key: string, hwid: string, system_type: SystemType) =>
    req<{ valid: boolean; message: string }>("/license/validate", {
      method: "POST",
      body: JSON.stringify({ key, hwid, system_type }),
    }, false),
}