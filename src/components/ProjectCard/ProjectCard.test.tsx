import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProjectCard } from './ProjectCard'
import type { IProject } from '@/types'
import { BrowserRouter } from 'react-router-dom'

const baseProject: IProject = {
  id: 'p1',
  name: 'Brand Redesign',
  description: 'A test project',
  status: 'active',
  priority: 'high',
  dueDate: '2026-06-30',
  assignees: ['Alice', 'Bob'],
  taskCount: 10,
  progress: 65,
  createdAt: '2026-01-15T00:00:00Z',
  updatedAt: '2026-03-01T00:00:00Z',
}

describe('ProjectCard Component', () => {
  it('renders project name and status badge', () => {
    const { getByText } = render(
      <BrowserRouter>
        <ProjectCard project={baseProject} onEdit={vi.fn()} onDelete={vi.fn()} />
      </BrowserRouter>
    )
    expect(getByText('Brand Redesign')).toBeInTheDocument()
    expect(getByText('Active')).toBeInTheDocument()
  })

  it('renders priority indicator high', () => {
    const { getByText } = render(
      <BrowserRouter>
        <ProjectCard project={baseProject} onEdit={vi.fn()} onDelete={vi.fn()} />
      </BrowserRouter>
    )
    expect(getByText('High')).toBeInTheDocument()
  })

  it('renders progress bar with correct value', () => {
    const { container } = render(
      <BrowserRouter>
        <ProjectCard project={baseProject} onEdit={vi.fn()} onDelete={vi.fn()} />
      </BrowserRouter>
    )
    const progressEl = container.querySelector('[style*="width: 65%"]')
    expect(progressEl).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn()
    const { getByRole } = render(
      <BrowserRouter>
        <ProjectCard project={baseProject} onEdit={onEdit} onDelete={vi.fn()} />
      </BrowserRouter>
    )
    fireEvent.click(getByRole('button', { name: 'Edit project' }))
    expect(onEdit).toHaveBeenCalledWith(baseProject)
  })

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn()
    const { getByRole } = render(
      <BrowserRouter>
        <ProjectCard project={baseProject} onEdit={vi.fn()} onDelete={onDelete} />
      </BrowserRouter>
    )
    fireEvent.click(getByRole('button', { name: 'Delete project' }))
    expect(onDelete).toHaveBeenCalledWith(baseProject.id)
  })

  it('renders completed status badge', () => {
    const project: IProject = { ...baseProject, status: 'completed' }
    const { getByText } = render(
      <BrowserRouter>
        <ProjectCard project={project} onEdit={vi.fn()} onDelete={vi.fn()} />
      </BrowserRouter>
    )
    expect(getByText('Completed')).toBeInTheDocument()
  })

  it('renders on_hold status badge', () => {
    const project: IProject = { ...baseProject, status: 'on_hold' }
    const { getByText } = render(
      <BrowserRouter>
        <ProjectCard project={project} onEdit={vi.fn()} onDelete={vi.fn()} />
      </BrowserRouter>
    )
    expect(getByText('On Hold')).toBeInTheDocument()
  })

  it('renders cancelled status badge', () => {
    const project: IProject = { ...baseProject, status: 'cancelled' }
    const { getByText } = render(
      <BrowserRouter>
        <ProjectCard project={project} onEdit={vi.fn()} onDelete={vi.fn()} />
      </BrowserRouter>
    )
    expect(getByText('Cancelled')).toBeInTheDocument()
  })

  it('renders urgent priority indicator', () => {
    const project: IProject = { ...baseProject, priority: 'urgent' }
    const { getByText } = render(
      <BrowserRouter>
        <ProjectCard project={project} onEdit={vi.fn()} onDelete={vi.fn()} />
      </BrowserRouter>
    )
    expect(getByText('Urgent')).toBeInTheDocument()
  })

  it('renders medium priority indicator', () => {
    const project: IProject = { ...baseProject, priority: 'medium' }
    const { getByText } = render(
      <BrowserRouter>
        <ProjectCard project={project} onEdit={vi.fn()} onDelete={vi.fn()} />
      </BrowserRouter>
    )
    expect(getByText('Medium')).toBeInTheDocument()
  })

  it('renders low priority indicator', () => {
    const project: IProject = { ...baseProject, priority: 'low' }
    const { getByText } = render(
      <BrowserRouter>
        <ProjectCard project={project} onEdit={vi.fn()} onDelete={vi.fn()} />
      </BrowserRouter>
    )
    expect(getByText('Low')).toBeInTheDocument()
  })

  it('renders without description', () => {
    const project: IProject = { ...baseProject, description: '' }
    const { container } = render(
      <BrowserRouter>
        <ProjectCard project={project} onEdit={vi.fn()} onDelete={vi.fn()} />
      </BrowserRouter>
    )
    expect(container.querySelector('p.text-xs.text-muted-foreground.mt-1')).toBeNull()
  })
})
