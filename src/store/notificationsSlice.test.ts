import { describe, it, expect } from 'vitest'
import { notificationsReducer, setNotifications, markAsRead, markAllAsRead, incrementUnread, selectUnreadCount } from './notificationsSlice'
import type { INotificationState, INotification } from '@/types'
import type { RootState } from './store'

const createMockNotification = (id: string, read = false): INotification => ({
  id,
  userId: 'user-1',
  title: `Notification ${id}`,
  message: `Message ${id}`,
  type: 'info',
  read,
  createdAt: '2026-05-24T10:00:00Z',
})

describe('notificationsSlice', () => {
  const initialState: INotificationState = {
    items: [],
    unreadCount: 0,
  }

  it('should handle setNotifications with mixed read states', () => {
    const notifications = [
      createMockNotification('n1', false),
      createMockNotification('n2', true),
      createMockNotification('n3', false),
    ]
    const nextState = notificationsReducer(initialState, setNotifications(notifications))
    expect(nextState.items.length).toBe(3)
    expect(nextState.unreadCount).toBe(2)
  })

  it('should handle setNotifications with all read', () => {
    const notifications = [
      createMockNotification('n1', true),
      createMockNotification('n2', true),
    ]
    const nextState = notificationsReducer(initialState, setNotifications(notifications))
    expect(nextState.unreadCount).toBe(0)
  })

  it('should handle setNotifications with all unread', () => {
    const notifications = [
      createMockNotification('n1', false),
      createMockNotification('n2', false),
    ]
    const nextState = notificationsReducer(initialState, setNotifications(notifications))
    expect(nextState.unreadCount).toBe(2)
  })

  it('should handle markAsRead on unread notification', () => {
    const state: INotificationState = {
      items: [createMockNotification('n1', false), createMockNotification('n2', false)],
      unreadCount: 2,
    }
    const nextState = notificationsReducer(state, markAsRead('n1'))
    expect(nextState.items[0].read).toBe(true)
    expect(nextState.unreadCount).toBe(1)
  })

  it('should not change unreadCount when marking already read notification', () => {
    const state: INotificationState = {
      items: [createMockNotification('n1', true)],
      unreadCount: 0,
    }
    const nextState = notificationsReducer(state, markAsRead('n1'))
    expect(nextState.items[0].read).toBe(true)
    expect(nextState.unreadCount).toBe(0)
  })

  it('should not go below zero on markAsRead', () => {
    const state: INotificationState = {
      items: [createMockNotification('n1', false)],
      unreadCount: 0,
    }
    const nextState = notificationsReducer(state, markAsRead('n1'))
    expect(nextState.unreadCount).toBe(0)
  })

  it('should handle markAllAsRead', () => {
    const state: INotificationState = {
      items: [
        createMockNotification('n1', false),
        createMockNotification('n2', true),
        createMockNotification('n3', false),
      ],
      unreadCount: 2,
    }
    const nextState = notificationsReducer(state, markAllAsRead())
    expect(nextState.items.every((n) => n.read)).toBe(true)
    expect(nextState.unreadCount).toBe(0)
  })

  it('should handle incrementUnread', () => {
    const state: INotificationState = {
      items: [createMockNotification('n1', false)],
      unreadCount: 1,
    }
    const nextState = notificationsReducer(state, incrementUnread())
    expect(nextState.unreadCount).toBe(2)
  })

  it('should handle empty state for markAsRead', () => {
    const nextState = notificationsReducer(initialState, markAsRead('non-existent'))
    expect(nextState.items.length).toBe(0)
    expect(nextState.unreadCount).toBe(0)
  })

  it('should handle empty state for markAllAsRead', () => {
    const nextState = notificationsReducer(initialState, markAllAsRead())
    expect(nextState.items.length).toBe(0)
    expect(nextState.unreadCount).toBe(0)
  })

  it('should return correct unreadCount from selectUnreadCount', () => {
    const state = {
      notifications: {
        items: [createMockNotification('n1', false), createMockNotification('n2', true)],
        unreadCount: 1,
      },
    } as unknown as RootState
    expect(selectUnreadCount(state)).toBe(1)
  })

  it('should return zero from selectUnreadCount when all read', () => {
    const state = {
      notifications: {
        items: [createMockNotification('n1', true)],
        unreadCount: 0,
      },
    } as unknown as RootState
    expect(selectUnreadCount(state)).toBe(0)
  })
})
