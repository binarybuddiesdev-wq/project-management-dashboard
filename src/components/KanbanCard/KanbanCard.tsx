import React from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Pencil, Trash2, Calendar, User } from 'lucide-react'
import type { IKanbanCardProps } from '@/types'

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  low: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
}

const getAvatarUrl = (name: string): string => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const imgId = (hash % 70) + 1
  return `https://i.pravatar.cc/32?img=${imgId}`
}

export const KanbanCard = React.memo((props: IKanbanCardProps) => {
  const { task, index, onEdit, onDelete } = props
  const { id, title, description, priority, assignee, dueDate, labels } = task

  const initials = assignee
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 mb-3 rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 select-none group relative ${
            snapshot.isDragging ? 'shadow-lg border-primary bg-accent/10 scale-[1.02] rotate-1' : ''
          }`}
        >
          {/* Header & Title */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-medium text-sm text-foreground leading-snug line-clamp-2 pr-6">
              {title}
            </h4>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute right-3 top-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(task)
                }}
                type="button"
                className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label={`Edit task ${title}`}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(id)
                }}
                type="button"
                className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer"
                aria-label={`Delete task ${title}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {description}
            </p>
          )}

          {/* Labels / Tags */}
          {labels && labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {labels.map((label) => (
                <span
                  key={label}
                  className="px-1.5 py-0.5 rounded bg-secondary text-[10px] text-secondary-foreground font-medium"
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* Footer Metadata */}
          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-2">
              {/* Priority badge */}
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border uppercase tracking-wider ${
                  PRIORITY_COLORS[priority] || 'bg-muted text-muted-foreground border-border'
                }`}
              >
                {priority}
              </span>

              {/* Due Date */}
              {dueDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {dueDate}
                </span>
              )}
            </div>

            {/* Assignee Avatar */}
            <div className="flex items-center gap-1.5">
              <span className="max-w-[80px] truncate hidden sm:inline">{assignee}</span>
              {assignee ? (
                <div className="relative h-5 w-5 rounded-full ring-1 ring-border overflow-hidden bg-accent flex items-center justify-center text-[8px] font-bold text-accent-foreground">
                  <img
                    src={getAvatarUrl(assignee)}
                    alt={assignee}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <span>{initials}</span>
                </div>
              ) : (
                <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center text-[8px] font-bold text-accent-foreground ring-1 ring-border">
                  <User className="h-2.5 w-2.5" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
})
