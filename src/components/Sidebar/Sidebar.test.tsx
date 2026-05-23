import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Sidebar } from './Sidebar'
import { MemoryRouter } from 'react-router-dom'
import type { IUser } from '@/types'

describe('Sidebar', () => {
  const mockUser: IUser = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/32?img=1',
  }

  it('renders navigation links and user profile info', () => {
    const handleToggle = vi.fn()
    const { getByText, getByAltText } = render(
      <MemoryRouter>
        <Sidebar
          isCollapsed={false}
          onToggle={handleToggle}
          user={mockUser}
        />
      </MemoryRouter>
    )

    expect(getByText('Dashboard')).toBeInTheDocument()
    expect(getByText('Projects')).toBeInTheDocument()
    expect(getByText('Team')).toBeInTheDocument()
    expect(getByText('Settings')).toBeInTheDocument()

    expect(getByText('John Doe')).toBeInTheDocument()
    expect(getByText('john@example.com')).toBeInTheDocument()
    expect(getByAltText('John Doe')).toBeInTheDocument()
  })

  it('triggers onToggle when collapse button is clicked', () => {
    const handleToggle = vi.fn()
    const { getByRole } = render(
      <MemoryRouter>
        <Sidebar
          isCollapsed={false}
          onToggle={handleToggle}
          user={mockUser}
        />
      </MemoryRouter>
    )

    const toggleButton = getByRole('button', { name: /collapse sidebar/i })
    fireEvent.click(toggleButton)
    expect(handleToggle).toHaveBeenCalled()
  })

  it('does not render profile details text when collapsed', () => {
    const handleToggle = vi.fn()
    const { queryByText } = render(
      <MemoryRouter>
        <Sidebar
          isCollapsed={true}
          onToggle={handleToggle}
          user={mockUser}
        />
      </MemoryRouter>
    )

    expect(queryByText('John Doe')).toBeNull()
    expect(queryByText('john@example.com')).toBeNull()
  })
})
