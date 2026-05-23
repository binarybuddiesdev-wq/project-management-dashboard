# Phase 3 — Core Layout & Navigation

Establish a premium sidebar and topbar navigation system modeled after Linear.app. This includes animated collapse/expand transitions, responsive mobile layers, notifications preview, theme control, search mock inputs, breadcrumbs tracking, and user profile management with session teardown.

## User Review Required

> [!IMPORTANT]
> - **Redux UI Slice**: Introduced a global `ui` Redux slice to manage UI properties (e.g. sidebar collapse state) to comply with the architecture rules in `agents.md` stating that Redux Toolkit manages UI state.
> - **Avatar Integration**: Sidebar user profiles and Topbar user dropdowns will render real images from `i.pravatar.cc` to match the design aesthetics rule of providing a premium UI.

## Proposed Changes

### UI & Global State
Introduce a UI slice to control navigation configurations globally.

#### [NEW] [ui.types.ts](file:///c:/antigravity-test/project-management-dashboard/src/types/ui.types.ts)
Define state shapes for general UI controls:
```typescript
export interface IUiState {
  sidebarCollapsed: boolean
}
```

#### [MODIFY] [store.types.ts](file:///c:/antigravity-test/project-management-dashboard/src/types/store.types.ts)
Extend `IRootState` to include the `ui` slice.

#### [NEW] [uiSlice.ts](file:///c:/antigravity-test/project-management-dashboard/src/store/uiSlice.ts)
Implement UI slice to toggle and persist sidebar collapse status.

#### [MODIFY] [store.ts](file:///c:/antigravity-test/project-management-dashboard/src/store/store.ts)
Register `uiReducer` inside the Redux configure store call.

---

### Navigation Components
Construct highly refined navigational controls.

#### [NEW] [navigation.types.ts](file:///c:/antigravity-test/project-management-dashboard/src/types/navigation.types.ts)
Define component prop shapes:
```typescript
import type { IUser } from './auth.types'

export interface ISidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  user: IUser | null
}

export interface ITopbarProps {
  title: string
  isCollapsed: boolean
  onToggle: () => void
  user: IUser | null
  onLogout: () => void
}
```

#### [NEW] [Sidebar.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/Sidebar/Sidebar.tsx)
Collapsible navigation panel featuring:
- Brand Logo header.
- Animated expand/collapse width via Framer Motion.
- Active navigation item indicators.
- User profile banner at the bottom.

#### [NEW] [Topbar.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/Topbar/Topbar.tsx)
Application header bar providing:
- Responsive page titles.
- Search mock input bar.
- Notifications indicator bell.
- Theme dark/light mode toggle.
- Profile dropdown container with logout link.

#### [NEW] [Breadcrumb.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/Breadcrumb/Breadcrumb.tsx)
Location tracking bar derived from active React Router paths.

---

### Layouts & Outlets
Modify the core dashboard frame to coordinate new layout headers.

#### [MODIFY] [AppLayout.tsx](file:///c:/antigravity-test/project-management-dashboard/src/layouts/AppLayout/AppLayout.tsx)
Connect `useAuth`, `useTheme`, and `useSelector` to coordinate header properties. Assemble `<Sidebar />` and `<Topbar />` into a cohesive dashboard grid.

---

### Unit & Integration Testing
Verify component behaviors and hook invocations.

#### [NEW] [Sidebar.test.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/Sidebar/Sidebar.test.tsx)
Verify animations, toggles, profile rendering, and active links.

#### [NEW] [Topbar.test.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/Topbar/Topbar.test.tsx)
Verify theme toggler button, search bar displays, and user avatar clicks.

#### [NEW] [Breadcrumb.test.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/Breadcrumb/Breadcrumb.test.tsx)
Verify path-to-label splits.

## Verification Plan

### Automated Tests
- Run type checks: `pnpm exec tsc --noEmit`
- Run build check: `pnpm run build`
- Run unit/UI checks: `pnpm run test`
- Run code coverage checks: `pnpm run test --coverage`
