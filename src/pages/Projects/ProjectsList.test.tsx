import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import type { ReactNode } from 'react'
import { ProjectsList } from './ProjectsList'
import { server } from '@/test/setup'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

const wrapper = (props: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      {props.children}
    </BrowserRouter>
  </QueryClientProvider>
)

describe('ProjectsList Page', () => {
  beforeEach(() => {
    queryClient.clear()
  })

  it('renders the page title', () => {
    render(<ProjectsList />, { wrapper })
    expect(screen.getByText('Projects')).toBeInTheDocument()
  })

  it('renders the "New Project" button', () => {
    render(<ProjectsList />, { wrapper })
    expect(screen.getByText('New Project')).toBeInTheDocument()
  })

  it('renders a list of project cards after loading', async () => {
    render(<ProjectsList />, { wrapper })
    await waitFor(() => {
      expect(screen.getByText('Brand Redesign')).toBeInTheDocument()
    })
    expect(screen.getByText('Mobile App Implementation')).toBeInTheDocument()
    expect(screen.getByText('API Refactoring')).toBeInTheDocument()
  })

  it('renders loading skeleton while fetching', () => {
    render(<ProjectsList />, { wrapper })
    const skeletonContainers = document.querySelectorAll('.animate-pulse')
    expect(skeletonContainers.length).toBeGreaterThan(0)
  })

  it('renders empty state when no projects exist', async () => {
    server.use(
      http.get('*/api/projects', () => {
        return HttpResponse.json({ data: [] })
      })
    )
    render(<ProjectsList />, { wrapper })
    await waitFor(() => {
      expect(screen.getByText('No projects yet')).toBeInTheDocument()
    })
    expect(screen.getByText('Create Project')).toBeInTheDocument()
  })

  it('renders error state when fetch fails', async () => {
    server.use(
      http.get('*/api/projects', () => {
        return HttpResponse.json({ error: 'Failed to load' }, { status: 500 })
      })
    )
    render(<ProjectsList />, { wrapper })
    await waitFor(() => {
      expect(screen.getByText('Failed to load projects')).toBeInTheDocument()
    }, { timeout: 5000 })
    expect(screen.getByText('Retry Request')).toBeInTheDocument()
  })
})
