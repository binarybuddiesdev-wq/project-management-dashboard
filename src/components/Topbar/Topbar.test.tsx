import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Topbar } from './Topbar'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { themeReducer } from '@/store/themeSlice'
import type { IUser } from '@/types'

describe('Topbar', () => {
  const mockUser: IUser = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/32?img=1',
  }

  const getStore = () => {
    return configureStore({
      reducer: {
        theme: themeReducer,
      },
    })
  }

  it('renders page title and elements', () => {
    const handleToggle = vi.fn()
    const handleLogout = vi.fn()
    
    const { getByText, getByPlaceholderText, getByAltText } = render(
      <Provider store={getStore()}>
        <Topbar
          title="Custom Title"
          isCollapsed={false}
          onToggle={handleToggle}
          user={mockUser}
          onLogout={handleLogout}
        />
      </Provider>
    )

    expect(getByText('Custom Title')).toBeInTheDocument()
    expect(getByPlaceholderText('Search workspace...')).toBeInTheDocument()
    expect(getByAltText('John Doe')).toBeInTheDocument()
  })

  it('toggles dropdown and calls onLogout on logout click', () => {
    const handleToggle = vi.fn()
    const handleLogout = vi.fn()
    
    const { getByRole, getByText, queryByText } = render(
      <Provider store={getStore()}>
        <Topbar
          title="Custom Title"
          isCollapsed={false}
          onToggle={handleToggle}
          user={mockUser}
          onLogout={handleLogout}
        />
      </Provider>
    )

    // Initially logout options shouldn't be in the document
    expect(queryByText('Sign Out')).toBeNull()

    // Click profile button to open dropdown
    const avatarButton = getByRole('button', { name: /user dropdown menu/i })
    fireEvent.click(avatarButton)

    expect(getByText('Sign Out')).toBeInTheDocument()

    // Click logout
    const logoutButton = getByText('Sign Out')
    fireEvent.click(logoutButton)

    expect(handleLogout).toHaveBeenCalled()
  })

  it('calls onToggle when menu button is clicked in collapsed state', () => {
    const handleToggle = vi.fn()
    const handleLogout = vi.fn()
    
    const { getByRole } = render(
      <Provider store={getStore()}>
        <Topbar
          title="Custom Title"
          isCollapsed={true}
          onToggle={handleToggle}
          user={mockUser}
          onLogout={handleLogout}
        />
      </Provider>
    )

    const menuButton = getByRole('button', { name: /expand sidebar/i })
    fireEvent.click(menuButton)
    expect(handleToggle).toHaveBeenCalled()
  })
})
