import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { SettingsPage } from './Settings'
import { themeReducer, setTheme } from '@/store/themeSlice'
import { authReducer, authSuccess } from '@/store/authSlice'
import { MemoryRouter } from 'react-router-dom'

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
  },
})

const renderSettings = () => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    </Provider>
  )
}

describe('SettingsPage Page', () => {
  beforeEach(() => {
    store.dispatch(setTheme('dark'))
    store.dispatch(authSuccess({
      user: { id: 'user-1', name: 'Alice', email: 'alice@example.com', avatar: 'https://example.com/avatar.jpg' },
      token: 'mock-token',
    }))
    localStorage.setItem('user', JSON.stringify({ id: 'user-1', name: 'Alice', email: 'alice@example.com' }))
    localStorage.setItem('registered_users', JSON.stringify([
      { email: 'alice@example.com', password: 'currentPass123' },
    ]))
  })

  it('renders the page title', () => {
    renderSettings()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('renders profile section', () => {
    renderSettings()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Avatar URL')).toBeInTheDocument()
  })

  it('renders password section', () => {
    renderSettings()
    expect(screen.getByText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Current Password')).toBeInTheDocument()
    expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
  })

  it('renders theme section', () => {
    renderSettings()
    expect(screen.getByText('Theme')).toBeInTheDocument()
    expect(screen.getByText('Appearance')).toBeInTheDocument()
  })

  it('shows user avatar initials', () => {
    renderSettings()
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('shows save profile button', () => {
    renderSettings()
    expect(screen.getByText('Save Profile')).toBeInTheDocument()
  })

  it('shows change password button', () => {
    renderSettings()
    expect(screen.getByText('Change Password')).toBeInTheDocument()
  })

  it('renders theme toggle button with dark mode icon', () => {
    renderSettings()
    expect(screen.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument()
  })
})
