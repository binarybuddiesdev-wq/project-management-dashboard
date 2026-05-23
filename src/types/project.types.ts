export interface IProject {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'on_hold' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate: string
  assignees: string[]
  taskCount: number
  progress: number
  createdAt: string
  updatedAt: string
}

export interface IProjectFormData {
  name: string
  description: string
  status: 'active' | 'completed' | 'on_hold' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate: string
  assignees: string[]
}

export interface IProjectCardProps {
  project: IProject
  onEdit: (project: IProject) => void
  onDelete: (id: string) => void
}

export interface IProjectModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: IProjectFormData) => Promise<void>
  project?: IProject | null
  isLoading?: boolean
}

export interface IProjectFiltersProps {
  search: string
  status: string
  priority: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onPriorityChange: (value: string) => void
}
