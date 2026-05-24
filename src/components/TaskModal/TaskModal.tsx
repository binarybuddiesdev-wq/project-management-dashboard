import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ITaskModalProps, ITaskFormData } from '@/types'

const taskSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  status: z.enum(['backlog', 'in_progress', 'in_review', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.string().min(1, 'Due date is required'),
  assignee: z.string().min(2, 'Assignee is required'),
  labels: z.array(z.string()),
})

export const TaskModal = (props: ITaskModalProps) => {
  const { open, onClose, onSubmit, task, isLoading } = props
  const shouldReduceMotion = useReducedMotion()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ITaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'backlog',
      priority: 'medium',
      dueDate: '',
      assignee: '',
      labels: [],
    },
  })

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignee: task.assignee,
        labels: task.labels,
      })
    } else {
      reset({
        title: '',
        description: '',
        status: 'backlog',
        priority: 'medium',
        dueDate: '',
        assignee: '',
        labels: [],
      })
    }
  }, [task, reset, open])

  const handleFormSubmit = async (data: ITaskFormData) => {
    await onSubmit(data)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95, y: shouldReduceMotion ? 0 : 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl [transform:translateZ(0)]"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                {task ? 'Edit Task' : 'Create Task'}
              </h2>
              <button
                onClick={onClose}
                type="button"
                className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">
                  Task Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Task title"
                  {...register('title')}
                  className={`w-full px-3 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.title ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                  }`}
                />
                {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="description" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Describe the task..."
                  rows={3}
                  {...register('description')}
                  className={`w-full px-3 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 resize-none ${
                    errors.description ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                  }`}
                />
                {errors.description && <p className="text-destructive text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="status" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">
                    Status
                  </label>
                  <select
                    id="status"
                    {...register('status')}
                    className={`w-full px-3 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.status ? 'border-destructive' : 'border-border'
                    }`}
                  >
                    <option value="backlog">Backlog</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="priority" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">
                    Priority
                  </label>
                  <select
                    id="priority"
                    {...register('priority')}
                    className={`w-full px-3 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.priority ? 'border-destructive' : 'border-border'
                    }`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="dueDate" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">
                    Due Date
                  </label>
                  <input
                    id="dueDate"
                    type="date"
                    {...register('dueDate')}
                    className={`w-full px-3 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.dueDate ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                    }`}
                  />
                  {errors.dueDate && <p className="text-destructive text-xs mt-1">{errors.dueDate.message}</p>}
                </div>

                <div className="space-y-1">
                  <label htmlFor="assignee" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">
                    Assignee Name
                  </label>
                  <input
                    id="assignee"
                    type="text"
                    placeholder="Assignee name"
                    {...register('assignee')}
                    className={`w-full px-3 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 ${
                      errors.assignee ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                    }`}
                  />
                  {errors.assignee && <p className="text-destructive text-xs mt-1">{errors.assignee.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="labels" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block select-none">
                  Labels (comma-separated)
                </label>
                <input
                  id="labels"
                  type="text"
                  placeholder="e.g. Design, Frontend"
                  {...register('labels', {
                    setValueAs: (v: string | string[]) => Array.isArray(v) ? v : v.split(',').map((s: string) => s.trim()).filter(Boolean),
                  })}
                  className={`w-full px-3 py-2 rounded-lg border bg-background text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 border-border focus:border-primary`}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background text-foreground hover:bg-accent transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
