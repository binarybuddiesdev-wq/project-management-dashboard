import { test, expect } from '@playwright/test'

async function loginUser(page) {
  await page.goto('/login')
  await page.fill('#email', 'john@example.com')
  await page.fill('#password', 'Password@123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/.*dashboard/)
}

test.describe('Projects Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await loginUser(page)
    await page.goto('/projects')
  })

  test('should display seeded projects list', async ({ page }) => {
    await expect(page.locator('text=Brand Redesign')).toBeVisible()
    await expect(page.locator('text=Mobile App Implementation')).toBeVisible()
  })

  test('should filter projects correctly', async ({ page }) => {
    // Test search filter
    await page.fill('input[placeholder="Search projects..."]', 'Brand')
    await expect(page.locator('text=Mobile App Implementation')).toBeHidden()
    await expect(page.locator('text=Brand Redesign')).toBeVisible()

    // Reset search
    await page.fill('input[placeholder="Search projects..."]', '')

    // Test status filter
    await page.selectOption('select[aria-label="Filter by status"]', 'completed')
    await expect(page.locator('text=Brand Redesign')).toBeHidden()
    await expect(page.locator('text=API Refactoring')).toBeVisible()
  })

  test('should create, edit and delete a project', async ({ page }) => {
    // 1. Create Project
    await page.click('text=New Project')
    await page.fill('#name', 'E2E New Project')
    await page.fill('#description', 'This is a brand new description for testing purposes')
    await page.selectOption('#status', 'active')
    await page.selectOption('#priority', 'urgent')
    await page.click('input#dueDate + button')
    await page.locator('button.rdp-day_button').first().click()
    await page.fill('#assignees', 'Sarah Connor')
    await page.click('button[type="submit"]')

    // Redirection to details page
    await expect(page).toHaveURL(/\/projects\/p.*/)
    await expect(page.locator('h1')).toHaveText('E2E New Project')

    // 2. Edit Project
    await page.click('button[aria-label="Edit project"]')
    await page.fill('#name', 'E2E Updated Project')
    await page.click('button[type="submit"]')
    await expect(page.locator('h1')).toHaveText('E2E Updated Project')

    // 3. Delete Project
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('delete this project')
      await dialog.accept()
    })
    await page.click('button[aria-label="Delete project"]')

    // Redirection back to projects list
    await expect(page).toHaveURL(/.*projects/)
    await expect(page.locator('text=E2E Updated Project')).toBeHidden()
  })
})
