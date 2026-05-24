import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/services'
import { setNotifications, markAsRead, markAllAsRead } from '@/store'
import type { INotification } from '@/types'

const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const

export const useNotifications = () => {
  const dispatch = useDispatch()

  const query = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: async () => {
      const response = await getNotifications()
      if (response.error) {
        throw new Error(response.error)
      }
      const items = response.data as INotification[]
      dispatch(setNotifications(items))
      return items
    },
    retry: false,
  })

  return query
}

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await markNotificationRead(id)
      if (response.error) {
        throw new Error(response.error)
      }
      return id
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
      dispatch(markAsRead(id))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
    },
  })
}

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  return useMutation({
    mutationFn: async () => {
      const response = await markAllNotificationsRead()
      if (response.error) {
        throw new Error(response.error)
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
      dispatch(markAllAsRead())
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
    },
  })
}
