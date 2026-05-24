import { useState, useCallback } from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { Plus, AlertCircle, RotateCcw } from 'lucide-react'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks'
import { KanbanColumn, TaskModal } from '@/components'
import type { ITask, ITaskFormData } from '@/types'

export const Kanban = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null)

  const { data: tasks = [], isLoading, isError, error, refetch } = useTasks()

  const createMutation = useCreateTask()
  const updateMutation = useUpdateTask()
  const deleteMutation = useDeleteTask()

  const handleOpenCreate = useCallback(() => {
    setSelectedTask(null)
    setModalOpen(true)
  }, [])

  const handleOpenEdit = useCallback((task: ITask) => {
    setSelectedTask(task)
    setModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
    setSelectedTask(null)
  }, [])

  const handleSubmit = useCallback(async (data: ITaskFormData) => {
    if (selectedTask) {
      await updateMutation.mutateAsync({ id: selectedTask.id, data })
    } else {
      await createMutation.mutateAsync(data)
    }
    handleCloseModal()
  }, [selectedTask, updateMutation, createMutation, handleCloseModal])

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteMutation.mutateAsync(id)
    }
  }, [deleteMutation])

  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // Call update mutation with the new status
    updateMutation.mutate({
      id: draggableId,
      data: {
        status: destination.droppableId as 'backlog' | 'in_progress' | 'in_review' | 'done',
      },
    })
  }, [updateMutation])

  const isMutating = createMutation.isPending || updateMutation.isPending

  const backlogTasks = tasks.filter((t) => t.status === 'backlog')
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress')
  const inReviewTasks = tasks.filter((t) => t.status === 'in_review')
  const doneTasks = tasks.filter((t) => t.status === 'done')

  if (isError) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-destructive/30 bg-destructive/5 rounded-xl p-8 text-center space-y-4 animate-in fade-in duration-300">
          <div className="rounded-full bg-destructive/10 p-3 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">Failed to load tasks</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {(error instanceof Error ? error.message : String(error)) || 'An unexpected error occurred while fetching tasks.'}
            </p>
          </div>
          <button
            onClick={() => { void refetch() }}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm transition-all duration-200 cursor-pointer active:scale-95 border-0"
          >
            <RotateCcw className="h-4 w-4" />
            Retry Request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kanban Board</h1>
          <p className="text-muted-foreground">Manage and prioritize your team tasks.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 shadow-sm transition-all duration-200 cursor-pointer active:scale-95 border-0 shrink-0"
        >
          <Plus className="h-4 w-4" />
          New Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1 items-start min-h-0 kanban-scroll">
          <KanbanColumn
            status="backlog"
            title="Backlog"
            tasks={backlogTasks}
            isLoading={isLoading}
            error={error}
            onEditTask={handleOpenEdit}
            onDeleteTask={handleDelete}
          />
          <KanbanColumn
            status="in_progress"
            title="In Progress"
            tasks={inProgressTasks}
            isLoading={isLoading}
            error={error}
            onEditTask={handleOpenEdit}
            onDeleteTask={handleDelete}
          />
          <KanbanColumn
            status="in_review"
            title="In Review"
            tasks={inReviewTasks}
            isLoading={isLoading}
            error={error}
            onEditTask={handleOpenEdit}
            onDeleteTask={handleDelete}
          />
          <KanbanColumn
            status="done"
            title="Done"
            tasks={doneTasks}
            isLoading={isLoading}
            error={error}
            onEditTask={handleOpenEdit}
            onDeleteTask={handleDelete}
          />
        </div>
      </DragDropContext>

      <TaskModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        task={selectedTask}
        isLoading={isMutating}
      />
    </div>
  )
}
