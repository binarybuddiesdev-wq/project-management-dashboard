import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemberCard } from './MemberCard'
import type { IMember } from '@/types'

const baseMember: IMember = {
  id: 'm1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Product Manager',
  avatar: 'https://example.com/avatar.jpg',
  department: 'Product',
  joinedAt: '2026-01-15T09:00:00Z',
}

describe('MemberCard Component', () => {
  it('renders member name', () => {
    const { getByText } = render(<MemberCard member={baseMember} onDelete={vi.fn()} />)
    expect(getByText('John Doe')).toBeInTheDocument()
  })

  it('renders member role', () => {
    const { getByText } = render(<MemberCard member={baseMember} onDelete={vi.fn()} />)
    expect(getByText('Product Manager')).toBeInTheDocument()
  })

  it('renders member email', () => {
    const { getByText } = render(<MemberCard member={baseMember} onDelete={vi.fn()} />)
    expect(getByText('john@example.com')).toBeInTheDocument()
  })

  it('renders member department', () => {
    const { getByText } = render(<MemberCard member={baseMember} onDelete={vi.fn()} />)
    expect(getByText('Product')).toBeInTheDocument()
  })

  it('renders avatar image', () => {
    const { getByAltText } = render(<MemberCard member={baseMember} onDelete={vi.fn()} />)
    expect(getByAltText('John Doe')).toBeInTheDocument()
  })

  it('shows fallback initials on avatar error', () => {
    const member: IMember = { ...baseMember, avatar: 'https://invalid.url/image.jpg' }
    const { getByText } = render(<MemberCard member={member} onDelete={vi.fn()} />)

    const img = document.querySelector('img')
    expect(img).toBeInTheDocument()
    fireEvent.error(img!)

    expect(getByText('JD')).toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn()
    const { getByRole } = render(<MemberCard member={baseMember} onDelete={onDelete} />)
    fireEvent.click(getByRole('button', { name: 'Remove John Doe' }))
    expect(onDelete).toHaveBeenCalledWith(baseMember.id)
  })

  it('renders edit button when onEdit is provided', () => {
    const onEdit = vi.fn()
    const { getByRole } = render(<MemberCard member={baseMember} onEdit={onEdit} onDelete={vi.fn()} />)
    fireEvent.click(getByRole('button', { name: 'Edit John Doe' }))
    expect(onEdit).toHaveBeenCalledWith(baseMember)
  })

  it('does not render delete button when onDelete is not provided', () => {
    const { queryByRole } = render(<MemberCard member={baseMember} />)
    expect(queryByRole('button', { name: 'Remove John Doe' })).toBeNull()
  })
})
