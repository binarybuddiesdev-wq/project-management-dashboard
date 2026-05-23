import { render, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { Login } from './Login'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '@/store/authSlice'
import { MemoryRouter } from 'react-router-dom'

describe('Login Component', () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    })
    localStorage.clear()
  })

  it('renders signin page details', () => {
    const { getByRole, getByLabelText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    )

    expect(getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
    expect(getByLabelText('Email address')).toBeInTheDocument()
    expect(getByLabelText('Password')).toBeInTheDocument()
  })

  it('validates email and password fields on empty submit', async () => {
    const { getByRole, getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    )

    fireEvent.submit(getByRole('button', { name: 'Sign In' }))

    await waitFor(() => {
      expect(getByText('Invalid email address')).toBeInTheDocument()
      expect(getByText('Password must be at least 8 characters')).toBeInTheDocument()
    })
  })
})
