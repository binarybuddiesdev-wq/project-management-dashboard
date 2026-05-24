import React from 'react'
import { Droppable } from '@hello-pangea/dnd'
import { KanbanCard } from '../KanbanCard/KanbanCard'
import type { IKanbanColumnProps } from '@/types'

export const KanbanColumn = React.memo((props: IKanbanColumnProps) => {
  const { status, title, tasks, isLoading, error, onEditTask, onDeleteTask } = props

  return (
    <div className="flex flex-col flex-1 min-w-[280px] max-w-sm bg-secondary/20 border border-border/50 rounded-2xl p-4 h-[calc(100vh-10rem)] min-h-[500px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-foreground">{title}</h3>
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Task List / Droppable */}
      <Droppable droppableId={status} type="DEFAULT">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto pr-1 min-h-[200px] rounded-lg transition-colors duration-200 kanban-scroll ${
              snapshot.isDraggingOver ? 'bg-secondary/40' : ''
            }`}
          >
            {isLoading && (
              <div className="space-y-3 pointer-events-none">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 rounded-xl border border-border/50 bg-card/60 animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-3.5 bg-muted rounded w-12" />
                      <div className="h-5 bg-muted rounded-full w-5" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center py-8 text-center text-destructive">
                <p className="text-xs font-medium">Failed to load tasks</p>
                <p className="text-[10px] text-muted-foreground mt-1">{error.message}</p>
              </div>
            )}

            {!isLoading && !error && tasks.map((task, index) => (
              <KanbanCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}

            {provided.placeholder}

            {!isLoading && !error && tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-48 border border-dashed border-border/60 rounded-xl p-4 text-center pointer-events-none">
                <span className="text-[11px] font-medium text-muted-foreground">No tasks</span>
                <span className="text-[9px] text-muted-foreground/80 mt-1">Drop tasks here</span>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
})
