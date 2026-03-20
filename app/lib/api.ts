export interface LicenseKey {
  key: string; note: string; days: number
  created_at: string; expires_at: string
  hwid: string | null; revoked: boolean
}
export interface CreateResult { key: string; expires_at: string; note: string }

const BACKENDS = [
  "https://license-api-seven-mocha.vercel.app",
  "https://license-api-git-master-anucha-namlees-projects.vercel.app",
  "https://license-kuwekcamn-anucha-namlees-projects.vercel.app",
]

function secret() {
  return typeof window !== "undefined" ? (localStorage.getItem("api_secret") ?? "") : ""
}

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  let lastError = ""

  for (const base of BACKENDS) {
    try {
      const res = await fetch(base + path, {
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

    } catch (e: unknown) {
      const msg = (e as Error).message
      // ถ้า error เป็น auth/permission — หยุดเลย ไม่ต้องลอง backend อื่น
      if (msg.includes("401") || msg.includes("403")) throw e
      // backend นี้ล่ม ลองอันต่อไป
      lastError = msg
      continue
    }
  }

  throw new Error("ทุก backend ไม่ตอบสนอง: " + lastError)
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