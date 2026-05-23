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
- Completed: 4
- In Progress: 0
- Not Started: 4

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
**Status:** 🔴 Not Started
**Depends On:** Phase 4 🟢 Complete

### Frontend Tasks
- [ ] Create Projects list page (src/pages/Projects/ProjectsList.tsx)
- [ ] Create Project detail page (src/pages/Projects/ProjectDetail.tsx)
- [ ] Create Project card component (src/components/ProjectCard/)
- [ ] Create Create/Edit project modal (src/components/ProjectModal/)
  - [ ] Using React Hook Form + Zod
  - [ ] Fields: name, description, status, priority, due date, assignees
- [ ] Create project filters and search (src/components/ProjectFilters/)
- [ ] Create useProjects custom hook (src/hooks/useProjects.ts)
- [ ] Create projects service (src/services/projects.service.ts)
- [ ] Set up MSW handlers for projects CRUD
- [ ] Use TanStack Query for fetching, creating, updating, deleting projects
- [ ] Implement optimistic updates on project status change
- [ ] Add loading, error, empty states for all views
- [ ] Project cards must have hover animations
- [ ] Modal must animate in/out using Framer Motion

### Test Tasks
- [ ] useProjects.test.ts — fetch, create, update, delete, optimistic update
- [ ] ProjectCard.test.tsx — renders correctly, hover state, click handler
- [ ] ProjectModal.test.tsx — form validation, submit, cancel
- [ ] ProjectFilters.test.tsx — filter changes, search input
- [ ] projects.service.test.ts — all CRUD operations

### Verification
- [ ] pnpm exec tsc --noEmit — zero errors
- [ ] pnpm run build — zero errors
- [ ] pnpm run test — all pass
- [ ] pnpm run test --coverage
- [ ] QA — CRUD works, filters work, modal animates, optimistic updates work

---

## Phase 6 — Kanban Board
**Status:** 🔴 Not Started
**Depends On:** Phase 5 🟢 Complete

### Frontend Tasks
- [ ] Create Kanban page (src/pages/Kanban/Kanban.tsx)
- [ ] Create Kanban column component (src/components/KanbanColumn/)
- [ ] Create Kanban card component (src/components/KanbanCard/)
- [ ] Create Add/Edit task modal (src/components/TaskModal/)
  - [ ] Fields: title, description, priority, assignee, due date, labels
- [ ] Implement drag and drop using @hello-pangea/dnd
- [ ] Create useKanban custom hook (src/hooks/useKanban.ts)
- [ ] Create tasks service (src/services/tasks.service.ts)
- [ ] Set up MSW handlers for tasks CRUD and status change
- [ ] Use TanStack Query for task fetching and mutations
- [ ] Implement optimistic updates on drag and drop
- [ ] Column task count badge
- [ ] Card priority color indicators
- [ ] Smooth drag animation
- [ ] Loading, error, empty states per column

### Test Tasks
- [ ] useKanban.test.ts — fetch tasks, move task, create, delete
- [ ] KanbanColumn.test.tsx — renders correctly, task count, empty state
- [ ] KanbanCard.test.tsx — renders correctly, priority indicator, click
- [ ] TaskModal.test.tsx — form validation, submit, cancel
- [ ] tasks.service.test.ts — all operations

### Verification
- [ ] pnpm exec tsc --noEmit — zero errors
- [ ] pnpm run build — zero errors
- [ ] pnpm run test — all pass
- [ ] pnpm run test --coverage
- [ ] QA — drag and drop works, tasks persist after drag, modal works, animations smooth

---

## Phase 7 — Team Members, Notifications & Settings
**Status:** 🔴 Not Started
**Depends On:** Phase 6 🟢 Complete

### Frontend Tasks

#### Team Members
- [ ] Create Team Members page (src/pages/Team/TeamMembers.tsx)
- [ ] Create Member card component (src/components/MemberCard/)
- [ ] Create Invite member modal (src/components/InviteMemberModal/)
- [ ] Use TanStack Virtual for virtualized member list
- [ ] Create useTeam custom hook (src/hooks/useTeam.ts)
- [ ] Create team service (src/services/team.service.ts)
- [ ] Set up MSW handlers for team data

#### Notifications
- [ ] Create Notifications page (src/pages/Notifications/Notifications.tsx)
- [ ] Create Notification item component (src/components/NotificationItem/)
- [ ] Create notifications RTK slice (src/store/notificationsSlice.ts)
- [ ] Create useNotifications custom hook (src/hooks/useNotifications.ts)
- [ ] Unread badge count in topbar
- [ ] Mark as read, mark all as read functionality
- [ ] Empty state when no notifications

#### Settings
- [ ] Create Settings page (src/pages/Settings/Settings.tsx)
- [ ] Profile settings section (name, email, avatar)
- [ ] Password change section
- [ ] Theme preference section
- [ ] All settings forms using React Hook Form + Zod
- [ ] Create useSettings custom hook (src/hooks/useSettings.ts)

### Test Tasks
- [ ] useTeam.test.ts
- [ ] MemberCard.test.tsx
- [ ] InviteMemberModal.test.tsx
- [ ] useNotifications.test.ts
- [ ] notificationsSlice.test.ts
- [ ] NotificationItem.test.tsx
- [ ] useSettings.test.ts
- [ ] Settings form validation tests

### Verification
- [ ] pnpm exec tsc --noEmit — zero errors
- [ ] pnpm run build — zero errors
- [ ] pnpm run test — all pass
- [ ] pnpm run test --coverage
- [ ] QA — all three sections work, virtualized list scrolls smoothly, notifications badge updates

---

## Phase 8 — End to End Tests & Final Polish
**Status:** 🔴 Not Started
**Depends On:** Phase 7 🟢 Complete

### E2E Test Tasks
- [ ] e2e/auth.spec.ts
  - [ ] User can sign up
  - [ ] User can log in
  - [ ] User is redirected when not authenticated
  - [ ] User can log out
- [ ] e2e/dashboard.spec.ts
  - [ ] Dashboard loads with all sections
  - [ ] Charts render correctly
  - [ ] Stats cards show correct data
- [ ] e2e/projects.spec.ts
  - [ ] User can create a project
  - [ ] User can edit a project
  - [ ] User can delete a project
  - [ ] Filters work correctly
- [ ] e2e/kanban.spec.ts
  - [ ] Kanban board loads with columns
  - [ ] User can create a task
  - [ ] User can drag a task between columns
  - [ ] User can delete a task
- [ ] e2e/team.spec.ts
  - [ ] Team members list loads
  - [ ] User can invite a member
- [ ] e2e/notifications.spec.ts
  - [ ] Notifications load
  - [ ] Mark as read works
- [ ] e2e/settings.spec.ts
  - [ ] Profile settings save correctly
  - [ ] Password change validates correctly

### Final Polish Tasks
- [ ] Audit every page for consistent spacing and alignment
- [ ] Audit every animation — must feel smooth not janky
- [ ] Audit all loading states — skeletons must match actual content layout
- [ ] Audit all error states — must be helpful not generic
- [ ] Audit all empty states — must be informative and have a clear CTA
- [ ] Audit mobile responsiveness on every page
- [ ] Audit dark and light mode on every page
- [ ] Check for any console errors or warnings
- [ ] Final pnpm run build must be clean

### Verification
- [ ] pnpm exec tsc --noEmit — zero errors
- [ ] pnpm run build — zero errors
- [ ] pnpm run test — all unit and UI tests pass
- [ ] pnpm run test --coverage — full coverage report
- [ ] pnpm exec playwright test — all E2E tests pass
- [ ] QA — full walkthrough of entire app

---

## Phase Completion Summary

| Phase | Name | Status |
|-------|------|--------|
| 1 | Project Setup & Design System | 🟢 Complete |
| 2 | Authentication | 🟢 Complete |
| 3 | Core Layout & Navigation | 🟢 Complete |
| 4 | Dashboard | 🟢 Complete |
| 5 | Projects | 🔴 Not Started |
| 6 | Kanban Board | 🔴 Not Started |
| 7 | Team Members, Notifications & Settings | 🔴 Not Started |
| 8 | End to End Tests & Final Polish | 🔴 Not Started |