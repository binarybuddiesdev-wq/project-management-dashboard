import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import type { ReactNode } from 'react'
import { NotificationsPage } from './Notifications'
import { notificationsReducer } from '@/store/notificationsSlice'
import type { INotification } from '@/types'

const defaultNotifications: INotification[] = [
  { id: 'n1', userId: 'user-1', title: 'Task Completed', message: 'Kyle Reese completed "Implement Login UI"', type: 'success', read: false, createdAt: '2026-05-24T10:00:00Z', link: '/kanban' },
  { id: 'n2', userId: 'user-1', title: 'New Member', message: 'Emily Davis has joined the team as QA Engineer', type: 'info', read: false, createdAt: '2026-05-24T09:15:00Z', link: '/team' },
  { id: 'n3', userId: 'user-1', title: 'Project Update', message: 'Brand Redesign project progress reached 70%', type: 'info', read: false, createdAt: '2026-05-23T16:45:00Z', link: '/projects' },
  { id: 'n4', userId: 'user-1', title: 'Task Overdue', message: 'Draft Architecture Plan task is past its due date', type: 'warning', read: true, createdAt: '2026-05-23T08:00:00Z', link: '/kanban' },
]

const mockGetNotifications = vi.hoisted(() => vi.fn())

vi.mock('@/services/notifications.service', () => ({
  getNotifications: mockGetNotifications,
  markNotificationRead: vi.fn(),
  markAllNotificationsRead: vi.fn(),
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
  },
})

const wrapper = (props: { children: ReactNode }) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  </Provider>
)

describe('NotificationsPage Page', () => {
  beforeEach(() => {
    queryClient.clear()
    vi.restoreAllMocks()
    store.dispatch({ type: 'notifications/setNotifications', payload: [] })
    mockGetNotifications.mockResolvedValue({ data: defaultNotifications })
  })

  it('renders the page title', () => {
    render(<NotificationsPage />, { wrapper })
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  it('renders notification items after loading', async () => {
    render(<NotificationsPage />, { wrapper })
    await waitFor(() => {
      expect(screen.getByText('Task Completed')).toBeInTheDocument()
    })
    expect(screen.getByText('New Member')).toBeInTheDocument()
    expect(screen.getByText('Project Update')).toBeInTheDocument()
  })

  it('renders loading state while fetching', () => {
    render(<NotificationsPage />, { wrapper })
    const skeletonContainers = document.querySelectorAll('.animate-pulse')
    expect(skeletonContainers.length).toBeGreaterThan(0)
  })

  it('renders empty state when no notifications exist', async () => {
    mockGetNotifications.mockResolvedValue({ data: [] })
    render(<NotificationsPage />, { wrapper })
    await waitFor(() => {
      expect(screen.getByText('No notifications')).toBeInTheDocument()
    })
    expect(screen.getByText('You are all caught up!')).toBeInTheDocument()
  })

  it('renders error state when fetch fails', async () => {
    mockGetNotifications.mockResolvedValue({ error: 'Failed to load' })
    render(<NotificationsPage />, { wrapper })
    await waitFor(() => {
      expect(screen.getByText('Failed to load notifications')).toBeInTheDocument()
    }, { timeout: 5000 })
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('shows mark all as read button when there are unread notifications', async () => {
    render(<NotificationsPage />, { wrapper })
    await waitFor(() => {
      expect(screen.getByText('Mark all as read')).toBeInTheDocument()
    })
  })

  it('shows unread count in subtitle', async () => {
    render(<NotificationsPage />, { wrapper })
    await waitFor(() => {
      expect(screen.getByText(/unread notification/)).toBeInTheDocument()
    })
  })
})
