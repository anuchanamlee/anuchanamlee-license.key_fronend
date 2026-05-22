"use server"

const N8N_BASE = process.env.N8N_WEBHOOK_BASE_URL ?? ""
const N8N_SECRET = process.env.N8N_WEBHOOK_SECRET ?? ""

async function callN8n(path: string, body: Record<string, unknown>) {
  if (!N8N_BASE) {
    return { ok: false, message: "N8N_WEBHOOK_BASE_URL not configured" }
  }
  try {
    const res = await fetch(`${N8N_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(N8N_SECRET ? { "x-webhook-secret": N8N_SECRET } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    })
    if (!res.ok) return { ok: false, message: `n8n error ${res.status}` }
    return { ok: true, message: "สำเร็จ" }
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Network error" }
  }
}

export async function confirmBooking(bookingRef: string) {
  return callN8n("/webhook/admin/confirm", { booking_ref: bookingRef, action: "confirm" })
}

export async function releaseBooking(bookingRef: string) {
  return callN8n("/webhook/admin/release", { booking_ref: bookingRef, action: "release" })
}

export async function replyToCustomer(bookingRef: string, lineUserId: string, message: string) {
  return callN8n("/webhook/admin/reply", { booking_ref: bookingRef, line_user_id: lineUserId, message })
}

export async function regenerateQr(bookingRef: string) {
  return callN8n("/webhook/admin/regenerate-qr", { booking_ref: bookingRef, action: "regenerate_qr" })
}
