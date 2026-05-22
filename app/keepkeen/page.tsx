import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { stats } from "@/lib/keepkeen-mock"
import { getBookings } from "@/lib/keepkeen-data"
import { CalendarCheck2, TrendingUp, AlertCircle, ShieldCheck, Users, QrCode } from "lucide-react"

const STAT_CARDS = [
  { label: "วันนี้ Bookings", value: stats.today_bookings, icon: CalendarCheck2, color: "text-emerald-600" },
  { label: "วันนี้ Revenue", value: `฿${stats.today_revenue.toLocaleString()}`, icon: TrendingUp, color: "text-blue-600" },
  { label: "รอ Admin Review", value: stats.pending_admin, icon: AlertCircle, color: "text-amber-600" },
  { label: "Errors ล่าสุด", value: stats.recent_errors, icon: ShieldCheck, color: "text-rose-600" },
  { label: "ลูกค้าทั้งหมด", value: stats.total_customers, icon: Users, color: "text-violet-600" },
  { label: "QR Active", value: stats.active_qr, icon: QrCode, color: "text-cyan-600" },
]

const STATUS_TONE: Record<string, string> = {
  awaiting_team_confirmation: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  awaiting_slip: "bg-cyan-100 text-cyan-800",
  paid: "bg-emerald-100 text-emerald-800",
  completed: "bg-slate-100 text-slate-700",
  cancelled: "bg-rose-100 text-rose-700",
}

export default async function KeepKeenOverview() {
  const bookings = await getBookings()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-sm text-slate-500">สถานะระบบ KeepKeen ณ ปัจจุบัน</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {STAT_CARDS.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-slate-500 flex items-center gap-2">
                  <Icon size={14} className={s.color} />
                  {s.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{s.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">📋 Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500 border-b">
              <tr>
                <th className="py-2 pr-3 font-medium">Ref</th>
                <th className="py-2 pr-3 font-medium">ลูกค้า</th>
                <th className="py-2 pr-3 font-medium">บริการ</th>
                <th className="py-2 pr-3 font-medium">ยอด</th>
                <th className="py-2 pr-3 font-medium">วัน</th>
                <th className="py-2 pr-3 font-medium">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.booking_ref} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="py-2 pr-3 font-mono text-xs">{b.booking_ref}</td>
                  <td className="py-2 pr-3">{b.customer_name}</td>
                  <td className="py-2 pr-3">{b.service_main}</td>
                  <td className="py-2 pr-3 font-medium">฿{b.total_price.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-slate-500">{b.preferred_date}</td>
                  <td className="py-2 pr-3">
                    <Badge className={STATUS_TONE[b.booking_status] || "bg-slate-100 text-slate-700"}>
                      {b.booking_status}
                    </Badge>
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
