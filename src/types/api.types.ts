import type { IUser } from './auth.types'

export interface IApiResponse<T> {
  data?: T
  error?: string
  meta?: unknown
}

export interface ILoginResponseData {
  user: IUser
  token: string
}

export interface ISignupResponseData {
  user: IUser
  token: string
}

export interface IForgotPasswordResponseData {
  message: string
}
