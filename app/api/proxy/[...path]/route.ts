import { NextRequest, NextResponse } from "next/server"

const API_BASE = "https://license-b83fzc1vb-anucha-namlees-projects.vercel.app"

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  return proxy(req, path, "GET")
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  return proxy(req, path, "POST")
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,x-admin-secret",
    },
  })
}

async function proxy(req: NextRequest, pathParts: string[], method: string) {
  const secret = req.headers.get("x-admin-secret") ?? ""
  const url    = `${API_BASE}/${pathParts.join("/")}`

  const init: RequestInit = {
    method,
    headers: { "Content-Type": "application/json", "x-admin-secret": secret },
  }
  if (method === "POST") {
    init.body = await req.text()
  }

  try {
    const res  = await fetch(url, init)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    return NextResponse.json({ message: "Proxy error: " + (e as Error).message }, { status: 502 })
  }
}