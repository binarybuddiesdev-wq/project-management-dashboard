export interface INotification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
  link?: string
}

export interface INotificationState {
  items: INotification[]
  unreadCount: number
}

export interface INotificationItemProps {
  notification: INotification
  onMarkRead: (id: string) => void
}
