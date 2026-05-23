# Implementation Plan — Phase 4 — Dashboard

Implement a high-fidelity, premium project management dashboard featuring animated stats cards, interactive Recharts visualizations (Activity Chart and Task Completion Chart), a recent projects list, recent activity feed, skeleton loading states, and robust error/empty visual states.

## User Review Required

> [!IMPORTANT]
> - **Recharts in React 19/Vite**: Since Recharts is used with React 19, we will ensure it renders correctly and mock its responsive behavior or elements inside Vitest to avoid rendering engine mock errors (especially with `<ResponsiveContainer />`).
> - **MSW Interceptors**: MSW mock handlers will be extended in `src/services/mock/handlers.ts` to return mock dashboard data, featuring options to test error and empty states (e.g. by passing query params or header flags if needed, or by testing error resolution).
> - **Framer Motion Animations**: Consistent motion animations will fade-in and scale cards/charts on first render, matching the premium aesthetics of Linear.app.

## Open Questions
No open questions at this time. The spec is fully clear.

## Proposed Changes

### Dashboard Types & Models

#### [NEW] [dashboard.types.ts](file:///c:/antigravity-test/project-management-dashboard/src/types/dashboard.types.ts)
Define state shapes and props for dashboard stats, activity, completion, projects, and feed list items:
- `IDashboardStats`: Represents summary statistics.
- `IActivityData`: Points for daily completion charts.
- `ICompletionData`: Status breakdown for the radial completion chart.
- `IRecentProject`: Quick summary of recently active projects.
- `IRecentActivity`: Log items of recent actions taken by team members.
- `IDashboardData`: Combined dashboard payload.

#### [MODIFY] [index.ts](file:///c:/antigravity-test/project-management-dashboard/src/types/index.ts)
Export all new interfaces from the dashboard types file.

---

### Dashboard Service & Custom Hook

#### [NEW] [dashboard.service.ts](file:///c:/antigravity-test/project-management-dashboard/src/services/dashboard.service.ts)
Create api call functions utilizing `ky` and `parseApiError`:
- `getDashboardData()`: Fetches `/api/dashboard` data.

#### [MODIFY] [index.ts](file:///c:/antigravity-test/project-management-dashboard/src/services/index.ts)
Export the new dashboard service methods.

#### [NEW] [useDashboard.ts](file:///c:/antigravity-test/project-management-dashboard/src/hooks/useDashboard.ts)
Create custom React hook wrapping the TanStack `useQuery` call. Returns:
- `dashboardData`: `IDashboardData | undefined`
- `isLoading`: boolean
- `isError`: boolean
- `error`: string | null
- `refetch`: function

#### [MODIFY] [index.ts](file:///c:/antigravity-test/project-management-dashboard/src/hooks/index.ts)
Export `useDashboard` hook.

---

### MSW Handler Mocking

#### [MODIFY] [handlers.ts](file:///c:/antigravity-test/project-management-dashboard/src/services/mock/handlers.ts)
Implement `GET /api/dashboard` returning complete mock data including:
- Stats cards totals.
- Activity array (daily activity data).
- Completion array (percentage/status counts).
- Recent projects.
- Recent activities.

---

### UI Components

#### [NEW] [StatsCard.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/StatsCard/StatsCard.tsx)
Individual animated metrics card. Features:
- Animated increment/count-up using Framer Motion.
- Small sparkline or delta indicator (+X% vs last week).
- Proper skeleton states.

#### [NEW] [ActivityChart.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/ActivityChart/ActivityChart.tsx)
Responsive bar/area chart using `recharts` to show active/completed tasks over the last week.

#### [NEW] [CompletionChart.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/CompletionChart/CompletionChart.tsx)
Donut/radial chart displaying current task statuses (Completed, In Progress, Backlog, etc.).

#### [NEW] [RecentProjects.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/RecentProjects/RecentProjects.tsx)
Renders projects list with name, status badges, progress bars, and target dates. Includes empty/error visuals.

#### [NEW] [ActivityFeed.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/ActivityFeed/ActivityFeed.tsx)
Vertical timeline listing recent changes, avatar badges, and timestamps.

#### [MODIFY] [Dashboard.tsx](file:///c:/antigravity-test/project-management-dashboard/src/pages/Dashboard/Dashboard.tsx)
Orchestrate the page using `useDashboard` hook, displaying loading skeleton wrappers, error boundary fallbacks with retry actions, empty states, and standard layout bindings.

#### [MODIFY] [index.ts](file:///c:/antigravity-test/project-management-dashboard/src/components/index.ts)
Add barrel exports for the new dashboard components.

---

### Testing Suite

#### [NEW] [useDashboard.test.ts](file:///c:/antigravity-test/project-management-dashboard/src/hooks/useDashboard.test.ts)
Vitest unit tests for the TanStack hook, validating loading transitions, data resolution, and query failure scenarios.

#### [NEW] [StatsCard.test.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/StatsCard/StatsCard.test.tsx)
Verify content outputs, delta calculations, skeleton state checks.

#### [NEW] [ActivityChart.test.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/ActivityChart/ActivityChart.test.tsx)
Verify Recharts renders correctly, and checks empty/zero data fallbacks.

#### [NEW] [CompletionChart.test.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/CompletionChart/CompletionChart.test.tsx)
Verify task completion chart renders status values correctly, and checks empty/zero data fallbacks.

#### [NEW] [RecentProjects.test.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/RecentProjects/RecentProjects.test.tsx)
Verify listing logic, status display, and empty states.

#### [NEW] [ActivityFeed.test.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/ActivityFeed/ActivityFeed.test.tsx)
Verify action list rendering, layout structure, and empty feed states.

---

## Verification Plan

### Automated Tests
- Run type checks: `pnpm exec tsc --noEmit`
- Run build check: `pnpm run build`
- Run unit/UI tests: `pnpm run test`
- Run test coverage checks: `pnpm run test --coverage`

### Manual Verification
- Verify layout responsiveness (mobile, tablet, desktop).
- Inspect loading skeleton visual transitions.
- Validate error visual fallbacks and the "Retry" action click handler.
- Verify light/dark theme toggle overrides.
