import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatsCard } from './StatsCard'

describe('StatsCard Component', () => {
  it('renders loading skeleton state when isLoading is true', () => {
    const { container } = render(
      <StatsCard title="Total Tasks" value={48} change={12} isLoading={true} />
    )
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders title, value, and change delta correctly', () => {
    const { getByText } = render(
      <StatsCard title="Total Tasks" value={48} change={12} isLoading={false} />
    )
    expect(getByText('Total Tasks')).toBeInTheDocument()
    expect(getByText('48')).toBeInTheDocument()
    expect(getByText('+12%')).toBeInTheDocument()
  })

  it('applies correct negative style for negative change delta', () => {
    const { getByText } = render(
      <StatsCard title="Total Tasks" value={48} change={-5} isLoading={false} />
    )
    const deltaEl = getByText('-5%')
    expect(deltaEl).toBeInTheDocument()
    expect(deltaEl.className).toContain('text-rose-500')
  })
})
