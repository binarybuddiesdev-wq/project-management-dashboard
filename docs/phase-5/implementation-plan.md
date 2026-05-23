# Phase 5 — Projects Implementation Plan

## Overview
Build full Projects CRUD with list/detail views, filters/search, and an animated modal form. All data is mocked via MSW. All components match the premium Linear.app design language from Phase 1.

## Steps

### 1. Types (`src/types/project.types.ts`)
- `IProject` — id, name, description, status, priority, dueDate, assignees, taskCount, progress, createdAt, updatedAt
- `IProjectFormData` — subset for create/edit form
- `IProjectCardProps` — ProjectCard component props
- `IProjectModalProps` — ProjectModal component props
- `IProjectFiltersProps` — ProjectFilters component props

### 2. Service (`src/services/projects.service.ts`)
- `getProjects(filters?)` — GET `/api/projects` with optional `status`, `priority`, `search` query params
- `getProject(id)` — GET `/api/projects/:id`
- `createProject(data)` — POST `/api/projects`
- `updateProject(id, data)` — PUT `/api/projects/:id`
- `deleteProject(id)` — DELETE `/api/projects/:id`
- All using ky, returning typed `IApiResponse<T>`

### 3. MSW Handlers (`src/services/mock/handlers.ts`)
- In-memory `projectsStore` with 4 seed projects
- GET `/api/projects` — filter by status, priority, search query params
- GET `/api/projects/:id` — single project or 404
- POST `/api/projects` — create with auto-generated id, status 201
- PUT `/api/projects/:id` — update or 404
- DELETE `/api/projects/:id` — remove or 404

### 4. Hook (`src/hooks/useProjects.ts`)
- `useProjects(filters?)` — query key `['projects', filters]`
- `useProject(id)` — query key `['project', id]`
- `useCreateProject()` — mutation, invalidates `['projects']`
- `useUpdateProject()` — mutation with optimistic update on `onMutate`, rollback on error
- `useDeleteProject()` — mutation with optimistic removal
- All mutations have `onSettled` invalidation

### 5. Components
#### ProjectCard (`src/components/ProjectCard/`)
- React.memo, Framer Motion hover (y: -4, scale: 1.01)
- Status badges, priority indicators, progress bar
- Edit/delete buttons with group-hover reveal
- Uses `useReducedMotion()` for accessibility

#### ProjectModal (`src/components/ProjectModal/`)
- RHF + Zod form with fields: name, description, status, priority, due date, assignees
- AnimatePresence for enter/exit animation
- Reset form on project change via useEffect
- Create/Edit mode based on project prop

#### ProjectFilters (`src/components/ProjectFilters/`)
- Search input with clear button
- Status dropdown (All, Active, Completed, On Hold, Cancelled)
- Priority dropdown (All, Low, Medium, High, Urgent)

### 6. Pages
#### ProjectsList (`src/pages/Projects/ProjectsList.tsx`)
- State-based search, status, priority filters
- Loading skeleton grid (6 cards)
- Error state with retry button
- Empty state with create button
- Animated project grid with stagger effect
- Connect ProjectModal for create/edit

#### ProjectDetail (`src/pages/Projects/ProjectDetail.tsx`)
- Back button, edit/delete actions
- Full project info display
- Loading skeleton, error state
- Edit modal integration

### 7. Routing (`src/App.tsx`)
- `/projects` → `<ProjectsList />`
- `/projects/:id` → `<ProjectDetail />`

### 8. Tests
- `projects.service.test.ts` — all CRUD, search, filter
- `useProjects.test.tsx` — fetch, filter, create, update, delete mutations
- `ProjectCard.test.tsx` — render, edit/delete click
- `ProjectModal.test.tsx` — open/close, create/edit, pre-fill
- `ProjectFilters.test.tsx` — search, status, priority change
- `ProjectsList.test.tsx` — renders page title and cards
- `ProjectDetail.test.tsx` — renders project name and actions

## File Structure
```
src/
  types/
    project.types.ts         (new)
  services/
    projects.service.ts      (new)
  hooks/
    useProjects.ts           (new)
  components/
    ProjectCard/
      ProjectCard.tsx        (new)
      index.ts               (new)
    ProjectModal/
      ProjectModal.tsx       (new)
      index.ts               (new)
    ProjectFilters/
      ProjectFilters.tsx     (new)
      index.ts               (new)
  pages/
    Projects/
      ProjectsList.tsx       (new)
      ProjectDetail.tsx      (new)
      index.ts               (new)
  services/mock/
    handlers.ts              (extended)
```

## Key Decisions
- ProjectModal stays as custom component (AnimatePresence + Framer Motion), not migrated to shadcn/ui Dialog
- MSW `projectsStore` uses module-level variable before the handlers array
- Optimistic updates on update and delete mutations with rollback on error
- Assignees field uses comma-separated input with `setValueAs` transformer
