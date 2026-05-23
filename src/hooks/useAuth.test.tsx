import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuth } from './useAuth'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '@/store/authSlice'
import React from 'react'

describe('useAuth hook', () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    })
    localStorage.clear()
  })

  const getWrapper = () => {
    const wrapper = (props: { children: React.ReactNode }) => {
      const { children } = props
      return <Provider store={store}>{children}</Provider>
    }
    return wrapper
  }

  it('should initialize with not authenticated state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: getWrapper() })
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
  })

  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: getWrapper() })
    
    let success = false
    await act(async () => {
      success = await result.current.login({
        email: 'john@example.com',
        password: 'password123',
      })
    })

    expect(success).toBe(true)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user?.email).toBe('john@example.com')
    expect(result.current.token).toBe('mock-jwt-token-12345')
  })

  it('should handle login failure', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: getWrapper() })
    
    let success = true
    await act(async () => {
      success = await result.current.login({
        email: 'fail@example.com',
        password: 'password123',
      })
    })

    expect(success).toBe(false)
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.error).toBe('Invalid email or password')
  })

  it('should signup successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: getWrapper() })
    
    let success = false
    await act(async () => {
      success = await result.current.signup({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
      })
    })

    expect(success).toBe(true)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user?.name).toBe('Jane Doe')
  })

  it('should handle signup failure', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: getWrapper() })
    
    let success = true
    await act(async () => {
      success = await result.current.signup({
        name: 'Jane Doe',
        email: 'fail@example.com',
        password: 'password123',
      })
    })

    expect(success).toBe(false)
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.error).toBe('Email already exists')
  })

  it('should request password reset successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: getWrapper() })
    
    let message: string | null = null
    await act(async () => {
      message = await result.current.requestPasswordReset('john@example.com')
    })

    expect(message).toBe('Password reset link sent to your email')
  })

  it('should handle requestPasswordReset failure', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: getWrapper() })
    
    let message: string | null = 'not-null'
    await act(async () => {
      message = await result.current.requestPasswordReset('fail@example.com')
    })

    expect(message).toBeNull()
    expect(result.current.error).toBe('Email not found')
  })

  it('should check session successfully when token exists', async () => {
    localStorage.setItem('token', 'mock-jwt-token-12345')
    const { result } = renderHook(() => useAuth(), { wrapper: getWrapper() })
    
    let success = false
    await act(async () => {
      success = await result.current.checkSession()
    })

    expect(success).toBe(true)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('should return false on checkSession if no token exists', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: getWrapper() })
    
    let success = true
    await act(async () => {
      success = await result.current.checkSession()
    })

    expect(success).toBe(false)
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should handle checkSession failure when token exists but session verification fails', async () => {
    localStorage.setItem('token', 'invalid-token')
    const { result } = renderHook(() => useAuth(), { wrapper: getWrapper() })
    
    let success = true
    await act(async () => {
      success = await result.current.checkSession()
    })

    expect(success).toBe(false)
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.error).toBe('Invalid token')
  })

  it('should logout correctly', async () => {
    localStorage.setItem('token', 'mock-jwt-token-12345')
    const { result } = renderHook(() => useAuth(), { wrapper: getWrapper() })
    
    await act(async () => {
      await result.current.checkSession()
    })

    expect(result.current.isAuthenticated).toBe(true)

    act(() => {
      result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })
})
