import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { authReducer, authSuccess } from '@/store/authSlice'
import { useSettings } from './useSettings'
import type { ReactNode } from 'react'

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

const wrapper = (props: { children: ReactNode }) => (
  <Provider store={store}>
    {props.children}
  </Provider>
)

describe('useSettings', () => {
  beforeEach(() => {
    localStorage.clear()
    store.dispatch(authSuccess({
      user: { id: 'user-1', name: 'Alice', email: 'alice@example.com', avatar: 'https://example.com/avatar.jpg' },
      token: 'mock-token',
    }))
    localStorage.setItem('user', JSON.stringify({ id: 'user-1', name: 'Alice', email: 'alice@example.com', avatar: 'https://example.com/avatar.jpg' }))
    localStorage.setItem('registered_users', JSON.stringify([
      { email: 'alice@example.com', password: 'currentPass123' },
    ]))
  })

  it('should update profile and save to localStorage', async () => {
    const { result } = renderHook(() => useSettings(), { wrapper })

    await waitFor(async () => {
      await result.current.updateProfile({
        name: 'Alice Updated',
        email: 'alice.new@example.com',
        avatar: '',
      })
    })

    const storedUser = JSON.parse(localStorage.getItem('user')!)
    expect(storedUser.name).toBe('Alice Updated')
    expect(storedUser.email).toBe('alice.new@example.com')
  })

  it('should update Redux state after profile update', async () => {
    const { result } = renderHook(() => useSettings(), { wrapper })

    await result.current.updateProfile({
      name: 'Alice Redux',
      email: 'alice@example.com',
      avatar: '',
    })

    const state = store.getState().auth
    expect(state.user!.name).toBe('Alice Redux')
  })

  it('should throw error when no user in localStorage', async () => {
    localStorage.removeItem('user')
    const { result } = renderHook(() => useSettings(), { wrapper })

    await expect(result.current.updateProfile({
      name: 'Test',
      email: 'test@example.com',
      avatar: '',
    })).rejects.toThrow('No user found')
  })

  it('should change password successfully', async () => {
    const { result } = renderHook(() => useSettings(), { wrapper })

    await waitFor(async () => {
      await result.current.changePassword({
        currentPassword: 'currentPass123',
        newPassword: 'newPass456',
        confirmPassword: 'newPass456',
      })
    })

    const storedUsers = JSON.parse(localStorage.getItem('registered_users')!)
    expect(storedUsers[0].password).toBe('newPass456')
  })

  it('should throw error when current password is incorrect', async () => {
    const { result } = renderHook(() => useSettings(), { wrapper })

    await expect(result.current.changePassword({
      currentPassword: 'wrongPassword',
      newPassword: 'newPass456',
      confirmPassword: 'newPass456',
    })).rejects.toThrow('Current password is incorrect')
  })

  it('should throw error when no registered users exist', async () => {
    localStorage.removeItem('registered_users')
    const { result } = renderHook(() => useSettings(), { wrapper })

    await expect(result.current.changePassword({
      currentPassword: 'pass',
      newPassword: 'newPass',
      confirmPassword: 'newPass',
    })).rejects.toThrow('No users found')
  })

  it('should throw error when no user logged in', async () => {
    localStorage.removeItem('user')
    const { result } = renderHook(() => useSettings(), { wrapper })

    await expect(result.current.changePassword({
      currentPassword: 'pass',
      newPassword: 'newPass456',
      confirmPassword: 'newPass456',
    })).rejects.toThrow('No user logged in')
  })
})
