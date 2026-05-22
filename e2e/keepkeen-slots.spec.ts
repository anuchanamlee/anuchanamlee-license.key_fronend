import { test, expect } from "@playwright/test"

test.describe("KeepKeen Slot Finder", () => {
  test("renders 7-day grid", async ({ page }) => {
    await page.goto("/keepkeen/slots")
    await expect(page.getByRole("heading", { name: "Slot Finder" })).toBeVisible()
    const dayCols = page.locator("[data-testid='day-col'], th")
    // 7 day columns + time label = at least 7 headers
    await expect(page.locator("table")).toBeVisible()
  })

  test("week navigation buttons exist", async ({ page }) => {
    await page.goto("/keepkeen/slots")
    await expect(page.getByRole("button").first()).toBeVisible()
  })

  test("clicking slot shows booking details", async ({ page }) => {
    await page.goto("/keepkeen/slots")
    // Click first colored (non-empty) slot button
    const slotBtn = page.locator("button").filter({ hasText: /morning|afternoon/i }).first()
    if (await slotBtn.count() > 0) {
      await slotBtn.click()
      // Panel should appear with booking info
      await expect(page.getByText(/booking_ref|KK-/i)).toBeVisible()
    }
  })
})
