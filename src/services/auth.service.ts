import { api, parseApiError } from './api'
import type { 
  IApiResponse, 
  ILoginResponseData, 
  ISignupResponseData, 
  IForgotPasswordResponseData,
  IUser
} from '@/types'

export const loginUser = async (credentials: Record<string, string>): Promise<IApiResponse<ILoginResponseData>> => {
  try {
    const response = await api.post('auth/login', { json: credentials }).json<IApiResponse<ILoginResponseData>>()
    return response
  } catch (error: unknown) {
    const message = await parseApiError(error, 'Unknown login error')
    return { error: message }
  }
}

export const signupUser = async (credentials: Record<string, string>): Promise<IApiResponse<ISignupResponseData>> => {
  try {
    const response = await api.post('auth/signup', { json: credentials }).json<IApiResponse<ISignupResponseData>>()
    return response
  } catch (error: unknown) {
    const message = await parseApiError(error, 'Unknown signup error')
    return { error: message }
  }
}

export const forgotPassword = async (credentials: Record<string, string>): Promise<IApiResponse<IForgotPasswordResponseData>> => {
  try {
    const response = await api.post('auth/forgot-password', { json: credentials }).json<IApiResponse<IForgotPasswordResponseData>>()
    return response
  } catch (error: unknown) {
    const message = await parseApiError(error, 'Unknown forgot password error')
    return { error: message }
  }
}

export const getCurrentUser = async (): Promise<IApiResponse<{ user: IUser }>> => {
  try {
    const response = await api.get('auth/me').json<IApiResponse<{ user: IUser }>>()
    return response
  } catch (error: unknown) {
    const message = await parseApiError(error, 'Unknown session fetch error')
    return { error: message }
  }
}

