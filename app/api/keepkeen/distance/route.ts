import { NextRequest, NextResponse } from "next/server"
import { getDrivingDistance, geocodeAddress } from "@/lib/ors"

// Service base location (configurable via env)
const BASE_LAT = Number(process.env.SERVICE_BASE_LAT ?? "13.756")
const BASE_LNG = Number(process.env.SERVICE_BASE_LNG ?? "100.501")

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address")
  if (!address) {
    return NextResponse.json({ error: "address param required" }, { status: 400 })
  }

  if (!process.env.ORS_API_KEY) {
    return NextResponse.json({ error: "ORS_API_KEY not configured" }, { status: 503 })
  }

  const dest = await geocodeAddress(address)
  if (!dest) {
    return NextResponse.json({ error: "Could not geocode address" }, { status: 422 })
  }

  const result = await getDrivingDistance({ lat: BASE_LAT, lng: BASE_LNG }, dest)
  return NextResponse.json({ ...result, dest })
}
