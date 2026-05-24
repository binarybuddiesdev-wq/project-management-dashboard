# Implementation Plan — Phase 6 — Kanban Board

Implement a premium, Linear-inspired interactive Kanban Board. Users can track tasks across columns (Backlog, In Progress, In Review, Done) with smooth drag-and-drop animations, metrics counts, and a dedicated Task Form Modal. All data is managed on the client with TanStack Query and persisted locally inside MSW handlers using `localStorage` (key `msw_tasks`).

## User Review Required

> [!IMPORTANT]
> - **React 19 Drag & Drop Compatibility**: `@hello-pangea/dnd` v18.0.1 is React 19-ready. To prevent layout flickering and runtime errors, we must ensure all `<Droppable />` components have the required `droppableId`, `type="DEFAULT"`, and properly assign refs and spread `droppableProps` and `placeholder`.
> - **Data Persistence**: All Kanban tasks will be stored in `localStorage` under `msw_tasks`. Seeding will run on first load if `msw_tasks` is empty, populated with healthy mock tasks across all four statuses.
> - **Optimistic Updates**: Task movement will perform an optimistic query cache update to instantly reflect card moves before the API returns.

## Proposed Changes

### 1. Types & Models

#### [NEW] [tasks.types.ts](file:///c:/antigravity-test/project-management-dashboard/src/types/tasks.types.ts)
Define state shapes and props for Kanban tasks:
- `ITask`: Represents a task object containing `id`, `title`, `description`, `status`, `priority`, `dueDate`, `assignee`, `createdAt`, `updatedAt`.
- `ITaskFormData`: Form data validation schema type.
- Prop shapes: `IKanbanColumnProps`, `IKanbanCardProps`, `ITaskModalProps`.

#### [MODIFY] [index.ts](file:///c:/antigravity-test/project-management-dashboard/src/types/index.ts)
Re-export new interfaces from `tasks.types.ts`.

---

### 2. Services & Hooks

#### [NEW] [tasks.service.ts](file:///c:/antigravity-test/project-management-dashboard/src/services/tasks.service.ts)
Define Ky-based HTTP operations matching the CRUD pattern:
- `getTasks()`: Fetch all tasks.
- `createTask(data)`: Create a task.
- `updateTask(id, data)`: Update task parameters or status.
- `deleteTask(id)`: Remove a task.

#### [MODIFY] [index.ts](file:///c:/antigravity-test/project-management-dashboard/src/services/index.ts)
Re-export tasks service.

#### [NEW] [useKanban.ts](file:///c:/antigravity-test/project-management-dashboard/src/hooks/useKanban.ts)
Implement TanStack Query hooks:
- `useTasks()`: Fetches all tasks.
- `useCreateTask()`: Mutation for task creation.
- `useUpdateTask()`: Mutation for task updating (including status moves) with optimistic query-cache updates.
- `useDeleteTask()`: Mutation for deleting tasks.

#### [MODIFY] [index.ts](file:///c:/antigravity-test/project-management-dashboard/src/hooks/index.ts)
Re-export useKanban hooks.

---

### 3. MSW Handlers

#### [MODIFY] [handlers.ts](file:///c:/antigravity-test/project-management-dashboard/src/services/mock/handlers.ts)
Implement backend handlers managing task records:
- Define `loadTasks()` and `saveTasks()` supporting `msw_tasks` localStorage persistence.
- Seed default tasks if empty (covering Backlog, In Progress, In Review, and Done statuses).
- Endpoints:
  - `GET /api/tasks`: Return list of tasks.
  - `POST /api/tasks`: Create new task.
  - `PUT /api/tasks/:id`: Update task properties or drag-move statuses.
  - `DELETE /api/tasks/:id`: Delete task.

---

### 4. Kanban UI Components

#### [NEW] [KanbanCard.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/KanbanCard/KanbanCard.tsx)
Task card component. Features:
- Drag handles and Draggable bindings.
- Displays title, priority, assignee name/avatar (pre-selected avatars based on mock usernames), and due date.
- Staggered edit and delete icons on hover.
- React.memo for high performance.

#### [NEW] [KanbanColumn.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/KanbanColumn/KanbanColumn.tsx)
Droppable column. Features:
- Task count badge.
- Grid placeholder for empty states.
- Stiff scroll support for overflow.
- React.memo wrapper.

#### [NEW] [TaskModal.tsx](file:///c:/antigravity-test/project-management-dashboard/src/components/TaskModal/TaskModal.tsx)
Form Modal using React Hook Form + Zod:
- Fields: `title`, `description`, `status` (column), `priority`, `dueDate`, `assignee`.
- Proper error state rendering and click transitions.

#### [MODIFY] [index.ts](file:///c:/antigravity-test/project-management-dashboard/src/components/index.ts)
Re-export new components.

---

### 5. Pages & Routing

#### [NEW] [Kanban.tsx](file:///c:/antigravity-test/project-management-dashboard/src/pages/Kanban/Kanban.tsx)
Assemble Kanban Columns under `<DragDropContext />` wrapper. Handles drag actions by calling the update mutation.

#### [MODIFY] [index.ts](file:///c:/antigravity-test/project-management-dashboard/src/pages/index.ts)
Re-export Kanban page.

#### [MODIFY] [App.tsx](file:///c:/antigravity-test/project-management-dashboard/src/App.tsx)
Add `/kanban` or update routing placeholders to bind the Kanban board.

---

## Verification Plan

### Automated Tests
- Run TS checks: `pnpm exec tsc --noEmit`
- Run build check: `pnpm run build`
- Run Vitest tests: `pnpm run test`
- Run Vitest coverage: `pnpm run test --coverage`
- Unit and UI tests:
  - `tasks.service.test.ts`
  - `useKanban.test.tsx`
  - `KanbanCard.test.tsx`
  - `KanbanColumn.test.tsx`
  - `TaskModal.test.tsx`
  - `Kanban.test.tsx`

### Manual Verification
- Drag task between columns, verify list updates instantly (optimistic update).
- Reload browser, verify task positions are persisted in `msw_tasks` localStorage.
- Create new task, edit existing task, delete task.
