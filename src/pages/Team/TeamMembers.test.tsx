import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { TeamMembers } from './TeamMembers'
import * as teamService from '@/services/team.service'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

const wrapper = (props: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {props.children}
  </QueryClientProvider>
)

describe('TeamMembers Page', () => {
  beforeEach(() => {
    queryClient.clear()
    vi.restoreAllMocks()
  })

  it('renders the page title', () => {
    render(<TeamMembers />, { wrapper })
    expect(screen.getByText('Team Members')).toBeInTheDocument()
  })

  it('renders the "Invite Member" button', () => {
    render(<TeamMembers />, { wrapper })
    expect(screen.getByText('Invite Member')).toBeInTheDocument()
  })

  it('renders team scroll container after loading', async () => {
    render(<TeamMembers />, { wrapper })
    await waitFor(() => {
      expect(document.querySelector('.team-scroll')).toBeInTheDocument()
    })
  })

  it('renders loading skeleton while fetching', () => {
    render(<TeamMembers />, { wrapper })
    const skeletonContainers = document.querySelectorAll('.animate-pulse')
    expect(skeletonContainers.length).toBeGreaterThan(0)
  })

  it('renders empty state when no members exist', async () => {
    vi.spyOn(teamService, 'getMembers').mockResolvedValue({ data: [] })
    render(<TeamMembers />, { wrapper })
    await waitFor(() => {
      expect(screen.getByText('No team members yet')).toBeInTheDocument()
    })
    expect(screen.getAllByText('Invite Member').length).toBeGreaterThanOrEqual(1)
  })

  it('renders error state when fetch fails', async () => {
    vi.spyOn(teamService, 'getMembers').mockResolvedValue({ error: 'Failed to load' })
    render(<TeamMembers />, { wrapper })
    await waitFor(() => {
      expect(screen.getByText('Failed to load team')).toBeInTheDocument()
    }, { timeout: 5000 })
    expect(screen.getByText('Retry Request')).toBeInTheDocument()
  })
})
