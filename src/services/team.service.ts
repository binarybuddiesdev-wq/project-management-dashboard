import { api, parseApiError } from './api'
import type { IApiResponse, IMember, IMemberFormData } from '@/types'

export const getMembers = async (): Promise<IApiResponse<IMember[]>> => {
  try {
    const response = await api.get('team').json<IApiResponse<IMember[]>>()
    return response
  } catch (error) {
    const message = await parseApiError(error, 'Failed to fetch team members')
    return { error: message }
  }
}

export const inviteMember = async (data: IMemberFormData): Promise<IApiResponse<IMember>> => {
  try {
    const response = await api.post('team', { json: data }).json<IApiResponse<IMember>>()
    return response
  } catch (error) {
    const message = await parseApiError(error, 'Failed to invite member')
    return { error: message }
  }
}

export const updateMember = async (id: string, data: Partial<IMemberFormData>): Promise<IApiResponse<IMember>> => {
  try {
    const response = await api.put(`team/${id}`, { json: data }).json<IApiResponse<IMember>>()
    return response
  } catch (error) {
    const message = await parseApiError(error, 'Failed to update member')
    return { error: message }
  }
}

export const removeMember = async (id: string): Promise<IApiResponse<null>> => {
  try {
    const response = await api.delete(`team/${id}`).json<IApiResponse<null>>()
    return response
  } catch (error) {
    const message = await parseApiError(error, 'Failed to remove member')
    return { error: message }
  }
}
