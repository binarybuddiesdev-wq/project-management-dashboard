import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { IRecentProjectsProps } from '@/types'

const getStatusBadge = (status: 'active' | 'completed' | 'on_hold') => {
  switch (status) {
    case 'completed':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          Completed
        </span>
      )
    case 'on_hold':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
          On Hold
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
          Active
        </span>
      )
  }
}

export const RecentProjects = React.memo((props: IRecentProjectsProps) => {
  const { projects = [], isLoading } = props
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
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="space-y-2 flex-1">
                <div className="h-4 w-1/3 rounded bg-muted" />
                <div className="h-2 w-1/2 rounded bg-muted" />
              </div>
              <div className="h-6 w-16 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const isEmpty = projects.length === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
      className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col h-full [transform:translateZ(0)]"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Recent Projects</h3>
        <p className="text-xs text-muted-foreground">List of currently active and tracked projects</p>
      </div>

      <div className="flex-1 overflow-auto">
        {isEmpty ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground py-8">
            No projects available.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {projects.map((project) => {
              const { id, name, status, progress, taskCount, dueDate } = project
              return (
                <div key={id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground truncate">{name}</span>
                      {getStatusBadge(status)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{taskCount} tasks</span>
                      <span>Due {dueDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex-1 sm:w-24 bg-secondary rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground w-8 text-right">
                      {progress}%
                    </span>
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
