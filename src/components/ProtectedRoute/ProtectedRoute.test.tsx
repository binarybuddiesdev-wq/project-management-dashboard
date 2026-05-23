import { render } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { ProtectedRoute } from './ProtectedRoute'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { authReducer, authSuccess, authStart } from '@/store/authSlice'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

describe('ProtectedRoute', () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    })
  })

  it('renders loading session spinner when isLoading is true', () => {
    store.dispatch(authStart())
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ProtectedRoute>
            <div>Target Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </Provider>
    )

    expect(getByText('Verifying session...')).toBeInTheDocument()
  })

  it('redirects to /login when user is not authenticated', () => {
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div>Secret Dashboard</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(getByText('Login Page')).toBeInTheDocument()
  })

  it('renders children when user is authenticated', () => {
    store.dispatch(
      authSuccess({
        user: { id: '1', name: 'John Doe', email: 'john@example.com' },
        token: 'token123',
      })
    )

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ProtectedRoute>
            <div>Secret Dashboard</div>
          </ProtectedRoute>
        </MemoryRouter>
      </Provider>
    )

    expect(getByText('Secret Dashboard')).toBeInTheDocument()
  })
})
