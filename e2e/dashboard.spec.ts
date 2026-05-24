import { test, expect } from '@playwright/test'

async function loginUser(page) {
  await page.goto('/login')
  await page.fill('#email', 'john@example.com')
  await page.fill('#password', 'Password@123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/.*dashboard/)
}

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await loginUser(page)
  })

  test('should load stats cards with metrics', async ({ page }) => {
    // Check presence of key dashboard elements
    await expect(page.locator('text=Total Projects')).toBeVisible()
    await expect(page.locator('text=Active Tasks')).toBeVisible()
    await expect(page.locator('text=Completed Tasks')).toBeVisible()
    await expect(page.locator('text=Team Members')).toBeVisible()
  })

  test('should render activity and completion charts', async ({ page }) => {
    // Check that Recharts SVG container or SVG elements are present
    const svgElements = page.locator('svg')
    await expect(svgElements.first()).toBeVisible()
  })

  test('should display recent projects and activity list', async ({ page }) => {
    await expect(page.locator('text=Recent Projects')).toBeVisible()
    await expect(page.locator('text=Recent Activity')).toBeVisible()
    // Verify some seeded data renders
    await expect(page.locator('text=Brand Redesign')).toBeVisible()
  })
})
