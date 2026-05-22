import { test, expect } from "@playwright/test"

test.describe("KeepKeen Bookings", () => {
  test("lists all bookings", async ({ page }) => {
    await page.goto("/keepkeen/bookings")
    await expect(page.getByRole("heading", { name: "Bookings" })).toBeVisible()
    const rows = page.locator("tbody tr")
    await expect(rows).not.toHaveCount(0)
  })

  test("navigates to booking detail", async ({ page }) => {
    await page.goto("/keepkeen/bookings")
    const firstChevron = page.locator("tbody tr").first().locator("a")
    const href = await firstChevron.getAttribute("href")
    await firstChevron.click()
    await expect(page.getByText("ข้อมูลลูกค้า")).toBeVisible()
    await expect(page.getByText("Admin Actions")).toBeVisible()
  })

  test("booking detail shows back link", async ({ page }) => {
    await page.goto("/keepkeen/bookings")
    await page.locator("tbody tr").first().locator("a").click()
    await expect(page.getByText("กลับไปรายการ")).toBeVisible()
  })

  test("404 for unknown booking ref", async ({ page }) => {
    await page.goto("/keepkeen/bookings/NOTEXIST-999")
    await expect(page).toHaveURL(/NOTEXIST-999/)
    // Next.js notFound() renders 404
    await expect(page.locator("body")).toContainText(/404|not found/i)
  })
})
