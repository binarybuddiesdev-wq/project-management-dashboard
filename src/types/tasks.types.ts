export interface ITask {
  id: string
  title: string
  description: string
  status: 'backlog' | 'in_progress' | 'in_review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee: string
  dueDate: string
  labels: string[]
  createdAt: string
  updatedAt: string
}

export interface ITaskFormData {
  title: string
  description: string
  status: 'backlog' | 'in_progress' | 'in_review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee: string
  dueDate: string
  labels: string[]
}

export interface IKanbanColumnProps {
  status: 'backlog' | 'in_progress' | 'in_review' | 'done'
  title: string
  tasks: ITask[]
  isLoading: boolean
  error: Error | null
  onEditTask: (task: ITask) => void
  onDeleteTask: (id: string) => void
}

export interface IKanbanCardProps {
  task: ITask
  index: number
  onEdit: (task: ITask) => void
  onDelete: (id: string) => void
}

export interface ITaskModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ITaskFormData) => Promise<void>
  task?: ITask | null
  isLoading?: boolean
}
