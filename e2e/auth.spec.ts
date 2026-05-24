import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage to ensure a clean session
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('should redirect unauthorized users to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/.*login/)
  })

  test('should allow a new user to sign up', async ({ page }) => {
    await page.goto('/signup')
    await page.fill('#name', 'Jane Doe')
    await page.fill('#email', 'jane.doe@example.com')
    await page.fill('#password', 'Password@123')
    await page.fill('#confirmPassword', 'Password@123')
    await page.click('button[type="submit"]')

    // After signup, user is automatically logged in and redirected to dashboard
    await expect(page).toHaveURL(/.*dashboard/)
    await expect(page.locator('h2:has-text("Dashboard")')).toBeVisible()
  })

  test('should allow an existing user to log in', async ({ page }) => {
    await page.goto('/login')
    await page.fill('#email', 'john@example.com')
    await page.fill('#password', 'Password@123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/.*dashboard/)
    await expect(page.locator('h2:has-text("Dashboard")')).toBeVisible()
  })

  test('should allow user to log out', async ({ page }) => {
    // Log in first
    await page.goto('/login')
    await page.fill('#email', 'john@example.com')
    await page.fill('#password', 'Password@123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*dashboard/)

    // Trigger logout
    await page.click('button[aria-label="User dropdown menu"]')
    await page.click('text=Sign Out')

    // Confirm redirected back to login page
    await expect(page).toHaveURL(/.*login/)
  })
})
