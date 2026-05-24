import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import type { ReactNode } from 'react'
import { Kanban } from './Kanban'
import { server } from '@/test/setup'

let queryClient: QueryClient

const wrapper = (props: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      {props.children}
    </BrowserRouter>
  </QueryClientProvider>
)

describe('Kanban Page', () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
  })

  it('renders the page title and subtitle', () => {
    render(<Kanban />, { wrapper })
    expect(screen.getByText('Kanban Board')).toBeInTheDocument()
    expect(screen.getByText('Manage and prioritize your team tasks.')).toBeInTheDocument()
  })

  it('renders the "New Task" button', () => {
    render(<Kanban />, { wrapper })
    expect(screen.getByText('New Task')).toBeInTheDocument()
  })

  it('renders columns and tasks after fetching data', async () => {
    render(<Kanban />, { wrapper })
    await waitFor(() => {
      expect(screen.getByText('Research User Personas')).toBeInTheDocument()
    }, { timeout: 5000 })
    expect(screen.getByText('Draft Architecture Plan')).toBeInTheDocument()
    expect(screen.getByText('Implement Login UI')).toBeInTheDocument()
    expect(screen.getByText('Scaffold Application')).toBeInTheDocument()
  })

  it('renders error state when fetch fails', async () => {
    server.use(
      http.get('*/api/tasks', () => {
        return HttpResponse.json({ error: 'Server error occurred' }, { status: 500 })
      })
    )
    render(<Kanban />, { wrapper })
    await waitFor(() => {
      expect(screen.getByText('Failed to load tasks')).toBeInTheDocument()
    }, { timeout: 5000 })
    expect(screen.getByText('Retry Request')).toBeInTheDocument()
  })
})
