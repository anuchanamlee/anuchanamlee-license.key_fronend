"use client"

import { useEffect, useState } from "react"

interface Props {
  address: string
}

export function DistanceBadge({ address }: Props) {
  const [label, setLabel] = useState<string>("...")

  useEffect(() => {
    if (!address) { setLabel("-"); return }
    fetch(`/api/keepkeen/distance?address=${encodeURIComponent(address)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setLabel("-")
        else setLabel(`${d.distanceKm} km · ${d.durationMin} min`)
      })
      .catch(() => setLabel("-"))
  }, [address])

  return <span className="text-xs text-slate-500">{label}</span>
}
