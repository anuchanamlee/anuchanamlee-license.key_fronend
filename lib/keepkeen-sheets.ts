/**
 * Google Sheets API adapter for KeepKeen admin data.
 *
 * Setup:
 *   1. Create a Google Cloud service account with Sheets API enabled
 *   2. Share each sheet with the service account email
 *   3. Set GOOGLE_SERVICE_ACCOUNT_JSON env var (stringified JSON key file)
 *   4. Set KEEPKEEN_SPREADSHEET_ID env var
 *
 * Sheet names (configured via KEEPKEEN_SHEET_* env vars or defaults below):
 *   Bookings, Customers, Payment Log, AI_Prompts, Service Rules
 */

import { JWT } from "google-auth-library"
import { google, sheets_v4 } from "googleapis"
import type { Booking, Customer, PaymentLog, AiPrompt, CaseRow } from "./keepkeen-mock"

const SPREADSHEET_ID = process.env.KEEPKEEN_SPREADSHEET_ID ?? ""
const SHEET_BOOKINGS = process.env.KEEPKEEN_SHEET_BOOKINGS ?? "Bookings"
const SHEET_CUSTOMERS = process.env.KEEPKEEN_SHEET_CUSTOMERS ?? "Customers"
const SHEET_PAYMENTS = process.env.KEEPKEEN_SHEET_PAYMENTS ?? "Payment Log"
const SHEET_PROMPTS = process.env.KEEPKEEN_SHEET_PROMPTS ?? "AI_Prompts"

function getAuthClient(): JWT {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON env var not set")
  const creds = JSON.parse(raw) as { client_email: string; private_key: string }
  return new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  })
}

async function getSheets(): Promise<sheets_v4.Sheets> {
  const auth = getAuthClient()
  return google.sheets({ version: "v4", auth })
}

async function readRange(range: string): Promise<string[][]> {
  const sheets = await getSheets()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueRenderOption: "UNFORMATTED_VALUE",
  })
  return (res.data.values ?? []) as string[][]
}

function row(values: string[][], index: number, col: number): string {
  return String(values[index]?.[col] ?? "")
}

export async function getBookings(): Promise<Booking[]> {
  const values = await readRange(`${SHEET_BOOKINGS}!A2:P`)
  return values.map((r) => ({
    booking_ref: r[0] ?? "",
    line_user_id: r[1] ?? "",
    customer_name: r[2] ?? "",
    phone: r[3] ?? "",
    service_main: r[4] ?? "",
    service_addons: r[5] ?? "",
    total_price: Number(r[6]) || 0,
    amount_paid: Number(r[7]) || 0,
    balance_due: Number(r[8]) || 0,
    preferred_date: r[9] ?? "",
    preferred_time: r[10] ?? "morning",
    booking_status: (r[11] ?? "confirmed") as Booking["booking_status"],
    qr_expires_at: r[12] || null,
    created_at: r[13] ?? new Date().toISOString(),
  }))
}

export async function getBookingByRef(ref: string): Promise<Booking | null> {
  const all = await getBookings()
  return all.find((b) => b.booking_ref === ref) ?? null
}

export async function getCustomers(): Promise<Customer[]> {
  const values = await readRange(`${SHEET_CUSTOMERS}!A2:M`)
  return values.map((r) => ({
    line_user_id: r[0] ?? "",
    customer_name: r[1] ?? "",
    phone: r[2] ?? "",
    address: r[3] ?? "",
    district: r[4] ?? "",
    property_type: (r[5] ?? "condo") as Customer["property_type"],
    size_sqm: Number(r[6]) || 0,
    total_bookings: Number(r[7]) || 0,
    total_spending: Number(r[8]) || 0,
    customer_tier: (r[9] ?? "new") as Customer["customer_tier"],
    last_service_date: r[10] || null,
  }))
}

export async function getPayments(): Promise<PaymentLog[]> {
  const values = await readRange(`${SHEET_PAYMENTS}!A2:K`)
  return values.map((r) => ({
    payment_id: r[0] ?? "",
    booking_ref: r[1] ?? "",
    line_user_id: r[2] ?? "",
    slip2go_status: r[3] ?? "",
    detected_amount: Number(r[4]) || 0,
    detected_datetime: r[5] ?? "",
    transaction_reference: r[6] ?? "",
    verification_status: (r[7] ?? "wait") as PaymentLog["verification_status"],
    mismatch_reason: r[8] ?? "",
    checked_at: r[9] ?? "",
  }))
}

export async function getAiPrompts(): Promise<AiPrompt[]> {
  const values = await readRange(`${SHEET_PROMPTS}!A2:F`)
  return values.map((r) => ({
    section: r[0] ?? "",
    order: Number(r[1]) || 0,
    active: r[2] === "TRUE" || r[2] === "1",
    content: r[3] ?? "",
    notes: r[4] ?? "",
  }))
}

export function isSheetsConfigured(): boolean {
  return Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_JSON && SPREADSHEET_ID)
}
