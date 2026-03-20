import { LicenseKey } from "../lib/api"

export default function StatusBadge({ row }: { row: LicenseKey }) {
  const today = new Date().toISOString().slice(0, 10)
  if (row.revoked)            return <span className="badge badge-revoked">ยกเลิกแล้ว</span>
  if (row.expires_at < today) return <span className="badge badge-expired">หมดอายุ</span>
  const d = Math.ceil((new Date(row.expires_at).getTime() - new Date(today).getTime()) / 86_400_000)
  return <span className="badge badge-active">เหลือ {d} วัน</span>
}