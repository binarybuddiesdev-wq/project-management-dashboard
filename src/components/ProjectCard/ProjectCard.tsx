import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import type { IProjectCardProps } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-primary/10 text-primary border-primary/20',
  completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  on_hold: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
}

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'text-rose-500',
  high: 'text-orange-500',
  medium: 'text-amber-500',
  low: 'text-muted-foreground',
}

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'active': return 'Active'
    case 'completed': return 'Completed'
    case 'on_hold': return 'On Hold'
    case 'cancelled': return 'Cancelled'
    default: return status
  }
}

export const ProjectCard = React.memo((props: IProjectCardProps) => {
  const { project, onEdit, onDelete } = props
  const { id, name, description, status, priority, dueDate, taskCount, progress } = project
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.01 }}
      className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-shadow duration-200 cursor-pointer [transform:translateZ(0)] group h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-3 flex-1">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground truncate">{name}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(project) }}
            type="button"
            className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer"
            aria-label="Edit project"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(id) }}
            type="button"
            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer"
            aria-label="Delete project"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${STATUS_COLORS[status] || 'bg-muted text-muted-foreground border-border'}`}>
          {getStatusLabel(status)}
        </span>
        <span className={`inline-flex items-center text-[10px] font-medium ${PRIORITY_COLORS[priority] || 'text-muted-foreground'}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current mr-1" />
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
      </div>

      <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-3">
        <span>{taskCount} tasks</span>
        <span>Due {dueDate}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 bg-secondary rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] font-medium text-muted-foreground w-8 text-right">
          {progress}%
        </span>
      </div>
    </motion.div>
  )
})
