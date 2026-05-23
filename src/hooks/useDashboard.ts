import { useQuery } from '@tanstack/react-query'
import { getDashboardData } from '@/services'

export const useDashboard = () => {
  const { data, isLoading, error, refetch, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await getDashboardData()
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    retry: false,
  })

  return {
    dashboardData: data,
    isLoading,
    isError,
    error: error instanceof Error ? error.message : null,
    refetch,
  }
}
