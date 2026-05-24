import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { NotificationItem } from './NotificationItem'
import type { INotification } from '@/types'

const unreadNotification: INotification = {
  id: 'n1',
  userId: 'user-1',
  title: 'Task Completed',
  message: 'A task was completed successfully.',
  type: 'success',
  read: false,
  createdAt: new Date().toISOString(),
}

const readNotification: INotification = {
  id: 'n2',
  userId: 'user-1',
  title: 'Welcome',
  message: 'Welcome to the workspace!',
  type: 'info',
  read: true,
  createdAt: new Date(Date.now() - 86400000).toISOString(),
}

describe('NotificationItem Component', () => {
  it('renders notification title', () => {
    const { getByText } = render(
      <NotificationItem notification={unreadNotification} onMarkRead={vi.fn()} />
    )
    expect(getByText('Task Completed')).toBeInTheDocument()
  })

  it('renders notification message', () => {
    const { getByText } = render(
      <NotificationItem notification={unreadNotification} onMarkRead={vi.fn()} />
    )
    expect(getByText('A task was completed successfully.')).toBeInTheDocument()
  })

  it('shows mark as read button for unread notification', () => {
    const { getByRole } = render(
      <NotificationItem notification={unreadNotification} onMarkRead={vi.fn()} />
    )
    expect(getByRole('button', { name: 'Mark as read' })).toBeInTheDocument()
  })

  it('does not show mark as read button for read notification', () => {
    const { queryByRole } = render(
      <NotificationItem notification={readNotification} onMarkRead={vi.fn()} />
    )
    expect(queryByRole('button', { name: 'Mark as read' })).toBeNull()
  })

  it('calls onMarkRead when button is clicked', () => {
    const onMarkRead = vi.fn()
    const { getByRole } = render(
      <NotificationItem notification={unreadNotification} onMarkRead={onMarkRead} />
    )
    fireEvent.click(getByRole('button', { name: 'Mark as read' }))
    expect(onMarkRead).toHaveBeenCalledWith(unreadNotification.id)
  })

  it('renders success type with correct icon', () => {
    const { container } = render(
      <NotificationItem notification={unreadNotification} onMarkRead={vi.fn()} />
    )
    expect(container.querySelector('.text-emerald-500')).toBeInTheDocument()
  })

  it('renders warning type with correct styling', () => {
    const warning: INotification = { ...unreadNotification, type: 'warning' }
    const { container } = render(
      <NotificationItem notification={warning} onMarkRead={vi.fn()} />
    )
    expect(container.querySelector('.text-amber-500')).toBeInTheDocument()
  })

  it('renders error type with correct styling', () => {
    const error: INotification = { ...unreadNotification, type: 'error' }
    const { container } = render(
      <NotificationItem notification={error} onMarkRead={vi.fn()} />
    )
    expect(container.querySelector('.text-red-500')).toBeInTheDocument()
  })

  it('renders info type with correct styling', () => {
    const info: INotification = { ...unreadNotification, type: 'info' }
    const { container } = render(
      <NotificationItem notification={info} onMarkRead={vi.fn()} />
    )
    expect(container.querySelector('.text-blue-500')).toBeInTheDocument()
  })

  it('shows unread indicator dot for unread notification', () => {
    const { container } = render(
      <NotificationItem notification={unreadNotification} onMarkRead={vi.fn()} />
    )
    expect(container.querySelector('.bg-indigo-500')).toBeInTheDocument()
  })

  it('does not show unread indicator dot for read notification', () => {
    const { container } = render(
      <NotificationItem notification={readNotification} onMarkRead={vi.fn()} />
    )
    expect(container.querySelector('.bg-indigo-500')).toBeNull()
  })

  it('displays relative time', () => {
    const { getByText } = render(
      <NotificationItem notification={unreadNotification} onMarkRead={vi.fn()} />
    )
    expect(getByText('Just now')).toBeInTheDocument()
  })
})
