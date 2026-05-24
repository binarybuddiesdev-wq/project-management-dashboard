import { test, expect } from '@playwright/test'

async function loginUser(page) {
  await page.goto('/login')
  await page.fill('#email', 'john@example.com')
  await page.fill('#password', 'Password@123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/.*dashboard/)
}

test.describe('Notifications flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await loginUser(page)
  })

  test('should display notifications list and mark as read', async ({ page }) => {
    // 1. Verify Topbar notification badge count matches seeded unread count (4)
    const badge = page.locator('a[aria-label^="Notifications:"]')
    await expect(badge).toContainText('4')

    // Go to notifications page
    await page.goto('/notifications')
    await expect(page.locator('h1:has-text("Notifications")')).toBeVisible()

    // 2. Verify seeded notifications message content is visible
    await expect(page.locator('text=Kyle Reese completed "Implement Login UI"')).toBeVisible()

    // 3. Mark one notification as read
    // Find the first unread notification item (they usually have a blue unread indicator dot)
    // We hover to reveal the checkmark button and click it
    const firstNotification = page.locator('[data-testid^="notification-item-n"]').first()
    await firstNotification.hover()
    
    const markReadBtn = firstNotification.locator('button[aria-label="Mark as read"]')
    await markReadBtn.click()

    // Expect the Topbar badge count to decrement from 4 to 3
    await expect(badge).toContainText('3')
  })

  test('should mark all notifications as read', async ({ page }) => {
    await page.goto('/notifications')
    
    // Click "Mark all as read" button
    await page.click('text=Mark all as read')

    // Expect the Topbar badge to hide (as unread count becomes 0)
    const badgeBadge = page.locator('a[aria-label^="Notifications:"] span')
    await expect(badgeBadge).toBeHidden()
  })
})
