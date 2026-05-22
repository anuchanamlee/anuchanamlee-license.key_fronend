/**
 * KeepKeen data source — falls back to mock data when Google Sheets is not configured.
 *
 * To enable real Sheets data:
 *   1. npm install googleapis google-auth-library
 *   2. Set GOOGLE_SERVICE_ACCOUNT_JSON (stringified service account key)
 *   3. Set KEEPKEEN_SPREADSHEET_ID
 *   4. Share the spreadsheet with the service account email
 */

import {
  mockBookings,
  mockCustomers,
  mockPayments,
  mockAiPrompts,
  mockCases,
  type Booking,
  type Customer,
  type PaymentLog,
  type AiPrompt,
  type CaseRow,
} from "./keepkeen-mock"

function isSheetsConfigured(): boolean {
  return Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_JSON && process.env.KEEPKEEN_SPREADSHEET_ID)
}

export async function getBookings(): Promise<Booking[]> {
  if (!isSheetsConfigured()) return mockBookings
  const { getBookings: sheetsGetBookings } = await import("./keepkeen-sheets")
  return sheetsGetBookings()
}

export async function getBookingByRef(ref: string): Promise<Booking | null> {
  if (!isSheetsConfigured()) return mockBookings.find((b) => b.booking_ref === ref) ?? null
  const { getBookingByRef: sheetsGet } = await import("./keepkeen-sheets")
  return sheetsGet(ref)
}

export async function getCustomers(): Promise<Customer[]> {
  if (!isSheetsConfigured()) return mockCustomers
  const { getCustomers: sheetsGetCustomers } = await import("./keepkeen-sheets")
  return sheetsGetCustomers()
}

export async function getPayments(): Promise<PaymentLog[]> {
  if (!isSheetsConfigured()) return mockPayments
  const { getPayments: sheetsGetPayments } = await import("./keepkeen-sheets")
  return sheetsGetPayments()
}

export async function getAiPrompts(): Promise<AiPrompt[]> {
  if (!isSheetsConfigured()) return mockAiPrompts
  const { getAiPrompts: sheetsGetPrompts } = await import("./keepkeen-sheets")
  return sheetsGetPrompts()
}

export async function getCases(): Promise<CaseRow[]> {
  return mockCases
}
