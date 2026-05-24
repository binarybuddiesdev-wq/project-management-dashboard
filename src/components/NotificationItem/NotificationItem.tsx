import { motion } from 'framer-motion'
import { Bell, CheckCircle2, AlertCircle, Info, Check } from 'lucide-react'
import type { INotificationItemProps } from '@/types'

const TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  success: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  warning: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  error: { icon: Bell, color: 'text-red-500', bg: 'bg-red-500/10' },
}

const getTimeAgo = (dateStr: string): string => {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

export const NotificationItem = (props: INotificationItemProps) => {
  const { notification, onMarkRead } = props

  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.info
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      data-testid={`notification-item-${notification.id}`}
      className={`group relative flex items-start gap-3 p-4 rounded-xl transition-all duration-200 ${
        notification.read ? 'bg-card hover:bg-accent/30' : 'bg-accent/20 hover:bg-accent/40'
      }`}
    >
      <div className={`shrink-0 p-2 rounded-lg ${config.bg} ${config.color}`}>
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className={`text-sm ${notification.read ? 'font-medium' : 'font-semibold'} text-foreground truncate`}>
            {notification.title}
          </h4>
          {!notification.read && (
            <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
        <span className="text-[10px] text-muted-foreground/60 mt-1 block">{getTimeAgo(notification.createdAt)}</span>
      </div>

      {!notification.read && (
        <button
          onClick={() => onMarkRead(notification.id)}
          type="button"
          className="shrink-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
          aria-label="Mark as read"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
      )}
    </motion.div>
  )
}
