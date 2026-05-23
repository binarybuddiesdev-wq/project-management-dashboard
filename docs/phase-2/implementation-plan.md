# Phase 2 — Authentication

Set up complete authentication flow, including global state management, service requests via `ky`, mock server responses via MSW, protected route guards, and premium, animated views for Login, Signup, and Forgot Password.

## Proposed Changes

### Types Definition
Define interfaces for user credentials, tokens, global authentication state, and API communication models.

#### [NEW] [auth.types.ts](file:///c:/antigravity-test/project-management-dashboard/src/types/auth.types.ts)
Define user state, authentication credentials, and auth state interfaces.

#### [NEW] [api.types.ts](file:///c:/antigravity-test/project-management-dashboard/src/types/api.types.ts)
Define backend payload shapes for authentication endpoints.

### Authentication State & Service Layer
Manage client-side authentication states in Redux and network requests using `ky` services.

#### [NEW] [authSlice.ts](file:///c:/antigravity-test/project-management-dashboard/src/store/authSlice.ts)
Implement Redux slice to track user state, login tokens, loading indicators, and error tracking.

#### [NEW] [auth.service.ts](file:///c:/antigravity-test/project-management-dashboard/src/services/auth.service.ts)
Build API client for login, signup, forgot password, and session check using `ky`.

#### [NEW] [useAuth.ts](file:///c:/antigravity-test/project-management-dashboard/src/hooks/useAuth.ts)
Create custom React hook to coordinate Redux dispatch actions and ky requests.

### Router & Route Protection
Ensure pages are hidden from non-authenticated users.

#### [NEW] [ProtectedRoute.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/ProtectedRoute/ProtectedRoute.tsx)
Build component guard that checks authentication and redirects to login if needed.

### Premium Forms & Pages
Implement the layouts and forms with animations.

#### [NEW] [AuthLayout.tsx](file:///c:/antigravity-test/project-management-dashboard/src/layouts/AuthLayout/AuthLayout.tsx)
Layout wrapper featuring split screens (mock graphics on left, form on right), matching the Linear-style premium layout.

#### [NEW] [Login.tsx](file:///c:/antigravity-test/project-management-dashboard/src/pages/Auth/Login.tsx)
Form handling with React Hook Form + Zod, displaying input transitions and custom button gradients.

#### [NEW] [Signup.tsx](file:///c:/antigravity-test/project-management-dashboard/src/pages/Auth/Signup.tsx)
New user signup page with email, name, password, and confirmPassword validation.

#### [NEW] [ForgotPassword.tsx](file:///c:/antigravity-test/project-management-dashboard/src/pages/Auth/ForgotPassword.tsx)
Page to request password reset.

### Verification & Testing
Integrate Vitest files checking both happy and error paths.

#### [NEW] [useAuth.test.ts](file:///c:/antigravity-test/project-management-dashboard/src/hooks/useAuth.test.ts)
#### [NEW] [authSlice.test.ts](file:///c:/antigravity-test/project-management-dashboard/src/store/authSlice.test.ts)
#### [NEW] [auth.service.test.ts](file:///c:/antigravity-test/project-management-dashboard/src/services/auth.service.test.ts)
#### [NEW] [ProtectedRoute.test.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/ProtectedRoute/ProtectedRoute.test.tsx)
#### [NEW] [Login.test.tsx](file:///c:/antigravity-test/project-management-dashboard/src/pages/Auth/Login.test.tsx)
#### [NEW] [Signup.test.tsx](file:///c:/antigravity-test/project-management-dashboard/src/pages/Auth/Signup.test.tsx)

## Verification Plan

### Automated Tests
- `pnpm exec tsc --noEmit` to verify type safety.
- `pnpm run build` to confirm bundler output matches production requirements.
- `pnpm run test` to verify unit and UI tests.
- `pnpm run test --coverage` to ensure full coverage of auth hooks, slices, and services.

### Manual Verification
- Visual inspection: verify smooth transition animations between login, register, and forgot password pages.
- State checks: verify auth state persistency across page refreshes.
