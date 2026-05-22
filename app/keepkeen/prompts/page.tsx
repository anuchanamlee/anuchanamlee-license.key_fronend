import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockAiPrompts } from "@/lib/keepkeen-mock"
import { Edit, RefreshCw } from "lucide-react"

export default function PromptsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Prompts</h1>
          <p className="text-sm text-slate-500">{mockAiPrompts.length} sections · sheet-driven · cache TTL 5 min</p>
        </div>
        <Button variant="outline" size="sm"><RefreshCw size={14} className="mr-1" />Refresh Cache</Button>
      </div>

      <div className="space-y-3">
        {mockAiPrompts.map((p) => (
          <Card key={p.section}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base flex items-center gap-3">
                <span className="text-xs text-slate-500 font-mono">#{p.order}</span>
                {p.section}
                {p.active ? <Badge className="bg-emerald-100 text-emerald-800">active</Badge> : <Badge variant="outline">inactive</Badge>}
              </CardTitle>
              <Button variant="outline" size="sm"><Edit size={14} className="mr-1" />แก้ไข</Button>
            </CardHeader>
            <CardContent>
              <pre className="text-xs whitespace-pre-wrap text-slate-700 bg-slate-50 p-3 rounded border">{p.content}</pre>
              {p.notes && <p className="text-xs text-slate-500 mt-2">📝 {p.notes}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
