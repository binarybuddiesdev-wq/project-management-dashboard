import { http, HttpResponse } from 'msw'
import type { IApiResponse, ILoginResponseData, ISignupResponseData, IForgotPasswordResponseData, IUser, IProject, IProjectFormData, ITask, ITaskFormData, IMember, IMemberFormData, INotification } from '@/types'

// Retrieve registered users from localStorage, seeding a default user if empty
const getRegisteredUsers = (): Record<string, string>[] => {
  if (typeof window === 'undefined') {
    return []
  }
  const usersStr = localStorage.getItem('registered_users')
  if (!usersStr) {
    const defaultUser = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password@123',
    }
    localStorage.setItem('registered_users', JSON.stringify([defaultUser]))
    return [defaultUser]
  }
  try {
    return JSON.parse(usersStr) as Record<string, string>[] // Cast for parsed JSON array of users
  } catch {
    return []
  }
}

// Add a new registered user to localStorage
const registerUser = (user: Record<string, string>): void => {
  if (typeof window === 'undefined') {
    return
  }
  const users = getRegisteredUsers()
  users.push(user)
  localStorage.setItem('registered_users', JSON.stringify(users))
}

// ── Projects Store ──
const PROJECTS_STORAGE_KEY = 'msw_projects'

const projectsSeed: IProject[] = [
  { id: 'p1', name: 'Brand Redesign', description: 'Complete brand identity redesign including logo, colors, and typography.', status: 'active', priority: 'high', dueDate: '2026-06-15', assignees: ['Sarah Connor', 'John Doe'], taskCount: 15, progress: 68, createdAt: '2026-04-01T10:00:00Z', updatedAt: '2026-05-20T14:30:00Z' },
  { id: 'p2', name: 'Mobile App Implementation', description: 'Build cross-platform mobile application using React Native.', status: 'active', priority: 'urgent', dueDate: '2026-07-01', assignees: ['John Doe'], taskCount: 22, progress: 45, createdAt: '2026-04-10T08:00:00Z', updatedAt: '2026-05-19T16:00:00Z' },
  { id: 'p3', name: 'API Refactoring', description: 'Refactor legacy REST APIs to improve performance and maintainability.', status: 'completed', priority: 'medium', dueDate: '2026-05-20', assignees: ['Kyle Reese', 'Sarah Connor'], taskCount: 8, progress: 100, createdAt: '2026-03-15T09:00:00Z', updatedAt: '2026-05-18T11:00:00Z' },
  { id: 'p4', name: 'Design System V2', description: 'Evolve the component library with new patterns and improved accessibility.', status: 'on_hold', priority: 'low', dueDate: '2026-08-10', assignees: ['Sarah Connor'], taskCount: 5, progress: 12, createdAt: '2026-05-01T12:00:00Z', updatedAt: '2026-05-17T09:00:00Z' },
]

const loadProjects = (): IProject[] => {
  if (typeof window === 'undefined') {
    return [...projectsSeed]
  }
  const stored = localStorage.getItem(PROJECTS_STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projectsSeed))
    return [...projectsSeed]
  }
  try {
    return JSON.parse(stored) as IProject[]
  } catch {
    return [...projectsSeed]
  }
}

const saveProjects = (projects: IProject[]): void => {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects))
}

let projectsStore: IProject[] = loadProjects()

// ── Tasks Store ──
const TASKS_STORAGE_KEY = 'msw_tasks'

const tasksSeed: ITask[] = [
  {
    id: 't1',
    title: 'Research User Personas',
    description: 'Gather user feedback and define initial personas for the target demographic.',
    status: 'backlog',
    priority: 'medium',
    assignee: 'John Doe',
    dueDate: '2026-06-30',
    labels: ['Research', 'Discovery'],
    createdAt: '2026-05-01T09:00:00Z',
    updatedAt: '2026-05-01T09:00:00Z'
  },
  {
    id: 't2',
    title: 'Draft Architecture Plan',
    description: 'Prepare draft documentation for the frontend state structure and API design.',
    status: 'in_progress',
    priority: 'high',
    assignee: 'Sarah Connor',
    dueDate: '2026-06-15',
    labels: ['Docs', 'Architecture'],
    createdAt: '2026-05-05T10:00:00Z',
    updatedAt: '2026-05-05T10:00:00Z'
  },
  {
    id: 't3',
    title: 'Implement Login UI',
    description: 'Code the login and signup forms with responsive design and validations.',
    status: 'in_review',
    priority: 'urgent',
    assignee: 'Kyle Reese',
    dueDate: '2026-05-28',
    labels: ['Frontend', 'Auth'],
    createdAt: '2026-05-10T08:00:00Z',
    updatedAt: '2026-05-10T08:00:00Z'
  },
  {
    id: 't4',
    title: 'Scaffold Application',
    description: 'Run pnpm create vite, configure tailwind, and initialize shadcn/ui components.',
    status: 'done',
    priority: 'low',
    assignee: 'John Doe',
    dueDate: '2026-05-20',
    labels: ['Setup', 'DevOps'],
    createdAt: '2026-05-01T08:00:00Z',
    updatedAt: '2026-05-01T08:00:00Z'
  }
]

const loadTasks = (): ITask[] => {
  if (typeof window === 'undefined') {
    return [...tasksSeed]
  }
  const stored = localStorage.getItem(TASKS_STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasksSeed))
    return [...tasksSeed]
  }
  try {
    return JSON.parse(stored) as ITask[]
  } catch {
    return [...tasksSeed]
  }
}

const saveTasks = (tasks: ITask[]): void => {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
}

let tasksStore: ITask[] = loadTasks()

// ── Team Store ──
const TEAM_STORAGE_KEY = 'msw_team'

const teamSeed: IMember[] = [
  { id: 'm1', name: 'John Doe', email: 'john@example.com', role: 'Product Manager', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop', department: 'Product', joinedAt: '2026-01-15T09:00:00Z' },
  { id: 'm2', name: 'Sarah Connor', email: 'sarah@example.com', role: 'Lead Engineer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop', department: 'Engineering', joinedAt: '2026-02-01T10:00:00Z' },
  { id: 'm3', name: 'Kyle Reese', email: 'kyle@example.com', role: 'Frontend Developer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', department: 'Engineering', joinedAt: '2026-03-10T08:00:00Z' },
  { id: 'm4', name: 'Jane Smith', email: 'jane@example.com', role: 'UX Designer', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop', department: 'Design', joinedAt: '2026-01-20T11:00:00Z' },
  { id: 'm5', name: 'Mike Chen', email: 'mike@example.com', role: 'Backend Developer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop', department: 'Engineering', joinedAt: '2026-04-05T09:00:00Z' },
  { id: 'm6', name: 'Emily Davis', email: 'emily@example.com', role: 'QA Engineer', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop', department: 'Quality', joinedAt: '2026-03-22T08:00:00Z' },
]

const loadMembers = (): IMember[] => {
  if (typeof window === 'undefined') { return [...teamSeed] }
  const stored = localStorage.getItem(TEAM_STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(teamSeed))
    return [...teamSeed]
  }
  try { return JSON.parse(stored) as IMember[] }
  catch { return [...teamSeed] }
}

const saveMembers = (members: IMember[]): void => {
  if (typeof window === 'undefined') { return }
  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(members))
}

let teamStore: IMember[] = loadMembers()

// ── Notifications Store ──
const NOTIFICATIONS_STORAGE_KEY_PREFIX = 'msw_notifications_'

const notificationsSeed: INotification[] = [
  { id: 'n1', userId: 'user-1', title: 'Task Completed', message: 'Kyle Reese completed "Implement Login UI"', type: 'success', read: false, createdAt: '2026-05-24T10:30:00Z', link: '/kanban' },
  { id: 'n2', userId: 'user-1', title: 'New Member', message: 'Emily Davis has joined the team as QA Engineer', type: 'info', read: false, createdAt: '2026-05-24T09:15:00Z', link: '/team' },
  { id: 'n3', userId: 'user-1', title: 'Project Update', message: 'Brand Redesign project progress reached 70%', type: 'info', read: false, createdAt: '2026-05-23T16:45:00Z', link: '/projects' },
  { id: 'n4', userId: 'user-1', title: 'Task Overdue', message: 'Draft Architecture Plan task is past its due date', type: 'warning', read: true, createdAt: '2026-05-23T08:00:00Z', link: '/kanban' },
  { id: 'n5', userId: 'user-1', title: 'Mention', message: 'Sarah Connor mentioned you in a comment on API Refactoring', type: 'info', read: true, createdAt: '2026-05-22T14:20:00Z', link: '/projects' },
  { id: 'n6', userId: 'user-1', title: 'Status Change', message: 'Mobile App Implementation moved to In Review', type: 'success', read: false, createdAt: '2026-05-22T11:00:00Z', link: '/kanban' },
  { id: 'n7', userId: 'user-1', title: 'System Alert', message: 'New deployment available for the dashboard module', type: 'warning', read: true, createdAt: '2026-05-21T09:30:00Z' },
  { id: 'n8', userId: 'user-1', title: 'Welcome', message: 'Welcome to Project Management Dashboard!', type: 'success', read: true, createdAt: '2026-05-20T08:00:00Z' },
]

const loadNotifications = (userId: string): INotification[] => {
  if (typeof window === 'undefined') { return [...notificationsSeed] }
  const key = `${NOTIFICATIONS_STORAGE_KEY_PREFIX}${userId}`
  const stored = localStorage.getItem(key)
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(notificationsSeed))
    return [...notificationsSeed]
  }
  try { return JSON.parse(stored) as INotification[] }
  catch { return [...notificationsSeed] }
}

const saveNotifications = (userId: string, notifications: INotification[]): void => {
  if (typeof window === 'undefined') { return }
  localStorage.setItem(`${NOTIFICATIONS_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(notifications))
}


export const handlers = [
  http.get('*/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),

  http.post('*/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as Record<string, string>
    const { email, password } = body

    if (!email || !password) {
      return HttpResponse.json<IApiResponse<unknown>>(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Keep hardcoded failure path for tests matching fail@example.com
    if (email === 'fail@example.com') {
      return HttpResponse.json<IApiResponse<unknown>>(
        { error: 'Invalid email or password' },
        { status: 400 }
      )
    }

    const registeredUsers = getRegisteredUsers()
    const foundUser = registeredUsers.find((u) => u.email === email)
    if (!foundUser) {
      return HttpResponse.json<IApiResponse<unknown>>(
        { error: 'No account found with this email' },
        { status: 400 }
      )
    }

    const isPasswordCorrect = foundUser.password === password ||
      (email === 'john@example.com' && password === 'password123')

    if (!isPasswordCorrect) {
      return HttpResponse.json<IApiResponse<unknown>>(
        { error: 'Incorrect password' },
        { status: 400 }
      )
    }

    const responseData: ILoginResponseData = {
      user: {
        id: 'user-1',
        name: foundUser.name || 'John Doe',
        email: foundUser.email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop',
      },
      token: foundUser.email === 'john@example.com' ? 'mock-jwt-token-12345' : `mock-jwt-token-${foundUser.email}`,
    }

    return HttpResponse.json<IApiResponse<ILoginResponseData>>({ data: responseData })
  }),

  http.post('*/api/auth/signup', async ({ request }) => {
    const body = (await request.json()) as Record<string, string>
    const { name, email, password } = body

    if (!name || !email || !password) {
      return HttpResponse.json<IApiResponse<unknown>>(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (email === 'fail@example.com') {
      return HttpResponse.json<IApiResponse<unknown>>(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    const registeredUsers = getRegisteredUsers()
    const emailExists = registeredUsers.some((u) => u.email === email)
    if (emailExists) {
      return HttpResponse.json<IApiResponse<unknown>>(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    registerUser({ name, email, password })

    const responseData: ISignupResponseData = {
      user: {
        id: `user-${registeredUsers.length + 1}`,
        name,
        email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop',
      },
      token: `mock-jwt-token-${email}`,
    }

    return HttpResponse.json<IApiResponse<ISignupResponseData>>({ data: responseData })
  }),

  http.post('*/api/auth/forgot-password', async ({ request }) => {
    const body = (await request.json()) as Record<string, string>
    const { email } = body

    if (!email) {
      return HttpResponse.json<IApiResponse<unknown>>(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (email === 'fail@example.com') {
      return HttpResponse.json<IApiResponse<unknown>>(
        { error: 'Email not found' },
        { status: 404 }
      )
    }

    const responseData: IForgotPasswordResponseData = {
      message: 'Password reset link sent to your email',
    }

    return HttpResponse.json<IApiResponse<IForgotPasswordResponseData>>({ data: responseData })
  }),

  http.get('*/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json<IApiResponse<unknown>>(
        { error: 'Unauthorized session' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    if (token === 'invalid-token') {
      return HttpResponse.json<IApiResponse<unknown>>(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Resolve user details dynamically if logged in via a standard mock token
    let userName = 'John Doe'
    let userEmail = 'john@example.com'
    if (token.startsWith('mock-jwt-token-') && token !== 'mock-jwt-token-12345') {
      const emailFromToken = token.substring(15)
      const registeredUsers = getRegisteredUsers()
      const found = registeredUsers.find((u) => u.email === emailFromToken)
      if (found) {
        userName = found.name
        userEmail = found.email
      }
    }

    const user: IUser = {
      id: 'user-1',
      name: userName,
      email: userEmail,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop',
    }

    return HttpResponse.json<IApiResponse<{ user: IUser }>>({ data: { user } })
  }),

  http.get('*/api/dashboard', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json<IApiResponse<unknown>>(
        { error: 'Unauthorized session' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    if (token === 'invalid-token') {
      return HttpResponse.json<IApiResponse<unknown>>(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    if (url.searchParams.get('error') === 'true') {
      return HttpResponse.json<IApiResponse<unknown>>(
        { error: 'Failed to fetch dashboard data' },
        { status: 500 }
      )
    }

    if (url.searchParams.get('empty') === 'true') {
      return HttpResponse.json<IApiResponse<any>>({
        data: {
          stats: {
            totalProjects: 0,
            totalProjectsChange: 0,
            totalTasks: 0,
            totalTasksChange: 0,
            completedTasks: 0,
            completedTasksChange: 0,
            teamMembers: 1,
            teamMembersChange: 0,
          },
          activity: [],
          completion: [],
          recentProjects: [],
          recentActivities: [],
        }
      })
    }

    const dashboardData = {
      stats: {
        totalProjects: 12,
        totalProjectsChange: 8,
        totalTasks: 48,
        totalTasksChange: 23,
        completedTasks: 32,
        completedTasksChange: 15,
        teamMembers: 6,
        teamMembersChange: 0,
      },
      activity: [
        { date: 'Mon', completed: 5, created: 8 },
        { date: 'Tue', completed: 8, created: 6 },
        { date: 'Wed', completed: 12, created: 9 },
        { date: 'Thu', completed: 7, created: 11 },
        { date: 'Fri', completed: 10, created: 7 },
        { date: 'Sat', completed: 4, created: 2 },
        { date: 'Sun', completed: 6, created: 3 },
      ],
      completion: [
        { name: 'Completed', value: 32, color: '#10b981' },
        { name: 'In Progress', value: 10, color: '#3b82f6' },
        { name: 'Todo', value: 6, color: '#f59e0b' },
      ],
      recentProjects: [
        { id: 'p1', name: 'Brand Redesign', status: 'active', progress: 68, taskCount: 15, dueDate: '2026-06-15' },
        { id: 'p2', name: 'Mobile App Implementation', status: 'active', progress: 45, taskCount: 22, dueDate: '2026-07-01' },
        { id: 'p3', name: 'API Refactoring', status: 'completed', progress: 100, taskCount: 8, dueDate: '2026-05-20' },
        { id: 'p4', name: 'Design System V2', status: 'on_hold', progress: 12, taskCount: 5, dueDate: '2026-08-10' },
      ],
      recentActivities: [
        { id: 'a1', userName: 'Sarah Connor', action: 'completed task', target: 'Define responsive tokens', timestamp: '10 mins ago' },
        { id: 'a2', userName: 'John Doe', action: 'created project', target: 'Design System V2', timestamp: '2 hours ago' },
        { id: 'a3', userName: 'Sarah Connor', action: 'moved task to In Progress', target: 'Create base Button component', timestamp: '4 hours ago' },
        { id: 'a4', userName: 'Kyle Reese', action: 'added comment to', target: 'API Refactoring', timestamp: '1 day ago' },
      ],
    }

    return HttpResponse.json<IApiResponse<typeof dashboardData>>({ data: dashboardData })
  }),

  http.get('*/api/projects', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const priority = url.searchParams.get('priority')
    const search = url.searchParams.get('search')

    let filtered = [...projectsStore]

    if (status) {
      filtered = filtered.filter((p) => p.status === status)
    }
    if (priority) {
      filtered = filtered.filter((p) => p.priority === priority)
    }
    if (search) {
      const term = search.toLowerCase()
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term))
    }

    return HttpResponse.json<IApiResponse<IProject[]>>({ data: filtered })
  }),

  http.get('*/api/projects/:id', ({ params }) => {
    const { id } = params
    const project = projectsStore.find((p) => p.id === id)
    if (!project) {
      return HttpResponse.json<IApiResponse<unknown>>({ error: 'Project not found' }, { status: 404 })
    }
    return HttpResponse.json<IApiResponse<IProject>>({ data: project })
  }),

  http.post('*/api/projects', async ({ request }) => {
    const body = (await request.json()) as IProjectFormData
    const newProject: IProject = {
      id: `p${Date.now()}`,
      name: body.name,
      description: body.description,
      status: body.status,
      priority: body.priority,
      dueDate: body.dueDate,
      assignees: body.assignees,
      taskCount: 0,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    projectsStore = [...projectsStore, newProject]
    saveProjects(projectsStore)
    return HttpResponse.json<IApiResponse<IProject>>({ data: newProject }, { status: 201 })
  }),

  http.put('*/api/projects/:id', async ({ params, request }) => {
    const { id } = params
    const body = (await request.json()) as Partial<IProjectFormData>
    const index = projectsStore.findIndex((p) => p.id === id)
    if (index === -1) {
      return HttpResponse.json<IApiResponse<unknown>>({ error: 'Project not found' }, { status: 404 })
    }
    const updated: IProject = {
      ...projectsStore[index],
      ...body,
      updatedAt: new Date().toISOString(),
    }
    projectsStore = [...projectsStore.slice(0, index), updated, ...projectsStore.slice(index + 1)]
    saveProjects(projectsStore)
    return HttpResponse.json<IApiResponse<IProject>>({ data: updated })
  }),

  http.delete('*/api/projects/:id', ({ params }) => {
    const { id } = params
    const index = projectsStore.findIndex((p) => p.id === id)
    if (index === -1) {
      return HttpResponse.json<IApiResponse<unknown>>({ error: 'Project not found' }, { status: 404 })
    }
    projectsStore = projectsStore.filter((p) => p.id !== id)
    saveProjects(projectsStore)
    return HttpResponse.json<IApiResponse<null>>({ data: null })
  }),

  http.get('*/api/tasks', () => {
    tasksStore = loadTasks()
    return HttpResponse.json<IApiResponse<ITask[]>>({ data: tasksStore })
  }),

  http.post('*/api/tasks', async ({ request }) => {
    const body = (await request.json()) as ITaskFormData
    const newTask: ITask = {
      id: `t${Date.now()}`,
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      assignee: body.assignee,
      dueDate: body.dueDate,
      labels: body.labels || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    tasksStore = [...tasksStore, newTask]
    saveTasks(tasksStore)
    return HttpResponse.json<IApiResponse<ITask>>({ data: newTask }, { status: 201 })
  }),

  http.put('*/api/tasks/:id', async ({ params, request }) => {
    const { id } = params
    const body = (await request.json()) as Partial<ITaskFormData>
    const index = tasksStore.findIndex((t) => t.id === id)
    if (index === -1) {
      return HttpResponse.json<IApiResponse<unknown>>({ error: 'Task not found' }, { status: 404 })
    }
    const updated: ITask = {
      ...tasksStore[index],
      ...body,
      updatedAt: new Date().toISOString(),
    }
    tasksStore = [...tasksStore.slice(0, index), updated, ...tasksStore.slice(index + 1)]
    saveTasks(tasksStore)
    return HttpResponse.json<IApiResponse<ITask>>({ data: updated })
  }),

  http.delete('*/api/tasks/:id', ({ params }) => {
    const { id } = params
    const index = tasksStore.findIndex((t) => t.id === id)
    if (index === -1) {
      return HttpResponse.json<IApiResponse<unknown>>({ error: 'Task not found' }, { status: 404 })
    }
    tasksStore = tasksStore.filter((t) => t.id !== id)
    saveTasks(tasksStore)
    return HttpResponse.json<IApiResponse<null>>({ data: null })
  }),

  // ── Team Members ──
  http.get('*/api/team', () => {
    teamStore = loadMembers()
    return HttpResponse.json<IApiResponse<IMember[]>>({ data: teamStore })
  }),

  http.post('*/api/team', async ({ request }) => {
    const body = (await request.json()) as IMemberFormData
    const newMember: IMember = {
      id: `m${Date.now()}`,
      name: body.name,
      email: body.email,
      role: body.role,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop`,
      department: body.department,
      joinedAt: new Date().toISOString(),
    }
    teamStore = [...teamStore, newMember]
    saveMembers(teamStore)
    return HttpResponse.json<IApiResponse<IMember>>({ data: newMember }, { status: 201 })
  }),

  http.put('*/api/team/:id', async ({ params, request }) => {
    const { id } = params
    const body = (await request.json()) as Partial<IMemberFormData>
    const index = teamStore.findIndex((m) => m.id === id)
    if (index === -1) {
      return HttpResponse.json<IApiResponse<unknown>>({ error: 'Member not found' }, { status: 404 })
    }
    const updated: IMember = { ...teamStore[index], ...body }
    teamStore = [...teamStore.slice(0, index), updated, ...teamStore.slice(index + 1)]
    saveMembers(teamStore)
    return HttpResponse.json<IApiResponse<IMember>>({ data: updated })
  }),

  http.delete('*/api/team/:id', ({ params }) => {
    const { id } = params
    const index = teamStore.findIndex((m) => m.id === id)
    if (index === -1) {
      return HttpResponse.json<IApiResponse<unknown>>({ error: 'Member not found' }, { status: 404 })
    }
    teamStore = teamStore.filter((m) => m.id !== id)
    saveMembers(teamStore)
    return HttpResponse.json<IApiResponse<null>>({ data: null })
  }),

  // ── Notifications ──
  http.get('*/api/notifications', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : ''
    const userId = token === 'mock-jwt-token-12345' ? 'user-1' : 'user-1'
    const notifications = loadNotifications(userId)
    return HttpResponse.json<IApiResponse<INotification[]>>({ data: notifications })
  }),

  http.put('*/api/notifications/:id/read', ({ params }) => {
    const { id } = params
    const userId = 'user-1'
    const notifications = loadNotifications(userId)
    const index = notifications.findIndex((n) => n.id === id)
    if (index === -1) {
      return HttpResponse.json<IApiResponse<unknown>>({ error: 'Notification not found' }, { status: 404 })
    }
    const updated = { ...notifications[index], read: true }
    const updatedNotifications = [...notifications.slice(0, index), updated, ...notifications.slice(index + 1)]
    saveNotifications(userId, updatedNotifications)
    return HttpResponse.json<IApiResponse<INotification>>({ data: updated })
  }),

  http.put('*/api/notifications/read-all', () => {
    const userId = 'user-1'
    const notifications = loadNotifications(userId)
    const updated = notifications.map((n) => ({ ...n, read: true }))
    saveNotifications(userId, updated)
    return HttpResponse.json<IApiResponse<null>>({ data: null })
  }),
]
