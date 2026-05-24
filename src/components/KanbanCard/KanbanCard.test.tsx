import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { KanbanCard } from './KanbanCard'
import type { ITask } from '@/types'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'

const mockTask: ITask = {
  id: 't1',
  title: 'Test Task Title',
  description: 'Test task description content.',
  status: 'backlog',
  priority: 'high',
  assignee: 'John Doe',
  dueDate: '2026-06-30',
  labels: ['Bug', 'High-Priority'],
  createdAt: '2026-05-01T00:00:00Z',
  updatedAt: '2026-05-01T00:00:00Z',
}

const renderWithDnd = (ui: React.ReactElement) => {
  return render(
    <DragDropContext onDragEnd={vi.fn()}>
      <Droppable droppableId="col-1" type="DEFAULT">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {ui}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

describe('KanbanCard Component', () => {
  it('renders task details correctly', () => {
    const { getByText } = renderWithDnd(
      <KanbanCard task={mockTask} index={0} onEdit={vi.fn()} onDelete={vi.fn()} />
    )
    expect(getByText('Test Task Title')).toBeInTheDocument()
    expect(getByText('Test task description content.')).toBeInTheDocument()
    expect(getByText('high')).toBeInTheDocument()
    expect(getByText('2026-06-30')).toBeInTheDocument()
    expect(getByText('Bug')).toBeInTheDocument()
    expect(getByText('High-Priority')).toBeInTheDocument()
    expect(getByText('John Doe')).toBeInTheDocument()
  })

  it('triggers onEdit callback when edit button is clicked', () => {
    const onEdit = vi.fn()
    const { getByRole } = renderWithDnd(
      <KanbanCard task={mockTask} index={0} onEdit={onEdit} onDelete={vi.fn()} />
    )
    const editBtn = getByRole('button', { name: /edit task/i })
    fireEvent.click(editBtn)
    expect(onEdit).toHaveBeenCalledWith(mockTask)
  })

  it('triggers onDelete callback when delete button is clicked', () => {
    const onDelete = vi.fn()
    const { getByRole } = renderWithDnd(
      <KanbanCard task={mockTask} index={0} onEdit={vi.fn()} onDelete={onDelete} />
    )
    const deleteBtn = getByRole('button', { name: /delete task/i })
    fireEvent.click(deleteBtn)
    expect(onDelete).toHaveBeenCalledWith('t1')
  })

  it('renders correctly with other priorities (urgent, medium, low)', () => {
    const priorities: ('urgent' | 'medium' | 'low')[] = ['urgent', 'medium', 'low']
    priorities.forEach((p) => {
      const task = { ...mockTask, priority: p }
      const { getByText, unmount } = renderWithDnd(
        <KanbanCard task={task} index={0} onEdit={vi.fn()} onDelete={vi.fn()} />
      )
      expect(getByText(p)).toBeInTheDocument()
      unmount()
    })
  })
})
