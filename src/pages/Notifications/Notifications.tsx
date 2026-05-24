import { useCallback } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks'
import { NotificationItem } from '@/components'
import type { RootState } from '@/store'

export const NotificationsPage = () => {
  const { items, unreadCount } = useSelector((state: RootState) => state.notifications)
  const { isLoading, isError, refetch } = useNotifications()
  const markReadMutation = useMarkNotificationRead()
  const markAllMutation = useMarkAllNotificationsRead()

  const handleMarkRead = useCallback((id: string) => {
    markReadMutation.mutate(id)
  }, [markReadMutation])

  const handleMarkAllRead = useCallback(() => {
    markAllMutation.mutate()
  }, [markAllMutation])

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-destructive/30 bg-destructive/5 rounded-xl p-8 text-center space-y-4">
        <div className="rounded-full bg-destructive/10 p-3 text-destructive">
          <Bell className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">Failed to load notifications</h3>
          <p className="text-sm text-muted-foreground">An error occurred while fetching notifications.</p>
        </div>
        <button
          onClick={() => { void refetch() }}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm transition-all cursor-pointer border-0"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {isLoading ? 'Loading...' : `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            type="button"
            disabled={markAllMutation.isPending}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-background text-foreground hover:bg-accent transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 notifications-scroll">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-card/60 animate-pulse">
                <div className="h-8 w-8 rounded-lg bg-muted shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border border-dashed border-border/60 rounded-xl p-8 text-center">
            <div className="rounded-full bg-muted p-3 text-muted-foreground mb-4">
              <Bell className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No notifications</h3>
            <p className="text-sm text-muted-foreground mt-1">You are all caught up!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
