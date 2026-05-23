import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProjectDetail } from './ProjectDetail'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

const renderPage = (projectId = 'p1') => render(
  <QueryClientProvider client={queryClient}>
    <MemoryRouter initialEntries={[`/projects/${projectId}`]}>
      <Routes>
        <Route path="/projects/:id" element={<ProjectDetail />} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
)

describe('ProjectDetail Page', () => {
  beforeEach(() => {
    queryClient.clear()
  })

  it('renders the project name after loading', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Brand Redesign')).toBeInTheDocument()
    })
  })

  it('renders project status badge', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Active')).toBeInTheDocument()
    })
  })

  it('renders edit and delete buttons after loading', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument()
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })
  })

  it('renders error state when project is not found', async () => {
    renderPage('non-existent')
    await waitFor(() => {
      expect(screen.getByText('Failed to load project')).toBeInTheDocument()
    })
    expect(screen.getByText('Retry Request')).toBeInTheDocument()
  })

  it('shows description section when project has description', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Description')).toBeInTheDocument()
    })
  })

  it('renders back button', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByLabelText('Back to projects')).toBeInTheDocument()
    })
  })

  it('renders the loading skeleton initially', () => {
    renderPage()
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })
})
