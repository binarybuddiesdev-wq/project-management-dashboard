import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import type { ReactNode } from 'react'
import { useMembers, useInviteMember, useUpdateMember, useRemoveMember } from './useTeam'
import { server } from '@/test/setup'
import type { IMember } from '@/types'

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

describe('useTeam', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('token', 'mock-jwt-token-12345')
    queryClient.clear()
  })

  it('should fetch members list successfully', async () => {
    const { result } = renderHook(() => useMembers(), { wrapper })
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
    expect(Array.isArray(result.current.data)).toBe(true)
    expect(result.current.data!.length).toBeGreaterThan(0)
  })

  it('should handle error when fetching members fails', async () => {
    server.use(
      http.get('*/api/team', () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 })
      })
    )
    const { result } = renderHook(() => useMembers(), { wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 5000 })
    expect(result.current.error).toBeDefined()
  })

  it('should invite a member via mutation', async () => {
    const { result } = renderHook(() => useInviteMember(), { wrapper })
    await waitFor(async () => {
      const res = await result.current.mutateAsync({
        name: 'New Member',
        email: 'new@example.com',
        role: 'Developer',
        department: 'Engineering',
      })
      expect(res.name).toBe('New Member')
    })
  })

  it('should handle invite mutation error', async () => {
    server.use(
      http.post('*/api/team', () => {
        return HttpResponse.json({ error: 'Invitation failed' }, { status: 400 })
      })
    )
    const { result } = renderHook(() => useInviteMember(), { wrapper })
    await waitFor(async () => {
      await expect(result.current.mutateAsync({
        name: 'Fail',
        email: 'fail@example.com',
        role: 'Dev',
        department: 'Eng',
      })).rejects.toThrow()
    })
  })

  it('should update a member via mutation', async () => {
    const { result } = renderHook(() => useUpdateMember(), { wrapper })
    await waitFor(async () => {
      const res = await result.current.mutateAsync({ id: 'm1', data: { name: 'Updated' } })
      expect(res.name).toBe('Updated')
    })
  })

  it('should handle update mutation error for non-existent member', async () => {
    const { result } = renderHook(() => useUpdateMember(), { wrapper })
    await waitFor(async () => {
      await expect(result.current.mutateAsync({ id: 'non-existent', data: { name: 'Nope' } })).rejects.toThrow()
    })
  })

  it('should remove a member via mutation', async () => {
    const { result } = renderHook(() => useRemoveMember(), { wrapper })
    await waitFor(async () => {
      const id = await result.current.mutateAsync('m1')
      expect(id).toBe('m1')
    })
  })

  it('should handle remove mutation error', async () => {
    const { result } = renderHook(() => useRemoveMember(), { wrapper })
    await waitFor(async () => {
      await expect(result.current.mutateAsync('non-existent')).rejects.toThrow()
    })
  })

  it('should optimistically update cache on successful update', async () => {
    const { result: listResult } = renderHook(() => useMembers(), { wrapper })
    await waitFor(() => expect(listResult.current.isSuccess).toBe(true))

    const { result: updateResult } = renderHook(() => useUpdateMember(), { wrapper })
    const res = await updateResult.current.mutateAsync({ id: 'm1', data: { name: 'Optimistic' } })
    expect(res.name).toBe('Optimistic')

    await waitFor(() => {
      const cachedData = queryClient.getQueryData<IMember[]>(['team'])
      const updated = cachedData?.find((m) => m.id === 'm1')
      expect(updated?.name).toBe('Optimistic')
    }, { timeout: 5000 })
  }, 15000)

  it('should optimistically remove from cache on successful delete', async () => {
    const { result: listResult } = renderHook(() => useMembers(), { wrapper })
    await waitFor(() => expect(listResult.current.isSuccess).toBe(true))
    const originalCount = listResult.current.data!.length
    expect(listResult.current.data!.find((m) => m.id === 'm2')).toBeDefined()

    const { result: deleteResult } = renderHook(() => useRemoveMember(), { wrapper })
    await deleteResult.current.mutateAsync('m2')

    await waitFor(() => {
      expect(listResult.current.data!.length).toBe(originalCount - 1)
    }, { timeout: 5000 })
    expect(listResult.current.data!.find((m) => m.id === 'm2')).toBeUndefined()
  })

  it('should roll back cache on remove error', async () => {
    const { result: listResult } = renderHook(() => useMembers(), { wrapper })
    await waitFor(() => expect(listResult.current.isSuccess).toBe(true))
    const originalProjects = listResult.current.data!

    const { result: deleteResult } = renderHook(() => useRemoveMember(), { wrapper })
    await waitFor(async () => {
      await expect(deleteResult.current.mutateAsync('non-existent')).rejects.toThrow()
    })

    await waitFor(() => expect(listResult.current.isSuccess).toBe(true), { timeout: 5000 })
    expect(listResult.current.data).toEqual(originalProjects)
  })

  it('should handle null guard in update onMutate when no cache exists', async () => {
    const teamKey = ['team']
    queryClient.setQueryData(teamKey, undefined)

    const { result } = renderHook(() => useUpdateMember(), { wrapper })
    await waitFor(async () => {
      const res = await result.current.mutateAsync({ id: 'm2', data: { name: 'NoCache' } })
      expect(res.name).toBe('NoCache')
    })

    const cached = queryClient.getQueryData(teamKey)
    expect(cached).toBeUndefined()
  })

  it('should handle null guard in remove onMutate when no cache exists', async () => {
    const teamKey = ['team']
    queryClient.setQueryData(teamKey, undefined)

    const { result } = renderHook(() => useRemoveMember(), { wrapper })
    await waitFor(async () => {
      const id = await result.current.mutateAsync('m2')
      expect(id).toBe('m2')
    })

    const cached = queryClient.getQueryData(teamKey)
    expect(cached).toBeUndefined()
  })
})
