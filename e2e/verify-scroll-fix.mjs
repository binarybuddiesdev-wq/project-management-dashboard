import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

// Login
await page.goto('http://localhost:5173/login');
await page.waitForSelector('input[type="email"]', { timeout: 10000 });
await page.fill('input[type="email"]', 'john@example.com');
await page.fill('input[type="password"]', 'Password@123');
await page.click('button[type="submit"]');
await page.waitForTimeout(1500);

// Navigate to /projects — screenshot
await page.goto('http://localhost:5173/projects');
await page.waitForTimeout(2000);
await page.screenshot({ path: 'projects-page-full.png', fullPage: true });

// Navigate to /kanban — screenshot
await page.goto('http://localhost:5173/kanban');
await page.waitForTimeout(2000);
await page.screenshot({ path: 'kanban-page-full.png', fullPage: true });

// Check which elements have .kanban-scroll and which ones overflow
const data = await page.evaluate(() => {
  const results = { elementsWithKanbanScroll: [], scrollableWithOverflow: [] };

  // Find all elements with kanban-scroll class
  document.querySelectorAll('.kanban-scroll').forEach((el, i) => {
    const cs = getComputedStyle(el);
    results.elementsWithKanbanScroll.push({
      index: i,
      className: el.className.substring(0, 100),
      tag: el.tagName,
      rect: el.getBoundingClientRect(),
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      hasOverflow: el.scrollHeight > el.clientHeight,
      scrollbarWidth: cs.scrollbarWidth,
      scrollbarColor: cs.scrollbarColor,
      overflowY: cs.overflowY,
    });
  });

  // Find all scrollable elements that have overflow
  document.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    if (el.scrollHeight > el.clientHeight + 1 && el.clientHeight > 10 &&
        (cs.overflowY === 'auto' || cs.overflowY === 'scroll')) {
      results.scrollableWithOverflow.push({
        tag: el.tagName,
        className: el.className.substring(0, 100),
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        overflowY: cs.overflowY,
        scrollbarWidth: cs.scrollbarWidth,
        hasKanbanScrollClass: el.classList.contains('kanban-scroll'),
      });
    }
  });

  return results;
});

console.log('=== Elements with .kanban-scroll class ===');
console.log(JSON.stringify(data.elementsWithKanbanScroll, null, 2));

console.log('\n=== Scrollable elements with actual overflow ===');
console.log(JSON.stringify(data.scrollableWithOverflow, null, 2));

if (data.scrollableWithOverflow.length > 0) {
  const styled = data.scrollableWithOverflow.filter(e => e.hasKanbanScrollClass);
  if (styled.length === data.scrollableWithOverflow.length) {
    console.log('\n✓ ALL overflowing scrollable elements have .kanban-scroll class');
  } else {
    console.log('\n⚠ Only some overflowing elements have .kanban-scroll class');
  }
} else {
  console.log('\n⚠ No scrollable elements with overflow found - need more content');
}

// Now create more tasks to force overflow, then re-check
console.log('\n--- Creating additional tasks to force overflow ---');

// Go to kanban and create tasks via the "New Task" button repeatedly
await page.goto('http://localhost:5173/kanban');
await page.waitForTimeout(1000);

for (let i = 0; i < 8; i++) {
  await page.click('button:has-text("New Task")');
  await page.waitForTimeout(300);
  // Fill the task form
  await page.fill('input[id="title"]', `Test Task ${i + 5}`);
  await page.fill('textarea[id="description"]', 'This is a test task created to verify scrollbar styling');
  await page.waitForTimeout(200);
  // Select backlog status
  const statusSelect = page.locator('select, [role="combobox"]').first();
  if (await statusSelect.isVisible()) {
    await statusSelect.click();
    await page.locator('[role="option"]:has-text("Backlog")').click();
    await page.waitForTimeout(100);
  }
  await page.click('button[type="submit"]');
  await page.waitForTimeout(500);
}

await page.waitForTimeout(1000);
await page.screenshot({ path: 'kanban-after-tasks.png', fullPage: true });

// Re-check after creating tasks
const dataAfter = await page.evaluate(() => {
  const results = { elementsWithKanbanScroll: [], scrollableWithOverflow: [] };

  document.querySelectorAll('.kanban-scroll').forEach((el, i) => {
    const cs = getComputedStyle(el);
    results.elementsWithKanbanScroll.push({
      index: i,
      className: el.className.substring(0, 100),
      hasOverflow: el.scrollHeight > el.clientHeight,
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      scrollbarWidth: cs.scrollbarWidth,
      scrollbarColor: cs.scrollbarColor,
    });
  });

  document.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    if (el.scrollHeight > el.clientHeight + 1 && el.clientHeight > 10 &&
        (cs.overflowY === 'auto' || cs.overflowY === 'scroll')) {
      results.scrollableWithOverflow.push({
        tag: el.tagName,
        partialClass: el.className.substring(0, 120),
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        overflowY: cs.overflowY,
        scrollbarWidth: cs.scrollbarWidth,
        hasKanbanScrollClass: el.classList.contains('kanban-scroll'),
      });
    }
  });

  return results;
});

console.log('\n=== AFTER CREATING TASKS: Elements with .kanban-scroll ===');
console.log(JSON.stringify(dataAfter.elementsWithKanbanScroll, null, 2));

console.log('\n=== AFTER CREATING TASKS: Scrollable with overflow ===');
console.log(JSON.stringify(dataAfter.scrollableWithOverflow, null, 2));

const styledAfter = dataAfter.scrollableWithOverflow.filter(e => e.hasKanbanScrollClass);
console.log(`\nStyled overflow elements: ${styledAfter.length}/${dataAfter.scrollableWithOverflow.length}`);

await browser.close();
