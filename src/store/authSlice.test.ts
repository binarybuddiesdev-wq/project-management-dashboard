import { describe, it, expect, beforeEach } from 'vitest'
import { authReducer, authStart, authSuccess, authFailure, logout, clearError } from './authSlice'
import type { IAuthState, IUser } from '@/types'

describe('authSlice', () => {
  let initialState: IAuthState
  const mockUser: IUser = {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
  }

  beforeEach(() => {
    initialState = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }
    localStorage.clear()
  })

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  })

  it('should handle authStart', () => {
    const state = authReducer(initialState, authStart())
    expect(state.isLoading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('should handle authSuccess', () => {
    const payload = { user: mockUser, token: 'jwt-123' }
    const state = authReducer(initialState, authSuccess(payload))
    expect(state.isLoading).toBe(false)
    expect(state.user).toEqual(mockUser)
    expect(state.token).toBe('jwt-123')
    expect(state.isAuthenticated).toBe(true)
    expect(state.error).toBeNull()
    expect(localStorage.getItem('token')).toBe('jwt-123')
  })

  it('should handle authFailure', () => {
    const errorMsg = 'Failed credentials'
    const state = authReducer(initialState, authFailure(errorMsg))
    expect(state.isLoading).toBe(false)
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.error).toBe(errorMsg)
  })

  it('should handle logout', () => {
    const loggedInState: IAuthState = {
      user: mockUser,
      token: 'jwt-123',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    }
    const state = authReducer(loggedInState, logout())
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('should handle clearError', () => {
    const errorState: IAuthState = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: 'Some error',
    }
    const state = authReducer(errorState, clearError())
    expect(state.error).toBeNull()
  })
})
