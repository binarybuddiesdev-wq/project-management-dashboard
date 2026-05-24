import { api, parseApiError } from './api'
import type { IApiResponse, INotification } from '@/types'

export const getNotifications = async (): Promise<IApiResponse<INotification[]>> => {
  try {
    const response = await api.get('notifications').json<IApiResponse<INotification[]>>()
    return response
  } catch (error) {
    const message = await parseApiError(error, 'Failed to fetch notifications')
    return { error: message }
  }
}

export const markNotificationRead = async (id: string): Promise<IApiResponse<INotification>> => {
  try {
    const response = await api.put(`notifications/${id}/read`).json<IApiResponse<INotification>>()
    return response
  } catch (error) {
    const message = await parseApiError(error, 'Failed to mark notification as read')
    return { error: message }
  }
}

export const markAllNotificationsRead = async (): Promise<IApiResponse<null>> => {
  try {
    const response = await api.put('notifications/read-all').json<IApiResponse<null>>()
    return response
  } catch (error) {
    const message = await parseApiError(error, 'Failed to mark all notifications as read')
    return { error: message }
  }
}
