import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getBookingByRef } from "@/lib/keepkeen-data"
import { ArrowLeft } from "lucide-react"
import { BookingActions } from "./BookingActions"

export default async function BookingDetail({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params
  const b = await getBookingByRef(ref)
  if (!b) notFound()

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/keepkeen/bookings" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft size={14} /> กลับไปรายการ
      </Link>

      <div>
        <h1 className="text-2xl font-bold">{b.booking_ref}</h1>
        <p className="text-sm text-slate-500">สร้างเมื่อ {new Date(b.created_at).toLocaleString("th-TH")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">ข้อมูลลูกค้า</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-6">
            <div><div className="text-xs text-slate-500">ชื่อ</div><div className="font-medium">{b.customer_name}</div></div>
            <div><div className="text-xs text-slate-500">เบอร์โทร</div><div className="font-mono">{b.phone}</div></div>
            <div className="col-span-2"><div className="text-xs text-slate-500">LINE UID</div><div className="font-mono text-xs">{b.line_user_id}</div></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">บริการ + ราคา</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-6">
            <div><div className="text-xs text-slate-500">บริการหลัก</div><div className="font-medium">{b.service_main}</div></div>
            <div><div className="text-xs text-slate-500">Add-ons</div><div>{b.service_addons || "-"}</div></div>
            <div><div className="text-xs text-slate-500">วัน-เวลา</div><div className="font-medium">{b.preferred_date} ({b.preferred_time})</div></div>
            <div><div className="text-xs text-slate-500">สถานะ</div><div><Badge className="bg-blue-100 text-blue-800">{b.booking_status}</Badge></div></div>
          </div>
          <div className="border-t pt-3 grid grid-cols-3 gap-3">
            <div><div className="text-xs text-slate-500">ยอดรวม</div><div className="text-lg font-bold">฿{b.total_price.toLocaleString()}</div></div>
            <div><div className="text-xs text-slate-500">จ่ายแล้ว</div><div className="text-lg font-bold text-emerald-600">฿{b.amount_paid.toLocaleString()}</div></div>
            <div><div className="text-xs text-slate-500">ค้างจ่าย</div><div className="text-lg font-bold text-rose-600">฿{b.balance_due.toLocaleString()}</div></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingActions
            bookingRef={b.booking_ref}
            lineUserId={b.line_user_id}
            bookingStatus={b.booking_status}
          />
        </CardContent>
      </Card>
    </div>
  )
}
