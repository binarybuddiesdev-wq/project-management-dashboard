import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProjectModal } from './ProjectModal'
import type { IProject } from '@/types'

const mockProject: IProject = {
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

describe('ProjectModal Component', () => {
  it('renders create modal with heading', () => {
    render(
      <ProjectModal
        open={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    )
    expect(screen.getByRole('heading', { name: 'Create Project' })).toBeInTheDocument()
  })

  it('renders edit modal with heading when project is provided', () => {
    render(
      <ProjectModal
        open={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        project={mockProject}
      />
    )
    expect(screen.getByRole('heading', { name: 'Edit Project' })).toBeInTheDocument()
  })

  it('pre-fills form fields when editing', () => {
    render(
      <ProjectModal
        open={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        project={mockProject}
      />
    )
    const nameInput = screen.getByDisplayValue('Brand Redesign')
    expect(nameInput).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    const { container } = render(
      <ProjectModal
        open={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    )
    expect(container.innerHTML).toBe('')
  })

  it('shows name validation error on empty submit', async () => {
    const onSubmit = vi.fn()
    render(
      <ProjectModal
        open={true}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    )
    const submitButton = screen.getByRole('button', { name: 'Create Project' })
    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument()
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows description validation error for short input', async () => {
    const onSubmit = vi.fn()
    render(
      <ProjectModal
        open={true}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    )
    fireEvent.change(screen.getByPlaceholderText('My Project'), { target: { value: 'Valid Name' } })
    fireEvent.change(screen.getByPlaceholderText('Describe the project...'), { target: { value: 'ab' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create Project' }))
    await waitFor(() => {
      expect(screen.getByText('Description must be at least 3 characters')).toBeInTheDocument()
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows due date validation error when empty', async () => {
    const onSubmit = vi.fn()
    render(
      <ProjectModal
        open={true}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    )
    fireEvent.change(screen.getByPlaceholderText('My Project'), { target: { value: 'Valid Name' } })
    fireEvent.change(screen.getByPlaceholderText('Describe the project...'), { target: { value: 'Valid description' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create Project' }))
    await waitFor(() => {
      expect(screen.getByText('Due date is required')).toBeInTheDocument()
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows assignees validation error when empty', async () => {
    const onSubmit = vi.fn()
    render(
      <ProjectModal
        open={true}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    )
    fireEvent.change(screen.getByPlaceholderText('My Project'), { target: { value: 'Valid Name' } })
    fireEvent.change(screen.getByPlaceholderText('Describe the project...'), { target: { value: 'Valid description' } })
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2026-12-31' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create Project' }))
    await waitFor(() => {
      expect(screen.getByText('At least one assignee is required')).toBeInTheDocument()
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows Saving... when isLoading is true', () => {
    render(
      <ProjectModal
        open={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        isLoading={true}
      />
    )
    expect(screen.getByText('Saving...')).toBeInTheDocument()
  })

  it('shows Update Project text in edit mode', () => {
    render(
      <ProjectModal
        open={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        project={mockProject}
      />
    )
    expect(screen.getByText('Update Project')).toBeInTheDocument()
  })

  it('calls onClose when cancel is clicked', () => {
    const onClose = vi.fn()
    render(
      <ProjectModal
        open={true}
        onClose={onClose}
        onSubmit={vi.fn()}
      />
    )
    fireEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(
      <ProjectModal
        open={true}
        onClose={onClose}
        onSubmit={vi.fn()}
      />
    )
    const backdrop = container.querySelector('.fixed.inset-0.z-50 > div:first-child')
    if (backdrop) fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalled()
  })
})
