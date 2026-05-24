import { render, fireEvent, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { InviteMemberModal } from './InviteMemberModal'

describe('InviteMemberModal Component', () => {
  it('does not render when closed', () => {
    const { queryByText } = render(
      <InviteMemberModal open={false} onClose={vi.fn()} onSubmit={vi.fn()} />
    )
    expect(queryByText('Invite Member')).toBeNull()
  })

  it('renders form fields when open', () => {
    const { getByLabelText, getByRole } = render(
      <InviteMemberModal open={true} onClose={vi.fn()} onSubmit={vi.fn()} />
    )
    expect(getByRole('heading', { name: 'Invite Member' })).toBeInTheDocument()
    expect(getByLabelText('Full Name')).toBeInTheDocument()
    expect(getByLabelText('Email')).toBeInTheDocument()
    expect(getByLabelText('Role')).toBeInTheDocument()
    expect(getByLabelText('Department')).toBeInTheDocument()
  })

  it('calls onClose when Cancel is clicked', () => {
    const onClose = vi.fn()
    const { getByText } = render(
      <InviteMemberModal open={true} onClose={onClose} onSubmit={vi.fn()} />
    )
    fireEvent.click(getByText('Cancel'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    const { getByRole } = render(
      <InviteMemberModal open={true} onClose={onClose} onSubmit={vi.fn()} />
    )
    fireEvent.click(getByRole('button', { name: 'Close modal' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('shows validation errors for empty fields on submit', async () => {
    const { getByRole, getByText } = render(
      <InviteMemberModal open={true} onClose={vi.fn()} onSubmit={vi.fn()} />
    )
    fireEvent.click(getByRole('button', { name: 'Invite Member' }))

    await vi.waitFor(() => {
      expect(getByText('Name must be at least 2 characters')).toBeInTheDocument()
      expect(getByText('Invalid email address')).toBeInTheDocument()
      expect(getByText('Role is required')).toBeInTheDocument()
      expect(getByText('Department is required')).toBeInTheDocument()
    })
  })

  it('calls onSubmit with form data when valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { getByLabelText, getByRole } = render(
      <InviteMemberModal open={true} onClose={vi.fn()} onSubmit={onSubmit} />
    )

    await act(async () => {
      fireEvent.input(getByLabelText('Full Name'), { target: { value: 'Test User' } })
      fireEvent.input(getByLabelText('Email'), { target: { value: 'test@example.com' } })
      fireEvent.change(getByLabelText('Role'), { target: { value: 'Frontend Developer' } })
      fireEvent.change(getByLabelText('Department'), { target: { value: 'Engineering' } })

      fireEvent.click(getByRole('button', { name: 'Invite Member' }))
    })

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        role: 'Frontend Developer',
        department: 'Engineering',
      })
    })
  })

  it('shows loading state on submit button', () => {
    const { getByText } = render(
      <InviteMemberModal open={true} onClose={vi.fn()} onSubmit={vi.fn()} isLoading={true} />
    )
    expect(getByText('Inviting...')).toBeInTheDocument()
  })
})
