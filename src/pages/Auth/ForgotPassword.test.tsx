import { render, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { ForgotPassword } from './ForgotPassword'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '@/store/authSlice'
import { MemoryRouter } from 'react-router-dom'

describe('ForgotPassword Component', () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    })
    localStorage.clear()
  })

  it('renders forgot password details', () => {
    const { getByRole, getByLabelText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      </Provider>
    )

    expect(getByRole('heading', { name: 'Reset password' })).toBeInTheDocument()
    expect(getByLabelText('Email address')).toBeInTheDocument()
  })

  it('validates empty email field on submit', async () => {
    const { getByRole, getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      </Provider>
    )

    fireEvent.submit(getByRole('button', { name: 'Send Reset Link' }))

    await waitFor(() => {
      expect(getByText('Invalid email address')).toBeInTheDocument()
    })
  })

  it('submits email and shows success message state', async () => {
    const { getByRole, getByLabelText, getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      </Provider>
    )

    fireEvent.input(getByLabelText('Email address'), { target: { value: 'john@example.com' } })
    fireEvent.submit(getByRole('button', { name: 'Send Reset Link' }))

    await waitFor(() => {
      expect(getByText('Password reset link sent to your email')).toBeInTheDocument()
      expect(getByText('Back to Sign In')).toBeInTheDocument()
    })
  })
})
