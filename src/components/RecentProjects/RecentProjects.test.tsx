import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { RecentProjects } from './RecentProjects'

describe('RecentProjects Component', () => {
  const mockProjects = [
    { id: 'p1', name: 'Brand Redesign', status: 'active' as const, progress: 68, taskCount: 15, dueDate: '2026-06-15' },
    { id: 'p2', name: 'API Refactoring', status: 'completed' as const, progress: 100, taskCount: 8, dueDate: '2026-05-20' },
  ]

  it('renders loading state when isLoading is true', () => {
    const { container } = render(
      <RecentProjects projects={mockProjects} isLoading={true} />
    )
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders title and project details correctly', () => {
    const { getByText } = render(
      <RecentProjects projects={mockProjects} isLoading={false} />
    )
    expect(getByText('Recent Projects')).toBeInTheDocument()
    expect(getByText('Brand Redesign')).toBeInTheDocument()
    expect(getByText('API Refactoring')).toBeInTheDocument()
    expect(getByText('68%')).toBeInTheDocument()
    expect(getByText('100%')).toBeInTheDocument()
  })

  it('renders empty state when projects array is empty', () => {
    const { getByText } = render(
      <RecentProjects projects={[]} isLoading={false} />
    )
    expect(getByText('No projects available.')).toBeInTheDocument()
  })
})
