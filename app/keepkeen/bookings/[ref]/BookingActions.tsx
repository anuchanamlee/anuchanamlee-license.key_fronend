"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Edit, MessageCircle, RotateCcw, QrCode, Loader2 } from "lucide-react"
import { confirmBooking, releaseBooking, replyToCustomer, regenerateQr } from "./actions"

interface Props {
  bookingRef: string
  lineUserId: string
  bookingStatus: string
}

type ActionKey = "confirm" | "edit" | "reply" | "release" | "qr"

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all ${ok ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
      {ok ? "✓ " : "✕ "}{msg}
    </div>
  )
}

export function BookingActions({ bookingRef, lineUserId, bookingStatus }: Props) {
  const [loading, setLoading] = useState<ActionKey | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [replyText, setReplyText] = useState("")
  const [showReply, setShowReply] = useState(false)
  const [editNote, setEditNote] = useState("")
  const [showEdit, setShowEdit] = useState(false)

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  async function run(key: ActionKey, fn: () => Promise<{ ok: boolean; message: string }>) {
    setLoading(key)
    try {
      const result = await fn()
      showToast(result.message, result.ok)
    } catch {
      showToast("เกิดข้อผิดพลาด", false)
    } finally {
      setLoading(null)
    }
  }

  const isPending = loading !== null
  const canConfirm = ["awaiting_team_confirmation", "confirmed"].includes(bookingStatus)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700"
          disabled={isPending || !canConfirm}
          onClick={() => run("confirm", () => confirmBooking(bookingRef))}
          title={!canConfirm ? `ไม่สามารถ confirm จาก status: ${bookingStatus}` : undefined}
        >
          {loading === "confirm" ? <Loader2 size={14} className="mr-1 animate-spin" /> : <Check size={14} className="mr-1" />}
          CONFIRM
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => setShowEdit((v) => !v)}
        >
          <Edit size={14} className="mr-1" />EDIT Quote
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => setShowReply((v) => !v)}
        >
          <MessageCircle size={14} className="mr-1" />REPLY ลูกค้า
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => run("release", () => releaseBooking(bookingRef))}
        >
          {loading === "release" ? <Loader2 size={14} className="mr-1 animate-spin" /> : <RotateCcw size={14} className="mr-1" />}
          RELEASE
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => run("qr", () => regenerateQr(bookingRef))}
        >
          {loading === "qr" ? <Loader2 size={14} className="mr-1 animate-spin" /> : <QrCode size={14} className="mr-1" />}
          Regenerate QR
        </Button>
      </div>

      {showEdit && (
        <div className="flex gap-2 items-start">
          <textarea
            className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-300"
            rows={2}
            placeholder="หมายเหตุ / รายละเอียด quote ที่แก้ไข..."
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
          />
          <Button
            size="sm"
            disabled={!editNote.trim() || isPending}
            onClick={() => {
              showToast("บันทึก quote note แล้ว (Google Sheets API ยังไม่เชื่อม)", true)
              setEditNote("")
              setShowEdit(false)
            }}
          >
            บันทึก
          </Button>
        </div>
      )}

      {showReply && (
        <div className="flex gap-2 items-start">
          <textarea
            className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-300"
            rows={2}
            placeholder="พิมพ์ข้อความ LINE ที่จะส่งถึงลูกค้า..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <Button
            size="sm"
            disabled={!replyText.trim() || isPending}
            onClick={() => {
              run("reply", () => replyToCustomer(bookingRef, lineUserId, replyText))
              setReplyText("")
              setShowReply(false)
            }}
          >
            ส่ง
          </Button>
        </div>
      )}

      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </div>
  )
}
