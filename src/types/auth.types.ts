export interface IUser {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface IAuthState {
  user: IUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
