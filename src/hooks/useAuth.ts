import { useDispatch, useSelector } from 'react-redux'
import { authStart, authSuccess, authFailure, logout as logoutAction } from '@/store'
import type { RootState } from '@/store'
import { loginUser, signupUser, forgotPassword, getCurrentUser } from '@/services'
import { useCallback } from 'react'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  )

  const login = useCallback(async (credentials: Record<string, string>): Promise<boolean> => {
    dispatch(authStart())
    const response = await loginUser(credentials)
    if (response.data) {
      dispatch(authSuccess(response.data))
      return true
    } else {
      dispatch(authFailure(response.error || 'Login failed'))
      return false
    }
  }, [dispatch])

  const signup = useCallback(async (credentials: Record<string, string>): Promise<boolean> => {
    dispatch(authStart())
    const response = await signupUser(credentials)
    if (response.data) {
      dispatch(authSuccess(response.data))
      return true
    } else {
      dispatch(authFailure(response.error || 'Signup failed'))
      return false
    }
  }, [dispatch])

  const requestPasswordReset = useCallback(async (email: string): Promise<string | null> => {
    dispatch(authStart())
    const response = await forgotPassword({ email })
    if (response.data) {
      // clear loading on success
      dispatch(authFailure('')) // resets state loading and error
      return response.data.message
    } else {
      dispatch(authFailure(response.error || 'Password reset request failed'))
      return null
    }
  }, [dispatch])

  const checkSession = useCallback(async (): Promise<boolean> => {
    const localToken = localStorage.getItem('token')
    if (!localToken) {
      dispatch(logoutAction())
      return false
    }

    dispatch(authStart())
    const response = await getCurrentUser()
    if (response.data) {
      dispatch(authSuccess({ user: response.data.user, token: localToken }))
      return true
    } else {
      dispatch(authFailure(response.error || 'Session expired'))
      return false
    }
  }, [dispatch])

  const logout = useCallback(() => {
    dispatch(logoutAction())
  }, [dispatch])

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    requestPasswordReset,
    checkSession,
    logout,
  }
}
