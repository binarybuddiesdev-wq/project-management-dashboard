import { useCallback, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, AlertCircle, RotateCcw } from 'lucide-react'
import { useProject, useUpdateProject, useDeleteProject } from '@/hooks'
import { ProjectModal } from '@/components'
import type { IProjectFormData } from '@/types'

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

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)

  const { data: project, isLoading, isError, error, refetch } = useProject(id || '')
  const updateMutation = useUpdateProject()
  const deleteMutation = useDeleteProject()

  const handleEdit = useCallback(() => {
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback(async () => {
    if (!id) return
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteMutation.mutateAsync(id)
      navigate('/projects')
    }
  }, [id, deleteMutation, navigate])

  const handleSubmit = useCallback(async (data: IProjectFormData) => {
    if (!id) return
    await updateMutation.mutateAsync({ id, data })
    setModalOpen(false)
  }, [id, updateMutation])

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-destructive/30 bg-destructive/5 rounded-xl p-8 text-center space-y-4 animate-in fade-in duration-300">
        <div className="rounded-full bg-destructive/10 p-3 text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">Failed to load project</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {(error instanceof Error ? error.message : String(error)) || 'An unexpected error occurred.'}
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
    )
  }

  if (isLoading || !project) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="h-6 w-1/3 rounded bg-muted" />
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-4 w-1/2 rounded bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/projects')}
          type="button"
          className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Back to projects"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">Project details and settings.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleEdit}
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-border bg-background text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[project.status] || 'bg-muted text-muted-foreground border-border'}`}>
            {getStatusLabel(project.status)}
          </span>
          <span className={`inline-flex items-center text-xs font-medium ${PRIORITY_COLORS[project.priority] || 'text-muted-foreground'}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5" />
            {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
          </span>
        </div>

        {project.description && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</h3>
            <p className="text-sm text-foreground">{project.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Due Date</h3>
            <p className="text-sm font-medium text-foreground">{project.dueDate}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tasks</h3>
            <p className="text-sm font-medium text-foreground">{project.taskCount}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Progress</h3>
            <p className="text-sm font-medium text-foreground">{project.progress}%</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Assignees</h3>
            <p className="text-sm font-medium text-foreground">
              {project.assignees.length > 0 ? project.assignees.join(', ') : 'None'}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Progress</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-foreground w-10 text-right">{project.progress}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-2 border-t border-border">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Created</h3>
            <p className="text-sm text-foreground">{new Date(project.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Last Updated</h3>
            <p className="text-sm text-foreground">{new Date(project.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <ProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        project={project}
        isLoading={updateMutation.isPending}
      />
    </div>
  )
}
