import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, AlertCircle, RotateCcw } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '@/hooks'
import { ProjectCard, ProjectModal, ProjectFilters } from '@/components'
import type { IProject, IProjectFormData } from '@/types'

export const ProjectsList = () => {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<IProject | null>(null)

  const { data: projects, isLoading, isError, error, refetch } = useProjects({
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    search: search || undefined,
  })

  const createMutation = useCreateProject()
  const updateMutation = useUpdateProject()
  const deleteMutation = useDeleteProject()

  const handleOpenCreate = useCallback(() => {
    setEditingProject(null)
    setModalOpen(true)
  }, [])

  const handleOpenEdit = useCallback((project: IProject) => {
    setEditingProject(project)
    setModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
    setEditingProject(null)
  }, [])

  const handleSubmit = useCallback(async (data: IProjectFormData) => {
    if (editingProject) {
      await updateMutation.mutateAsync({ id: editingProject.id, data })
    } else {
      const result = await createMutation.mutateAsync(data)
      if (result) {
        navigate(`/projects/${result.id}`)
      }
    }
    handleCloseModal()
  }, [editingProject, updateMutation, createMutation, handleCloseModal, navigate])

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteMutation.mutateAsync(id)
    }
  }, [deleteMutation])

  const isMutating = createMutation.isPending || updateMutation.isPending

  if (isError) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-destructive/30 bg-destructive/5 rounded-xl p-8 text-center space-y-4 animate-in fade-in duration-300">
          <div className="rounded-full bg-destructive/10 p-3 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">Failed to load projects</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {(error instanceof Error ? error.message : String(error)) || 'An unexpected error occurred while fetching projects.'}
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
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and track your team projects.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 shadow-sm transition-all duration-200 cursor-pointer active:scale-95 border-0 shrink-0"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      <ProjectFilters
        search={search}
        status={statusFilter}
        priority={priorityFilter}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
      />

      <div className="projects-scroll flex-1 min-h-0 overflow-y-auto">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-sm animate-pulse space-y-4">
                <div className="space-y-2">
                  <div className="h-4 w-2/3 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                </div>
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded-full bg-muted" />
                  <div className="h-5 w-12 rounded-full bg-muted" />
                </div>
                <div className="h-1.5 w-full rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: shouldReduceMotion ? 0 : index * 0.05 }}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="cursor-pointer"
              >
                <ProjectCard
                  project={project}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-border rounded-xl p-8 text-center space-y-3">
            <div className="rounded-full bg-accent/10 p-3">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground">No projects yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Get started by creating your first project.
            </p>
            <button
              onClick={handleOpenCreate}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm transition-all cursor-pointer border-0"
            >
              <Plus className="h-4 w-4" />
              Create Project
            </button>
          </div>
        )}
      </div>

      <ProjectModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        project={editingProject}
        isLoading={isMutating}
      />
    </div>
  )
}
