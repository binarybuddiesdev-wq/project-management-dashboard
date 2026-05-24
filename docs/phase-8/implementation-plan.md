# Implementation Plan — Phase 8 — End to End Tests & Final Polish

Create and run Playwright E2E tests for all application modules, perform visual and responsiveness audits on each page, align spacing and loading/skeleton states, check for console warning/errors, and ensure production builds are perfectly clean.

## User Review Required

> [!IMPORTANT]
> - **Playwright Setup**: Tests will be placed in the `e2e/` folder. They run using local MSW (Mock Service Worker) mocking, enabled by default in Vite's development mode (`pnpm run dev`), which intercepts network requests and simulates user actions.
> - **Test Coverage**:
>   - `auth.spec.ts` (Sign up, login, redirection, logout)
>   - `dashboard.spec.ts` (Verification of stats cards, Recharts renders)
>   - `projects.spec.ts` (Projects list, filters, creating, editing, and deleting a project)
>   - `kanban.spec.ts` (Kanban board layout, task creation, dragging/optimistic status updates, task deletion)
>   - `team.spec.ts` (Team members page list, virtual scroll container presence, invite modal flow)
>   - `notifications.spec.ts` (Badge dynamic unread indicator, mark-as-read, read-all)
>   - `settings.spec.ts` (Profile edits, password validations, theme preferences)

---

## Proposed Changes

### 1. E2E Tests (Playwright)

#### [NEW] [auth.spec.ts](file:///c:/antigravity-test/project-management-dashboard/e2e/auth.spec.ts)
- Test unauthorized access redirection from `/dashboard` or `/projects` to `/login`.
- Test user signup flow via `/signup` with validations.
- Test user login flow with `john@example.com` / `Password@123`.
- Test user logout flow by toggling profile dropdown and clicking "Sign Out".

#### [NEW] [dashboard.spec.ts](file:///c:/antigravity-test/project-management-dashboard/e2e/dashboard.spec.ts)
- Test stats cards display with non-zero change indicators.
- Test Activity and Task Completion charts render.
- Test recent activities feed and recent projects grid load.

#### [NEW] [projects.spec.ts](file:///c:/antigravity-test/project-management-dashboard/e2e/projects.spec.ts)
- Test rendering the list of seeded projects.
- Test filters (status, priority, search text query).
- Test opening modal, submitting a new project, and seeing it render.
- Test editing an existing project, and deleting a project.

#### [NEW] [kanban.spec.ts](file:///c:/antigravity-test/project-management-dashboard/e2e/kanban.spec.ts)
- Test displaying the four columns (Backlog, In Progress, In Review, Done).
- Test creating a task and verifying it appears in the Backlog column.
- Test drag-and-drop simulated actions (triggering MSW status update).
- Test deleting a task.

#### [NEW] [team.spec.ts](file:///c:/antigravity-test/project-management-dashboard/e2e/team.spec.ts)
- Test team page list loading and virtualized list scrollbar.
- Test inviting a new member via form inputs in the invite modal.

#### [NEW] [notifications.spec.ts](file:///c:/antigravity-test/project-management-dashboard/e2e/notifications.spec.ts)
- Test Topbar bell badge updates to match unread count.
- Test marking notification item as read.
- Test marking all items as read and checking the empty/success state.

#### [NEW] [settings.spec.ts](file:///c:/antigravity-test/project-management-dashboard/e2e/settings.spec.ts)
- Test updating user profile name and dispatches.
- Test password updates and verification constraints.
- Test switching themes (dark to light) and verifying HTML classes update.

---

### 2. Final Polish

#### [MODIFY] [index.css](file:///c:/antigravity-test/project-management-dashboard/src/index.css)
- Ensure all pages use consistent custom scrollbars.
- Check responsive styles or overflow configurations.

---

## Verification Plan

### Automated Tests
- Run TS checks: `pnpm exec tsc --noEmit`
- Run build check: `pnpm run build`
- Run Vitest tests: `pnpm run test`
- Run Vitest coverage: `pnpm run test --coverage`
- Run Playwright E2E tests: `pnpm exec playwright test`

### Manual Verification
- Visual inspection of skeletons, animations, loading states, and responsiveness.
- Check dark/light theme persistence and smooth layouts.
