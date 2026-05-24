import { test, expect } from '@playwright/test'

async function loginUser(page) {
  await page.goto('/login')
  await page.fill('#email', 'john@example.com')
  await page.fill('#password', 'Password@123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/.*dashboard/)
}

test.describe('Team Members Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await loginUser(page)
    await page.goto('/team')
  })

  test('should load team members list', async ({ page }) => {
    await expect(page.locator('h1:has-text("Team Members")')).toBeVisible()
    await expect(page.locator('h4:has-text("John Doe")')).toBeVisible()
    await expect(page.locator('h4:has-text("Sarah Connor")')).toBeVisible()
  })

  test('should invite a new member', async ({ page }) => {
    await page.click('text=Invite Member')
    await page.fill('#name', 'Agent Smith')
    await page.fill('#email', 'smith@matrix.com')
    await page.selectOption('#role', 'Frontend Developer')
    await page.selectOption('#department', 'Engineering')
    await page.click('button[type="submit"]')

    // Confirm listed
    await expect(page.locator('text=Agent Smith')).toBeVisible()
    await expect(page.locator('text=smith@matrix.com')).toBeVisible()
  })
})
