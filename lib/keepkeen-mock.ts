// Mock data for KeepKeen admin dashboard (replace with Google Sheets API later)

export type BookingStatus =
  | "awaiting_team_confirmation"
  | "confirmed"
  | "awaiting_slip"
  | "qr_sent"
  | "qr_expired"
  | "paid"
  | "completed"
  | "cancelled"
  | "escalated"

export type Booking = {
  booking_ref: string
  line_user_id: string
  customer_name: string
  phone: string
  service_main: string
  service_addons: string
  total_price: number
  amount_paid: number
  balance_due: number
  preferred_date: string
  preferred_time: string
  booking_status: BookingStatus
  qr_expires_at: string | null
  created_at: string
}

export type Customer = {
  line_user_id: string
  customer_name: string
  phone: string
  address: string
  district: string
  property_type: "condo" | "villa" | "office"
  size_sqm: number
  total_bookings: number
  total_spending: number
  customer_tier: "new" | "regular" | "vip"
  last_service_date: string | null
}

export type PaymentLog = {
  payment_id: string
  booking_ref: string
  line_user_id: string
  slip2go_status: string
  detected_amount: number
  detected_datetime: string
  transaction_reference: string
  verification_status: "confirm" | "fail" | "escalate" | "wait"
  mismatch_reason: string
  checked_at: string
}

export type AiPrompt = {
  section: string
  order: number
  active: boolean
  content: string
  notes: string
}

export type CaseRow = {
  case_id: string
  line_user_id: string
  ai_assessment: string
  recommended_package: string
  recommended_addons: string
  price_range_min: number
  price_range_max: number
  image_url: string
  status: "pending_admin" | "approved" | "rejected"
  created_at: string
}

const NOW = new Date()
const iso = (d: Date) => d.toISOString()
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86400000)
const daysFromNow = (n: number) => new Date(NOW.getTime() + n * 86400000)

export const mockBookings: Booking[] = [
  {
    booking_ref: "KK-20260519-558S9",
    line_user_id: "U7c56035e35e33f5a59ae359e2a8c8edb",
    customer_name: "อนุชา นามลี",
    phone: "0823456789",
    service_main: "Daily Refresh 1BR",
    service_addons: "",
    total_price: 1,
    amount_paid: 1,
    balance_due: 0,
    preferred_date: "2026-05-19",
    preferred_time: "morning",
    booking_status: "paid",
    qr_expires_at: null,
    created_at: iso(daysAgo(1)),
  },
  {
    booking_ref: "KK-20260520-7K2P3",
    line_user_id: "U115bef9014326020e130385392863b56",
    customer_name: "พิมานมาศ ฉ.",
    phone: "0912345678",
    service_main: "Sanctuary Reset 2BR",
    service_addons: "Mattress Queen, Ozone M",
    total_price: 7469,
    amount_paid: 0,
    balance_due: 7469,
    preferred_date: "2026-05-20",
    preferred_time: "afternoon",
    booking_status: "awaiting_team_confirmation",
    qr_expires_at: null,
    created_at: iso(daysAgo(0)),
  },
  {
    booking_ref: "KK-20260518-3FT91",
    line_user_id: "U22ab3cd4ef5g6h7i8j9k0lmnop",
    customer_name: "สมชาย วงศ์ใหญ่",
    phone: "0888777666",
    service_main: "Grand Restoration 3BR",
    service_addons: "Curtain Heavy x4, Sofa 3-Seater Leather",
    total_price: 18280,
    amount_paid: 9140,
    balance_due: 9140,
    preferred_date: "2026-05-22",
    preferred_time: "morning",
    booking_status: "confirmed",
    qr_expires_at: null,
    created_at: iso(daysAgo(2)),
  },
  {
    booking_ref: "KK-20260517-XR8KK",
    line_user_id: "U33cd4ef5g6h7i8j9k0lmnopqrs",
    customer_name: "วรินทร อภินันทร์",
    phone: "0999111222",
    service_main: "AC Care Wall Deep",
    service_addons: "",
    total_price: 2400,
    amount_paid: 0,
    balance_due: 2400,
    preferred_date: "2026-05-21",
    preferred_time: "afternoon",
    booking_status: "awaiting_slip",
    qr_expires_at: iso(new Date(NOW.getTime() + 8 * 60000)),
    created_at: iso(daysAgo(0)),
  },
  {
    booking_ref: "KK-20260515-MMM00",
    line_user_id: "U44ef5g6h7i8j9k0lmnopqrstuv",
    customer_name: "ธนากร เจริญพร",
    phone: "0811223344",
    service_main: "Daily Refresh 2BR",
    service_addons: "Garment x5",
    total_price: 2369,
    amount_paid: 2369,
    balance_due: 0,
    preferred_date: "2026-05-15",
    preferred_time: "morning",
    booking_status: "completed",
    qr_expires_at: null,
    created_at: iso(daysAgo(4)),
  },
]

export const mockCustomers: Customer[] = [
  {
    line_user_id: "U7c56035e35e33f5a59ae359e2a8c8edb",
    customer_name: "อนุชา นามลี",
    phone: "0823456789",
    address: "https://goo.gl/maps/abc",
    district: "ห้วยขวาง",
    property_type: "condo",
    size_sqm: 50,
    total_bookings: 1,
    total_spending: 1,
    customer_tier: "new",
    last_service_date: iso(daysAgo(1)),
  },
  {
    line_user_id: "U33cd4ef5g6h7i8j9k0lmnopqrs",
    customer_name: "วรินทร อภินันทร์",
    phone: "0999111222",
    address: "ลาดพร้าว 71",
    district: "ลาดพร้าว",
    property_type: "condo",
    size_sqm: 45,
    total_bookings: 3,
    total_spending: 8100,
    customer_tier: "regular",
    last_service_date: iso(daysAgo(30)),
  },
  {
    line_user_id: "U44ef5g6h7i8j9k0lmnopqrstuv",
    customer_name: "ธนากร เจริญพร",
    phone: "0811223344",
    address: "ทองหล่อ 10",
    district: "วัฒนา",
    property_type: "villa",
    size_sqm: 220,
    total_bookings: 12,
    total_spending: 142500,
    customer_tier: "vip",
    last_service_date: iso(daysAgo(7)),
  },
]

export const mockPayments: PaymentLog[] = [
  {
    payment_id: "pay_KK-20260519-558S9_1778939040487",
    booking_ref: "KK-20260519-558S9",
    line_user_id: "U7c56035e35e33f5a59ae359e2a8c8edb",
    slip2go_status: "verified_full_payment",
    detected_amount: 1,
    detected_datetime: "2026-05-16T00:20:58+07:00",
    transaction_reference: "A9c714d8823504024",
    verification_status: "confirm",
    mismatch_reason: "",
    checked_at: iso(daysAgo(0)),
  },
  {
    payment_id: "pay_KK-20260518-3FT91_1778830040123",
    booking_ref: "KK-20260518-3FT91",
    line_user_id: "U22ab3cd4ef5g6h7i8j9k0lmnop",
    slip2go_status: "verified_deposit",
    detected_amount: 9140,
    detected_datetime: "2026-05-15T14:32:00+07:00",
    transaction_reference: "B7e892f1234567890",
    verification_status: "confirm",
    mismatch_reason: "",
    checked_at: iso(daysAgo(1)),
  },
  {
    payment_id: "pay_KK-20260517-XR8KK_1778712340555",
    booking_ref: "KK-20260517-XR8KK",
    line_user_id: "U33cd4ef5g6h7i8j9k0lmnopqrs",
    slip2go_status: "payment_mismatch",
    detected_amount: 2000,
    detected_datetime: "2026-05-16T10:15:30+07:00",
    transaction_reference: "C5d419g8765432101",
    verification_status: "fail",
    mismatch_reason: "ยอด ฿2,000 ไม่ตรง ฿2,400",
    checked_at: iso(daysAgo(0)),
  },
]

export const mockAiPrompts: AiPrompt[] = [
  { section: "IDENTITY", order: 10, active: true, content: "คุณคือ KeepKeen Concierge — Digital Front-Desk...", notes: "ตัวตน + persona" },
  { section: "IMAGE_POLICY", order: 20, active: true, content: "🚨 IMAGE-FIRST POLICY\n- ห้าม quote ราคาก่อนลูกค้าส่งภาพ...", notes: "นโยบายภาพ" },
  { section: "LANGUAGE", order: 40, active: true, content: "ภาษาเดียวกับลูกค้า ลงท้าย ค่ะ...", notes: "tone of voice" },
  { section: "CARE_MENU", order: 50, active: true, content: "# CARE MENU\n{{CARE_MENU}}", notes: "placeholder" },
  { section: "PRICE_INTEGRITY", order: 60, active: true, content: "🚨 PRICE INTEGRITY (CRITICAL)\n- ราคา MUST come from CARE MENU...", notes: "กฎห้าม hallucinate" },
  { section: "CART_RULES", order: 70, active: true, content: "🛒 CART_STATE RULES\n{{CART_STATE}}\n- ยอดรวม = base + confirmed...", notes: "cart logic" },
]

export const mockCases: CaseRow[] = [
  {
    case_id: "case_U7c56035e35e33f5a59ae359e2a8c8edb_1",
    line_user_id: "U7c56035e35e33f5a59ae359e2a8c8edb",
    ai_assessment: "ห้องคอนโด 1BR เริ่มจะมีฝุ่นเกาะตามผิวเรียบ + คราบในห้องครัว",
    recommended_package: "Sanctuary Reset 1BR",
    recommended_addons: "Mattress Queen",
    price_range_min: 3500,
    price_range_max: 5000,
    image_url: "https://drive.google.com/file/d/abc/view",
    status: "pending_admin",
    created_at: iso(daysAgo(0)),
  },
  {
    case_id: "case_U115bef9014326020e130385392863b56_3",
    line_user_id: "U115bef9014326020e130385392863b56",
    ai_assessment: "Villa 3BR ผิว marble หมอง + sofa เป็นคราบกาแฟ",
    recommended_package: "Grand Restoration 3BR",
    recommended_addons: "Sofa 3-Seater Leather, Carpet",
    price_range_min: 12000,
    price_range_max: 18000,
    image_url: "https://drive.google.com/file/d/def/view",
    status: "approved",
    created_at: iso(daysAgo(1)),
  },
]

export const stats = {
  today_bookings: 2,
  today_revenue: 9140,
  pending_admin: 2,
  recent_errors: 0,
  total_customers: 142,
  active_qr: 1,
}
