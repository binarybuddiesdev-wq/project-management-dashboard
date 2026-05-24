import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import type { ReactNode } from 'react'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from './useKanban'
import { server } from '@/test/setup'

let queryClient: QueryClient

const wrapper = (props: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {props.children}
  </QueryClientProvider>
)

describe('useKanban', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'mock-jwt-token-12345')
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  it('should fetch tasks list successfully', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper })
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 5000 })
    expect(result.current.data).toBeDefined()
    expect(Array.isArray(result.current.data)).toBe(true)
    expect(result.current.data!.length).toBeGreaterThan(0)
  })

  it('should handle error when fetching tasks fails', async () => {
    server.use(
      http.get('*/api/tasks', () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 })
      })
    )
    const { result } = renderHook(() => useTasks(), { wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 })
    expect(result.current.error).toBeDefined()
  })

  it('should create a task via mutation', async () => {
    const { result } = renderHook(() => useCreateTask(), { wrapper })
    const data = {
      title: 'New Task',
      description: 'Created in test',
      status: 'backlog' as const,
      priority: 'medium' as const,
      dueDate: '2026-12-31',
      assignee: 'Tester',
      labels: ['Label1'],
    }
    await waitFor(async () => {
      const res = await result.current.mutateAsync(data)
      expect(res.title).toBe('New Task')
    }, { timeout: 5000 })
  })

  it('should handle create mutation error', async () => {
    server.use(
      http.post('*/api/tasks', () => {
        return HttpResponse.json({ error: 'Creation failed' }, { status: 400 })
      })
    )
    const { result } = renderHook(() => useCreateTask(), { wrapper })
    const data = {
      title: 'Fail',
      description: 'Should fail',
      status: 'backlog' as const,
      priority: 'low' as const,
      dueDate: '2026-12-31',
      assignee: 'Tester',
      labels: [],
    }
    await waitFor(async () => {
      await expect(result.current.mutateAsync(data)).rejects.toThrow()
    }, { timeout: 5000 })
  })

  it('should update a task via mutation', async () => {
    const { result } = renderHook(() => useUpdateTask(), { wrapper })
    await waitFor(async () => {
      const res = await result.current.mutateAsync({ id: 't1', data: { title: 'Updated' } })
      expect(res.title).toBe('Updated')
    }, { timeout: 5000 })
  })

  it('should handle update mutation error for non-existent task', async () => {
    const { result } = renderHook(() => useUpdateTask(), { wrapper })
    await waitFor(async () => {
      await expect(result.current.mutateAsync({ id: 'non-existent', data: { title: 'Nope' } })).rejects.toThrow()
    }, { timeout: 5000 })
  })

  it('should roll back cache on update error when cache exists', async () => {
    const { result: listResult } = renderHook(() => useTasks(), { wrapper })
    await waitFor(() => expect(listResult.current.isSuccess).toBe(true), { timeout: 5000 })
    const originalTasks = listResult.current.data!

    const { result: updateResult } = renderHook(() => useUpdateTask(), { wrapper })
    await waitFor(async () => {
      await expect(updateResult.current.mutateAsync({ id: 'non-existent', data: { title: 'Nope' } })).rejects.toThrow()
    }, { timeout: 5000 })

    await waitFor(() => expect(listResult.current.isSuccess).toBe(true), { timeout: 5000 })
    expect(listResult.current.data).toEqual(originalTasks)
  })

  it('should delete a task via mutation', async () => {
    const { result } = renderHook(() => useDeleteTask(), { wrapper })
    await waitFor(async () => {
      const id = await result.current.mutateAsync('t4')
      expect(id).toBe('t4')
    }, { timeout: 5000 })
  })

  it('should handle delete mutation error for non-existent task', async () => {
    const { result } = renderHook(() => useDeleteTask(), { wrapper })
    await waitFor(async () => {
      await expect(result.current.mutateAsync('non-existent')).rejects.toThrow()
    }, { timeout: 5000 })
  })

  it('should remove task from cache on successful delete when cache exists', async () => {
    const { result: listResult } = renderHook(() => useTasks(), { wrapper })
    await waitFor(() => expect(listResult.current.isSuccess).toBe(true), { timeout: 5000 })
    const originalCount = listResult.current.data!.length
    expect(listResult.current.data!.find((t) => t.id === 't3')).toBeDefined()

    const { result: deleteResult } = renderHook(() => useDeleteTask(), { wrapper })
    await waitFor(async () => {
      await deleteResult.current.mutateAsync('t3')
    }, { timeout: 5000 })

    await waitFor(() => {
      expect(listResult.current.data!.length).toBe(originalCount - 1)
    }, { timeout: 5000 })
    expect(listResult.current.data!.find((t) => t.id === 't3')).toBeUndefined()
  })

  it('should roll back cache on delete error when cache exists', async () => {
    const { result: listResult } = renderHook(() => useTasks(), { wrapper })
    await waitFor(() => expect(listResult.current.isSuccess).toBe(true), { timeout: 5000 })
    const originalTasks = listResult.current.data!

    const { result: deleteResult } = renderHook(() => useDeleteTask(), { wrapper })
    await waitFor(async () => {
      await expect(deleteResult.current.mutateAsync('non-existent')).rejects.toThrow()
    }, { timeout: 5000 })

    await waitFor(() => expect(listResult.current.isSuccess).toBe(true), { timeout: 5000 })
    expect(listResult.current.data).toEqual(originalTasks)
  })

  it('should handle null guard in update onMutate when no cache exists', async () => {
    const tasksKey = ['tasks']
    queryClient.setQueryData(tasksKey, undefined)

    const { result } = renderHook(() => useUpdateTask(), { wrapper })
    await waitFor(async () => {
      const res = await result.current.mutateAsync({ id: 't2', data: { title: 'NoCache' } })
      expect(res.title).toBe('NoCache')
    }, { timeout: 5000 })

    const cached = queryClient.getQueryData(tasksKey)
    expect(cached).toBeUndefined()
  })

  it('should handle null guard in delete onMutate when no cache exists', async () => {
    const tasksKey = ['tasks']
    queryClient.setQueryData(tasksKey, undefined)

    const { result } = renderHook(() => useDeleteTask(), { wrapper })
    await waitFor(async () => {
      const id = await result.current.mutateAsync('t2')
      expect(id).toBe('t2')
    }, { timeout: 5000 })

    const cached = queryClient.getQueryData(tasksKey)
    expect(cached).toBeUndefined()
  })
})
