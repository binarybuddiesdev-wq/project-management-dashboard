import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TaskModal } from './TaskModal'
import type { ITask } from '@/types'

const mockTask: ITask = {
  id: 't1',
  title: 'Research User Personas',
  description: 'A test task',
  status: 'backlog',
  priority: 'high',
  dueDate: '2026-06-30',
  assignee: 'John Doe',
  labels: ['Research'],
  createdAt: '2026-05-01T00:00:00Z',
  updatedAt: '2026-05-01T00:00:00Z',
}

describe('TaskModal Component', () => {
  it('renders create modal with heading', () => {
    render(
      <TaskModal
        open={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    )
    expect(screen.getByRole('heading', { name: 'Create Task' })).toBeInTheDocument()
  })

  it('renders edit modal with heading when task is provided', () => {
    render(
      <TaskModal
        open={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        task={mockTask}
      />
    )
    expect(screen.getByRole('heading', { name: 'Edit Task' })).toBeInTheDocument()
  })

  it('pre-fills form fields when editing', () => {
    render(
      <TaskModal
        open={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        task={mockTask}
      />
    )
    const titleInput = screen.getByDisplayValue('Research User Personas')
    expect(titleInput).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    const { container } = render(
      <TaskModal
        open={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    )
    expect(container.innerHTML).toBe('')
  })

  it('shows validation errors on empty submit', async () => {
    const onSubmit = vi.fn()
    render(
      <TaskModal
        open={true}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    )
    const submitButton = screen.getByRole('button', { name: 'Create Task' })
    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('Title must be at least 2 characters')).toBeInTheDocument()
      expect(screen.getByText('Description must be at least 3 characters')).toBeInTheDocument()
      expect(screen.getByText('Due date is required')).toBeInTheDocument()
      expect(screen.getByText('Assignee is required')).toBeInTheDocument()
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits correctly with valid values', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <TaskModal
        open={true}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    )
    fireEvent.change(screen.getByPlaceholderText('Task title'), { target: { value: 'Valid Title' } })
    fireEvent.change(screen.getByPlaceholderText('Describe the task...'), { target: { value: 'Valid description content' } })
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2026-12-31' } })
    fireEvent.change(screen.getByPlaceholderText('Assignee name'), { target: { value: 'Jane Doe' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create Task' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Valid Title',
        description: 'Valid description content',
        status: 'backlog',
        priority: 'medium',
        dueDate: '2026-12-31',
        assignee: 'Jane Doe',
        labels: [],
      })
    })
  })

  it('shows Saving... when isLoading is true', () => {
    render(
      <TaskModal
        open={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        isLoading={true}
      />
    )
    expect(screen.getByText('Saving...')).toBeInTheDocument()
  })

  it('calls onClose when cancel is clicked', () => {
    const onClose = vi.fn()
    render(
      <TaskModal
        open={true}
        onClose={onClose}
        onSubmit={vi.fn()}
      />
    )
    fireEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalled()
  })
})
