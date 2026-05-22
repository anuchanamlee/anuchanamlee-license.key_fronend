import { test, expect } from "@playwright/test"

test.describe("KeepKeen Overview", () => {
  test("loads overview page with stat cards", async ({ page }) => {
    await page.goto("/keepkeen")
    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible()
    await expect(page.getByText("วันนี้ Bookings")).toBeVisible()
    await expect(page.getByText("วันนี้ Revenue")).toBeVisible()
    await expect(page.getByText("Recent Bookings")).toBeVisible()
  })

  test("overview table shows booking rows", async ({ page }) => {
    await page.goto("/keepkeen")
    const rows = page.locator("tbody tr")
    await expect(rows).toHaveCount(5)
  })
})
