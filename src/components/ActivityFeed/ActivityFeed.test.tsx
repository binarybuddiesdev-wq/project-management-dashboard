import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ActivityFeed } from './ActivityFeed'

describe('ActivityFeed Component', () => {
  const mockActivities = [
    { id: 'a1', userName: 'Sarah Connor', action: 'completed task', target: 'Define responsive tokens', timestamp: '10 mins ago' },
    { id: 'a2', userName: 'John Doe', action: 'created project', target: 'Design System V2', timestamp: '2 hours ago' },
  ]

  it('renders loading state when isLoading is true', () => {
    const { container } = render(
      <ActivityFeed activities={mockActivities} isLoading={true} />
    )
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders title and activity logs correctly', () => {
    const { getByText } = render(
      <ActivityFeed activities={mockActivities} isLoading={false} />
    )
    expect(getByText('Recent Activity')).toBeInTheDocument()
    expect(getByText('Sarah Connor')).toBeInTheDocument()
    expect(getByText('completed task')).toBeInTheDocument()
    expect(getByText('Define responsive tokens')).toBeInTheDocument()
    expect(getByText('John Doe')).toBeInTheDocument()
    expect(getByText('created project')).toBeInTheDocument()
    expect(getByText('Design System V2')).toBeInTheDocument()
  })

  it('renders empty state when activities array is empty', () => {
    const { getByText } = render(
      <ActivityFeed activities={[]} isLoading={false} />
    )
    expect(getByText('No recent activity.')).toBeInTheDocument()
  })
})
