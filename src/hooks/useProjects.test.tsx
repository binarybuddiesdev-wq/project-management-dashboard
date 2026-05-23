import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import type { ReactNode } from 'react'
import { useProjects, useProject, useCreateProject, useUpdateProject, useDeleteProject } from './useProjects'
import { server } from '@/test/setup'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const wrapper = (props: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {props.children}
  </QueryClientProvider>
)

describe('useProjects', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'mock-jwt-token-12345')
    queryClient.clear()
  })

  it('should fetch projects list successfully', async () => {
    const { result } = renderHook(() => useProjects(), { wrapper })
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
    expect(Array.isArray(result.current.data)).toBe(true)
    expect(result.current.data!.length).toBeGreaterThan(0)
  })

  it('should filter projects by status', async () => {
    const { result } = renderHook(() => useProjects({ status: 'completed' }), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data!.every((p) => p.status === 'completed')).toBe(true)
  })

  it('should handle error when fetching projects fails', async () => {
    server.use(
      http.get('*/api/projects', () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 })
      })
    )
    const { result } = renderHook(() => useProjects(), { wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 })
    expect(result.current.error).toBeDefined()
  })

  it('should fetch single project by id', async () => {
    const { result } = renderHook(() => useProject('p1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
    expect(result.current.data!.id).toBe('p1')
  })

  it('should handle error when project is not found', async () => {
    const { result } = renderHook(() => useProject('non-existent'), { wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('should not fetch when id is empty', () => {
    const { result } = renderHook(() => useProject(''), { wrapper })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('should create a project via mutation', async () => {
    const { result } = renderHook(() => useCreateProject(), { wrapper })
    const data = {
      name: 'New Test',
      description: 'Created in test',
      status: 'active' as const,
      priority: 'medium' as const,
      dueDate: '2026-12-31',
      assignees: ['Tester'],
    }
    await waitFor(async () => {
      const res = await result.current.mutateAsync(data)
      expect(res.name).toBe('New Test')
    })
  })

  it('should handle create mutation error', async () => {
    server.use(
      http.post('*/api/projects', () => {
        return HttpResponse.json({ error: 'Creation failed' }, { status: 400 })
      })
    )
    const { result } = renderHook(() => useCreateProject(), { wrapper })
    const data = {
      name: 'Fail',
      description: 'Should fail',
      status: 'active' as const,
      priority: 'low' as const,
      dueDate: '2026-12-31',
      assignees: ['Tester'],
    }
    await waitFor(async () => {
      await expect(result.current.mutateAsync(data)).rejects.toThrow()
    })
  })

  it('should update a project via mutation', async () => {
    const { result } = renderHook(() => useUpdateProject(), { wrapper })
    await waitFor(async () => {
      const res = await result.current.mutateAsync({ id: 'p1', data: { name: 'Updated' } })
      expect(res.name).toBe('Updated')
    })
  })

  it('should handle update mutation error for non-existent project', async () => {
    const { result } = renderHook(() => useUpdateProject(), { wrapper })
    await waitFor(async () => {
      await expect(result.current.mutateAsync({ id: 'non-existent', data: { name: 'Nope' } })).rejects.toThrow()
    })
  })

  it('should roll back cache on update error when cache exists', async () => {
    const { result: listResult } = renderHook(() => useProjects(), { wrapper })
    await waitFor(() => expect(listResult.current.isSuccess).toBe(true))
    const originalProjects = listResult.current.data!

    const { result: updateResult } = renderHook(() => useUpdateProject(), { wrapper })
    await waitFor(async () => {
      await expect(updateResult.current.mutateAsync({ id: 'non-existent', data: { name: 'Nope' } })).rejects.toThrow()
    })

    await waitFor(() => expect(listResult.current.isSuccess).toBe(true))
    expect(listResult.current.data).toEqual(originalProjects)
  })

  it('should delete a project via mutation', async () => {
    const { result } = renderHook(() => useDeleteProject(), { wrapper })
    await waitFor(async () => {
      const id = await result.current.mutateAsync('p4')
      expect(id).toBe('p4')
    })
  })

  it('should handle delete mutation error for non-existent project', async () => {
    const { result } = renderHook(() => useDeleteProject(), { wrapper })
    await waitFor(async () => {
      await expect(result.current.mutateAsync('non-existent')).rejects.toThrow()
    })
  })

  it('should remove project from cache on successful delete when cache exists', async () => {
    const { result: listResult } = renderHook(() => useProjects(), { wrapper })
    await waitFor(() => expect(listResult.current.isSuccess).toBe(true))
    const originalCount = listResult.current.data!.length
    expect(listResult.current.data!.find((p) => p.id === 'p3')).toBeDefined()

    const { result: deleteResult } = renderHook(() => useDeleteProject(), { wrapper })
    await waitFor(async () => {
      await deleteResult.current.mutateAsync('p3')
    })

    await waitFor(() => {
      expect(listResult.current.data!.length).toBe(originalCount - 1)
    }, { timeout: 5000 })
    expect(listResult.current.data!.find((p) => p.id === 'p3')).toBeUndefined()
  })

  it('should roll back cache on delete error when cache exists', async () => {
    const { result: listResult } = renderHook(() => useProjects(), { wrapper })
    await waitFor(() => expect(listResult.current.isSuccess).toBe(true))
    const originalProjects = listResult.current.data!

    const { result: deleteResult } = renderHook(() => useDeleteProject(), { wrapper })
    await waitFor(async () => {
      await expect(deleteResult.current.mutateAsync('non-existent')).rejects.toThrow()
    })

    await waitFor(() => expect(listResult.current.isSuccess).toBe(true), { timeout: 5000 })
    expect(listResult.current.data).toEqual(originalProjects)
  })

  it('should handle null guard in update onMutate when no cache exists', async () => {
    const projectsKey = ['projects', undefined]
    queryClient.setQueryData(projectsKey, undefined)

    const { result } = renderHook(() => useUpdateProject(), { wrapper })
    await waitFor(async () => {
      const res = await result.current.mutateAsync({ id: 'p2', data: { name: 'NoCache' } })
      expect(res.name).toBe('NoCache')
    })

    const cached = queryClient.getQueryData(projectsKey)
    expect(cached).toBeUndefined()
  })

  it('should handle null guard in delete onMutate when no cache exists', async () => {
    const projectsKey = ['projects', undefined]
    queryClient.setQueryData(projectsKey, undefined)

    const { result } = renderHook(() => useDeleteProject(), { wrapper })
    await waitFor(async () => {
      const id = await result.current.mutateAsync('p2')
      expect(id).toBe('p2')
    })

    const cached = queryClient.getQueryData(projectsKey)
    expect(cached).toBeUndefined()
  })

  it('should optimistically update single project cache when it exists', async () => {
    const { result: singleResult } = renderHook(() => useProject('p1'), { wrapper })
    await waitFor(() => expect(singleResult.current.isSuccess).toBe(true))

    const { result: updateResult } = renderHook(() => useUpdateProject(), { wrapper })
    await updateResult.current.mutateAsync({ id: 'p1', data: { name: 'Optimistic Update' } })

    const cached = queryClient.getQueryData(['project', 'p1']) as { name: string } | undefined
    expect(cached?.name).toBe('Optimistic Update')
  }, 15000)
})
