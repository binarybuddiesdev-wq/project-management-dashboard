import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from './notifications.service'
import { server } from '@/test/setup'

describe('notifications.service', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'mock-jwt-token-12345')
  })

  it('should fetch all notifications successfully', async () => {
    const response = await getNotifications()
    expect(response.data).toBeDefined()
    expect(Array.isArray(response.data)).toBe(true)
    expect(response.data!.length).toBeGreaterThan(0)
    expect(response.error).toBeUndefined()
  })

  it('should mark a notification as read', async () => {
    const response = await markNotificationRead('n1')
    expect(response.data).toBeDefined()
    expect(response.data!.read).toBe(true)
    expect(response.error).toBeUndefined()
  })

  it('should mark all notifications as read', async () => {
    const response = await markAllNotificationsRead()
    expect(response.error).toBeUndefined()
  })

  it('should return error when fetch fails', async () => {
    server.use(
      http.get('*/api/notifications', () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 })
      })
    )
    const response = await getNotifications()
    expect(response.data).toBeUndefined()
    expect(response.error).toBeDefined()
  })

  it('should return error when mark read fails', async () => {
    const response = await markNotificationRead('non-existent')
    expect(response.data).toBeUndefined()
    expect(response.error).toBeDefined()
  })

  it('should return error when mark all read fails', async () => {
    server.use(
      http.put('*/api/notifications/read-all', () => {
        return HttpResponse.json({ error: 'Failed to mark all read' }, { status: 500 })
      })
    )
    const response = await markAllNotificationsRead()
    expect(response.data).toBeUndefined()
    expect(response.error).toBeDefined()
  })
})
