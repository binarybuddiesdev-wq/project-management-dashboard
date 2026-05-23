import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CompletionChart } from './CompletionChart'
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

describe('CompletionChart Component', () => {
  const mockData = [
    { name: 'Completed', value: 32, color: '#10b981' },
    { name: 'In Progress', value: 10, color: '#3b82f6' },
  ]

  it('renders loading skeleton state when isLoading is true', () => {
    const { container } = render(
      <CompletionChart data={mockData} isLoading={true} />
    )
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders title and metadata when loaded', () => {
    const { getByText } = render(
      <CompletionChart data={mockData} isLoading={false} />
    )
    expect(getByText('Task Status')).toBeInTheDocument()
    expect(getByText('Current completion and progress distribution')).toBeInTheDocument()
  })

  it('displays empty state message when data is empty', () => {
    const { getByText } = render(
      <CompletionChart data={[]} isLoading={false} />
    )
    expect(getByText('No status data available.')).toBeInTheDocument()
  })
})
