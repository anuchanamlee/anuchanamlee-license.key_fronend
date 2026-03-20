export interface LicenseKey {
  key: string; note: string; days: number
  created_at: string; expires_at: string
  hwid: string | null; revoked: boolean
}
export interface CreateResult { key: string; expires_at: string; note: string }

function secret() {
  return typeof window !== "undefined" ? (localStorage.getItem("api_secret") ?? "") : ""
}

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch("/api/proxy" + path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": secret(),
      ...(init.headers ?? {}),
    },
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
  list:   ()                           => req<LicenseKey[]>("/admin/list"),
  create: (days: number, note: string) => req<CreateResult>("/admin/create", {
    method: "POST", body: JSON.stringify({ days, note }),
  }),
  revoke: (key: string) => req<{ revoked: boolean; key: string }>("/admin/revoke", {
    method: "POST", body: JSON.stringify({ key }),
  }),
}