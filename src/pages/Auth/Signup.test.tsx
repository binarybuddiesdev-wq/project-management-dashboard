import { render, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { Signup } from './Signup'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '@/store/authSlice'
import { MemoryRouter } from 'react-router-dom'

describe('Signup Component', () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    })
    localStorage.clear()
  })

  it('renders signup details', () => {
    const { getByRole, getByLabelText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </Provider>
    )

    expect(getByRole('heading', { name: 'Create account' })).toBeInTheDocument()
    expect(getByLabelText('Full name')).toBeInTheDocument()
    expect(getByLabelText('Email address')).toBeInTheDocument()
    expect(getByLabelText('Confirm Password')).toBeInTheDocument()
  })

  it('validates empty inputs on submit', async () => {
    const { getByRole, getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </Provider>
    )

    fireEvent.submit(getByRole('button', { name: 'Create Account' }))

    await waitFor(() => {
      expect(getByText('Name must be at least 2 characters')).toBeInTheDocument()
      expect(getByText('Invalid email address')).toBeInTheDocument()
      expect(getByText('Password must be at least 8 characters')).toBeInTheDocument()
    })
  })

  it('validates password mismatch', async () => {
    const { getByRole, getByLabelText, getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </Provider>
    )

    fireEvent.input(getByLabelText('Full name'), { target: { value: 'John Doe' } })
    fireEvent.input(getByLabelText('Email address'), { target: { value: 'john@example.com' } })
    fireEvent.input(getByLabelText('Password'), { target: { value: 'password123' } })
    fireEvent.input(getByLabelText('Confirm Password'), { target: { value: 'differentpassword' } })

    fireEvent.submit(getByRole('button', { name: 'Create Account' }))

    await waitFor(() => {
      expect(getByText('Passwords do not match')).toBeInTheDocument()
    })
  })
})
