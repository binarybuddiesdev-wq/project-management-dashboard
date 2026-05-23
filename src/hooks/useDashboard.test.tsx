import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useDashboard } from './useDashboard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

describe('useDashboard hook', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    localStorage.clear()
    localStorage.setItem('token', 'mock-jwt-token-12345')
  })

  const getWrapper = () => {
    const wrapper = (props: { children: React.ReactNode }) => {
      const { children } = props
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      )
    }
    return wrapper
  }

  it('should fetch dashboard data successfully', async () => {
    const { result } = renderHook(() => useDashboard(), { wrapper: getWrapper() })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isError).toBe(false)
    expect(result.current.dashboardData).toBeDefined()
    expect(result.current.dashboardData?.stats.totalProjects).toBe(12)
    expect(result.current.dashboardData?.activity.length).toBe(7)
  })

  it('should handle dashboard fetch error', async () => {
    localStorage.setItem('token', 'invalid-token')
    const { result } = renderHook(() => useDashboard(), { wrapper: getWrapper() })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isError).toBe(true)
    expect(result.current.error).toBeDefined()
  })
})
