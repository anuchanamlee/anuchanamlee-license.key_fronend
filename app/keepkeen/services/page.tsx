import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const mockServices = [
  { service_name: "Daily Refresh 1BR", property_type: "condo", base_price: 1, size_min: 0, size_max: 35 },
  { service_name: "Daily Refresh 2BR", property_type: "condo", base_price: 1, size_min: 36, size_max: 55 },
  { service_name: "Sanctuary Reset 1BR", property_type: "condo", base_price: 1, size_min: 0, size_max: 35 },
  { service_name: "Sanctuary Reset 2BR", property_type: "condo", base_price: 1, size_min: 36, size_max: 55 },
  { service_name: "Grand Restoration 3BR", property_type: "condo", base_price: 1, size_min: 56, size_max: 75 },
]

const mockAddons = [
  { code: "MATTRESS_Q", name: "Mattress Queen", price: 1600, unit: "หลัง", category: "addon-fabric" },
  { code: "OZONE_M", name: "Ozone Medium", price: 2500, unit: "รอบ", category: "addon-ozone" },
  { code: "AC_WALL_DEEP", name: "AC Wall Deep Clean", price: 1200, unit: "เครื่อง", category: "addon-ac" },
  { code: "SOFA_3S_LTHR", name: "Sofa 3-Seater Leather", price: 2280, unit: "ตัว", category: "addon-fabric" },
]

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Services + Add-ons</h1>
          <p className="text-sm text-slate-500">Service Rules + Add-on Catalog</p>
        </div>
        <Button variant="outline" size="sm">+ เพิ่มรายการ</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">🧹 Service Rules — Main Services</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500 bg-slate-50 border-y">
              <tr>
                <th className="px-4 py-2.5 font-medium">บริการ</th>
                <th className="px-4 py-2.5 font-medium">Property</th>
                <th className="px-4 py-2.5 font-medium">ขนาด (ตร.ม.)</th>
                <th className="px-4 py-2.5 font-medium">ราคา</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {mockServices.map((s) => (
                <tr key={s.service_name} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-medium">{s.service_name}</td>
                  <td className="px-4 py-2.5 capitalize">{s.property_type}</td>
                  <td className="px-4 py-2.5 text-slate-600">{s.size_min}-{s.size_max}</td>
                  <td className="px-4 py-2.5 font-medium">฿{s.base_price.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right">
                    <Button variant="ghost" size="sm">แก้ไข</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">➕ Add-on Catalog</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500 bg-slate-50 border-y">
              <tr>
                <th className="px-4 py-2.5 font-medium">Code</th>
                <th className="px-4 py-2.5 font-medium">ชื่อ</th>
                <th className="px-4 py-2.5 font-medium">หมวด</th>
                <th className="px-4 py-2.5 font-medium">ราคา</th>
                <th className="px-4 py-2.5 font-medium">หน่วย</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {mockAddons.map((a) => (
                <tr key={a.code} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono text-xs">{a.code}</td>
                  <td className="px-4 py-2.5">{a.name}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant="outline">{a.category}</Badge>
                  </td>
                  <td className="px-4 py-2.5 font-medium">฿{a.price.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-slate-600">/{a.unit}</td>
                  <td className="px-4 py-2.5 text-right">
                    <Button variant="ghost" size="sm">แก้ไข</Button>
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
