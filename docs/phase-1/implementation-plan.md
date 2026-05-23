# Phase 1 — Project Setup & Design System

Initialize the Project Management Dashboard project structure, styling tokens, base layout, RTK/Query, MSW, and testing frameworks.

## Proposed Changes

### DevOps & Configuration Setup
Set up the React + Vite + TypeScript environment in strict mode, configure Tailwind CSS, initialize shadcn/ui, configure Vitest, and configure Playwright.

#### [NEW] [package.json](file:///c:/antigravity-test/project-management-dashboard/package.json)
Configure all dependencies and build/test scripts.

#### [NEW] [vite.config.ts](file:///c:/antigravity-test/project-management-dashboard/vite.config.ts)
Configure path aliases and plugins.

#### [NEW] [tsconfig.json](file:///c:/antigravity-test/project-management-dashboard/tsconfig.json)
Configure strict type checking, aliases, and paths.

#### [NEW] [tsconfig.app.json](file:///c:/antigravity-test/project-management-dashboard/tsconfig.app.json)
App-specific tsconfig configuration.

#### [NEW] [tsconfig.node.json](file:///c:/antigravity-test/project-management-dashboard/tsconfig.node.json)
Node-specific tsconfig configuration.

#### [NEW] [tailwind.config.js](file:///c:/antigravity-test/project-management-dashboard/tailwind.config.js)
Define custom tokens for the premium dark/light mode dashboard theme.

#### [NEW] [vitest.config.ts](file:///c:/antigravity-test/project-management-dashboard/vitest.config.ts)
Configure Vitest with test coverage reporting.

#### [NEW] [playwright.config.ts](file:///c:/antigravity-test/project-management-dashboard/playwright.config.ts)
Configure Playwright to run against the local development server.

#### [NEW] [components.json](file:///c:/antigravity-test/project-management-dashboard/components.json)
shadcn/ui configuration file.

### Design System Documentation
Define the color system, typography scale, spacing scale, motion tokens, and guidelines.

#### [NEW] [design-system.md](file:///c:/antigravity-test/project-management-dashboard/src/styles/design-system.md)
Document the design tokens and layout principles.

### Frontend Base Architecture
Create the structure, barrel files, RTK store, TanStack Query client, theme provider, global layout with custom cursor, sidebar, topbar, and error boundary.

#### [NEW] [index.css](file:///c:/antigravity-test/project-management-dashboard/src/index.css)
Inject Tailwind layers, global variables, and styles.

#### [NEW] [main.tsx](file:///c:/antigravity-test/project-management-dashboard/src/main.tsx)
Initialize React app and MSW if mock is enabled.

#### [NEW] [app.types.ts](file:///c:/antigravity-test/project-management-dashboard/src/types/app.types.ts)
Export global interfaces (e.g. state shapes, action objects).

#### [NEW] [theme.types.ts](file:///c:/antigravity-test/project-management-dashboard/src/types/theme.types.ts)
Export interfaces for theme configurations.

#### [NEW] [useTheme.ts](file:///c:/antigravity-test/project-management-dashboard/src/hooks/useTheme.ts)
Custom hook to interact with the theme state.

#### [NEW] [themeSlice.ts](file:///c:/antigravity-test/project-management-dashboard/src/store/themeSlice.ts)
RTK slice for theme (dark/light) management.

#### [NEW] [store.ts](file:///c:/antigravity-test/project-management-dashboard/src/store/store.ts)
RTK root store configuration.

#### [NEW] [queryClient.ts](file:///c:/antigravity-test/project-management-dashboard/src/services/queryClient.ts)
TanStack Query client configuration.

#### [NEW] [browser.ts](file:///c:/antigravity-test/project-management-dashboard/src/services/mock/browser.ts)
Configure MSW browser service.

#### [NEW] [handlers.ts](file:///c:/antigravity-test/project-management-dashboard/src/services/mock/handlers.ts)
Configure base API mocks.

#### [NEW] [ErrorBoundary.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/ErrorBoundary/ErrorBoundary.tsx)
Graceful rendering fallback for runtime app errors.

#### [NEW] [CustomCursor.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/CustomCursor/CustomCursor.tsx)
Interactive custom cursor component for a premium experience.

#### [NEW] [AppLayout.tsx](file:///c:/antigravity-test/project-management-dashboard/src/layouts/AppLayout/AppLayout.tsx)
Main dashboard layout container with sidebar & topbar placeholders.

### Test Coverage Setup
Ensure high quality setup with Vitest tests for the theme hooks, store configuration, utilities, and components.

#### [NEW] [useTheme.test.ts](file:///c:/antigravity-test/project-management-dashboard/src/hooks/useTheme.test.ts)
Test theme state updates.

#### [NEW] [themeSlice.test.ts](file:///c:/antigravity-test/project-management-dashboard/src/store/themeSlice.test.ts)
Test theme slice reducers.

#### [NEW] [CustomCursor.test.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/CustomCursor/CustomCursor.test.tsx)
Test custom cursor rendering.

## Verification Plan

### Automated Tests
- Running `pnpm exec tsc --noEmit` to verify zero TypeScript errors.
- Running `pnpm run build` to verify standard production bundle output.
- Running `pnpm run test` to verify Vitest tests.
- Running `pnpm run test --coverage` to verify complete code coverage on utility functions and custom hooks.

### Manual Verification
- Visual inspection via browser dev server: verify dark and light mode toggle, layout grid alignment, and sidebar collapse placeholder.
