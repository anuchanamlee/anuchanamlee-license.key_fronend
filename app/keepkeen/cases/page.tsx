import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockCases } from "@/lib/keepkeen-mock"
import { Check, X, Eye } from "lucide-react"

const STATUS_TONE: Record<string, string> = {
  pending_admin: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-700",
}

export default function CasesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cases (Vision)</h1>
        <p className="text-sm text-slate-500">รอ Admin review {mockCases.filter(c => c.status === "pending_admin").length} cases</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockCases.map((c) => (
          <Card key={c.case_id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-mono">{c.case_id.substring(0, 32)}...</CardTitle>
              <Badge className={STATUS_TONE[c.status]}>{c.status}</Badge>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div>
                <div className="text-xs text-slate-500 mb-1">AI Assessment</div>
                <p>{c.ai_assessment}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-slate-500">แนะนำ</div>
                  <div className="font-medium">{c.recommended_package}</div>
                </div>
                <div>
                  <div className="text-slate-500">Add-ons</div>
                  <div>{c.recommended_addons || "-"}</div>
                </div>
                <div>
                  <div className="text-slate-500">ราคาประเมิน</div>
                  <div className="font-medium">฿{c.price_range_min.toLocaleString()} - ฿{c.price_range_max.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-500">วันที่ส่ง</div>
                  <div>{new Date(c.created_at).toLocaleDateString("th-TH")}</div>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t">
                <Button size="sm" variant="outline"><Eye size={14} className="mr-1" />ดูภาพ</Button>
                {c.status === "pending_admin" && (
                  <>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700"><Check size={14} className="mr-1" />Approve</Button>
                    <Button size="sm" variant="outline" className="text-rose-700"><X size={14} className="mr-1" />Reject</Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
