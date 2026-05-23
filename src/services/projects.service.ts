import { api, parseApiError } from './api'
import type { IApiResponse, IProject, IProjectFormData } from '@/types'

export const getProjects = async (params?: {
  status?: string
  priority?: string
  search?: string
}): Promise<IApiResponse<IProject[]>> => {
  try {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set('status', params.status)
    if (params?.priority) searchParams.set('priority', params.priority)
    if (params?.search) searchParams.set('search', params.search)
    const query = searchParams.toString()
    const response = await api.get(`projects${query ? `?${query}` : ''}`).json<IApiResponse<IProject[]>>()
    return response
  } catch (error) {
    const message = await parseApiError(error, 'Failed to fetch projects')
    return { error: message }
  }
}

export const getProject = async (id: string): Promise<IApiResponse<IProject>> => {
  try {
    const response = await api.get(`projects/${id}`).json<IApiResponse<IProject>>()
    return response
  } catch (error) {
    const message = await parseApiError(error, 'Failed to fetch project')
    return { error: message }
  }
}

export const createProject = async (data: IProjectFormData): Promise<IApiResponse<IProject>> => {
  try {
    const response = await api.post('projects', { json: data }).json<IApiResponse<IProject>>()
    return response
  } catch (error) {
    const message = await parseApiError(error, 'Failed to create project')
    return { error: message }
  }
}

export const updateProject = async (id: string, data: Partial<IProjectFormData>): Promise<IApiResponse<IProject>> => {
  try {
    const response = await api.put(`projects/${id}`, { json: data }).json<IApiResponse<IProject>>()
    return response
  } catch (error) {
    const message = await parseApiError(error, 'Failed to update project')
    return { error: message }
  }
}

export const deleteProject = async (id: string): Promise<IApiResponse<null>> => {
  try {
    const response = await api.delete(`projects/${id}`).json<IApiResponse<null>>()
    return response
  } catch (error) {
    const message = await parseApiError(error, 'Failed to delete project')
    return { error: message }
  }
}
