import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { http, HttpResponse } from 'msw'
import type { ReactNode } from 'react'
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from './useNotifications'
import { notificationsReducer } from '@/store/notificationsSlice'
import { server } from '@/test/setup'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
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

describe('useNotifications', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'mock-jwt-token-12345')
    queryClient.clear()
    store.dispatch({ type: 'notifications/setNotifications', payload: [] })
  })

  it('should fetch notifications successfully', async () => {
    const { result } = renderHook(() => useNotifications(), { wrapper })
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
    expect(Array.isArray(result.current.data)).toBe(true)
    expect(result.current.data!.length).toBeGreaterThan(0)
  })

  it('should handle error when fetching notifications fails', async () => {
    server.use(
      http.get('*/api/notifications', () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 })
      })
    )
    const { result } = renderHook(() => useNotifications(), { wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 })
    expect(result.current.error).toBeDefined()
  })

  it('should mark a notification as read via mutation', async () => {
    const { result } = renderHook(() => useNotifications(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const unreadBefore = store.getState().notifications.unreadCount

    const { result: markResult } = renderHook(() => useMarkNotificationRead(), { wrapper })
    await waitFor(async () => {
      const id = await markResult.current.mutateAsync('n1')
      expect(id).toBe('n1')
    })

    const state = store.getState().notifications
    expect(state.items.find((n) => n.id === 'n1')?.read).toBe(true)
    expect(state.unreadCount).toBe(unreadBefore - 1)
  })

  it('should mark all notifications as read via mutation', async () => {
    const { result } = renderHook(() => useNotifications(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const { result: markAllResult } = renderHook(() => useMarkAllNotificationsRead(), { wrapper })
    await waitFor(async () => {
      await markAllResult.current.mutateAsync()
    })

    const state = store.getState().notifications
    expect(state.items.every((n) => n.read)).toBe(true)
    expect(state.unreadCount).toBe(0)
  })

  it('should dispatch setNotifications on successful fetch', async () => {
    const previousState = store.getState().notifications
    expect(previousState.items.length).toBe(0)

    const { result } = renderHook(() => useNotifications(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const state = store.getState().notifications
    expect(state.items.length).toBeGreaterThan(0)
  })

  it('should handle mark read mutation error', async () => {
    const { result } = renderHook(() => useMarkNotificationRead(), { wrapper })
    await waitFor(async () => {
      await expect(result.current.mutateAsync('non-existent')).rejects.toThrow()
    })
  })

  it('should handle mark all read mutation error', async () => {
    server.use(
      http.put('*/api/notifications/read-all', () => {
        return HttpResponse.json({ error: 'Failed' }, { status: 500 })
      })
    )
    const { result } = renderHook(() => useMarkAllNotificationsRead(), { wrapper })
    await waitFor(async () => {
      await expect(result.current.mutateAsync()).rejects.toThrow()
    })
  })
})
