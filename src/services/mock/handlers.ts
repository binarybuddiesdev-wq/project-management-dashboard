import { http, HttpResponse } from 'msw'
import type { IApiResponse, ILoginResponseData, ISignupResponseData, IForgotPasswordResponseData, IUser } from '@/types'

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
]
