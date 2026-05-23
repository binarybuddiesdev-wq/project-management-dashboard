import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProjectFilters } from './ProjectFilters'

describe('ProjectFilters Component', () => {
  it('renders search input and dropdowns', () => {
    const { getByPlaceholderText } = render(
      <ProjectFilters
        search=""
        status=""
        priority=""
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
        onPriorityChange={vi.fn()}
      />
    )
    expect(getByPlaceholderText('Search projects...')).toBeInTheDocument()
  })

  it('calls onSearchChange when typing in search input', () => {
    const onSearchChange = vi.fn()
    const { getByPlaceholderText } = render(
      <ProjectFilters
        search=""
        status=""
        priority=""
        onSearchChange={onSearchChange}
        onStatusChange={vi.fn()}
        onPriorityChange={vi.fn()}
      />
    )
    const input = getByPlaceholderText('Search projects...')
    fireEvent.change(input, { target: { value: 'test' } })
    expect(onSearchChange).toHaveBeenCalledWith('test')
  })

  it('calls onStatusChange when selecting a status', () => {
    const onStatusChange = vi.fn()
    const { getByDisplayValue } = render(
      <ProjectFilters
        search=""
        status=""
        priority=""
        onSearchChange={vi.fn()}
        onStatusChange={onStatusChange}
        onPriorityChange={vi.fn()}
      />
    )
    const select = getByDisplayValue('All Statuses')
    fireEvent.change(select, { target: { value: 'active' } })
    expect(onStatusChange).toHaveBeenCalledWith('active')
  })

  it('calls onPriorityChange when selecting a priority', () => {
    const onPriorityChange = vi.fn()
    const { getByDisplayValue } = render(
      <ProjectFilters
        search=""
        status=""
        priority=""
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
        onPriorityChange={onPriorityChange}
      />
    )
    const select = getByDisplayValue('All Priorities')
    fireEvent.change(select, { target: { value: 'urgent' } })
    expect(onPriorityChange).toHaveBeenCalledWith('urgent')
  })

  it('shows clear button when search has text', () => {
    const onSearchChange = vi.fn()
    const { getByLabelText } = render(
      <ProjectFilters
        search="active search"
        status=""
        priority=""
        onSearchChange={onSearchChange}
        onStatusChange={vi.fn()}
        onPriorityChange={vi.fn()}
      />
    )
    const clearButton = getByLabelText('Clear search')
    expect(clearButton).toBeInTheDocument()
    fireEvent.click(clearButton)
    expect(onSearchChange).toHaveBeenCalledWith('')
  })

  it('does not show clear button when search is empty', () => {
    const { queryByLabelText } = render(
      <ProjectFilters
        search=""
        status=""
        priority=""
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
        onPriorityChange={vi.fn()}
      />
    )
    expect(queryByLabelText('Clear search')).toBeNull()
  })

  it('renders with combined status and priority filters set', () => {
    const { getByDisplayValue } = render(
      <ProjectFilters
        search=""
        status="active"
        priority="high"
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
        onPriorityChange={vi.fn()}
      />
    )
    expect(getByDisplayValue('Active')).toBeInTheDocument()
    expect(getByDisplayValue('High')).toBeInTheDocument()
  })
})
