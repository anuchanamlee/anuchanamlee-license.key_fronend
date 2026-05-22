import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPayments } from "@/lib/keepkeen-data"

const STATUS_TONE: Record<string, string> = {
  confirm: "bg-emerald-100 text-emerald-800",
  fail: "bg-rose-100 text-rose-700",
  escalate: "bg-amber-100 text-amber-800",
  wait: "bg-cyan-100 text-cyan-800",
}

export default async function PaymentsPage() {
  const payments = await getPayments()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payment Log</h1>
        <p className="text-sm text-slate-500">{payments.length} slip submissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">💳 Slip Verifications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500 bg-slate-50 border-y">
              <tr>
                <th className="px-4 py-2.5 font-medium">Time</th>
                <th className="px-4 py-2.5 font-medium">Booking</th>
                <th className="px-4 py-2.5 font-medium">Amount</th>
                <th className="px-4 py-2.5 font-medium">Tx Ref</th>
                <th className="px-4 py-2.5 font-medium">Slip2Go</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">เหตุผล</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.payment_id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-2.5 text-xs text-slate-500">{new Date(p.checked_at).toLocaleString("th-TH")}</td>
                  <td className="px-4 py-2.5 font-mono text-xs">{p.booking_ref}</td>
                  <td className="px-4 py-2.5 font-medium">฿{p.detected_amount.toLocaleString()}</td>
                  <td className="px-4 py-2.5 font-mono text-xs">{p.transaction_reference}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-600">{p.slip2go_status}</td>
                  <td className="px-4 py-2.5">
                    <Badge className={STATUS_TONE[p.verification_status]}>{p.verification_status}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-rose-600">{p.mismatch_reason || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
