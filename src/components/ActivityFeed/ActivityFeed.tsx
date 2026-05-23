import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { IActivityFeedProps } from '@/types'

export const ActivityFeed = React.memo((props: IActivityFeedProps) => {
  const { activities = [], isLoading } = props
  const shouldReduceMotion = useReducedMotion()

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm animate-pulse space-y-4">
        <div className="space-y-2">
          <div className="h-4 w-40 rounded bg-muted" />
          <div className="h-3 w-28 rounded bg-muted" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 py-2">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/4 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const isEmpty = activities.length === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col h-full [transform:translateZ(0)]"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
        <p className="text-xs text-muted-foreground">Real-time log of team accomplishments</p>
      </div>

      <div className="flex-1 overflow-auto">
        {isEmpty ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground py-8">
            No recent activity.
          </div>
        ) : (
          <div className="relative pl-6 border-l border-border space-y-6">
            {activities.map((activity) => {
              const { id, userName, action, target, timestamp } = activity
              return (
                <div key={id} className="relative group">
                  <div className="absolute -left-[31px] top-1.5 bg-background border border-border rounded-full h-4 w-4 flex items-center justify-center group-hover:border-primary transition-colors duration-200">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors duration-200" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{userName}</span>{' '}
                      <span className="text-muted-foreground">{action}</span>{' '}
                      <span className="font-medium text-primary">{target}</span>
                    </p>
                    <span className="text-xs text-muted-foreground">{timestamp}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
})
