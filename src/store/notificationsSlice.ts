import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { INotification, INotificationState } from '@/types'
import type { RootState } from './store'

const initialState: INotificationState = {
  items: [],
  unreadCount: 0,
}

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<INotification[]>) => {
      state.items = action.payload
      state.unreadCount = action.payload.filter((n) => !n.read).length
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((n) => n.id === action.payload)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((n) => { n.read = true })
      state.unreadCount = 0
    },
    incrementUnread: (state) => {
      state.unreadCount += 1
    },
  },
})

export const { setNotifications, markAsRead, markAllAsRead, incrementUnread } = notificationsSlice.actions
export const selectUnreadCount = (state: RootState): number => state.notifications.unreadCount
export const notificationsReducer = notificationsSlice.reducer
