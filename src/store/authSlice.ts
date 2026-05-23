import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { IAuthState, IUser } from '@/types'

const getInitialToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

const getInitialUser = (): IUser | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr) as IUser
      } catch {
        return null
      }
    }
  }
  return null
}

const token = getInitialToken()
const user = getInitialUser()

const initialState: IAuthState = {
  user,
  token,
  isAuthenticated: !!token && !!user,
  isLoading: false,
  error: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    authSuccess: (state, action: PayloadAction<{ user: IUser; token: string }>) => {
      state.isLoading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
      state.isAuthenticated = false
      state.user = null
      state.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { authStart, authSuccess, authFailure, logout, clearError } = authSlice.actions
export const authReducer = authSlice.reducer
