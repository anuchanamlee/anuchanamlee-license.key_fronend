import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCustomers } from "@/lib/keepkeen-data"
import { DistanceBadge } from "./DistanceBadge"

const TIER_TONE: Record<string, string> = {
  new: "bg-slate-100 text-slate-700",
  regular: "bg-blue-100 text-blue-800",
  vip: "bg-amber-100 text-amber-800",
}

export default async function CustomersPage() {
  const customers = await getCustomers()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-sm text-slate-500">{customers.length} ลูกค้า</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">👥 Customer Registry</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500 bg-slate-50 border-y">
              <tr>
                <th className="px-4 py-2.5 font-medium">ชื่อ</th>
                <th className="px-4 py-2.5 font-medium">เขต</th>
                <th className="px-4 py-2.5 font-medium">Property</th>
                <th className="px-4 py-2.5 font-medium">ขนาด</th>
                <th className="px-4 py-2.5 font-medium">Bookings</th>
                <th className="px-4 py-2.5 font-medium">LTV</th>
                <th className="px-4 py-2.5 font-medium">Tier</th>
                <th className="px-4 py-2.5 font-medium">ระยะทาง</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.line_user_id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-2.5">
                    <div className="font-medium">{c.customer_name}</div>
                    <div className="text-xs text-slate-500">{c.phone}</div>
                  </td>
                  <td className="px-4 py-2.5">{c.district}</td>
                  <td className="px-4 py-2.5 capitalize">{c.property_type}</td>
                  <td className="px-4 py-2.5">{c.size_sqm} ตร.ม.</td>
                  <td className="px-4 py-2.5 text-center">{c.total_bookings}</td>
                  <td className="px-4 py-2.5 font-medium">฿{c.total_spending.toLocaleString()}</td>
                  <td className="px-4 py-2.5">
                    <Badge className={TIER_TONE[c.customer_tier]}>{c.customer_tier.toUpperCase()}</Badge>
                  </td>
                  <td className="px-4 py-2.5">
                    <DistanceBadge address={`${c.address} ${c.district} Bangkok`} />
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
