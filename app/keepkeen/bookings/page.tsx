import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getBookings } from "@/lib/keepkeen-data"
import { ChevronRight } from "lucide-react"

const STATUS_TONE: Record<string, string> = {
  awaiting_team_confirmation: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  awaiting_slip: "bg-cyan-100 text-cyan-800",
  qr_sent: "bg-cyan-100 text-cyan-800",
  qr_expired: "bg-rose-100 text-rose-700",
  paid: "bg-emerald-100 text-emerald-800",
  completed: "bg-slate-100 text-slate-700",
  cancelled: "bg-rose-100 text-rose-700",
  escalated: "bg-rose-100 text-rose-700",
}

export default async function BookingsPage() {
  const bookings = await getBookings()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-sm text-slate-500">{bookings.length} rows</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Filter</Button>
          <Button variant="outline" size="sm">Export CSV</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">📋 All Bookings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500 bg-slate-50 border-y">
              <tr>
                <th className="px-4 py-2.5 font-medium">Ref</th>
                <th className="px-4 py-2.5 font-medium">ลูกค้า</th>
                <th className="px-4 py-2.5 font-medium">บริการ</th>
                <th className="px-4 py-2.5 font-medium">Add-ons</th>
                <th className="px-4 py-2.5 font-medium">ยอดรวม</th>
                <th className="px-4 py-2.5 font-medium">ค้างจ่าย</th>
                <th className="px-4 py-2.5 font-medium">วัน-เวลา</th>
                <th className="px-4 py-2.5 font-medium">สถานะ</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.booking_ref} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono text-xs">{b.booking_ref}</td>
                  <td className="px-4 py-2.5">
                    <div className="font-medium">{b.customer_name}</div>
                    <div className="text-xs text-slate-500">{b.phone}</div>
                  </td>
                  <td className="px-4 py-2.5">{b.service_main}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-600 max-w-[200px] truncate">{b.service_addons || "-"}</td>
                  <td className="px-4 py-2.5 font-medium">฿{b.total_price.toLocaleString()}</td>
                  <td className="px-4 py-2.5">
                    {b.balance_due > 0 ? <span className="text-rose-600">฿{b.balance_due.toLocaleString()}</span> : <span className="text-slate-400">-</span>}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">
                    <div>{b.preferred_date}</div>
                    <div className="text-xs text-slate-400">{b.preferred_time}</div>
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge className={STATUS_TONE[b.booking_status] || "bg-slate-100"}>{b.booking_status}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Link href={`/keepkeen/bookings/${b.booking_ref}`} className="text-slate-400 hover:text-slate-700 inline-flex">
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
