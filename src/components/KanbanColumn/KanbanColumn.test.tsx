import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { KanbanColumn } from './KanbanColumn'
import type { ITask } from '@/types'
import { DragDropContext } from '@hello-pangea/dnd'

const mockTasks: ITask[] = [
  {
    id: 't1',
    title: 'Task 1',
    description: 'Desc 1',
    status: 'backlog',
    priority: 'low',
    assignee: 'Alice',
    dueDate: '2026-06-30',
    labels: [],
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z',
  },
]

const renderColumnWithDnd = (props: any) => {
  return render(
    <DragDropContext onDragEnd={vi.fn()}>
      <KanbanColumn {...props} />
    </DragDropContext>
  )
}

describe('KanbanColumn Component', () => {
  it('renders column title and task count', () => {
    const { getByText } = renderColumnWithDnd({
      status: 'backlog',
      title: 'Backlog',
      tasks: mockTasks,
      isLoading: false,
      error: null,
      onEditTask: vi.fn(),
      onDeleteTask: vi.fn(),
    })

    expect(getByText('Backlog')).toBeInTheDocument()
    expect(getByText('1')).toBeInTheDocument()
    expect(getByText('Task 1')).toBeInTheDocument()
  })

  it('renders loading skeleton state', () => {
    const { container } = renderColumnWithDnd({
      status: 'backlog',
      title: 'Backlog',
      tasks: [],
      isLoading: true,
      error: null,
      onEditTask: vi.fn(),
      onDeleteTask: vi.fn(),
    })

    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders error state', () => {
    const { getByText } = renderColumnWithDnd({
      status: 'backlog',
      title: 'Backlog',
      tasks: [],
      isLoading: false,
      error: new Error('Network failure'),
      onEditTask: vi.fn(),
      onDeleteTask: vi.fn(),
    })

    expect(getByText('Failed to load tasks')).toBeInTheDocument()
    expect(getByText('Network failure')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    const { getByText } = renderColumnWithDnd({
      status: 'backlog',
      title: 'Backlog',
      tasks: [],
      isLoading: false,
      error: null,
      onEditTask: vi.fn(),
      onDeleteTask: vi.fn(),
    })

    expect(getByText('No tasks')).toBeInTheDocument()
    expect(getByText('Drop tasks here')).toBeInTheDocument()
  })
})
