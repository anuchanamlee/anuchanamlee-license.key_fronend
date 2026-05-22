import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.LICENSE_API_URL ?? "https://license-api-seven-mocha.vercel.app"
const ADMIN_SECRET = process.env.ADMIN_SECRET

export async function PATCH(req: NextRequest) {
  if (!ADMIN_SECRET) {
    return NextResponse.json({ message: "Server misconfigured: ADMIN_SECRET not set" }, { status: 500 })
  }
  const body = await req.json()
  const res = await fetch(`${API_URL}/license/revoke`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": ADMIN_SECRET,
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
