"use client"
import { createContext, useContext, useState, useCallback, ReactNode } from "react"

type ToastType = "success" | "error" | "info"
interface ToastCtx { toast: (msg: string, type?: ToastType) => void }
const Ctx = createContext<ToastCtx>({ toast: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg,  setMsg]  = useState("")
  const [type, setType] = useState<ToastType>("info")
  const [show, setShow] = useState(false)

  const toast = useCallback((m: string, t: ToastType = "info") => {
    setMsg(m); setType(t); setShow(true)
    setTimeout(() => setShow(false), 3000)
  }, [])

  const borderColor =
    type === "success" ? "var(--success)" :
    type === "error"   ? "var(--error)"   : "var(--border)"

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className={`toast ${show ? "toast-show" : "toast-hidden"}`} style={{ borderColor }}>
        {msg}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)