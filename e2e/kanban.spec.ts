import { test, expect } from '@playwright/test'

async function loginUser(page) {
  await page.goto('/login')
  await page.fill('#email', 'john@example.com')
  await page.fill('#password', 'Password@123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/.*dashboard/)
}

test.describe('Kanban Board operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await loginUser(page)
    await page.goto('/kanban')
  })

  test('should display board with columns and seeded tasks', async ({ page }) => {
    await expect(page.locator('text=Backlog')).toBeVisible()
    await expect(page.locator('text=In Progress')).toBeVisible()
    await expect(page.locator('text=In Review')).toBeVisible()
    await expect(page.locator('text=Done')).toBeVisible()

    await expect(page.locator('text=Research User Personas')).toBeVisible()
  })

  test('should create, drag, and delete a task', async ({ page }) => {
    // 1. Create a task
    await page.click('text=New Task')
    await page.fill('#title', 'E2E Task Item')
    await page.fill('#description', 'Task created dynamically inside Playwright specs')
    await page.selectOption('#status', 'backlog')
    await page.selectOption('#priority', 'low')
    await page.click('input#dueDate + button')
    await page.locator('button.rdp-day_button').first().click()
    await page.fill('#assignee', 'Sarah Connor')
    await page.fill('#labels', 'Testing, Automation')
    await page.click('button[type="submit"]')

    // Confirm rendered in Backlog
    const backlogColumn = page.locator('[data-rfd-droppable-id="backlog"]')
    await expect(backlogColumn.locator('text=E2E Task Item')).toBeVisible()

    // 2. Move task to In Progress by editing it (more reliable in E2E than react-beautiful-dnd drag simulation)
    const inProgressColumn = page.locator('[data-rfd-droppable-id="in_progress"]')
    const taskCard = page.locator('text=E2E Task Item')
    await taskCard.hover()
    await page.click('button[aria-label="Edit task E2E Task Item"]')
    await page.selectOption('#status', 'in_progress')
    await page.click('button[type="submit"]')
    
    // Verify task is now in "In Progress" column and no longer in "Backlog"
    await expect(inProgressColumn.locator('text=E2E Task Item')).toBeVisible()
    await expect(backlogColumn.locator('text=E2E Task Item')).toBeHidden()

    // 3. Delete the task
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('delete this task')
      await dialog.accept()
    })
    
    // Hover over the card to reveal actions and click delete button
    const deleteBtn = page.locator('button[aria-label="Delete task E2E Task Item"]')
    await deleteBtn.click()

    // Verify task is deleted
    await expect(page.locator('text=E2E Task Item')).toBeHidden()
  })
})
