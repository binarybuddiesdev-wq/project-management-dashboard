# Project Phases — Project Management Dashboard

## How to Use This File
- This file defines all phases of the project
- After completing each phase update the status from 🔴 Not Started → 🟡 In Progress → 🟢 Complete
- Never start a new phase until the current phase passes all verification checks
- Verification order after every phase:
  1. pnpm exec tsc --noEmit
  2. pnpm run build
  3. pnpm run test
  4. pnpm run test --coverage
  5. QA visual check in browser

---

## Overall Progress
- Total Phases: 8
- Completed: 8
- In Progress: 0
- Not Started: 0

---

## Phase 1 — Project Setup & Design System
**Status:** 🟢 Complete

### DevOps Tasks
- [x] Scaffold Vite + React + TypeScript project using pnpm
- [x] Install all dependencies listed in agents.md
- [x] Set up strict TypeScript in tsconfig.app.json and tsconfig.node.json
- [x] Set up path aliases (@/) in vite.config.ts and tsconfig
- [x] Set up TailwindCSS
- [x] Initialize shadcn/ui
- [x] Set up Vitest config with coverage reporting
- [x] Set up Playwright config
- [x] Set up MSW (Mock Service Worker) with a base handler file
- [x] Confirm dev server runs with zero errors

### Designer Tasks
- [x] Define color palette (dark + light mode tokens)
- [x] Define typography scale (font family, sizes, weights, line heights)
- [x] Define spacing scale
- [x] Define border radius, shadow, and motion tokens
- [x] Define component design guidelines (cards, buttons, inputs, badges, modals)
- [x] Document everything in src/styles/design-system.md

### Frontend Tasks
- [x] Set up folder structure: components, pages, hooks, store, types, services, utils, layouts
- [x] Create index.ts barrel files in every folder
- [x] Set up React Router v6 with base routing structure
- [x] Set up Redux Toolkit store with base configuration
- [x] Set up TanStack Query provider
- [x] Set up MSW handlers for mock API
- [x] Set up global error boundary
- [x] Set up theme provider (dark/light toggle using RTK)
- [x] Set up custom cursor component
- [x] Set up global layout with sidebar and topbar placeholders

### Test Tasks
- [x] Write tests for all utility functions created in this phase
- [x] Write tests for theme hook and store slice
- [x] Confirm all tests pass

### Verification
- [x] pnpm exec tsc --noEmit — zero errors
- [x] pnpm run build — zero errors
- [x] pnpm run test — all pass
- [x] pnpm run test --coverage — utils and hooks covered
- [x] QA visual check — base layout renders correctly in dark and light mode

---

## Phase 2 — Authentication
**Status:** 🟢 Complete
**Depends On:** Phase 1 🟢 Complete

### Frontend Tasks
- [x] Create auth layout (src/layouts/AuthLayout.tsx)
- [x] Create Login page (src/pages/Auth/Login.tsx)
- [x] Create Signup page (src/pages/Auth/Signup.tsx)
- [x] Create forgot password page (src/pages/Auth/ForgotPassword.tsx)
- [x] Build auth forms using React Hook Form + Zod validation
- [x] Create useAuth custom hook (src/hooks/useAuth.ts)
- [x] Create auth RTK slice (src/store/authSlice.ts)
- [x] Create auth service using ky (src/services/auth.service.ts)
- [x] Set up MSW handlers for login, signup, forgot password
- [x] Implement protected route component (src/components/ProtectedRoute/)
- [x] Implement token storage and auto refresh logic
- [x] Add Framer Motion page transition animations on auth pages
- [x] Auth pages must be premium — not generic

### Test Tasks
- [x] useAuth.test.ts — test all hook scenarios
- [x] authSlice.test.ts — test all RTK slice actions
- [x] auth.service.test.ts — test all service functions
- [x] Login.test.tsx — happy path, validation errors, submit error
- [x] Signup.test.tsx — happy path, validation errors, password mismatch
- [x] ProtectedRoute.test.tsx — authenticated, unauthenticated redirect

### Verification
- [x] pnpm exec tsc --noEmit — zero errors
- [x] pnpm run build — zero errors
- [x] pnpm run test — all pass
- [x] pnpm run test --coverage — auth hooks, slice, service fully covered
- [x] QA — login works, signup works, protected route redirects, token persists on refresh

---

## Phase 3 — Core Layout & Navigation
**Status:** 🟢 Complete
**Depends On:** Phase 2 🟢 Complete

### Frontend Tasks
- [x] Create main app layout (src/layouts/AppLayout.tsx)
- [x] Create sidebar component (src/components/Sidebar/)
  - [x] Logo area
  - [x] Navigation links with active state
  - [x] Collapse/expand functionality
  - [x] User profile section at bottom
- [x] Create topbar component (src/components/Topbar/)
  - [x] Page title
  - [x] Search bar (UI only — functionality in later phase)
  - [x] Notifications bell with badge
  - [x] Theme toggle button
  - [x] User avatar with dropdown menu
- [x] Create breadcrumb component (src/components/Breadcrumb/)
- [x] Set up nested routing inside AppLayout
- [x] Sidebar must animate on collapse/expand using Framer Motion
- [x] All navigation must feel as premium as Linear.app sidebar

### Test Tasks
- [x] Sidebar.test.tsx — renders correctly, collapse toggle, active link
- [x] Topbar.test.tsx — renders correctly, theme toggle, user dropdown
- [x] Breadcrumb.test.tsx — renders correct path

### Verification
- [x] pnpm exec tsc --noEmit — zero errors
- [x] pnpm run build — zero errors
- [x] pnpm run test — all pass
- [x] QA — sidebar collapses, navigation works, topbar renders on all pages, theme toggle works

---

## Phase 4 — Dashboard
**Status:** 🟢 Complete
**Depends On:** Phase 3 🟢 Complete

### Frontend Tasks
- [x] Create Dashboard page (src/pages/Dashboard/Dashboard.tsx)
- [x] Create stats cards component (src/components/StatsCard/)
  - Total Projects, Total Tasks, Completed Tasks, Team Members
- [x] Create activity chart using Recharts (src/components/ActivityChart/)
- [x] Create task completion chart using Recharts (src/components/CompletionChart/)
- [x] Create recent projects list (src/components/RecentProjects/)
- [x] Create recent activity feed (src/components/ActivityFeed/)
- [x] Create useDashboard custom hook (src/hooks/useDashboard.ts)
- [x] Create dashboard service (src/services/dashboard.service.ts)
- [x] Set up MSW handlers for dashboard data
- [x] Use TanStack Query for all dashboard data fetching
- [x] Add loading skeleton states for all cards and charts
- [x] Add error states for all sections
- [x] Add empty states for all sections
- [x] All charts and cards must animate in on load using Framer Motion

### Test Tasks
- [x] useDashboard.test.ts — loading, success, error states
- [x] StatsCard.test.tsx — renders correctly with data, loading, error
- [x] ActivityChart.test.tsx — renders with data, empty state
- [x] RecentProjects.test.tsx — renders list, empty state
- [x] ActivityFeed.test.tsx — renders items, empty state

### Verification
- [x] pnpm exec tsc --noEmit — zero errors
- [x] pnpm run build — zero errors
- [x] pnpm run test — all pass
- [x] pnpm run test --coverage
- [x] QA — all charts render, loading skeletons show, data populates correctly

---

## Phase 5 — Projects
**Status:** 🟢 Complete
**Depends On:** Phase 4 🟢 Complete

### Frontend Tasks
- [x] Create Projects list page (src/pages/Projects/ProjectsList.tsx)
- [x] Create Project detail page (src/pages/Projects/ProjectDetail.tsx)
- [x] Create Project card component (src/components/ProjectCard/)
- [x] Create Create/Edit project modal (src/components/ProjectModal/)
  - [x] Using React Hook Form + Zod
  - [x] Fields: name, description, status, priority, due date, assignees
- [x] Create project filters and search (src/components/ProjectFilters/)
- [x] Create useProjects custom hook (src/hooks/useProjects.ts)
- [x] Create projects service (src/services/projects.service.ts)
- [x] Set up MSW handlers for projects CRUD
- [x] Use TanStack Query for fetching, creating, updating, deleting projects
- [x] Implement optimistic updates on project status change
- [x] Add loading, error, empty states for all views
- [x] Project cards must have hover animations
- [x] Modal must animate in/out using Framer Motion
- [x] Add page-level test files (ProjectsList.test.tsx, ProjectDetail.test.tsx)

### Test Tasks
- [x] useProjects.test.ts — fetch, create, update, delete, optimistic update
- [x] ProjectCard.test.tsx — renders correctly, hover state, click handler
- [x] ProjectModal.test.tsx — form validation, submit, cancel
- [x] ProjectFilters.test.tsx — filter changes, search input
- [x] projects.service.test.ts — all CRUD operations
- [x] ProjectsList.test.tsx — renders page title, project cards
- [x] ProjectDetail.test.tsx — renders project name, status, edit/delete buttons

### Verification
- [x] pnpm exec tsc --noEmit — zero errors
- [x] pnpm run build — zero errors
- [x] pnpm run test — 109 tests pass (30 test files)
- [x] pnpm run test --coverage — 86.94% statements, 89.83% functions
- [x] QA — CRUD works, filters work, modal animates, optimistic updates work

---

## Phase 6 — Kanban Board
**Status:** 🟢 Complete
**Depends On:** Phase 5 🟢 Complete

### Frontend Tasks
- [x] Create Kanban page (src/pages/Kanban/Kanban.tsx)
- [x] Create Kanban column component (src/components/KanbanColumn/)
- [x] Create Kanban card component (src/components/KanbanCard/)
- [x] Create Add/Edit task modal (src/components/TaskModal/)
  - [x] Fields: title, description, priority, assignee, due date, labels
- [x] Implement drag and drop using @hello-pangea/dnd
- [x] Create useKanban custom hook (src/hooks/useKanban.ts)
- [x] Create tasks service (src/services/tasks.service.ts)
- [x] Set up MSW handlers for tasks CRUD and status change
- [x] Use TanStack Query for task fetching and mutations
- [x] Implement optimistic updates on drag and drop
- [x] Column task count badge
- [x] Card priority color indicators
- [x] Smooth drag animation
- [x] Loading, error, empty states per column

### Test Tasks
- [x] useKanban.test.ts — fetch tasks, move task, create, delete
- [x] KanbanColumn.test.tsx — renders correctly, task count, empty state
- [x] KanbanCard.test.tsx — renders correctly, priority indicator, click
- [x] TaskModal.test.tsx — form validation, submit, cancel
- [x] tasks.service.test.ts — all operations

### Verification
- [x] pnpm exec tsc --noEmit — zero errors
- [x] pnpm run build — zero errors
- [x] pnpm run test — all pass
- [x] pnpm run test --coverage
- [x] QA — drag and drop works, tasks persist after drag, modal works, animations smooth

---

## Phase 7 — Team Members, Notifications & Settings
**Status:** 🟢 Complete
**Depends On:** Phase 6 🟢 Complete

### Frontend Tasks

#### Team Members
- [x] Create Team Members page (src/pages/Team/TeamMembers.tsx)
- [x] Create Member card component (src/components/MemberCard/)
- [x] Create Invite member modal (src/components/InviteMemberModal/)
- [x] Use TanStack Virtual for virtualized member list
- [x] Create useTeam custom hook (src/hooks/useTeam.ts)
- [x] Create team service (src/services/team.service.ts)
- [x] Set up MSW handlers for team data

#### Notifications
- [x] Create Notifications page (src/pages/Notifications/Notifications.tsx)
- [x] Create Notification item component (src/components/NotificationItem/)
- [x] Create notifications RTK slice (src/store/notificationsSlice.ts)
- [x] Create useNotifications custom hook (src/hooks/useNotifications.ts)
- [x] Unread badge count in topbar
- [x] Mark as read, mark all as read functionality
- [x] Empty state when no notifications

#### Settings
- [x] Create Settings page (src/pages/Settings/Settings.tsx)
- [x] Profile settings section (name, email, avatar)
- [x] Password change section
- [x] Theme preference section
- [x] All settings forms using React Hook Form + Zod
- [x] Create useSettings custom hook (src/hooks/useSettings.ts)

### Test Tasks
- [x] useTeam.test.ts
- [x] MemberCard.test.tsx
- [x] InviteMemberModal.test.tsx
- [x] useNotifications.test.ts
- [x] notificationsSlice.test.ts
- [x] NotificationItem.test.tsx
- [x] useSettings.test.ts
- [x] Settings form validation tests

### Verification
- [x] pnpm exec tsc --noEmit — zero errors
- [x] pnpm run build — zero errors
- [x] pnpm run test — all pass
- [x] pnpm run test --coverage
- [x] QA — all three sections work, virtualized list scrolls smoothly, notifications badge updates

---

## Phase 8 — End to End Tests & Final Polish
**Status:** 🟢 Complete
**Depends On:** Phase 7 🟢 Complete

### E2E Test Tasks
- [x] e2e/auth.spec.ts
  - [x] User can sign up
  - [x] User can log in
  - [x] User is redirected when not authenticated
  - [x] User can log out
- [x] e2e/dashboard.spec.ts
  - [x] Dashboard loads with all sections
  - [x] Charts render correctly
  - [x] Stats cards show correct data
- [x] e2e/projects.spec.ts
  - [x] User can create a project
  - [x] User can edit a project
  - [x] User can delete a project
  - [x] Filters work correctly
- [x] e2e/kanban.spec.ts
  - [x] Kanban board loads with columns
  - [x] User can create a task
  - [x] User can drag a task between columns
  - [x] User can delete a task
- [x] e2e/team.spec.ts
  - [x] Team members list loads
  - [x] User can invite a member
- [x] e2e/notifications.spec.ts
  - [x] Notifications load
  - [x] Mark as read works
- [x] e2e/settings.spec.ts
  - [x] Profile settings save correctly
  - [x] Password change validates correctly

### Final Polish Tasks
- [x] Audit every page for consistent spacing and alignment
- [x] Audit every animation — must feel smooth not janky
- [x] Audit all loading states — skeletons must match actual content layout
- [x] Audit all error states — must be helpful not generic
- [x] Audit all empty states — must be informative and have a clear CTA
- [x] Audit mobile responsiveness on every page
- [x] Audit dark and light mode on every page
- [x] Check for any console errors or warnings
- [x] Final pnpm run build must be clean

### Verification
- [x] pnpm exec tsc --noEmit — zero errors
- [x] pnpm run build — zero errors
- [x] pnpm run test — all unit and UI tests pass
- [x] pnpm run test --coverage — full coverage report
- [x] pnpm exec playwright test — all E2E tests pass
- [x] QA — full walkthrough of entire app

---

## Phase Completion Summary

| Phase | Name | Status |
|-------|------|--------|
| 1 | Project Setup & Design System | 🟢 Complete |
| 2 | Authentication | 🟢 Complete |
| 3 | Core Layout & Navigation | 🟢 Complete |
| 4 | Dashboard | 🟢 Complete |
| 5 | Projects | 🟢 Complete |
| 6 | Kanban Board | 🟢 Complete |
| 7 | Team Members, Notifications & Settings | 🟢 Complete |
| 8 | End to End Tests & Final Polish | 🟢 Complete |