import { test, expect } from "@playwright/test"

test.describe("KeepKeen Customers", () => {
  test("renders customer table", async ({ page }) => {
    await page.goto("/keepkeen/customers")
    await expect(page.getByRole("heading", { name: "Customers" })).toBeVisible()
    await expect(page.getByText("Customer Registry")).toBeVisible()
    await expect(page.locator("tbody tr").first()).toBeVisible()
  })

  test("shows tier badges", async ({ page }) => {
    await page.goto("/keepkeen/customers")
    await expect(page.locator("tbody td").last()).toBeVisible()
  })
})
