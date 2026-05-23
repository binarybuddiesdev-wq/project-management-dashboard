import { api, parseApiError } from './api'
import type { IApiResponse, IDashboardData } from '@/types'

export const getDashboardData = async (): Promise<IApiResponse<IDashboardData>> => {
  try {
    const response = await api.get('dashboard').json<IApiResponse<IDashboardData>>()
    return response
  } catch (error) {
    const message = await parseApiError(error, 'Failed to fetch dashboard data')
    return { error: message }
  }
}
