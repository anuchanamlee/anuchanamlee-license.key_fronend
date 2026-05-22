/**
 * OpenRouteService driving-distance helper.
 * Requires ORS_API_KEY env var (free key from openrouteservice.org).
 *
 * Usage:
 *   const result = await getDrivingDistance(
 *     { lat: 13.756, lng: 100.501 },  // origin (e.g. service base)
 *     { lat: 13.742, lng: 100.553 }   // destination (customer address)
 *   )
 */

const ORS_BASE = "https://api.openrouteservice.org/v2"

export interface Coord {
  lat: number
  lng: number
}

export interface DistanceResult {
  distanceKm: number
  durationMin: number
}

export async function getDrivingDistance(origin: Coord, dest: Coord): Promise<DistanceResult> {
  const apiKey = process.env.ORS_API_KEY
  if (!apiKey) throw new Error("ORS_API_KEY env var not set")

  const res = await fetch(`${ORS_BASE}/directions/driving-car`, {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coordinates: [
        [origin.lng, origin.lat],
        [dest.lng, dest.lat],
      ],
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`ORS error ${res.status}: ${text}`)
  }

  const data = (await res.json()) as {
    routes: Array<{ summary: { distance: number; duration: number } }>
  }

  const summary = data.routes[0]?.summary
  if (!summary) throw new Error("ORS returned no routes")

  return {
    distanceKm: Math.round((summary.distance / 1000) * 10) / 10,
    durationMin: Math.round(summary.duration / 60),
  }
}

export async function geocodeAddress(address: string): Promise<Coord | null> {
  const apiKey = process.env.ORS_API_KEY
  if (!apiKey) return null

  const params = new URLSearchParams({
    api_key: apiKey,
    text: address,
    "boundary.country": "TH",
    size: "1",
  })

  const res = await fetch(`${ORS_BASE.replace("/v2", "")}/geocode/search?${params}`)
  if (!res.ok) return null

  const data = (await res.json()) as {
    features: Array<{ geometry: { coordinates: [number, number] } }>
  }

  const coords = data.features[0]?.geometry?.coordinates
  if (!coords) return null

  return { lat: coords[1], lng: coords[0] }
}
