"use client"
import { useState, useMemo } from "react"
import { mockBookings, type Booking } from "@/lib/keepkeen-mock"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarSearch } from "lucide-react"
import Link from "next/link"

const SLOTS = ["morning", "afternoon"] as const
type SlotKey = typeof SLOTS[number]
const SLOT_LABEL: Record<SlotKey, string> = { morning: "เช้า (08–12)", afternoon: "บ่าย (13–17)" }
const MAX_PER_SLOT = 3

function getDateRange(base: Date, days = 14): Date[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(base)
    d.setDate(d.getDate() + i)
    return d
  })
}

function fmt(d: Date) {
  return d.toISOString().slice(0, 10)
}

function dayLabel(d: Date) {
  return d.toLocaleDateString("th-TH", { weekday: "short", day: "numeric", month: "short" })
}

function slotColor(count: number) {
  if (count === 0) return "bg-emerald-50 border-emerald-200 text-emerald-700"
  if (count < MAX_PER_SLOT) return "bg-amber-50 border-amber-200 text-amber-700"
  return "bg-rose-50 border-rose-200 text-rose-700"
}

function slotLabel(count: number) {
  if (count === 0) return "ว่าง"
  if (count < MAX_PER_SLOT) return `${count}/${MAX_PER_SLOT}`
  return "เต็ม"
}

const ACTIVE_STATUSES = new Set(["confirmed", "awaiting_team_confirmation", "awaiting_slip", "qr_sent"])

export default function SmartSlotFinder() {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [weekOffset, setWeekOffset] = useState(0)
  const [selected, setSelected] = useState<{ date: string; slot: SlotKey } | null>(null)

  const dates = useMemo(() => {
    const base = new Date(today)
    base.setDate(base.getDate() + weekOffset * 7)
    return getDateRange(base, 7)
  }, [today, weekOffset])

  // bookingMap[date][slot] = active bookings
  const bookingMap = useMemo(() => {
    const map: Record<string, Record<SlotKey, Booking[]>> = {}
    for (const b of mockBookings) {
      if (!ACTIVE_STATUSES.has(b.booking_status)) continue
      const slot = b.preferred_time as SlotKey
      if (!SLOTS.includes(slot)) continue
      if (!map[b.preferred_date]) map[b.preferred_date] = { morning: [], afternoon: [] }
      map[b.preferred_date][slot].push(b)
    }
    return map
  }, [])

  const selectedBookings = selected
    ? (bookingMap[selected.date]?.[selected.slot] ?? [])
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarSearch size={22} className="text-emerald-600" />
          Smart Slot Finder
        </h1>
        <p className="text-sm text-slate-500">ดูความว่างของ time slot — คลิก slot เพื่อดู bookings</p>
      </div>

      {/* Week navigator */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => setWeekOffset((w) => w - 1)}>
          <ChevronLeft size={16} />
        </Button>
        <span className="text-sm font-medium text-slate-700">
          {dayLabel(dates[0])} — {dayLabel(dates[6])}
        </span>
        <Button variant="outline" size="sm" onClick={() => setWeekOffset((w) => w + 1)}>
          <ChevronRight size={16} />
        </Button>
        {weekOffset !== 0 && (
          <Button variant="ghost" size="sm" className="text-slate-500" onClick={() => setWeekOffset(0)}>
            กลับสัปดาห์นี้
          </Button>
        )}
      </div>

      {/* Slot grid */}
      <Card>
        <CardContent className="pt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="text-left text-slate-500 font-medium pb-3 pr-4 w-28">Slot</th>
                {dates.map((d) => {
                  const isToday = fmt(d) === fmt(today)
                  return (
                    <th key={fmt(d)} className={`text-center pb-3 px-2 font-medium text-xs ${isToday ? "text-emerald-700" : "text-slate-600"}`}>
                      {dayLabel(d)}
                      {isToday && <div className="text-[10px] text-emerald-600 font-normal">วันนี้</div>}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {SLOTS.map((slot) => (
                <tr key={slot} className="border-t border-slate-100">
                  <td className="py-3 pr-4 text-xs text-slate-500 font-medium">{SLOT_LABEL[slot]}</td>
                  {dates.map((d) => {
                    const dateStr = fmt(d)
                    const count = bookingMap[dateStr]?.[slot]?.length ?? 0
                    const isSelected = selected?.date === dateStr && selected?.slot === slot
                    return (
                      <td key={dateStr} className="py-2 px-2 text-center">
                        <button
                          onClick={() => setSelected(isSelected ? null : { date: dateStr, slot })}
                          className={`w-full rounded-md border px-2 py-2 text-xs font-semibold transition-all ${slotColor(count)} ${isSelected ? "ring-2 ring-slate-400" : "hover:opacity-80"}`}
                        >
                          {slotLabel(count)}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Selected slot detail */}
      {selected && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              {selected.date} · {SLOT_LABEL[selected.slot]}
              {" — "}
              {selectedBookings.length === 0
                ? "ว่าง (0 bookings)"
                : `${selectedBookings.length} booking${selectedBookings.length > 1 ? "s" : ""}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedBookings.length === 0 ? (
              <p className="text-sm text-slate-400">ไม่มี booking ที่ active ใน slot นี้</p>
            ) : (
              <div className="space-y-2">
                {selectedBookings.map((b) => (
                  <div key={b.booking_ref} className="flex items-center justify-between rounded-md border border-slate-100 bg-white px-4 py-3 text-sm">
                    <div>
                      <span className="font-mono text-xs font-medium text-slate-600">{b.booking_ref}</span>
                      <span className="mx-2 text-slate-300">·</span>
                      <span className="font-medium">{b.customer_name}</span>
                      <span className="mx-2 text-slate-300">·</span>
                      <span className="text-slate-500">{b.service_main}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">{b.booking_status}</Badge>
                      <Link href={`/keepkeen/bookings/${b.booking_ref}`} className="text-xs text-emerald-600 hover:underline">
                        ดูรายละเอียด
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <div className="flex gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-200 inline-block" />ว่าง</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-200 inline-block" />มีบางส่วน</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-200 inline-block" />เต็ม ({MAX_PER_SLOT} slots)</span>
      </div>
    </div>
  )
}
