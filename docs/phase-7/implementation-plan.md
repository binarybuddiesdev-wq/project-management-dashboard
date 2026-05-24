# Phase 7: Team Members, Notifications & Settings

## Objective
Build three new sections: Team Members management, Notifications center with Redux + TanStack Query, and Settings page with profile/password/theme controls.

## Pages

### Team Members (`/team`)
- Virtualized list of team members using `@tanstack/react-virtual`
- CRUD via MSW handlers (GET/POST/PUT/DELETE `/api/team`)
- Invite modal (React Hook Form + Zod)
- Loading, empty, and error states

### Notifications (`/notifications`)
- Dual state: TanStack Query (fetching) + Redux Toolkit (unread count)
- Mark single notification read, mark all read
- Data seeded per-user via MSW (`msw_notifications_{userId}`)
- Dynamic badge in Topbar with Link

### Settings (`/settings`)
- Profile form (name, email, avatar URL) — React Hook Form + Zod
- Password change form with confirmation validation
- Theme toggle (existing `useTheme` hook)

## New Files
| File | Purpose |
|------|---------|
| `src/types/team.types.ts` | IMember, IMemberFormData, etc. |
| `src/types/notifications.types.ts` | INotification, INotificationState |
| `src/types/settings.types.ts` | IProfileFormData, IPasswordFormData |
| `src/services/team.service.ts` | API functions for team CRUD |
| `src/services/notifications.service.ts` | API functions for notifications |
| `src/hooks/useTeam.ts` | React Query hooks for team |
| `src/hooks/useNotifications.ts` | React Query hooks for notifications |
| `src/hooks/useSettings.ts` | Local settings update functions |
| `src/store/notificationsSlice.ts` | Redux slice for notifications UI state |
| `src/components/MemberCard/` | Member card component |
| `src/components/InviteMemberModal/` | Invite member modal with form |
| `src/components/NotificationItem/` | Notification item with type icons |
| `src/pages/Team/` | TeamMembers page |
| `src/pages/Notifications/` | Notifications page |
| `src/pages/Settings/` | Settings page |

## Verification
- `pnpm exec tsc --noEmit` — zero errors
- `pnpm run build` — zero errors/warnings
- `pnpm run test` — all tests pass
- Playwright visual check — all 3 pages load correctly, responsive, animations smooth
