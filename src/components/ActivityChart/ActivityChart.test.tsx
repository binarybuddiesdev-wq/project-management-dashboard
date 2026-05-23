import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ActivityChart } from './ActivityChart'
import React from 'react'

// Mock recharts responsive container behavior
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts') as any
  return {
    ...original,
    ResponsiveContainer: (props: { children: React.ReactNode }) => {
      const { children } = props
      return <div style={{ width: '800px', height: '400px' }}>{children}</div>
    },
  }
})

describe('ActivityChart Component', () => {
  const mockData = [
    { date: 'Mon', completed: 5, created: 8 },
    { date: 'Tue', completed: 8, created: 6 },
  ]

  it('renders loading skeleton state when isLoading is true', () => {
    const { container } = render(
      <ActivityChart data={mockData} isLoading={true} />
    )
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders title and metadata when loaded', () => {
    const { getByText } = render(
      <ActivityChart data={mockData} isLoading={false} />
    )
    expect(getByText('Task Activity')).toBeInTheDocument()
    expect(getByText('Daily task creation and completion overview')).toBeInTheDocument()
  })

  it('displays empty state message when data is empty', () => {
    const { getByText } = render(
      <ActivityChart data={[]} isLoading={false} />
    )
    expect(getByText('No activity data available.')).toBeInTheDocument()
  })
})
