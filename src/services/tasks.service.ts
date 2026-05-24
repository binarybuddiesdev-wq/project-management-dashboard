import { api, parseApiError } from './api'
import type { IApiResponse, ITask, ITaskFormData } from '@/types'

export const getTasks = async (): Promise<IApiResponse<ITask[]>> => {
  try {
    const response = await api.get('tasks').json<IApiResponse<ITask[]>>()
    return response
  } catch (error) {
    const message = await parseApiError(error, 'Failed to fetch tasks')
    return { error: message }
  }
}

export const createTask = async (data: ITaskFormData): Promise<IApiResponse<ITask>> => {
  try {
    const response = await api.post('tasks', { json: data }).json<IApiResponse<ITask>>()
    return response
  } catch (error) {
    const message = await parseApiError(error, 'Failed to create task')
    return { error: message }
  }
}

export const updateTask = async (id: string, data: Partial<ITaskFormData>): Promise<IApiResponse<ITask>> => {
  try {
    const response = await api.put(`tasks/${id}`, { json: data }).json<IApiResponse<ITask>>()
    return response
  } catch (error) {
    const message = await parseApiError(error, 'Failed to update task')
    return { error: message }
  }
}

export const deleteTask = async (id: string): Promise<IApiResponse<null>> => {
  try {
    const response = await api.delete(`tasks/${id}`).json<IApiResponse<null>>()
    return response
  } catch (error) {
    const message = await parseApiError(error, 'Failed to delete task')
    return { error: message }
  }
}
