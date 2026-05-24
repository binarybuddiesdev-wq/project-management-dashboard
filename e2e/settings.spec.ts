import { test, expect } from '@playwright/test'

async function loginUser(page: any) {
  await page.goto('/login')
  await page.fill('#email', 'john@example.com')
  await page.fill('#password', 'Password@123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/.*dashboard/)
}

test.describe('Settings Page Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await loginUser(page)
    await page.goto('/settings')
  })

  test('should display profile settings and allow updating them', async ({ page }) => {
    await expect(page.locator('h1:has-text("Settings")')).toBeVisible()

    // 1. Check default profile values match seeded user
    const nameInput = page.locator('#profile-name')
    await expect(nameInput).toHaveValue('John Doe')

    // 2. Change profile name and submit
    await nameInput.fill('John updated')
    await page.click('text=Save Profile')

    // 3. Confirm success message is shown
    await expect(page.locator('text=Profile updated successfully.')).toBeVisible()

    // 4. Verify updated name persists/updates in the layout (e.g. sidebar or avatar)
    await expect(page.locator('text=John updated').first()).toBeVisible()
  })

  test('should validate password change constraints', async ({ page }) => {
    // 1. Attempt mismatching passwords
    await page.fill('#current-password', 'Password@123')
    await page.fill('#new-password', 'NewPassword@123')
    await page.fill('#confirm-password', 'NewPassword@1234')
    await page.click('text=Change Password')

    // Confirm Zod message
    await expect(page.locator('text=Passwords do not match')).toBeVisible()

    // 2. Short password error check
    await page.fill('#new-password', '123')
    await page.fill('#confirm-password', '123')
    await page.click('text=Change Password')
    await expect(page.locator('text=New password must be at least 6 characters')).toBeVisible()
  })

  test('should toggle dark/light themes and update HTML class', async ({ page }) => {
    const html = page.locator('html')
    
    // Check current theme - could be dark by default
    const isDarkInitially = await html.evaluate((el) => el.classList.contains('dark'))
    
    // Toggle theme
    await page.click('button[aria-label="Toggle theme"]')
    
    // Verify theme class has flipped
    if (isDarkInitially) {
      await expect(html).not.toHaveClass(/dark/)
    } else {
      await expect(html).toHaveClass(/dark/)
    }

    // Toggle back
    await page.click('button[aria-label="Toggle theme"]')
    if (isDarkInitially) {
      await expect(html).toHaveClass(/dark/)
    } else {
      await expect(html).not.toHaveClass(/dark/)
    }
  })
})
