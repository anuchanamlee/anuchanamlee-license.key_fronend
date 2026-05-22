import { NextResponse } from "next/server"

const API_URL = process.env.LICENSE_API_URL ?? "https://license-api-seven-mocha.vercel.app"
const ADMIN_SECRET = process.env.ADMIN_SECRET

export async function GET() {
  if (!ADMIN_SECRET) {
    return NextResponse.json({ message: "Server misconfigured: ADMIN_SECRET not set" }, { status: 500 })
  }
  const res = await fetch(`${API_URL}/license/list`, {
    headers: { "x-admin-secret": ADMIN_SECRET },
    cache: "no-store",
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
